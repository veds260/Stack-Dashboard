"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-2xl bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 p-6"
    >
      {/* Red glow accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </div>
        <div className="text-4xl font-light tracking-tight text-white">
          {value}
        </div>
      </div>
    </motion.div>
  );
}
