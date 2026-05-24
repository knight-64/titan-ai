"use client";

import { motion } from "framer-motion";

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
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`absolute inset-0 bg-gradient-neon rounded-full opacity-20 blur-2xl`}
      />

      {/* Middle ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 border border-accent/30 rounded-full`}
      />

      {/* Inner orb */}
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-neon rounded-full opacity-40 blur-lg"
      />

      {/* Core pulse */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute inset-1/4 bg-cyan-400 rounded-full blur"
      />
    </div>
  );
}
