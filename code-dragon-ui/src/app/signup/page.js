"use client";

import { useSignUp } from "@clerk/nextjs";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const { userId, isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard");
    }
  }, [isLoaded, userId, router]);

  async function handleSignUp(e) {
    e.preventDefault();
    if (!isLoaded || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification();
      setPendingVerification(true);
    } catch (err) {
      const firstError = err.errors?.[0]?.message || "Something went wrong.";
      setErrorMsg(firstError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerification(e) {
    e.preventDefault();
    if (!isLoaded || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        console.log("Email verification response:", result);
      }
    } catch (err) {
      setErrorMsg("Invalid verification code. Please try again.");
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
          {!pendingVerification ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-medium mb-2">
                  Create your account
                </h1>
                <p className="text-sm text-brandGray-400">
                  Start your Python learning journey today
                </p>
              </div>

              <div className="bg-brandGray-900/50 border border-brandGray-800 rounded-lg p-6">
                {errorMsg && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-5">
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
                        placeholder="Create a password"
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brandWhite text-brandBlack py-2 rounded-md font-medium 
                             hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-medium mb-2">Verify your email</h1>
                <p className="text-sm text-brandGray-400">
                  We've sent a verification code to {email}
                </p>
              </div>

              <div className="bg-brandGray-900/50 border border-brandGray-800 rounded-lg p-6">
                {errorMsg && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleVerification} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Verification Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-brandGray-800 border border-brandGray-700 rounded-md px-4 py-2 pl-10
                                 focus:outline-none focus:border-brandGray-600 transition-colors"
                        placeholder="Enter verification code"
                      />
                      <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-brandGray-400" />
                    </div>
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
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify email
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}

          <p className="text-center mt-6 text-sm text-brandGray-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-brandWhite hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div id="clerk-captcha" />
    </div>
  );
}
