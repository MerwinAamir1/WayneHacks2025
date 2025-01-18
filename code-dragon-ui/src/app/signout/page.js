"use client";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SignOutPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    async function doSignOut() {
      await signOut();
      window.location.href = "/";
    }
    doSignOut();
  }, [signOut]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brandBlack text-brandWhite">
      <h2 className="text-3xl font-display mb-2">Signing Out...</h2>
      <p className="text-brandGray-300 mb-4">
        Please wait while we securely end your session.
      </p>
      <div className="w-8 h-8 border-4 border-brandGray-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
