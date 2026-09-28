"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LEVELS, EMAILS_BY_LEVEL, EMAIL_MAP } from "@/data/emails";
import type { LevelId, PhishEmail } from "@/data/emails";
import {
  STORAGE_KEYS,
  computePoints,
  formatTime,
  loadJSON,
  saveJSON,
} from "@/lib/game";
import type { Answer, Choice, GameResult } from "@/lib/game";
import MailSidebar from "@/components/MailSidebar";
import LevelStrip from "@/components/LevelStrip";
import type { LevelStatus } from "@/components/LevelStrip";
import EmailList from "@/components/EmailList";
import EmailPreview from "@/components/EmailPreview";
import Toast from "@/components/Toast";
import type { ToastData } from "@/components/Toast";

interface Banner {
  clearedName: string;
  nextId: LevelId | null;
  last: boolean;
}

export default function GameScreen() {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");

  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(0);

  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [usedHint, setUsedHint] = useState<Record<string, boolean>>({});
  const [activeLevelId, setActiveLevelId] = useState<LevelId>("recruit");
  const [viewLevelId, setViewLevelId] = useState<LevelId>("recruit");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [hintConfirmFor, setHintConfirmFor] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const openedAtRef = useRef<Record<string, number>>({});
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishRef = useRef(false);

  const showToast = useCallback((t: ToastData) => {
    setToast(t);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const storedName = loadJSON<string>(STORAGE_KEYS.name);
    if (!storedName) {
      router.replace("/");
      return;
    }
    startRef.current = Date.now();
    // hydration: reading localStorage must happen after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(storedName);
    setHydrated(true);
  }, [router]);

  useEffect(() => {
    if (!hydrated) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [hydrated]);

  const activeIndex = LEVELS.findIndex((l) => l.id === activeLevelId);
  const statusMap: Record<LevelId, LevelStatus> = (() => {
    const map: Record<LevelId, LevelStatus> = {
      recruit: "locked",
      agent: "locked",
      elite: "locked",
    };
    LEVELS.forEach((l, i) => {
      if (i < activeIndex) map[l.id] = "cleared";
      else if (i === activeIndex) map[l.id] = "active";
      else map[l.id] = "locked";
    });
    return map;
  })();

  const viewEmails = EMAILS_BY_LEVEL(viewLevelId);
  const activeEmails = EMAILS_BY_LEVEL(activeLevelId);
  const unread = activeEmails.filter((e) => !answers[e.id]).length;
  const isReadOnlyView = viewLevelId !== activeLevelId;
  const selectedEmail: PhishEmail | null = selectedId ? EMAIL_MAP[selectedId] ?? null : null;

  const handleSelect = useCallback(
    (id: string) => {
      const email = EMAIL_MAP[id];
      if (!email || answers[id]) return;
      if (!openedAtRef.current[id]) openedAtRef.current[id] = Date.now();
      setSelectedId(id);
    },
    [answers],
  );

  const handleLevelSelect = (levelId: LevelId) => {
    const status = statusMap[levelId];
    if (status === "locked") return;
    setViewLevelId(levelId);
    setSelectedId(null);
  };

  const revealHint = () => {
    if (!selectedId || usedHint[selectedId]) return;
    setHintConfirmFor(selectedId);
  };

  const confirmHint = () => {
    if (!hintConfirmFor) return;
    setUsedHint((prev) => ({ ...prev, [hintConfirmFor]: true }));
    showToast({
      kind: "warn",
      message: "HINT USED — REWARD REDUCED TO +50 IF CORRECT.",
    });
    setHintConfirmFor(null);
  };

  const answer = (choice: Choice) => {
    if (!selectedEmail || answers[selectedEmail.id]) return;
    const email = selectedEmail;
    const openedAt = openedAtRef.current[email.id] ?? Date.now();
    const seconds = Math.max(0.5, (Date.now() - openedAt) / 1000);
    const hintUsed = Boolean(usedHint[email.id]);
    const { correct, points } = computePoints(email, choice, hintUsed, seconds);

    const newAnswers: Record<string, Answer> = {
      ...answers,
      [email.id]: {
        emailId: email.id,
        choice,
        correct,
        usedHint: hintUsed,
        timeTakenSec: Math.round(seconds),
        pointsEarned: points,
      },
    };
    setAnswers(newAnswers);
    setScore((prev) => Math.max(0, prev + points));
    showToast({
      kind: correct ? "success" : "info",
      message: correct
        ? `CORRECT +${points} PTS`
        : `WRONG — ${points} PTS`,
    });

    const levelDone = activeEmails.every((e) => newAnswers[e.id]);
    if (levelDone) {
      const next = LEVELS[activeIndex + 1] ?? null;
      setBanner({
        clearedName: LEVELS[activeIndex].name,
        nextId: next?.id ?? null,
        last: !next,
      });
      if (next) {
        setActiveLevelId(next.id);
        setViewLevelId(next.id);
      }
      setSelectedId(null);
      showToast({
        kind: "success",
        message: next
          ? `LEVEL ${LEVELS[activeIndex].name} CLEARED — ${next.name} UNLOCKED.`
          : "ALL LEVELS CLEARED — OUTSTANDING HUNTING.",
      });
    }
  };

  const finish = () => {
    if (finishRef.current) return;
    finishRef.current = true;
    const totalTime = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const result: GameResult = {
      playerName: name,
      score,
      totalTimeSec: totalTime,
      finishedLevels: LEVELS.filter((l) =>
        EMAILS_BY_LEVEL(l.id).every((e) => answers[e.id]),
      ).length,
      answers: Object.values(answers),
    };
    saveJSON(STORAGE_KEYS.results, result);
    router.replace("/results");
  };

  if (!hydrated) {
    return (
      <div className="relative flex flex-1 items-center justify-center">
        <p className="text-neon cursor-blink">LOADING OPERATION…</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 justify-center p-4 sm:p-6">
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      <div className="scanlines fixed inset-0 pointer-events-none" />

      <div className="rise-in relative z-10 flex w-full max-w-6xl flex-col gap-3">
          {/* header */}
          <div className="panel-corner panel flex flex-wrap items-center gap-4 border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="border border-neon px-2 py-0.5 font-display text-[10px] tracking-[0.25em] text-neon">
                cyber<span className="text-cyan">0</span>ne
              </span>
              <span className="font-display text-[11px] tracking-[0.25em] text-text-dim">
                PHISH HUNTER
              </span>
            </div>
            <div className="ml-auto flex items-center gap-5 text-[12px]">
              <span className="flex items-center gap-2">
                <span className="text-dim">SCORE</span>
                <span className="glow-green min-w-[4ch] border border-line bg-abyss/60 px-2 py-1 text-center font-display text-neon">
                  {score}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-dim">TIME</span>
                <span className="min-w-[5ch] border border-line bg-abyss/60 px-2 py-1 text-center font-display text-cyan">
                  {formatTime(elapsed)}
                </span>
              </span>
              <button
                type="button"
                onClick={finish}
                className="border border-alert/70 bg-alert/10 px-3 py-1.5 font-display text-[11px] tracking-[0.2em] text-alert transition hover:bg-alert/20"
              >
                [ FINISH ]
              </button>
            </div>
          </div>

          {/* level strip */}
          <LevelStrip status={statusMap} onSelect={handleLevelSelect} />

          {/* level cleared banner */}
          {banner && (
            <div className="rise-in panel-corner panel flex flex-wrap items-center gap-3 border border-neon bg-neon/5 px-4 py-3">
              <span className="font-display text-[12px] tracking-[0.2em] text-neon">
                LEVEL {banner.clearedName} CLEARED
              </span>
              <span className="text-[12px] text-text/80">
                {banner.last
                  ? "You neutralised every threat in the inbox."
                  : `${LEVELS[activeIndex].name} is now unlocked.`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setBanner(null);
                  if (!banner.last) {
                    setViewLevelId(activeLevelId);
                  } else {
                    finish();
                  }
                }}
                className="ml-auto border border-neon bg-neon/10 px-4 py-2 font-display text-[11px] tracking-[0.2em] text-neon transition hover:bg-neon/20"
              >
                {banner.last ? "[ COMPLETE OPERATION ]" : "[ ADVANCE ]"}
              </button>
            </div>
          )}

          {/* mail window */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-mail-border bg-mail-bg shadow-[0_24px_70px_rgba(0,0,0,0.55)] lg:h-[min(80vh,820px)]">
            {/* toolbar */}
            <div className="flex items-center gap-2 border-b border-mail-border bg-mail-surface px-3 py-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-mail-muted transition hover:bg-mail-surface-2 hover:text-mail-text"
                aria-label="Menu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mail-accent-soft text-mail-accent">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <span className="hidden text-[13px] font-medium text-mail-text sm:block">
                  Phish Hunter
                </span>
              </span>
              <span className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-full bg-mail-surface-2 px-4 py-1.5 text-[12px] text-mail-muted sm:flex">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                Search mail — inspect senders, links &amp; attachments
              </span>
              <span
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#3b7a57] text-[12px] font-medium text-white"
                title={name}
              >
                {(name[0] ?? "A").toUpperCase()}
              </span>
            </div>

            {/* window body */}
            <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[200px_minmax(240px,340px)_1fr] lg:grid-cols-[230px_minmax(280px,360px)_1fr]">
              <MailSidebar unread={unread} />

              <div
                className={`min-h-0 flex-col border-r border-mail-border bg-mail-bg ${
                  selectedId ? "hidden md:flex" : "flex"
                }`}
              >
                <div className="flex items-center justify-between border-b border-mail-border px-4 py-2">
                  <span className="text-[13px] font-medium text-mail-text">
                    {LEVELS.find((l) => l.id === viewLevelId)?.name}
                  </span>
                  <span className="text-[11px] text-mail-muted">
                    {viewEmails.filter((e) => answers[e.id]).length}/{viewEmails.length} classified
                  </span>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <EmailList
                    emails={viewEmails}
                    answers={answers}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    readOnly={isReadOnlyView}
                  />
                </div>
              </div>

              <div
                className={`min-h-0 flex-col bg-mail-bg p-2 ${
                  selectedId ? "flex" : "hidden md:flex"
                }`}
              >
                {selectedEmail ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="mb-2 flex items-center gap-2 rounded-full px-2 py-1 text-[13px] font-medium text-mail-accent transition hover:bg-mail-surface-2 md:hidden"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back to inbox
                    </button>
                    <EmailPreview
                      email={selectedEmail}
                      playerName={name}
                      answer={answers[selectedEmail.id] ?? null}
                      usedHint={Boolean(usedHint[selectedEmail.id])}
                      onAnswer={answer}
                      onRevealHint={revealHint}
                    />
                  </>
                ) : (
                  <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-mail-border px-6 text-center">
                    <p className="text-[14px] font-medium text-mail-text">
                      No message selected
                    </p>
                    <p className="max-w-sm text-[13px] leading-relaxed text-mail-muted">
                      Select an unread message from the{" "}
                      {LEVELS[activeIndex].name} inbox to begin analysis.
                      Examine the sender, links and attachments before you
                      classify.
                    </p>
                    <p className="text-[11px] text-mail-muted">
                      CORRECT +100 · WITH HINT +50 · WRONG −50
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {toast && <Toast toast={toast} />}

      {/* hint confirm modal */}
      {hintConfirmFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/80 p-4">
          <div className="panel-corner panel w-full max-w-sm border-amber/60 px-6 py-5">
            <p className="font-display text-[12px] tracking-[0.25em] text-amber">
              CONSUME A HINT?
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-text/90">
              Using a hint reveals a clue — but your reward for a correct call
              drops from <span className="text-neon">+100</span> to{" "}
              <span className="text-amber">+50</span>.
            </p>
            <p className="mt-2 text-[12px] text-dim">
              {EMAIL_MAP[hintConfirmFor].hint}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={confirmHint}
                className="flex-1 border border-amber bg-amber/10 px-4 py-2.5 font-display text-[11px] tracking-[0.2em] text-amber transition hover:bg-amber/20"
              >
                [ CONSUME ]
              </button>
              <button
                type="button"
                onClick={() => setHintConfirmFor(null)}
                className="flex-1 border border-line px-4 py-2.5 font-display text-[11px] tracking-[0.2em] text-text-dim transition hover:bg-neon/5"
              >
                [ CANCEL ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}