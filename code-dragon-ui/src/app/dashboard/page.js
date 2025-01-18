"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-brandGray-300">Loading...</p>
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
    <div className="p-8 bg-brandGray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-brandGray-900 p-6 rounded shadow-md">
        <h1 className="text-3xl font-display mb-4">Dashboard</h1>
        <p className="text-brandGray-300 mb-6">
          This is your personal space to track progress, solve challenges, and
          engage with our AI assistant.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <a
            href="/challenges"
            className="px-6 py-3 bg-brandWhite text-brandBlack rounded font-semibold hover:opacity-80 transition text-center"
          >
            Solve Challenges
          </a>
          <a
            href="/sandbox"
            className="px-6 py-3 bg-brandWhite text-brandBlack rounded font-semibold hover:opacity-80 transition text-center"
          >
            Code Sandbox
          </a>
          <a
            href="/assistant"
            className="px-6 py-3 bg-brandWhite text-brandBlack rounded font-semibold hover:opacity-80 transition text-center"
          >
            AI Assistant
          </a>
          <a
            href="/curriculum"
            className="px-6 py-3 bg-brandWhite text-brandBlack rounded font-semibold hover:opacity-80 transition text-center"
          >
            Python Curriculum
          </a>
        </div>

        <div className="mb-6 text-brandGray-400 text-sm">
          <p>Need help or suggestions? Ask our AI or check out the docs!</p>
        </div>

        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="inline-block py-2 px-4 bg-brandGray-700 text-brandWhite rounded font-semibold hover:opacity-80 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
