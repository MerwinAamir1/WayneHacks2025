"use client";
import { python } from "@codemirror/lang-python";
import dynamic from "next/dynamic";
import { useState } from "react";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

export default function SandboxPage() {
  const [code, setCode] = useState(
    `# Write your Python code here\nprint("Hello Code Dragon!")`
  );
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  async function handleRunCode() {
    try {
      setIsRunning(true);
      setOutput("Running...");
      const response = await fetch("http://localhost:5000/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (response.ok) {
        setOutput(data.stdout || data.error || "");
      } else {
        setOutput(`Error: ${data?.error || "Unknown error"}`);
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="p-8 bg-brandGray-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-brandGray-800 p-6 rounded shadow-md">
        <h1 className="text-3xl font-display mb-4 text-brandWhite">Sandbox</h1>
        <p className="text-brandGray-300 mb-6">
          Edit your Python code below, then click <strong>Run Code</strong> to
          execute it on the server.
        </p>

        <div className="mb-4">
          <CodeMirror
            value={code}
            height="300px"
            extensions={[python()]}
            theme="dark"
            onChange={(value) => setCode(value)}
            className="text-sm rounded"
          />
        </div>

        <button
          onClick={handleRunCode}
          className="px-6 py-2 bg-brandWhite text-brandBlack rounded font-semibold hover:opacity-80 transition"
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Run Code"}
        </button>

        <div className="mt-6 bg-brandGray-900 p-4 rounded min-h-[100px]">
          <h2 className="text-lg font-semibold mb-2">Output:</h2>
          <pre className="text-brandGray-300 whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
