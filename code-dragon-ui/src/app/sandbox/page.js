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
    <div className="bg-brandBlack text-brandWhite min-h-screen flex flex-col">
      <header className="w-full py-8 bg-brandGray-900 shadow-lg shadow-brandBlack">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display mb-2">Sandbox</h1>
          <p className="text-brandGray-300 text-sm md:text-base leading-relaxed">
            Edit your Python code below, then click <strong>Run Code</strong> to
            execute it on our server. See the output instantly!
          </p>
        </div>
      </header>
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        <section className="bg-brandGray-800 rounded p-4 shadow-md">
          <h2 className="text-xl font-display mb-4">Your Code</h2>
          <CodeMirror
            value={code}
            height="400px"
            extensions={[python()]}
            theme="dark"
            onChange={(value) => setCode(value)}
            className="border border-brandGray-700 rounded"
          />
          <div className="mt-4 text-right">
            <button
              onClick={handleRunCode}
              className="inline-block px-6 py-2 bg-brandWhite text-brandBlack rounded font-semibold hover:opacity-80 transition"
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>
          </div>
        </section>

        <section className="bg-brandGray-800 rounded p-4 shadow-md">
          <h2 className="text-xl font-display mb-2">Output</h2>
          <div className="bg-brandGray-900 rounded p-3 min-h-[150px] text-brandGray-300">
            {output}
          </div>
        </section>
      </main>
    </div>
  );
}
