"use client";

import { motion } from "framer-motion";
import { Twitter, Send, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { TalentMember } from "@/lib/google-sheets";

interface TalentCardProps {
  member: TalentMember;
  index: number;
}

export function TalentCard({ member, index }: TalentCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatXHandle = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:twitter\.com|x\.com)\/([^/?]+)/i);
    return match ? `@${match[1]}` : null;
  };

  const joinDate = member.timestamp
    ? new Date(member.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const xHandle = formatXHandle(member.xProfile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.5),
        duration: 0.5,
        ease: "easeOut"
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 flex flex-col overflow-hidden cursor-default"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-orange-500/0 group-hover:from-red-500/5 group-hover:to-orange-500/5 transition-all duration-500" />

      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative">
        {/* Name */}
        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-red-50 transition-colors">{member.name}</h3>

        {/* Social links */}
        <div className="flex items-center gap-3 mb-4 text-sm">
          {xHandle && (
            <motion.a
              href={member.xProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
              whileHover={{ x: 2 }}
            >
              <Twitter className="w-3.5 h-3.5" />
              {xHandle}
            </motion.a>
          )}
          {member.telegram && (
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Send className="w-3.5 h-3.5" />
              {member.telegram}
            </span>
          )}
        </div>

        {/* Skills */}
        {member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {member.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) + i * 0.05 }}
                className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800/60 text-zinc-300 border border-zinc-700/50 group-hover:border-zinc-600/50 transition-colors"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        )}

        {/* Experience & Rate */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.experienceLevel && (
            <span className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800/60 text-zinc-200 border border-zinc-700/50">
              {member.experienceLevel}
            </span>
          )}
          {member.rateRange && (
            <span className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {member.rateRange}
            </span>
          )}
        </div>

        {/* Biggest Win */}
        {member.biggestWin && (
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-1"
            >
              Biggest Win
              {expanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <motion.p
              initial={false}
              animate={{ height: expanded ? "auto" : "2.5rem" }}
              className={`text-sm text-zinc-400 overflow-hidden ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {member.biggestWin}
            </motion.p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
          {member.portfolio ? (
            <motion.a
              href={member.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
              whileHover={{ x: 2 }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Portfolio
            </motion.a>
          ) : (
            <span />
          )}
          {joinDate && (
            <span className="text-xs text-zinc-600">Joined {joinDate}</span>
          )}
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
