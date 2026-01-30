"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LogOut } from "lucide-react";

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-black/90 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <Image
              src="/logo.jpg"
              alt="Stack Daily"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div className="absolute inset-0 rounded-lg bg-red-500/20 blur-md -z-10" />
          </div>
          <span className="text-sm">
            <span className="text-white font-medium">Stack Daily</span>
            <span className="text-zinc-600 mx-2">/</span>
            <span className="text-zinc-400">dashboard</span>
          </span>
        </motion.div>

        {onLogout && (
          <motion.button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}
