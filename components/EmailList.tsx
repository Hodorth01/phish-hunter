"use client";

import type { PhishEmail } from "@/data/emails";
import type { Answer } from "@/lib/game";

interface EmailListProps {
  emails: PhishEmail[];
  answers: Record<string, Answer>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  readOnly: boolean;
}

function Avatar({ name, tone }: { name: string; tone: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-medium ${tone}`}
    >
      {initials || "?"}
    </span>
  );
}

function avatarTone(label: string): string {
  const palette = [
    "bg-[#6c4f9e] text-white",
    "bg-[#3b7a57] text-white",
    "bg-[#9e5f3b] text-white",
    "bg-[#4f7a9e] text-white",
    "bg-[#9e3b5f] text-white",
    "bg-[#5f9e3b] text-white",
  ];
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function snippet(email: PhishEmail): string {
  return email.paragraphs[0] ?? "";
}

export default function EmailList({
  emails,
  answers,
  selectedId,
  onSelect,
  readOnly,
}: EmailListProps) {
  return (
    <div className="flex flex-col">
      {emails.map((email) => {
        const answer = answers[email.id];
        const isAnswered = Boolean(answer);
        const isSelected = selectedId === email.id;
        const unread = !isAnswered;
        return (
          <button
            key={email.id}
            type="button"
            disabled={isAnswered || readOnly}
            onClick={() => onSelect(email.id)}
            className={`group flex items-start gap-3 px-3 py-2.5 text-left transition ${
              isSelected
                ? "bg-mail-accent-soft"
                : isAnswered
                  ? "bg-mail-bg opacity-60"
                  : "bg-mail-bg hover:bg-mail-hover"
            } ${readOnly && !isAnswered ? "cursor-not-allowed opacity-40" : ""}`}
          >
            <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full">
              {unread && <span className="block h-2 w-2 rounded-full bg-mail-accent" />}
            </span>
            <Avatar name={email.fromLabel} tone={avatarTone(email.fromLabel)} />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span
                  className={`truncate text-[13px] ${unread ? "font-medium text-mail-text" : "text-mail-muted"}`}
                >
                  {email.fromLabel}
                </span>
                <span className="shrink-0 text-[11px] text-mail-muted">
                  {email.date.split(" ").slice(0, 3).join(" ")}
                </span>
              </span>
              <span className="mt-0.5 flex items-baseline gap-1.5">
                <span
                  className={`truncate text-[13px] ${unread ? "font-medium text-mail-text" : "text-mail-text"}`}
                >
                  {email.subject}
                </span>
                <span className="truncate text-[12px] text-mail-muted">
                  — {snippet(email)}
                </span>
              </span>
            </span>
            {isAnswered && (
              <span
                className={`mt-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  answer.correct
                    ? "bg-[#1c3527] text-[#8fe3b0]"
                    : "bg-[#3a1d24] text-[#ff8fa3]"
                }`}
              >
                {answer.correct ? "SAFE" : "PHISH"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}