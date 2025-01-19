"use client";

import { Loader2, Mic, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function TypingMessage({
  finalText,
  audioBlob,
  onDoneTyping,
  typingSpeed = 30,
}) {
  const [typedText, setTypedText] = useState("");
  const indexRef = useRef(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  useEffect(() => {
    const sanitizedText = (finalText ?? "").trim();
    setTypedText("");
    indexRef.current = 0;

    if (!sanitizedText) return;

    const interval = setInterval(() => {
      if (indexRef.current < sanitizedText.length) {
        setTypedText((prev) => prev + sanitizedText[indexRef.current]);
        indexRef.current += 1;
      } else {
        clearInterval(interval);
        onDoneTyping && onDoneTyping();
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [finalText, onDoneTyping, typingSpeed]);

  useEffect(() => {
    if (audioBlob && !hasPlayedAudio) {
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play().catch((err) => console.error("Audio play error:", err));
      setHasPlayedAudio(true);
    }
  }, [audioBlob, hasPlayedAudio]);

  return (
    <div className="text-base text-brandWhite leading-relaxed whitespace-pre-wrap">
      {typedText}
    </div>
  );
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = "en-US";

        recog.onstart = () => setListening(true);
        recog.onend = () => setListening(false);

        recog.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          handleSendMessage(transcript);
        };

        setRecognition(recog);
      }
    }
  }, []);

  function startListening() {
    if (recognition && !listening) {
      recognition.start();
    }
  }

  async function fetchAIText(prompt) {
    const response = await fetch("http://localhost:5000/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data?.response || "No response";
  }

  async function fetchTTSBlob(text) {
    const response = await fetch("http://localhost:5000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice: "alloy",
        model: "tts-1",
      }),
    });
    if (!response.ok) {
      throw new Error("TTS error: " + (await response.text()));
    }
    return response.blob();
  }

  async function handleSendMessage(text) {
    const userMessage = text.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserInput("");
    setLoading(true);

    try {
      const aiText = await fetchAIText(userMessage);
      const audioBlob = await fetchTTSBlob(aiText);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiText, audioBlob },
      ]);
    } catch (err) {
      console.error("Error retrieving AI or TTS:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error retrieving AI or TTS." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite flex flex-col">
      {/* Header */}
      <header className="border-b border-brandGray-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-medium mb-2">AI Assistant</h1>
          <p className="text-sm text-brandGray-300">
            Ask questions and get help from our Python tutor AI
          </p>
        </div>
      </header>

      <main className="flex-grow flex flex-col max-w-4xl w-full mx-auto p-6">
        <div className="flex-grow overflow-y-auto space-y-6 mb-6">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    isUser
                      ? "bg-blue-500/10 border border-blue-500/20"
                      : "bg-brandGray-900 border border-brandGray-800"
                  }`}
                >
                  {isUser ? (
                    <div className="text-base text-brandWhite">
                      {msg.content}
                    </div>
                  ) : (
                    <TypingMessage
                      finalText={msg.content}
                      audioBlob={msg.audioBlob}
                      typingSpeed={20}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-2 text-brandGray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-brandGray-800 pt-4">
          <div className="flex items-center gap-3">
            <input
              className="flex-grow bg-brandGray-900 text-brandWhite px-4 py-3 rounded-md border border-brandGray-800 focus:outline-none focus:border-brandGray-700 transition-colors"
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(userInput);
                }
              }}
            />
            <button
              onClick={() => handleSendMessage(userInput)}
              className="p-3 rounded-md bg-brandGray-900 border border-brandGray-800 hover:bg-brandGray-800 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
            <button
              onClick={startListening}
              className={`p-3 rounded-md border transition-colors ${
                listening
                  ? "bg-red-500/10 border-red-500/20 text-red-500"
                  : "bg-brandGray-900 border-brandGray-800 hover:bg-brandGray-800"
              }`}
            >
              <Mic className={`w-5 h-5 ${listening ? "animate-pulse" : ""}`} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
