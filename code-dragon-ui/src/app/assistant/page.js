"use client";

import { useEffect, useState } from "react";

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [loading, setLoading] = useState(false);

  async function playOpenAITTS(textToSpeak) {
    try {
      const response = await fetch("http://localhost:5000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSpeak,
          voice: "alloy",
          model: "tts-1",
        }),
      });

      if (!response.ok) {
        console.error("TTS Error:", await response.text());
        return;
      }

      const audioBlob = await response.blob();
      const audioURL = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioURL);
      audio.play();
    } catch (err) {
      console.error("Error fetching TTS:", err);
    }
  }

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

  async function handleSendMessage(text) {
    const userMessage = text.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();
      console.log(data);
      const assistantReply = data?.response || "No response";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);

      playOpenAITTS(assistantReply);
    } catch (err) {
      console.error("Error calling AI:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error retrieving AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    if (recognition && !listening) {
      recognition.start();
    }
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite p-6 flex flex-col">
      <h1 className="text-3xl font-display mb-4">AI Assistant</h1>
      <div className="flex-grow overflow-y-auto bg-brandGray-900 p-4 rounded mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.role === "user"
                ? "bg-brandGray-800 text-right"
                : "bg-brandGray-700 text-left"
            }`}
          >
            <p className="text-sm">
              {msg.role === "user" ? "You" : "Assistant"}:
            </p>
            <p className="text-md">{msg.content}</p>
          </div>
        ))}
        {loading && <p className="text-brandGray-400">Thinking...</p>}
      </div>

      <div className="flex items-center gap-2">
        <input
          className="flex-grow bg-brandGray-800 text-brandWhite px-3 py-2 rounded 
                     focus:outline-none focus:ring-2 focus:ring-brandGray-400"
          type="text"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(userInput);
            }
          }}
        />
        <button
          onClick={() => handleSendMessage(userInput)}
          className="bg-brandWhite text-brandBlack px-4 py-2 rounded font-semibold
                     hover:opacity-80 transition"
        >
          Send
        </button>

        <button
          onClick={startListening}
          className={`px-4 py-2 rounded font-semibold transition 
            ${
              listening
                ? "bg-red-500 text-brandWhite animate-pulse"
                : "bg-brandGray-600 text-brandWhite hover:opacity-80"
            }
          `}
        >
          {listening ? "Listening..." : "Voice"}
        </button>
      </div>
    </div>
  );
}
