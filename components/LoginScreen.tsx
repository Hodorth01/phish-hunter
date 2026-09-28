"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS, saveJSON } from "@/lib/game";

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  function start() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    saveJSON(STORAGE_KEYS.name, trimmed);
    router.push("/game");
  }

  return (
    <div className="relative flex flex-1 items-center justify-center p-6">
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      <div className="scanlines fixed inset-0 pointer-events-none" />

      <div className="rise-in relative w-full max-w-xl">
        <div className="panel-corner panel relative border-line p-8">
          <div className="absolute right-4 top-3 text-[10px] tracking-[0.3em] text-dim">
            JIC — CYBERSECURITY CLUB
          </div>

          <div className="mb-8 flex items-center gap-3">
            <span className="glow-green border border-neon px-2 py-1 font-display text-[11px] tracking-[0.3em] text-neon">
              cyber<span className="text-cyan">0</span>ne
            </span>
            <span className="text-dim">—</span>
            <span className="font-display text-[11px] tracking-[0.3em] text-text-dim">
              OPERATION
            </span>
          </div>

          <h1 className="flicker font-display text-3xl font-bold tracking-[0.08em] text-neon text-glow sm:text-5xl sm:tracking-[0.15em]">
            PHISH<span className="text-cyan">_</span>
            <span className="cursor-blink text-cyan">HUNTER</span>
          </h1>

          <p className="mt-2 font-display text-[11px] tracking-[0.4em] text-dim">
            TRACKING &amp; NEUTRALISING DECEPTIVE EMAILS
          </p>

          <p className="mt-6 text-[13px] leading-relaxed text-text/90">
            15 emails. 3 threat levels{" "}
            <span className="text-neon">RECRUIT</span> ·{" "}
            <span className="text-cyan">AGENT</span> ·{" "}
            <span className="text-alert">ELITE</span>. Classify each message as
            phishing or safe, use hints if you get stuck but every hint cuts
            your reward. Your score and time are recorded when the hunt ends.
          </p>

          <div className="mt-8 space-y-3">
            <label htmlFor="player-name" className="block text-[11px] tracking-widest text-dim">
              OPERATOR CALLSIGN
            </label>
            <input
              id="player-name"
              type="text"
              value={name}
              maxLength={40}
              onChange={(e) => {
                setName(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && start()}
              placeholder="enter your name, agent…"
              className={`w-full border bg-abyss/60 px-4 py-3 text-[14px] text-neon caret-neon outline-none transition ${
                error ? "border-alert shadow-[0_0_14px_rgba(255,46,77,0.4)]" : "border-line focus:border-neon focus:shadow-[0_0_14px_rgba(0,255,65,0.25)]"
              }`}
            />
            {error && (
              <p className="text-[11px] text-alert">
                [ ERROR ] name required to begin the hunt
              </p>
            )}
            <button
              type="button"
              onClick={start}
              className="panel-corner glow-green w-full border border-neon bg-neon/10 px-6 py-4 font-display text-[14px] tracking-[0.3em] text-neon transition hover:bg-neon/20"
            >
              [ INITIATE HUNT ]
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[10px] text-dim">
            <div className="border border-line px-2 py-2">15 EMAILS</div>
            <div className="border border-line px-2 py-2">3 LEVELS</div>
            <div className="border border-line px-2 py-2">NO SECOND CHANCES</div>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] tracking-widest text-dim">
          cyber0ne — JIC · BUILT FOR TRAINING, NOT FOR ATTACKS
        </p>
      </div>
    </div>
  );
}