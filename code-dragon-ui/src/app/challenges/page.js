"use client";
import Link from "next/link";
import { useState } from "react";

const challengesData = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers and a target, return indices of the two numbers that add up to the target.",
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Given a string, return it reversed.",
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "Easy",
    description:
      'Print the numbers from 1 to N, but for multiples of 3 print "Fizz" and for multiples of 5 print "Buzz", etc.',
  },
];

export default function ChallengesListPage() {
  const [challenges] = useState(challengesData);

  return (
    <div className="p-8 bg-brandGray-900 min-h-screen">
      <div className="max-w-3xl mx-auto bg-brandGray-800 p-6 rounded shadow-md">
        <h1 className="text-3xl font-display mb-6 text-brandWhite">
          Challenges
        </h1>
        <p className="text-brandGray-300 mb-6">
          Select a challenge to view details and submit a solution.
        </p>

        <div className="space-y-4">
          {challenges.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.id}`}
              className="block bg-brandGray-900 p-4 rounded hover:opacity-80 transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-brandWhite font-semibold">
                  {challenge.title}
                </h2>
                <span className="text-sm text-brandGray-400">
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-brandGray-400 mt-1">{challenge.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
