"use client";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    if (!isLoaded) return;

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
    }
  }

  async function handleVerification(e) {
    e.preventDefault();
    if (!isLoaded) return;

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
    }
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite flex items-center justify-center">
      <div id="clerk-captcha"></div>
      {!pendingVerification && (
        <form
          onSubmit={handleSignUp}
          className="bg-brandGray-800 p-6 rounded w-full max-w-sm"
        >
          <h2 className="text-2xl font-display mb-4">Sign Up</h2>
          {errorMsg && <p className="text-red-400 mb-2">{errorMsg}</p>}

          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-brandGray-700 focus:outline-none"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-brandGray-700 focus:outline-none"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brandWhite text-brandBlack py-2 rounded font-semibold hover:opacity-80 transition"
          >
            Sign Up
          </button>

          <p className="mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-brandGray-300 hover:underline">
              Sign In
            </a>
          </p>
        </form>
      )}

      {pendingVerification && (
        <form
          onSubmit={handleVerification}
          className="bg-brandGray-800 p-6 rounded w-full max-w-sm"
        >
          <h2 className="text-2xl font-display mb-4">Verify Your Email</h2>
          {errorMsg && <p className="text-red-400 mb-2">{errorMsg}</p>}

          <div className="mb-4">
            <label className="block mb-2">Verification Code</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-brandGray-700 focus:outline-none"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brandWhite text-brandBlack py-2 rounded font-semibold hover:opacity-80 transition"
          >
            Verify
          </button>
        </form>
      )}
    </div>
  );
}
