import type { Level } from "@/data/emails";

export interface LevelColorClasses {
  text: string;
  border: string;
  glow: string;
  dim: string;
  softBg: string;
}

export function colorClasses(color: Level["color"]): LevelColorClasses {
  switch (color) {
    case "green":
      return {
        text: "text-neon",
        border: "border-neon",
        glow: "glow-green",
        dim: "text-neon/50",
        softBg: "bg-neon/5",
      };
    case "cyan":
      return {
        text: "text-cyan",
        border: "border-cyan",
        glow: "glow-cyan",
        dim: "text-cyan/50",
        softBg: "bg-cyan/5",
      };
    case "red":
      return {
        text: "text-alert",
        border: "border-alert",
        glow: "glow-red",
        dim: "text-alert/50",
        softBg: "bg-alert/5",
      };
  }
}