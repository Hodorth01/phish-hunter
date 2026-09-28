"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EMAIL_MAP, LEVELS } from "@/data/emails";
import {
  STORAGE_KEYS,
  accuracy,
  clearStorage,
  computeLevelScores,
  formatTime,
  loadJSON,
} from "@/lib/game";
import type { GameResult } from "@/lib/game";
import { colorClasses } from "@/components/levelStyle";

export default function ResultsScreen() {
  const router = useRouter();
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    const stored = loadJSON<GameResult>(STORAGE_KEYS.results);
    if (!stored) {
      router.replace("/");
      return;
    }
    // hydration: reading localStorage must happen after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(stored);
  }, [router]);

  if (!result) {
    return (
      <div className="relative flex flex-1 items-center justify-center">
        <p className="text-neon cursor-blink">GENERATING REPORT…</p>
      </div>
    );
  }

  const levelScores = computeLevelScores(result.answers);
  const acc = accuracy(result.answers);
  const classified = result.answers.length;

  return (
    <div className="relative flex flex-1 p-6">
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      <div className="scanlines fixed inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="rise-in panel-corner panel border-neon px-6 py-6 text-center">
          <p className="font-display text-[11px] tracking-[0.4em] text-dim">
            OPERATION COMPLETE
          </p>
          <h1 className="flicker mt-2 font-display text-3xl font-bold tracking-[0.1em] text-neon text-glow sm:text-4xl">
            {result.playerName.toUpperCase()}
          </h1>
          <p className="mt-3 text-[13px] text-text/90">
            You scored{" "}
            <span className="glow-green inline-block border border-neon px-3 py-1 font-display text-xl text-neon">
              {result.score}
            </span>{" "}
            in{" "}
            <span className="inline-block border border-cyan px-3 py-1 font-display text-xl text-cyan">
              {formatTime(result.totalTimeSec)}
            </span>
          </p>
          <p className="mt-4 text-[11px] tracking-widest text-dim">
            {classified}/15 EMAILS CLASSIFIED · {result.finishedLevels}/3 LEVELS
            CLEARED · {acc}% ACCURACY
          </p>
        </div>

        <div className="panel-corner panel border-line px-5 py-4">
          <p className="mb-3 font-display text-[11px] tracking-[0.3em] text-dim">
            LEVEL REPORT
          </p>
          <div className="flex flex-col gap-3">
            {LEVELS.map((level) => {
              const ls = levelScores.find((s) => s.levelId === level.id)!;
              const c = colorClasses(level.color);
              const pct = ls.total === 0 ? 0 : Math.round((ls.correct / ls.total) * 100);
              return (
                <div key={level.id}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className={`font-display tracking-[0.2em] ${c.text}`}>
                      {level.rank} · {level.name}
                    </span>
                    <span className="text-text-dim">
                      {ls.correct}/{ls.total} · {ls.score} PTS
                      {ls.usedHints > 0 && (
                        <span className="text-amber"> · {ls.usedHints} HINT{ls.usedHints > 1 ? "S" : ""}</span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1 h-2 border border-line bg-abyss/60">
                    <div
                      className={`h-full ${c.text === "text-neon" ? "bg-neon" : c.text === "text-cyan" ? "bg-cyan" : "bg-alert"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel-corner panel border-line px-5 py-4">
          <p className="mb-3 font-display text-[11px] tracking-[0.3em] text-dim">
            MISSION REVIEW
          </p>
          <div className="flex flex-col gap-2">
            {result.answers.map((a) => {
              const email = EMAIL_MAP[a.emailId];
              if (!email) return null;
              return (
                <div
                  key={a.emailId}
                  className={`border-l-2 px-3 py-2 ${a.correct ? "border-neon" : "border-alert"}`}
                >
                  <p className="text-[12px]">
                    <span className={a.correct ? "text-neon" : "text-alert"}>
                      {a.correct ? "[ CORRECT ]" : "[ WRONG ]"}
                    </span>{" "}
                    <span className="text-text">{email.subject}</span>
                    <span className="text-dim">
                      {" "}
                      · {email.isPhishing ? "PHISHING" : "SAFE"} · you said{" "}
                      {a.choice.toUpperCase()} · {a.timeTakenSec}s
                      {a.usedHint && <span className="text-amber"> · HINT</span>}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-text-dim">
                    {email.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              clearStorage(STORAGE_KEYS.results);
              router.push("/game");
            }}
            className="panel-corner glow-green flex-1 border border-neon bg-neon/10 px-6 py-4 font-display text-[13px] tracking-[0.3em] text-neon transition hover:bg-neon/20"
          >
            [ PLAY AGAIN ]
          </button>
          <button
            type="button"
            onClick={() => {
              clearStorage(STORAGE_KEYS.results, STORAGE_KEYS.name);
              router.push("/");
            }}
            className="panel-corner flex-1 border border-line px-6 py-4 font-display text-[13px] tracking-[0.3em] text-text-dim transition hover:bg-neon/5"
          >
            [ NEW OPERATOR ]
          </button>
        </div>

        <p className="pb-4 text-center text-[10px] tracking-widest text-dim">
          cyber0ne — JIC · STAY SHARP, TRUST NOTHING
        </p>
      </div>
    </div>
  );
}