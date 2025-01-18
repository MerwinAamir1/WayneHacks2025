"use client";

import { python } from "@codemirror/lang-python";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

const challengesData = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.
Assume each input would have exactly one solution. You may not use the same element twice.`,
    tests: [
      {
        input: `nums = [2,7,11,15], target = 9`,
        expectedOutput: "0 1",
      },
      {
        input: `nums = [3,2,4], target = 6`,
        expectedOutput: "1 2",
      },
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description: `Given a string s, return it reversed.`,
    tests: [
      {
        input: "hello",
        expectedOutput: "olleh",
      },
      {
        input: "CodeDragon",
        expectedOutput: "nogedarDoeC",
      },
    ],
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    description: `Print the numbers from 1 to N, but for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".`,
    tests: [
      {
        input: "15",
        expectedOutput: `1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz`,
      },
    ],
  },
];

export default function ChallengeDetailPage() {
  const params = useParams();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState(`# Write your Python solution here`);
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Find the challenge by ID
    const found = challengesData.find((c) => c.id === params.id);
    setChallenge(found || null);
  }, [params.id]);

  async function handleTestSolution() {
    if (!challenge) return;
    setTesting(true);
    setResults([]);

    const newResults = [];

    // For each test, we append the input to the user's code for an MVP approach
    for (const test of challenge.tests) {
      const codeToRun = `${code}\n\n# Test input:\ninput_data = """${test.input}"""\n`;

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
      <div className="p-8 bg-brandGray-900 min-h-screen text-brandWhite">
        <h2 className="text-2xl font-display mb-4">Challenge Not Found</h2>
      </div>
    );
  }

  return (
    <div className="p-8 bg-brandGray-900 min-h-screen text-brandWhite">
      <div className="max-w-4xl mx-auto bg-brandGray-800 p-6 rounded shadow-md">
        <h1 className="text-3xl font-display mb-4">{challenge.title}</h1>
        <pre className="text-brandGray-300 mb-6 whitespace-pre-wrap">
          {challenge.description}
        </pre>

        {/* Code Editor */}
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

        {/* Test Button */}
        <button
          onClick={handleTestSolution}
          className="px-6 py-2 bg-brandWhite text-brandBlack rounded font-semibold hover:opacity-80 transition"
          disabled={testing}
        >
          {testing ? "Testing..." : "Test Solution"}
        </button>
      </div>

      {/* Test Results */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto bg-brandGray-800 p-6 rounded shadow-md mt-6">
          <h2 className="text-xl font-display mb-4">Results</h2>
          {results.map((r, idx) => (
            <div
              key={idx}
              className={`mb-3 p-3 rounded ${
                r.passed ? "bg-green-800" : "bg-red-800"
              }`}
            >
              <p className="text-sm text-brandGray-200">
                <strong>Input:</strong> {r.input}
              </p>
              <p className="text-sm text-brandGray-200">
                <strong>Expected Output:</strong> {r.expected}
              </p>
              <p className="text-sm text-brandGray-200">
                <strong>Your Output:</strong> {r.output}
              </p>
              <p className="text-sm font-semibold mt-1">
                {r.passed ? "Passed ✅" : "Failed ❌"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
