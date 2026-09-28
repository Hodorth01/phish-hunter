"use client";

interface MailSidebarProps {
  unread: number;
}

interface FolderRow {
  id: string;
  label: string;
  count?: number;
}

function Icon({ name }: { name: string }) {
  const common = {
    width: "1em",
    height: "1em",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };
  switch (name) {
    case "inbox":
      return (
        <svg {...common}>
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "sent":
      return (
        <svg {...common}>
          <path d="M22 2 11 13" />
          <path d="M22 2 15 22l-4-9-9-4 20-7z" />
        </svg>
      );
    case "draft":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    default:
      return null;
  }
}

function iconFor(id: string): string {
  switch (id) {
    case "inbox":
      return "inbox";
    case "star":
      return "star";
    case "clock":
      return "clock";
    case "sent":
      return "sent";
    case "draft":
      return "draft";
    case "alert":
      return "alert";
    case "trash":
      return "trash";
    default:
      return "inbox";
  }
}

export default function MailSidebar({ unread }: MailSidebarProps) {
  const folders: FolderRow[] = [
    { id: "inbox", label: "Inbox", count: unread },
    { id: "star", label: "Starred" },
    { id: "clock", label: "Snoozed" },
    { id: "sent", label: "Sent" },
    { id: "draft", label: "Drafts" },
    { id: "alert", label: "Spam", count: 3 },
    { id: "trash", label: "Trash" },
  ];

  return (
    <aside className="hidden w-full shrink-0 flex-col overflow-y-auto bg-mail-bg md:flex">
      <nav className="flex flex-col gap-0.5 p-2 pt-3">
        {folders.map((f) => {
          const active = f.id === "inbox";
          return (
            <div
              key={f.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition ${
                active
                  ? "bg-mail-accent-soft font-medium text-mail-accent"
                  : "text-[#71767c] hover:bg-mail-hover hover:text-mail-text"
              }`}
            >
              <span className="shrink-0 text-[18px] leading-none text-[#8a8f96]">
                <Icon name={iconFor(f.id)} />
              </span>
              <span className="min-w-0 flex-1 truncate">{f.label}</span>
              {typeof f.count === "number" && (
                <span
                  className={`text-[12px] ${active ? "text-mail-accent" : "text-[#71767c]"}`}
                >
                  {f.count}
                </span>
              )}
            </div>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-mail-border px-4 py-3">
        <p className="text-[11px] leading-relaxed text-mail-muted">
          Inspect every sender, link and attachment. Trust nothing.
        </p>
      </div>
    </aside>
  );
}