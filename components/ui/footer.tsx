"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="border-t border-zinc-800/50 py-8 mt-16"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-600">
        <span>Stack Daily Talent Pool</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </motion.footer>
  );
}
