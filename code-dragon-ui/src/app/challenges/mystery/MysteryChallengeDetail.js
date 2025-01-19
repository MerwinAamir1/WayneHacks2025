import { python } from "@codemirror/lang-python";
import { CheckCircle, Play, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

export default function MysteryChallengeDetail({ challenge }) {
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (challenge) {
      setCode(
        `${challenge.signature}\n    # TODO: implement your solution here\n    pass`
      );
    }
  }, [challenge]);

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
${code}

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

  if (!challenge) {
    return (
      <div className="min-h-screen bg-brandBlack text-brandWhite">
        <div className="max-w-5xl mx-auto px-8 py-16">
          <h2 className="text-2xl font-medium">
            No Mystery Challenge available.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite">
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="space-y-10">
          {/* Challenge Details */}
          <div className="space-y-4">
            <h1 className="text-2xl font-medium">{challenge.title}</h1>
            <div className="text-brandGray-300 leading-relaxed">
              {challenge.description}
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-brandGray-900 rounded-lg overflow-hidden border border-brandGray-800">
            <div className="relative">
              <CodeMirror
                value={code}
                height="400px"
                extensions={[python()]}
                theme="dark"
                onChange={(val) => setCode(val)}
                className="border-none"
              />

              {/* Run Button */}
              <button
                onClick={handleTestSolution}
                disabled={testing}
                className="absolute bottom-4 right-4 px-4 py-2 bg-brandGray-800 hover:bg-brandGray-700 rounded-md flex items-center gap-2 transition-all duration-200 border border-brandGray-700"
              >
                <Play className="w-4 h-4" />
                {testing ? "Running..." : "Run Tests"}
              </button>
            </div>
          </div>

          {/* Test Results */}
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
        </div>
      </div>
    </div>
  );
}
