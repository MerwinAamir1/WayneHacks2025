import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-brandGray-900 shadow-glow-black">
      <div className="flex items-center gap-2">
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition">
            <img
              src="/assets/dragon-logo.svg"
              alt="Code Dragon Logo"
              className="w-8 h-8"
            />
            <span className="text-xl font-display">Code Dragon</span>
          </a>
        </Link>
      </div>

      <nav className="flex items-center space-x-6">
        {isSignedIn ? (
          <>
            <Link href="/dashboard">
              <a className="hover:text-brandGray-300 transition-colors">
                Dashboard
              </a>
            </Link>
            <Link href="/signout">
              <a className="hover:text-brandGray-300 transition-colors">
                Sign Out
              </a>
            </Link>
          </>
        ) : (
          <>
            <Link href="/signin">
              <a className="hover:text-brandGray-300 transition-colors">
                Sign In
              </a>
            </Link>
            <Link href="/signup">
              <a className="hover:text-brandGray-300 transition-colors">
                Sign Up
              </a>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
