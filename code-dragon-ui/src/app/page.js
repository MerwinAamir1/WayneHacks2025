"use client";

import { ArrowRight, Bot, Code2, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group relative bg-brandGray-900/50 border border-brandGray-800 rounded-lg p-6 hover:border-brandGray-700 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-brandGray-800 rounded-md group-hover:bg-brandGray-700 transition-colors">
          <Icon className="w-5 h-5 text-brandGray-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-brandGray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-brandBlack text-brandWhite">
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAyL3dvcmxkZmFjZXNsYWJfYV9ibGFja19zaWxob3VldHRlX2RyYWdvbl9sb2dvX2ljb25fb25fYV93aGl0ZV9iYV81YzMzOTc1ZS1hYTliLTRjOWEtODJiMy1hMzQ2ODA1NzIzYzYucG5n.png')] bg-center bg-cover bg-no-repeat opacity-[0.03] animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-brandBlack via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brandGray-900/50 border border-brandGray-800 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-brandGray-300">
                The future of Python learning
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium mb-6 tracking-tight">
              Master Python with
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Code Dragon
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-brandGray-400 leading-relaxed mb-12">
              Your all-in-one platform to master Python, solve coding
              challenges, and chat with our AI assistant—all in one sleek,
              modern experience.
            </p>

            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Link
                href="/signup"
                className="group px-6 py-3 bg-brandWhite text-brandBlack rounded-lg font-medium inline-flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signin"
                className="px-6 py-3 rounded-lg border border-brandGray-800 text-brandGray-300 hover:bg-brandGray-900/50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              icon={Code2}
              title="Interactive Challenges"
              description="Practice with our curated collection of Python coding challenges, from basics to advanced algorithms."
            />
            <FeatureCard
              icon={Terminal}
              title="Live Code Sandbox"
              description="Write, test, and run Python code in real-time with our integrated development environment."
            />
            <FeatureCard
              icon={Bot}
              title="AI Assistant"
              description="Get instant help and feedback from our intelligent AI tutor as you learn and code."
            />
          </div>
        </div>
      </div>

      <footer className="border-t border-brandGray-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-sm text-brandGray-400">
            &copy; {new Date().getFullYear()} Code Dragon. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-brandGray-400 hover:text-brandGray-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-brandGray-400 hover:text-brandGray-300 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
