"use client";

import {
  BookOpen,
  Bot,
  ChevronRight,
  Code2,
  Home,
  LogOut,
  Menu,
  Terminal,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function NavLink({
  href,
  icon: Icon,
  children,
  isActive,
  onClick,
  className = "",
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
        ${
          isActive
            ? "bg-brandGray-800 text-brandWhite"
            : "text-brandGray-400 hover:bg-brandGray-800/50 hover:text-brandWhite"
        }
        ${className}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
      <ChevronRight
        className={`w-4 h-4 ml-auto transition-transform duration-200 
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      />
    </Link>
  );
}

function MobileNav({ isOpen, onClose, isSignedIn, currentPath }) {
  return (
    <div
      className={`
        fixed inset-0 z-50 transform transition-transform duration-300 md:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* Menu */}
      <div className="relative w-4/5 max-w-xs h-full bg-brandBlack border-r border-brandGray-800">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-brandGray-800">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Navigation</span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-brandGray-800 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex-grow p-4 space-y-1">
            <NavLink
              href="/"
              icon={Home}
              isActive={currentPath === "/"}
              onClick={onClose}
            >
              Home
            </NavLink>
            <NavLink
              href="/challenges"
              icon={Code2}
              isActive={currentPath === "/challenges"}
              onClick={onClose}
            >
              Challenges
            </NavLink>
            <NavLink
              href="/sandbox"
              icon={Terminal}
              isActive={currentPath === "/sandbox"}
              onClick={onClose}
            >
              Sandbox
            </NavLink>
            <NavLink
              href="/assistant"
              icon={Bot}
              isActive={currentPath === "/assistant"}
              onClick={onClose}
            >
              AI Assistant
            </NavLink>
            <NavLink
              href="/curriculum"
              icon={BookOpen}
              isActive={currentPath === "/curriculum"}
              onClick={onClose}
            >
              Curriculum
            </NavLink>
          </nav>

          <div className="p-4 border-t border-brandGray-800">
            {isSignedIn ? (
              <button
                onClick={onClose}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/signout"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brandWhite text-brandBlack rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Sign Out
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();
  const isSignedIn = false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brandGray-800 bg-brandBlack/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium hover:text-brandGray-300 transition-colors"
        >
          <span className="text-2xl tracking-tight">Code Dragon</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-grow">
          <NavLink href="/" icon={Home} isActive={currentPath === "/"}>
            Home
          </NavLink>
          <NavLink
            href="/challenges"
            icon={Code2}
            isActive={currentPath === "/challenges"}
          >
            Challenges
          </NavLink>
          <NavLink
            href="/sandbox"
            icon={Terminal}
            isActive={currentPath === "/sandbox"}
          >
            Sandbox
          </NavLink>
          <NavLink
            href="/assistant"
            icon={Bot}
            isActive={currentPath === "/assistant"}
          >
            AI Assistant
          </NavLink>
          <NavLink
            href="/curriculum"
            icon={BookOpen}
            isActive={currentPath === "/curriculum"}
          >
            Curriculum
          </NavLink>
        </nav>

        {/* Auth Button - Desktop */}
        <div className="hidden md:block">
          {isSignedIn ? (
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/signout"
              className="flex items-center gap-2 px-4 py-2 bg-brandWhite text-brandBlack rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Sign Out
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 hover:bg-brandGray-800 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <MobileNav
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isSignedIn={isSignedIn}
        currentPath={currentPath}
      />
    </header>
  );
}
