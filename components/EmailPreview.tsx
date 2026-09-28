"use client";

import type { PhishEmail } from "@/data/emails";
import type { Answer, Choice } from "@/lib/game";

interface EmailPreviewProps {
  email: PhishEmail;
  playerName: string;
  answer: Answer | null;
  usedHint: boolean;
  hasNext: boolean;
  onAnswer: (choice: Choice) => void;
  onRevealHint: () => void;
  onNext: () => void;
}

function Icon({ name }: { name: "alert" | "check" | "clip" }) {
  const common = {
    width: "1em",
    height: "1em",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };
  if (name === "alert")
    return (
      <svg {...common}>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    );
  if (name === "check")
    return (
      <svg {...common}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function Initials({ name, large }: { name: string; large?: boolean }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#3b7a57] font-medium text-white ${
        large ? "h-12 w-12 text-[18px]" : "h-8 w-8 text-[12px]"
      }`}
    >
      {initials || "?"}
    </span>
  );
}

export default function EmailPreview({
  email,
  playerName,
  answer,
  usedHint,
  hasNext,
  onAnswer,
  onRevealHint,
  onNext,
}: EmailPreviewProps) {
  const isAnswered = Boolean(answer);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg bg-mail-surface">
      {/* email header */}
      <div className="border-b border-mail-border px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Initials name={email.fromLabel} large />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
              <div className="min-w-0">
                <p className="text-lg font-semibold leading-tight text-mail-text">
                  {email.fromLabel}
                </p>
                <p className="break-all text-[12px] leading-snug text-mail-muted sm:text-[13px]">
                  &lt;{email.fromAddress}&gt;
                </p>
              </div>
              <span className="shrink-0 pt-0.5 text-[11px] text-mail-muted sm:text-[12px]">
                {email.date}
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-mail-muted">
              to:{" "}
              <span className="text-mail-text">
                {playerName
                  ? `${playerName.trim().toLowerCase().replace(/\s+/g, ".")}@jicollege.edu.sa`
                  : email.to}
              </span>
            </p>
            <p className="mt-3 break-words text-[19px] font-medium leading-snug text-mail-text sm:text-[22px]">
              {email.subject}
            </p>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 text-[14px] leading-relaxed text-mail-text sm:px-5">
        {email.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {email.links.length > 0 && (
          <div className="rounded-lg bg-mail-surface-2 px-4 py-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-mail-muted">
              Embedded links
            </p>
            {email.links.map((l) => (
              <p key={l.href} className="text-[13px]">
                <span className="font-medium text-mail-accent underline decoration-mail-accent/50" title={l.href}>
                  {l.label}
                </span>{" "}
                <span className="text-mail-muted">({l.href})</span>
              </p>
            ))}
          </div>
        )}

        {email.attachments.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-mail-muted">
              Attachments
            </p>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-2 rounded-full border border-mail-border bg-mail-surface-2 px-3 py-1.5 text-[12px] text-mail-text"
                >
                  <span className="text-[14px] leading-none text-mail-muted">
                    <Icon name="clip" />
                  </span>
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* verdict / actions */}
      <div className="border-t border-mail-border px-5 py-4">
        {isAnswered && answer ? (
          <div className="space-y-3">
            <div
              className={`rise-in rounded-xl px-4 py-3 ${
                answer.correct ? "bg-[#1c3527]" : "bg-[#3a1d24]"
              }`}
            >
              <p
                className={`text-[13px] font-medium ${
                  answer.correct ? "text-[#8fe3b0]" : "text-[#ff8fa3]"
                }`}
              >
                {answer.correct ? "✓ Correct" : "✕ Wrong"} —{" "}
                {answer.pointsEarned > 0 ? `+${answer.pointsEarned}` : answer.pointsEarned} pts
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-mail-text">
                {email.explanation}
              </p>
            </div>
            {hasNext && (
              <button
                type="button"
                onClick={onNext}
                className="w-full rounded-full border border-mail-accent/60 bg-mail-accent/15 px-4 py-2.5 text-[13px] font-medium text-mail-accent transition hover:bg-mail-accent/25"
              >
                Next email →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-mail-muted">
              Classify this email
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => onAnswer("phishing")}
                className="flex-1 rounded-full border border-[#c5221f]/70 bg-[#c5221f]/15 px-4 py-2.5 text-[13px] font-medium text-[#ff8fa3] transition hover:bg-[#c5221f]/30"
              >
                <span className="mr-1.5 inline-flex align-[-2px]"><Icon name="alert" /></span>
                Report as phishing
              </button>
              <button
                type="button"
                onClick={() => onAnswer("safe")}
                className="flex-1 rounded-full border border-mail-accent/60 bg-mail-accent/15 px-4 py-2.5 text-[13px] font-medium text-mail-accent transition hover:bg-mail-accent/25"
              >
                <span className="mr-1.5 inline-flex align-[-2px]"><Icon name="check" /></span>
                Mark as safe
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onRevealHint}
                disabled={usedHint}
                className={`rounded-full border border-dashed px-3 py-1.5 text-[12px] font-medium transition ${
                  usedHint
                    ? "cursor-default border-mail-border text-mail-muted"
                    : "border-amber/60 text-amber hover:bg-amber/10"
                }`}
              >
                {usedHint ? "Hint consumed" : "[ ? ] Reveal hint"}
              </button>
              {usedHint && (
                <span className="text-[11px] text-amber/80">
                  reward reduced to +50 if correct
                </span>
              )}
            </div>
            {usedHint && (
              <p className="rounded-lg bg-amber/10 px-3 py-2 text-[13px] text-amber">
                <span className="font-medium uppercase tracking-wider">Hint //</span>{" "}
                {email.hint}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}