"use client";
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isLoaded) return;

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
    }
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-brandGray-800 p-6 rounded w-full max-w-sm"
      >
        <h2 className="text-2xl font-display mb-4">Sign In</h2>
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
          Sign In
        </button>

        <p className="mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-brandGray-300 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
