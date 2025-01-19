import { setLocalMysteryChallenge } from "../storeMysteryChallenge.js";

if (resp.ok) {
  setMysteryChallenge(data);
  setLocalMysteryChallenge(data);
}
