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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
      className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-5 flex flex-col"
    >
      {/* Name */}
      <h3 className="text-lg font-medium text-white mb-2">{member.name}</h3>

      {/* Social links */}
      <div className="flex items-center gap-3 mb-4 text-sm">
        {xHandle && (
          <a
            href={member.xProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <Twitter className="w-3.5 h-3.5" />
            {xHandle}
          </a>
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
          {member.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs rounded-md bg-zinc-800/50 text-zinc-400 border border-zinc-700/40"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Experience & Rate */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {member.experienceLevel && (
          <span className="px-2 py-1 text-xs rounded-md bg-zinc-800/50 text-zinc-300 border border-zinc-700/40">
            {member.experienceLevel}
          </span>
        )}
        {member.rateRange && (
          <span className="px-2 py-1 text-xs rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {member.rateRange}
          </span>
        )}
      </div>

      {/* Biggest Win */}
      {member.biggestWin && (
        <div className="mb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-400 transition-colors mb-1"
          >
            Biggest Win
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          <p
            className={`text-sm text-zinc-400 ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {member.biggestWin}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-zinc-800/40 flex items-center justify-between">
        {member.portfolio ? (
          <a
            href={member.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Portfolio
          </a>
        ) : (
          <span />
        )}
        {joinDate && (
          <span className="text-xs text-zinc-600">Joined {joinDate}</span>
        )}
      </div>
    </motion.div>
  );
}
