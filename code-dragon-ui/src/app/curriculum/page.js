"use client";

import { useMemo, useState } from "react";

export default function CurriculumPage() {
  const [tiers, setTiers] = useState([
    {
      title: "Tier 1: Python Foundations",
      description: "Your journey begins with the basics.",
      modules: [
        {
          name: "Variables & Data Types",
          completed: false,
        },
        {
          name: "Control Flow (If/Else, Loops)",
          completed: false,
        },
        {
          name: "Functions & Scope",
          completed: false,
        },
      ],
    },
    {
      title: "Tier 2: Intermediate Python",
      description: "Next steps into deeper topics.",
      modules: [
        {
          name: "Data Structures (Lists, Dicts, etc.)",
          completed: false,
        },
        {
          name: "Object-Oriented Programming",
          completed: false,
        },
        {
          name: "Error Handling & Exceptions",
          completed: false,
        },
      ],
    },
    {
      title: "Tier 3: Advanced Topics",
      description: "Push your Python skills further.",
      modules: [
        {
          name: "Decorators & Generators",
          completed: false,
        },
        {
          name: "Modules & Packages",
          completed: false,
        },
        {
          name: "File I/O & Concurrency",
          completed: false,
        },
      ],
    },
  ]);

  const { totalModules, completedModules } = useMemo(() => {
    let total = 0;
    let completed = 0;
    tiers.forEach((tier) => {
      tier.modules.forEach((m) => {
        total += 1;
        if (m.completed) completed += 1;
      });
    });
    return { totalModules: total, completedModules: completed };
  }, [tiers]);

  const completionPercentage =
    totalModules === 0
      ? 0
      : Math.round((completedModules / totalModules) * 100);

  function toggleModule(tierIndex, moduleIndex) {
    const newTiers = [...tiers];
    newTiers[tierIndex].modules[moduleIndex].completed =
      !newTiers[tierIndex].modules[moduleIndex].completed;
    setTiers(newTiers);
  }

  return (
    <div className="min-h-screen bg-brandBlack text-brandWhite p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-4xl font-display mb-2">Python Curriculum</h1>
          <p className="text-brandGray-300">
            Progress through the tiers to master Python from basics to advanced!
          </p>
        </div>

        <div className="w-full bg-brandGray-800 rounded h-4 overflow-hidden">
          <div
            className="h-4 bg-brandWhite transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-brandGray-300 text-sm">
          {completedModules} / {totalModules} modules completed (
          {completionPercentage}%)
        </p>

        <div className="space-y-8 mt-8">
          {tiers.map((tier, tierIndex) => (
            <div
              key={tierIndex}
              className="bg-brandGray-900 rounded p-4 shadow-glow-black"
            >
              <h2 className="text-2xl font-display mb-1">{tier.title}</h2>
              <p className="text-brandGray-400 text-sm mb-4">
                {tier.description}
              </p>

              <div className="space-y-3">
                {tier.modules.map((module, moduleIndex) => (
                  <label
                    key={moduleIndex}
                    className="flex items-center bg-brandGray-800 rounded p-3 hover:bg-brandGray-700 transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={module.completed}
                      onChange={() => toggleModule(tierIndex, moduleIndex)}
                      className="h-5 w-5 accent-brandWhite mr-3"
                    />
                    <span
                      className={`text-sm ${
                        module.completed
                          ? "line-through text-brandGray-400"
                          : "text-brandGray-200"
                      }`}
                    >
                      {module.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
