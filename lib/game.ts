import type { LevelId, PhishEmail } from "@/data/emails";
import { EMAIL_MAP } from "@/data/emails";

export type Choice = "phishing" | "safe";

export interface Answer {
  emailId: string;
  choice: Choice;
  correct: boolean;
  usedHint: boolean;
  timeTakenSec: number;
  pointsEarned: number;
}

export interface LevelScore {
  levelId: LevelId;
  score: number;
  correct: number;
  total: number;
  usedHints: number;
}

export interface GameResult {
  playerName: string;
  score: number;
  totalTimeSec: number;
  finishedLevels: number;
  answers: Answer[];
}

export const STORAGE_KEYS = {
  name: "phishhunter:name",
  results: "phishhunter:results",
} as const;

export const SCORING = {
  correctClean: 100,
  correctWithHint: 50,
  wrong: -50,
} as const;

export function speedBonus(seconds: number): number {
  if (seconds <= 8) return 30;
  if (seconds <= 15) return 15;
  if (seconds <= 25) return 5;
  return 0;
}

export function computePoints(
  email: PhishEmail,
  choice: Choice,
  usedHint: boolean,
  seconds: number,
): { correct: boolean; points: number } {
  const correct = (choice === "phishing") === email.isPhishing;
  let points = 0;
  if (correct) {
    points = usedHint ? SCORING.correctWithHint : SCORING.correctClean + speedBonus(seconds);
  } else {
    points = SCORING.wrong;
  }
  return { correct, points };
}

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export function computeLevelScores(answers: Answer[]): LevelScore[] {
  const levels: LevelId[] = ["recruit", "agent", "elite"];
  return levels.map((levelId) => {
    const levelAnswers = answers.filter((a) => {
      const email = EMAIL_MAP[a.emailId];
      return email?.level === levelId;
    });
    return {
      levelId,
      score: levelAnswers.reduce((sum, a) => sum + a.pointsEarned, 0),
      correct: levelAnswers.filter((a) => a.correct).length,
      total: levelAnswers.length,
      usedHints: levelAnswers.filter((a) => a.usedHint).length,
    };
  });
}

export function accuracy(answers: Answer[]): number {
  if (answers.length === 0) return 0;
  return Math.round((answers.filter((a) => a.correct).length / answers.length) * 100);
}

export function maxScore(): number {
  const cleanBest = SCORING.correctClean + speedBonus(1);
  return 15 * cleanBest;
}

export function loadJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — ignore
  }
}

export function clearStorage(...keys: string[]): void {
  keys.forEach((k) => window.localStorage.removeItem(k));
}