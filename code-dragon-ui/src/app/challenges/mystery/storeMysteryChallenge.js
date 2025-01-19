export function setLocalMysteryChallenge(challenge) {
  localStorage.setItem("mysteryChallenge", JSON.stringify(challenge));
}

export function getLocalMysteryChallenge() {
  const raw = localStorage.getItem("mysteryChallenge");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearLocalMysteryChallenge() {
  localStorage.removeItem("mysteryChallenge");
}
