"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import { CheckCircle, Mic, Play, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { challengesData } from "../challengesData";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

const COMMANDS = {
  RUN_TESTS: {
    patterns: [
      "run test",
      "execute test",
      "start test",
      "check solution",
      "verify code",
      "test my code",
    ],
    action: "runTests",
  },
  EXPLAIN_CODE: {
    patterns: [
      "explain",
      "describe",
      "analyze",
      "check my code",
      "help me understand",
      "what does this do",
    ],
    action: "explainCode",
  },
  OPTIMIZE_CODE: {
    patterns: [
      "optimize",
      "improve",
      "make better",
      "enhance",
      "refactor",
      "suggestions",
    ],
    action: "optimizeCode",
  },
  GO_TO_LINE: {
    patterns: [
      "go to line",
      "move to line",
      "navigate to line",
      "jump to line",
    ],
    action: "goToLine",
  },
  DELETE_LINE: {
    patterns: ["delete line", "remove line", "clear line"],
    action: "deleteLine",
  },
  HELP: {
    patterns: [
      "help",
      "what can you do",
      "show commands",
      "available commands",
      "list commands",
    ],
    action: "showHelp",
  },
};

export default function VoiceChallenge() {
  const params = useParams();

  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [status, setStatus] = useState("Click 'Start Voice' to begin");
  const [processingCommand, setProcessingCommand] = useState(false);

  const [isInterviewing, setIsInterviewing] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState("behavioral");
  const [behavioralQuestions, setBehavioralQuestions] = useState([
    "Can you tell me about yourself?",
    "Why do you want to work at our company?",
    "What are your strengths and weaknesses?",
    "Describe a challenging project you worked on and how you overcame the difficulties.",
    "Where do you see yourself in five years?",
  ]);
  const [technicalQuestions, setTechnicalQuestions] = useState([
    "Can you explain the current technical challenge you're working on?",
    "What approach are you taking to solve this problem?",
    "Are there any specific algorithms or data structures you're utilizing?",
    "How do you ensure your code is efficient and maintainable?",
    "Can you walk me through your testing strategy for this solution?",
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewResults, setInterviewResults] = useState([]);

  const interviewResultsRef = useRef([]);

  const recognitionRef = useRef(null);
  const editorRef = useRef(null);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);
  const pendingCodeUpdate = useRef(null);
  const awaitingConfirmation = useRef(false);
  const lastSelection = useRef(null);

  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const queueAudio = (audio) => {
    return new Promise((resolve) => {
      audio.onended = resolve;
      audioQueue.current.push(audio);
      processAudioQueue();
    });
  };

  const processAudioQueue = async () => {
    if (isPlaying.current || audioQueue.current.length === 0) return;

    isPlaying.current = true;
    const audio = audioQueue.current[0];

    try {
      await audio.play();
      audioQueue.current.shift();
      isPlaying.current = false;
      processAudioQueue();
    } catch (error) {
      console.error("Audio playback error:", error);
      audioQueue.current.shift();
      isPlaying.current = false;
      processAudioQueue();
    }
  };

  // Voice feedback with queue management
  const speak = async (text) => {
    if (!text) return;

    try {
      const response = await fetch("http://localhost:5000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.slice(0, 4000), // Limit text length
          voice: "alloy",
          model: "tts-1",
        }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      await queueAudio(audio);
    } catch (err) {
      console.error("Speech error:", err);
      setStatus("Voice feedback error");
    }
  };

  const findCommand = (transcript) => {
    const text = transcript.toLowerCase();

    for (const [commandType, command] of Object.entries(COMMANDS)) {
      if (command.patterns.some((pattern) => text.includes(pattern))) {
        const numbers = text.match(/\d+/g);
        return {
          type: commandType,
          action: command.action,
          numbers: numbers ? numbers.map(Number) : [],
        };
      }
    }
    return null;
  };

  // Run tests handler
  async function handleTestSolution() {
    if (!challenge) return;
    setTesting(true);
    setResults([]);

    const functionName = challenge.signature
      .replace("def ", "")
      .split("(")[0]
      .replace(":", "")
      .trim();

    const newResults = [];
    for (const test of challenge.tests) {
      const codeToRun = `
${codeRef.current}

# Automated test
test_input = ${test.input}
result = ${functionName}(*test_input)
print(result)
`;

      try {
        const resp = await fetch("http://localhost:5000/run-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeToRun }),
        });

        const data = await resp.json();
        if (!resp.ok) {
          newResults.push({
            input: test.input,
            expected: test.expectedOutput,
            output: data.error || "Error",
            passed: false,
          });
        } else {
          const output = data.stdout.trim();
          const passed = output === test.expectedOutput;
          newResults.push({
            input: test.input,
            expected: test.expectedOutput,
            output,
            passed,
          });
        }
      } catch (err) {
        newResults.push({
          input: test.input,
          expected: test.expectedOutput,
          output: `Error: ${err.message}`,
          passed: false,
        });
      }
    }

    setResults(newResults);
    setTesting(false);
  }

  // Interactive helper functions
  const provideGuidance = async () => {
    setProcessingCommand(true);
    try {
      const response = await fetch("http://localhost:5000/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Given this coding challenge and current code:
Challenge: ${challenge?.description}
Current code:\n${codeRef.current}

Provide brief, encouraging guidance on what the user should focus on next.`,
        }),
      });

      const data = await response.json();
      if (data.response) {
        await speak(data.response);
        // No need to store in conversationContext
      }
    } catch (error) {
      console.error("Guidance error:", error);
      await speak(
        "I'm having trouble analyzing your progress. Let's try breaking down the problem together."
      );
    } finally {
      setProcessingCommand(false);
    }
  };

  const provideHint = async () => {
    setProcessingCommand(true);
    try {
      const response = await fetch("http://localhost:5000/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Given this coding challenge and current code progress:
Challenge: ${challenge?.description}
Current code:\n${codeRef.current}

Provide a helpful hint that guides them toward the solution without giving it away.`,
        }),
      });

      const data = await response.json();
      if (data.response) {
        await speak(data.response);
        // No need to store in conversationContext
      }
    } catch (error) {
      console.error("Hint error:", error);
      await speak(
        "I'm having trouble generating a hint right now. Would you like to talk through your approach?"
      );
    } finally {
      setProcessingCommand(false);
    }
  };

  const explainSelection = async (selectedCode) => {
    setProcessingCommand(true);
    await speak("Let me look at that section...");

    try {
      const response = await fetch("http://localhost:5000/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Please explain this selected code section in a conversational way:
${selectedCode}`,
        }),
      });

      const data = await response.json();
      if (data.response) {
        await speak(data.response);
      }
    } catch (error) {
      console.error("Explanation error:", error);
      await speak(
        "I had trouble analyzing that section. Could you ask me about a specific part you're curious about?"
      );
    } finally {
      setProcessingCommand(false);
    }
  };

  const optimizeSelection = async (selectedCode) => {
    setProcessingCommand(true);
    await speak("Analyzing this section for possible improvements...");

    try {
      const response = await fetch("http://localhost:5000/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a helpful AI coding companion. Please analyze this selected Python code section and suggest specific improvements:
${selectedCode}

Provide your response in two parts:
1. A brief verbal explanation of the improvements
2. The improved code section`,
        }),
      });

      const data = await response.json();
      if (data.response) {
        const parts = data.response.split("```python");
        if (parts.length >= 2) {
          const explanation = parts[0].trim();
          const improvedCode = parts[1].split("```")[0].trim();

          await speak(explanation);
          await speak(
            "Would you like me to update this section with the improved code? Say 'yes' to apply or 'no' to keep it as is."
          );

          pendingCodeUpdate.current = improvedCode;
          awaitingConfirmation.current = true;
        } else {
          await speak(
            "I analyzed the code but couldn't generate specific improvements."
          );
        }
      }
    } catch (error) {
      console.error("Optimization error:", error);
      await speak(
        "I had trouble optimizing that section. Would you like me to explain what I see instead?"
      );
    } finally {
      setProcessingCommand(false);
    }
  };

  const commandHandlers = {
    async runTests() {
      await handleTestSolution();
    },

    async explainCode() {
      setProcessingCommand(true);
      try {
        const response = await fetch("http://localhost:5000/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Please explain this code in simple terms:\n${codeRef.current}`,
          }),
        });
        const data = await response.json();
        if (data.response) {
          await speak(data.response);
        }
      } catch (error) {
        console.error("Explanation error:", error);
        await speak("Sorry, I couldn't analyze the code right now");
      } finally {
        setProcessingCommand(false);
      }
    },

    async optimizeCode() {
      if (processingCommand || isPlaying.current) return;
      setProcessingCommand(true);
      await speak("Analyzing your code for improvements...");

      try {
        const response = await fetch("http://localhost:5000/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `You are a helpful AI coding companion. Please analyze this Python code and suggest specific improvements. 
Format your response in two parts:
1. A brief verbal explanation of the improvements
2. The complete improved code

Current code:\n${codeRef.current}`,
          }),
        });

        const data = await response.json();
        if (data.response) {
          const parts = data.response.split("```python");
          if (parts.length >= 2) {
            const explanation = parts[0].trim();
            const improvedCode = parts[1].split("```")[0].trim();

            await speak(explanation);
            await speak(
              "Would you like me to apply these improvements? Say 'yes' to apply or 'no' to keep your current code."
            );

            pendingCodeUpdate.current = improvedCode;
            awaitingConfirmation.current = true;
          } else {
            await speak(
              "I analyzed the code but couldn't generate specific improvements."
            );
          }
        }
      } catch (error) {
        console.error("Optimization error:", error);
        await speak("Sorry, I ran into an issue while optimizing the code");
      } finally {
        setProcessingCommand(false);
      }
    },

    async goToLine(lineNumber) {
      if (!editorRef.current?.view) return;

      const editor = editorRef.current.view;
      const targetLine = Math.min(lineNumber, editor.state.doc.lines);
      const pos = editor.state.doc.line(targetLine).from;

      editor.dispatch({
        selection: { anchor: pos },
      });
      await speak(`Moved to line ${lineNumber}`);
    },

    async deleteLine(lineNumber) {
      if (!editorRef.current?.view) return;

      const editor = editorRef.current.view;
      const line = editor.state.doc.line(lineNumber);

      editor.dispatch({
        changes: { from: line.from, to: line.to + 1 },
      });
      await speak(`Deleted line ${lineNumber}`);
    },

    async showHelp() {
      const helpText = `Available commands:
- Run tests or check solution
- Explain or analyze code
- Optimize or improve code
- Go to line followed by a number
- Delete line followed by a number
- Help or show commands
- Start Interview or End Interview`;
      await speak(helpText);
    },
  };

  const handleVoiceCommand = async (transcript) => {
    if (processingCommand || isPlaying.current) {
      if (!isPlaying.current) {
        await speak(
          "I'm still processing your last request. One moment please."
        );
      }
      return;
    }

    if (isInterviewing) {
      return;
    }

    setProcessingCommand(true);

    const text = transcript.toLowerCase();

    if (awaitingConfirmation.current) {
      if (
        text.includes("yes") ||
        text.includes("sure") ||
        text.includes("okay")
      ) {
        awaitingConfirmation.current = false;
        if (pendingCodeUpdate.current) {
          setCode(pendingCodeUpdate.current);
          pendingCodeUpdate.current = null;
          await speak(
            "Great! I've updated your code. Let me know if you'd like me to explain any part of it."
          );
        }
        setProcessingCommand(false);
        return;
      } else if (
        text.includes("no") ||
        text.includes("dont") ||
        text.includes("don't")
      ) {
        awaitingConfirmation.current = false;
        pendingCodeUpdate.current = null;
        await speak(
          "No problem! Let's keep your current code. Is there anything specific you'd like me to explain?"
        );
        setProcessingCommand(false);
        return;
      }
    }

    if (lastSelection.current) {
      if (text.includes("explain this") || text.includes("what does this do")) {
        await explainSelection(lastSelection.current);
        setProcessingCommand(false);
        return;
      }
      if (text.includes("improve this") || text.includes("optimize this")) {
        await optimizeSelection(lastSelection.current);
        setProcessingCommand(false);
        return;
      }
    }

    if (text.includes("what should i do") || text.includes("how do i")) {
      await provideGuidance();
      setProcessingCommand(false);
      return;
    }

    if (text.includes("stuck") || text.includes("not sure")) {
      await provideHint();
      setProcessingCommand(false);
      return;
    }

    const command = findCommand(text);
    if (command) {
      setStatus(`Working on it...`);
      try {
        if (command.action === "goToLine" || command.action === "deleteLine") {
          if (command.numbers.length > 0) {
            await commandHandlers[command.action](command.numbers[0]);
          } else {
            await speak(
              `Which line would you like to ${
                command.action === "goToLine" ? "go to" : "delete"
              }?`
            );
          }
        } else {
          await commandHandlers[command.action]();
        }
      } catch (error) {
        console.error("Command execution error:", error);
        await speak(
          "I encountered an error while trying to help. Could you try that again?"
        );
      } finally {
        setStatus("Ready");
        setProcessingCommand(false);
      }
    } else {
      await speak(
        "I'm not quite sure what you'd like me to do. You can ask me to run tests, explain code, or suggest improvements. What would you like?"
      );
      setStatus("Awaiting command");
      setProcessingCommand(false);
    }
  };

  const startInterviewMode = async () => {
    setIsInterviewing(true);
    setInterviewPhase("behavioral");
    setCurrentQuestionIndex(0);
    setInterviewResults([]);
    interviewResultsRef.current = [];

    setVoiceEnabled(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    await askNextQuestion("behavioral", 0);
  };

  const endInterviewMode = () => {
    setIsInterviewing(false);
    setInterviewPhase("behavioral");
    setCurrentQuestionIndex(0);
    setInterviewResults([]);
    interviewResultsRef.current = [];

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setVoiceEnabled(true);

    speak(
      "Interview session has ended. Let me know if you need anything else."
    );
  };

  const askNextQuestion = async (phase, index) => {
    let question;
    if (phase === "behavioral") {
      if (index >= behavioralQuestions.length) {
        setInterviewPhase("technical");
        setCurrentQuestionIndex(0);
        await speak("Let's move on to the technical part of the interview.");
        await askNextQuestion("technical", 0);
        return;
      }
      question = behavioralQuestions[index];
    } else if (phase === "technical") {
      if (index >= technicalQuestions.length) {
        setInterviewPhase("feedback");
        await speak(
          "Thank you for your responses. Let me provide some feedback."
        );
        await provideFeedback();
        endInterviewMode();
        return;
      }
      question = technicalQuestions[index];
    }

    await speak(question);

    // After asking the question, start listening for the user's response
    await startListeningForResponse(phase, index);
  };

  // Listen for the user's response to a question
  const startListeningForResponse = async (phase, questionIndex) => {
    // Ensure no existing recognition is running
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setStatus("Speech recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        setStatus("Listening for your response...");
      };

      recognition.onend = () => {
        setListening(false);
        if (isInterviewing) {
          recognition.start();
        }
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        setListening(false);
        setStatus("Voice recognition error");
        if (event.error === "not-allowed") {
          speak("Please enable microphone access");
        } else {
          speak(
            "I encountered an error while listening. Please try answering again."
          );
          startListeningForResponse(phase, questionIndex);
        }
      };

      recognition.onresult = async (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.trim();
        console.log("User Response:", transcript);
        recognition.stop();
        setInterviewResults((prev) => {
          const updated = [
            ...prev,
            {
              phase,
              question:
                phase === "behavioral"
                  ? behavioralQuestions[questionIndex]
                  : technicalQuestions[questionIndex],
              answer: transcript,
            },
          ];
          interviewResultsRef.current = updated;
          return updated;
        });
        setCurrentQuestionIndex((prev) => prev + 1);
        await askNextQuestion(phase, questionIndex + 1);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Voice start error:", err);
      setStatus("Failed to start voice recognition");
    }
  };

  const provideFeedback = async () => {
    if (interviewResultsRef.current.length === 0) {
      await speak("I have no responses to provide feedback on.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze the following interview responses and provide comprehensive feedback:\n${JSON.stringify(
            interviewResultsRef.current,
            null,
            2
          )}`,
        }),
      });

      const data = await response.json();
      if (data.response) {
        await speak(data.response);
      }
    } catch (error) {
      console.error("Feedback error:", error);
      await speak("I encountered an issue while providing feedback.");
    }
  };

  // Handle selection change in CodeMirror
  const handleSelectionChange = (editorView) => {
    const selection = editorView.state.sliceDoc(
      editorView.state.selection.main.from,
      editorView.state.selection.main.to
    );
    if (selection) {
      lastSelection.current = selection;
    }
  };

  // Voice Recognition Control Functions
  const startVoiceRecognition = async () => {
    // Ensure no existing recognition is running
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setStatus("Speech recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Enable continuous listening
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        setStatus("Listening...");
      };

      recognition.onend = () => {
        setListening(false);
        if (voiceEnabled && !isInterviewing) {
          recognition.start(); // Restart recognition if voice is enabled and not interviewing
        }
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        setListening(false);
        setStatus("Voice recognition error");
        if (event.error === "not-allowed") {
          speak("Please enable microphone access");
        }
      };

      recognition.onresult = async (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript;
        await handleVoiceCommand(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setVoiceEnabled(true);
    } catch (err) {
      console.error("Voice start error:", err);
      setStatus("Failed to start voice recognition");
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setVoiceEnabled(false);
      setListening(false);
      setStatus("Voice recognition stopped");
    }
  };

  useEffect(() => {
    const found = challengesData.find((c) => c.id === params.id);
    if (found) {
      setChallenge(found);
      setCode(`${found.signature}\n    # Write your solution here\n    pass`);
    }
  }, [params.id]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite">
      {(processingCommand || isInterviewing) && (
        <div className="fixed top-6 right-6 transition-all duration-300 ease-in-out">
          <Alert className="bg-brandGray-900 border-brandGray-800">
            <AlertDescription className="text-sm text-brandGray-300">
              {status}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isInterviewing && (
        <InterviewStatus
          phase={interviewPhase}
          questionIndex={currentQuestionIndex}
          totalQuestions={
            interviewPhase === "behavioral"
              ? behavioralQuestions.length
              : technicalQuestions.length
          }
        />
      )}

      <div className="border-b border-brandGray-800">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="flex items-start justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium">
                {challenge?.title || "Loading..."}
              </h1>
              <p className="text-brandGray-300 leading-relaxed max-w-2xl">
                {challenge?.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={
                  voiceEnabled && !isInterviewing
                    ? stopVoiceRecognition
                    : startVoiceRecognition
                }
                className={`p-4 rounded-lg transition-all duration-200 ease-in-out ${
                  voiceEnabled && !isInterviewing
                    ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
                    : "bg-brandGray-800 hover:bg-brandGray-700 border border-brandGray-700"
                }`}
                disabled={isInterviewing}
              >
                <Mic
                  className={`w-5 h-5 ${listening ? "animate-pulse" : ""}`}
                />
              </button>

              <NewFeatureButton
                isInterviewing={isInterviewing}
                onStart={startInterviewMode}
                onEnd={endInterviewMode}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="space-y-10">
          <div className="bg-brandGray-900 rounded-lg overflow-hidden border border-brandGray-800">
            <div className="relative">
              <CodeMirror
                value={code}
                height="400px"
                extensions={[python(), EditorView.lineWrapping]}
                theme="dark"
                onChange={(value) => setCode(value)}
                ref={editorRef}
                onUpdate={(update) => {
                  if (update.selectionSet) {
                    handleSelectionChange(update.view);
                  }
                }}
                className="border-none"
              />

              <button
                onClick={handleTestSolution}
                disabled={testing || isInterviewing}
                className="absolute bottom-4 right-4 px-4 py-2 bg-brandGray-800 hover:bg-brandGray-700 rounded-md flex items-center gap-2 transition-all duration-200 border border-brandGray-700"
              >
                <Play className="w-4 h-4" />
                {testing ? "Running..." : "Run Tests"}
              </button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Test Results</h2>
              <div className="space-y-4">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-lg border transition-all duration-200 ${
                      result.passed
                        ? "bg-green-500/5 border-green-500/10"
                        : "bg-red-500/5 border-red-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {result.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-medium">Test Case {idx + 1}</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-[100px,1fr] gap-4">
                        <span className="text-brandGray-300">Input:</span>
                        <code className="font-mono text-brandGray-200">
                          {JSON.stringify(result.input)}
                        </code>
                      </div>
                      <div className="grid grid-cols-[100px,1fr] gap-4">
                        <span className="text-brandGray-300">Expected:</span>
                        <code className="font-mono text-brandGray-200">
                          {result.expected}
                        </code>
                      </div>
                      <div className="grid grid-cols-[100px,1fr] gap-4">
                        <span className="text-brandGray-300">Output:</span>
                        <code className="font-mono text-brandGray-200">
                          {result.output}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {interviewResults.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Interview Summary</h2>
                <span className="text-sm text-brandGray-400">
                  {interviewResults.length} responses recorded
                </span>
              </div>
              <div className="grid gap-6">
                {interviewResults.map((result, idx) => (
                  <InterviewSummaryCard key={idx} result={result} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InterviewStatus({ phase, questionIndex, totalQuestions }) {
  const progress = (questionIndex / totalQuestions) * 100;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl">
      <div className="mx-4 bg-brandGray-900/95 border border-brandGray-800 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">
            {phase === "behavioral"
              ? "Behavioral Questions"
              : "Technical Interview"}
          </span>
          <span className="text-sm text-brandGray-400">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="h-1.5 bg-brandGray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function NewFeatureButton({ isInterviewing, onStart, onEnd }) {
  return (
    <div className="relative group">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1.5 rounded-full border border-blue-500/20 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New Feature - Try Mock Interviews!
        </div>
      </div>

      <button
        onClick={isInterviewing ? onEnd : onStart}
        className={`
          px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
          ${
            isInterviewing
              ? "bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400"
              : "bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400"
          }
        `}
      >
        {isInterviewing ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            End Interview
          </>
        ) : (
          <>Start Mock Interview</>
        )}
      </button>
    </div>
  );
}

function InterviewSummaryCard({ result, index }) {
  return (
    <div className="bg-brandGray-900/50 border border-brandGray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-brandGray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-1.5 bg-brandGray-800 rounded text-xs font-medium">
            {index + 1}
          </span>
          <span className="text-sm font-medium">
            {result.phase === "behavioral" ? "Behavioral" : "Technical"}
          </span>
        </div>
        <span className="text-xs text-brandGray-400">
          {new Date().toLocaleTimeString()}
        </span>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Question:</h4>
          <p className="text-sm text-brandGray-300">{result.question}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Your Response:</h4>
          <p className="text-sm text-brandGray-300">{result.answer}</p>
        </div>
      </div>
    </div>
  );
}
