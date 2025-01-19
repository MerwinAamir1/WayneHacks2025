"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { BookOpen, Bot, Boxes, Code2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/signin");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brandBlack text-brandWhite">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-t-2 border-brandWhite rounded-full animate-spin" />
          <p className="text-brandGray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite">
      <Navbar />

      {/* Hero Section */}
      <header className="relative border-b border-brandGray-800">
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-medium mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-lg text-brandGray-300">
              Track your progress, solve challenges, and harness the power of
              our AI assistant.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            title="Solve Challenges"
            href="/challenges"
            description="Improve your coding skills by tackling algorithmic puzzles."
            icon={<Boxes className="w-5 h-5" />}
          />
          <DashboardCard
            title="Code Sandbox"
            href="/sandbox"
            description="Test, compile, and run Python code in a safe environment."
            icon={<Code2 className="w-5 h-5" />}
          />
          <DashboardCard
            title="AI Assistant"
            href="/assistant"
            description="Ask for hints or solutions, with speech-to-speech interaction."
            icon={<Bot className="w-5 h-5" />}
          />
          <DashboardCard
            title="Python Curriculum"
            href="/curriculum"
            description="Master Python via a structured tiered roadmap."
            icon={<BookOpen className="w-5 h-5" />}
          />
        </div>

        {/* Help Section */}
        <div className="border border-brandGray-800 rounded-lg p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-medium mb-2">Need Guidance?</h2>
              <p className="text-brandGray-300">
                Our Python tutor AI is here to help you learn and grow.
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-brandGray-800 hover:bg-brandGray-700 rounded-md border border-brandGray-700 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, href, description, icon }) {
  return (
    <a
      href={href}
      className="group flex flex-col p-6 rounded-lg border border-brandGray-800 hover:border-brandGray-700 bg-brandGray-900/50 hover:bg-brandGray-900 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-brandGray-800 rounded-md">{icon}</div>
        <span className="text-brandGray-400 group-hover:translate-x-1 transition-transform duration-200">
          →
        </span>
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-brandGray-400 group-hover:text-brandGray-300 transition-colors duration-200">
        {description}
      </p>
    </a>
  );
}
