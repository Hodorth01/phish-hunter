"use client";

import type { Level, LevelId } from "@/data/emails";
import { LEVELS } from "@/data/emails";
import { colorClasses } from "@/components/levelStyle";

export type LevelStatus = "cleared" | "active" | "locked";

interface LevelStripProps {
  status: Record<LevelId, LevelStatus>;
  onSelect: (levelId: LevelId) => void;
}

export default function LevelStrip({ status, onSelect }: LevelStripProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {LEVELS.map((level: Level) => {
        const c = colorClasses(level.color);
        const st = status[level.id];
        const isActive = st === "active";
        const isCleared = st === "cleared";
        const isLocked = st === "locked";
        return (
          <button
            key={level.id}
            type="button"
            disabled={isLocked}
            onClick={() => !isLocked && onSelect(level.id)}
            className={`panel-corner group flex flex-1 items-center gap-3 border px-4 py-3 text-left transition ${
              isActive
                ? `${c.border} ${c.glow} ${c.softBg}`
                : isCleared
                  ? "border-line hover:border-line-bright hover:bg-neon/5"
                  : "cursor-not-allowed border-line opacity-40"
            }`}
          >
            <span className={`font-display text-lg ${isActive ? c.text : isCleared ? "text-text-dim" : "text-dim"}`}>
              {level.rank}
            </span>
            <span className="flex-1">
              <span
                className={`font-display text-[13px] tracking-[0.2em] ${
                  isActive ? c.text : isCleared ? "text-text" : "text-text-dim"
                }`}
              >
                {level.name}
              </span>
              <span className="block text-[10px] text-dim">{level.tagline}</span>
            </span>
            <span className="text-[10px]">
              {isLocked && <span className="text-dim">[ LOCKED ]</span>}
              {isCleared && <span className="text-neon">[ CLEARED ]</span>}
              {isActive && <span className={`${c.text} cursor-blink`}>[ ACTIVE ]</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}