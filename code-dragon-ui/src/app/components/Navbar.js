"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const isSignedIn = false;

  return (
    <header className="w-full bg-brandBlack shadow-lg shadow-brandBlack relative z-50">
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition">
            <img
              src="/dragon-logo.svg"
              alt="Code Dragon Logo"
              className="w-8 h-8"
            />
            <span className="text-2xl font-display text-brandWhite tracking-wider">
              Code Dragon
            </span>
          </a>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brandWhite hover:text-brandGray-300 transition focus:outline-none"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
        </button>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks isSignedIn={isSignedIn} />
        </nav>
      </div>

      <div
        className={`
          md:hidden bg-brandBlack transition-all duration-300
          ${
            isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }
          overflow-hidden
        `}
      >
        <nav className="px-4 pt-2 pb-4 flex flex-col space-y-2">
          <NavLinks
            isSignedIn={isSignedIn}
            onClickLink={() => setIsOpen(false)}
          />
        </nav>
      </div>
    </header>
  );
}

function NavLinks({ isSignedIn, onClickLink }) {
  const handleClick = (fn) => {
    if (onClickLink) onClickLink();
    if (fn) fn();
  };

  return (
    <>
      <Link href="/">
        <a
          onClick={() => handleClick()}
          className="text-brandWhite hover:text-brandGray-300 transition-colors"
        >
          Home
        </a>
      </Link>
      <Link href="/challenges">
        <a
          onClick={() => handleClick()}
          className="text-brandWhite hover:text-brandGray-300 transition-colors"
        >
          Challenges
        </a>
      </Link>
      <Link href="/sandbox">
        <a
          onClick={() => handleClick()}
          className="text-brandWhite hover:text-brandGray-300 transition-colors"
        >
          Sandbox
        </a>
      </Link>
      <Link href="/assistant">
        <a
          onClick={() => handleClick()}
          className="text-brandWhite hover:text-brandGray-300 transition-colors"
        >
          AI Assistant
        </a>
      </Link>
      <Link href="/curriculum">
        <a
          onClick={() => handleClick()}
          className="text-brandWhite hover:text-brandGray-300 transition-colors"
        >
          Curriculum
        </a>
      </Link>

      {isSignedIn ? (
        <a
          onClick={() => handleClick()}
          className="text-brandWhite hover:text-brandGray-300 transition-colors cursor-pointer"
        >
          Sign Out
        </a>
      ) : (
        <Link href="/signin">
          <a
            onClick={() => handleClick()}
            className="bg-brandWhite text-brandBlack font-semibold px-3 py-1 rounded hover:bg-brandGray-300 transition-colors"
          >
            Sign In
          </a>
        </Link>
      )}
    </>
  );
}
