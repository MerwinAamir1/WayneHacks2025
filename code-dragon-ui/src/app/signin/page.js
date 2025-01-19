"use client";

import { useSignIn } from "@clerk/nextjs";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const { userId, isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard");
    }
  }, [isLoaded, userId, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isLoaded || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        console.log("Sign in response:", result);
      }
    } catch (err) {
      console.log(err);
      setErrorMsg("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite flex flex-col">
      {/* Header */}
      <div className="w-full p-4 text-center border-b border-brandGray-800">
        <Link
          href="/"
          className="text-sm text-brandGray-400 hover:text-brandGray-300 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium mb-2">Welcome back</h1>
            <p className="text-sm text-brandGray-400">
              Sign in to continue your Python learning journey
            </p>
          </div>

          <div className="bg-brandGray-900/50 border border-brandGray-800 rounded-lg p-6">
            {errorMsg && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-sm text-red-400">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brandGray-800 border border-brandGray-700 rounded-md px-4 py-2 pl-10 
                             focus:outline-none focus:border-brandGray-600 transition-colors"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-brandGray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brandGray-800 border border-brandGray-700 rounded-md px-4 py-2 pl-10
                             focus:outline-none focus:border-brandGray-600 transition-colors"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-brandGray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-brandGray-400 hover:text-brandGray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-brandGray-700 bg-brandGray-800"
                  />
                  <span className="text-brandGray-400">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-brandGray-400 hover:text-brandGray-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brandWhite text-brandBlack py-2 rounded-md font-medium 
                         hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-brandGray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-brandWhite hover:underline transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
