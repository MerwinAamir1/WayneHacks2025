import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-brandGray-900 shadow-glow-black">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img
            src="/assets/dragon-logo.svg"
            alt="Code Dragon Logo"
            className="w-8 h-8"
          />
          <span className="text-xl font-display">Code Dragon</span>
        </Link>
      </div>
      <nav className="flex items-center space-x-6">
        {isSignedIn ? (
          <>
            <Link
              href="/dashboard"
              className="hover:text-brandGray-300 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/signout"
              className="hover:text-brandGray-300 transition-colors"
            >
              Sign Out
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className="hover:text-brandGray-300 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hover:text-brandGray-300 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
