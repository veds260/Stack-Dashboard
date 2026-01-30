"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return <>{displayValue}</>;
}

export function StatCard({ label, value, icon: Icon, delay = 0 }: StatCardProps) {
  const isNumber = typeof value === "number";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 overflow-hidden cursor-default"
    >
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:via-transparent group-hover:to-red-500/5 transition-all duration-500" />

      {/* Subtle glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-3">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        <div className="text-3xl font-light text-white tracking-tight">
          {isNumber ? <AnimatedNumber value={value} /> : value}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
