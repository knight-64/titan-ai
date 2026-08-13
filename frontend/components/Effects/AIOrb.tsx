"use client";

interface AIObProps {
  size?: "small" | "medium" | "large";
}

export default function AIOrb({ size = "medium" }: AIObProps) {
  const sizeMap = {
    small: "w-12 h-12",
    medium: "w-24 h-24",
    large: "w-48 h-48",
  };

  const pulseSize = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-64 h-64",
  };

  return (
    <div className={`relative ${sizeMap[size]}`}>
      {/* Outer glow */}
      <div
        className={`absolute inset-0 bg-gradient-neon rounded-full opacity-20 blur-2xl`}
      />

      {/* Middle ring */}
      <div
        className={`absolute inset-0 border border-accent/30 rounded-full`}
      />

      {/* Inner orb */}
      <div
        className="absolute inset-0 bg-gradient-neon rounded-full opacity-40 blur-lg"
      />

      {/* Core pulse */}
      <div
        className="absolute inset-1/4 bg-cyan-400 rounded-full blur"
      />
    </div>
  );
}
