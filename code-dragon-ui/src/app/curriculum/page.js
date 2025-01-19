"use client";

import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Lock,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";

const INITIAL_TIERS = [
  {
    title: "Tier 1: Python Foundations",
    description: "Your journey begins with the basics.",
    isLocked: false,
    estimatedHours: 8,
    modules: [
      {
        name: "Variables & Data Types",
        completed: false,
        description:
          "Learn about Python's basic data types and how to use variables.",
        topics: [
          "Numbers",
          "Strings",
          "Booleans",
          "Type conversion",
          "Variables naming",
        ],
        exercises: 5,
      },
      {
        name: "Control Flow (If/Else, Loops)",
        completed: false,
        description:
          "Master the art of controlling program flow with conditions and loops.",
        topics: [
          "If statements",
          "For loops",
          "While loops",
          "Break/Continue",
          "Nested loops",
        ],
        exercises: 6,
      },
      {
        name: "Functions & Scope",
        completed: false,
        description:
          "Understand how to create reusable code blocks with functions.",
        topics: [
          "Function definition",
          "Parameters",
          "Return values",
          "Local/Global scope",
        ],
        exercises: 4,
      },
    ],
  },
  {
    title: "Tier 2: Intermediate Python",
    description: "Next steps into deeper topics.",
    isLocked: true,
    estimatedHours: 12,
    modules: [
      {
        name: "Data Structures",
        completed: false,
        description:
          "Explore Python's built-in data structures and their usage.",
        topics: [
          "Lists",
          "Dictionaries",
          "Sets",
          "Tuples",
          "List comprehension",
        ],
        exercises: 7,
      },
      {
        name: "Object-Oriented Programming",
        completed: false,
        description:
          "Learn the principles of OOP and how to implement them in Python.",
        topics: [
          "Classes",
          "Objects",
          "Inheritance",
          "Polymorphism",
          "Encapsulation",
        ],
        exercises: 5,
      },
      {
        name: "Error Handling & Exceptions",
        completed: false,
        description:
          "Master the art of handling errors and exceptions gracefully.",
        topics: [
          "Try/Except",
          "Custom exceptions",
          "Error types",
          "Best practices",
        ],
        exercises: 4,
      },
    ],
  },
  {
    title: "Tier 3: Advanced Topics",
    description: "Push your Python skills further.",
    isLocked: true,
    estimatedHours: 15,
    modules: [
      {
        name: "Decorators & Generators",
        completed: false,
        description:
          "Dive into advanced Python features for better code organization.",
        topics: [
          "Function decorators",
          "Class decorators",
          "Generators",
          "Yield",
        ],
        exercises: 5,
      },
      {
        name: "Modules & Packages",
        completed: false,
        description:
          "Learn how to organize and structure larger Python applications.",
        topics: [
          "Import system",
          "Package creation",
          "Virtual environments",
          "PyPI",
        ],
        exercises: 3,
      },
      {
        name: "File I/O & Concurrency",
        completed: false,
        description:
          "Master file operations and concurrent programming concepts.",
        topics: ["File operations", "Threading", "Asyncio", "Multiprocessing"],
        exercises: 6,
      },
    ],
  },
];

function ModuleCard({ module, isLocked, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-brandGray-800/50 rounded-lg border border-brandGray-700/50 overflow-hidden transition-all duration-200 hover:border-brandGray-600/50">
      <div
        className="p-4 flex items-center gap-3 cursor-pointer"
        onClick={() => !isLocked && setIsExpanded(!isExpanded)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            !isLocked && onToggle();
          }}
          className={`flex-shrink-0 ${
            isLocked ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={isLocked}
        >
          {isLocked ? (
            <Lock className="w-5 h-5 text-brandGray-500" />
          ) : module.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-brandGray-400" />
          )}
        </button>

        <div className="flex-grow">
          <h3
            className={`text-sm font-medium ${
              module.completed ? "text-brandGray-400" : "text-brandWhite"
            }`}
          >
            {module.name}
          </h3>
          <p className="text-xs text-brandGray-400 mt-1">
            {module.exercises} exercises
          </p>
        </div>

        <ChevronRight
          className={`w-4 h-4 text-brandGray-400 transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </div>

      {isExpanded && !isLocked && (
        <div className="px-4 pb-4 pt-2 border-t border-brandGray-700/50">
          <p className="text-sm text-brandGray-300 mb-3">
            {module.description}
          </p>
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-brandGray-400">
              Topics covered:
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {module.topics.map((topic, idx) => (
                <li
                  key={idx}
                  className="text-xs text-brandGray-300 flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-brandGray-400 rounded-full" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function TierCard({ tier, tierIndex, onModuleToggle }) {
  const moduleCount = tier.modules.length;
  const completedCount = tier.modules.filter((m) => m.completed).length;
  const progress = Math.round((completedCount / moduleCount) * 100);

  return (
    <div className="bg-brandGray-900/50 rounded-lg border border-brandGray-800">
      <div className="p-6 border-b border-brandGray-800">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-medium mb-1">{tier.title}</h2>
            <p className="text-sm text-brandGray-400">{tier.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-brandGray-400">
            <Clock className="w-4 h-4" />
            {tier.estimatedHours}h
          </div>
        </div>

        <div className="w-full h-1 bg-brandGray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500/50 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-brandGray-400 mt-2">
          {completedCount} of {moduleCount} modules completed
        </p>
      </div>

      <div className="p-6 space-y-3">
        {tier.modules.map((module, moduleIndex) => (
          <ModuleCard
            key={moduleIndex}
            module={module}
            isLocked={tier.isLocked}
            onToggle={() => onModuleToggle(tierIndex, moduleIndex)}
          />
        ))}
      </div>
    </div>
  );
}

export default function CurriculumPage() {
  const [tiers, setTiers] = useState(INITIAL_TIERS);

  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    let totalHours = 0;

    tiers.forEach((tier) => {
      totalHours += tier.estimatedHours;
      tier.modules.forEach((m) => {
        total += 1;
        if (m.completed) completed += 1;
      });
    });

    return {
      totalModules: total,
      completedModules: completed,
      totalHours,
      completionPercentage: Math.round((completed / total) * 100),
    };
  }, [tiers]);

  function toggleModule(tierIndex, moduleIndex) {
    setTiers((prevTiers) => {
      const newTiers = [...prevTiers];
      newTiers[tierIndex] = {
        ...newTiers[tierIndex],
        modules: [...newTiers[tierIndex].modules],
      };
      newTiers[tierIndex].modules[moduleIndex] = {
        ...newTiers[tierIndex].modules[moduleIndex],
        completed: !newTiers[tierIndex].modules[moduleIndex].completed,
      };

      // Unlock next tier if all modules in current tier are completed
      if (tierIndex < newTiers.length - 1) {
        const allCompleted = newTiers[tierIndex].modules.every(
          (m) => m.completed
        );
        if (allCompleted) {
          newTiers[tierIndex + 1] = {
            ...newTiers[tierIndex + 1],
            isLocked: false,
          };
        }
      }

      return newTiers;
    });
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite">
      {/* Header */}
      <div className="border-b border-brandGray-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-medium mb-2">Python Curriculum</h1>
              <p className="text-sm text-brandGray-400">
                Master Python progressively through structured tiers
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-brandGray-400">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{stats.totalModules} modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{stats.totalHours} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>{stats.completionPercentage}% complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {tiers.map((tier, tierIndex) => (
            <TierCard
              key={tierIndex}
              tier={tier}
              tierIndex={tierIndex}
              onModuleToggle={toggleModule}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
