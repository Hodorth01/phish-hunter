"use client";

export type ToastKind = "info" | "warn" | "success";

export interface ToastData {
  kind: ToastKind;
  message: string;
}

export default function Toast({ toast }: { toast: ToastData }) {
  const styles = {
    info: "border-cyan/60 bg-cyan/10 text-cyan",
    warn: "border-amber/60 bg-amber/10 text-amber",
    success: "border-neon/60 bg-neon/10 text-neon",
  } as const;

  return (
    <div
      className={`toast-in fixed right-4 top-4 z-50 max-w-xs border px-4 py-3 text-[12px] shadow-[0_0_20px_rgba(0,255,65,0.15)] ${styles[toast.kind]}`}
      role="status"
    >
      {toast.message}
    </div>
  );
}