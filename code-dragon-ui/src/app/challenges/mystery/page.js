"use client";

import { useEffect, useState } from "react";
import MysteryChallengeDetail from "./MysteryChallengeDetail";
import { getLocalMysteryChallenge } from "./storeMysteryChallenge";

export default function MysteryPage() {
  const [challenge, setChallenge] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = getLocalMysteryChallenge();
    setChallenge(stored);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-brandBlack text-brandWhite flex items-center justify-center">
        <p>Loading challenge...</p>
      </div>
    );
  }
  if (!challenge) {
    return (
      <div className="min-h-screen bg-brandBlack text-brandWhite flex items-center justify-center">
        <p>No Mystery Challenge found. Generate one first.</p>
      </div>
    );
  }

  return <MysteryChallengeDetail challenge={challenge} />;
}
