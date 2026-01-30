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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-black/95 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Stack Daily"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="text-sm">
            <span className="text-white font-medium">Stack Daily</span>
            <span className="text-zinc-600 mx-2">/</span>
            <span className="text-zinc-500">dashboard</span>
          </span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>
    </motion.header>
  );
}
