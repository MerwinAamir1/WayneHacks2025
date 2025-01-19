"use client";

import {
  ArrowRight,
  Book,
  ChevronRight,
  Dices,
  Sparkles,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { challengesData } from "./challengesData";
import { setLocalMysteryChallenge } from "./mystery/storeMysteryChallenge";

function ChallengeCard({ challenge }) {
  return (
    <Link
      href={`/challenges/${challenge.id}`}
      className="group flex flex-col h-full p-6 bg-brandGray-900/50 rounded-lg border border-brandGray-800 hover:border-brandGray-700 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-brandGray-800 rounded-md">
          <Book className="w-5 h-5 text-brandGray-400" />
        </div>
        <div className="flex items-center gap-2 text-sm text-brandGray-400">
          <Timer className="w-4 h-4" />
          <span>~{challenge.estimatedMinutes || 15} min</span>
        </div>
      </div>

      <div className="flex-grow">
        <h2 className="text-lg font-medium mb-2 group-hover:text-blue-400 transition-colors">
          {challenge.title}
        </h2>
        <p className="text-sm text-brandGray-400 line-clamp-2 mb-4">
          {challenge.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {challenge.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-brandGray-800 rounded-md text-xs text-brandGray-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <ChevronRight className="w-4 h-4 text-brandGray-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

function MysteryChallenge({ challenge, loading, onGenerate }) {
  if (loading) {
    return (
      <div className="p-8 border border-brandGray-800 rounded-lg bg-brandGray-900/50 text-center">
        <div className="inline-block p-3 bg-brandGray-800 rounded-lg mb-4">
          <Dices className="w-6 h-6 text-brandGray-400 animate-spin" />
        </div>
        <p className="text-brandGray-400">
          Generating your mystery challenge...
        </p>
      </div>
    );
  }

  if (challenge) {
    return (
      <div className="p-6 border border-brandGray-800 rounded-lg bg-brandGray-900/50">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{challenge.title}</h3>
            <p className="text-sm text-brandGray-400">
              {challenge.description}
            </p>
          </div>
          <Link
            href={`/challenges/mystery?tempId=${challenge.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            <span className="text-sm">Solve Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button
          onClick={onGenerate}
          className="w-full px-4 py-2 border border-brandGray-700 rounded-md text-sm text-brandGray-400 hover:bg-brandGray-800 transition-colors"
        >
          Generate Another
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onGenerate}
      className="w-full p-8 border border-dashed border-brandGray-800 rounded-lg hover:bg-brandGray-900/50 transition-colors group"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-brandGray-900 rounded-lg group-hover:bg-brandGray-800 transition-colors">
          <Sparkles className="w-6 h-6 text-brandGray-400" />
        </div>
        <div className="text-center">
          <p className="font-medium mb-1">Generate Mystery Challenge</p>
          <p className="text-sm text-brandGray-400">
            Get a randomly generated coding challenge
          </p>
        </div>
      </div>
    </button>
  );
}

export default function ChallengesListPage() {
  const [mysteryChallenge, setMysteryChallenge] = useState(null);
  const [loadingMystery, setLoadingMystery] = useState(false);

  const handleFetchMystery = async () => {
    setLoadingMystery(true);
    try {
      const resp = await fetch("http://localhost:5000/random-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty: "easy" }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setMysteryChallenge(data);
        setLocalMysteryChallenge(data);
      } else {
        console.error(data.error);
        setMysteryChallenge(null);
      }
    } catch (err) {
      console.error("Mystery challenge error:", err);
      setMysteryChallenge(null);
    } finally {
      setLoadingMystery(false);
    }
  };

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite">
      {/* Header */}
      <div className="border-b border-brandGray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-medium mb-2">Coding Challenges</h1>
              <p className="text-sm text-brandGray-400">
                Practice your Python skills with our curated collection of
                challenges
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-brandGray-400">
              <span>{challengesData.length} challenges available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challengesData.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>

          {/* Mystery Challenge Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Mystery Challenge</h2>
            <MysteryChallenge
              challenge={mysteryChallenge}
              loading={loadingMystery}
              onGenerate={handleFetchMystery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
