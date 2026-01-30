"use client";

import { motion } from "framer-motion";
import { Twitter, Send, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { TalentMember } from "@/lib/google-sheets";

interface TalentCardProps {
  member: TalentMember;
  index: number;
}

const skillColors: Record<string, string> = {
  "Video Editing": "bg-red-500/20 text-red-400 border-red-500/30",
  "Thumbnail Design": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Copywriting": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Social Media Management": "bg-green-500/20 text-green-400 border-green-500/30",
  "Content Strategy": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Graphic Design": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Motion Graphics": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Photography": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const experienceColors: Record<string, string> = {
  "Beginner (0-1 years)": "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  "Intermediate (1-3 years)": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Advanced (3-5 years)": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Expert (5+ years)": "bg-red-500/20 text-red-400 border-red-500/30",
};

function getSkillColor(skill: string): string {
  return skillColors[skill] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}

function getExperienceColor(level: string): string {
  return experienceColors[level] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}

export function TalentCard({ member, index }: TalentCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatXProfile = (url: string) => {
    if (!url) return null;
    // Extract handle from URL
    const match = url.match(/(?:twitter\.com|x\.com)\/([^/?]+)/i);
    return match ? `@${match[1]}` : url;
  };

  const joinDate = member.timestamp
    ? new Date(member.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        {/* Name */}
        <h3 className="text-xl font-medium text-white mb-3">{member.name}</h3>

        {/* Social links */}
        <div className="flex flex-wrap gap-3 mb-4">
          {member.xProfile && (
            <a
              href={member.xProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
              {formatXProfile(member.xProfile)}
            </a>
          )}
          {member.telegram && (
            <span className="flex items-center gap-1.5 text-sm text-zinc-400">
              <Send className="w-4 h-4" />
              {member.telegram}
            </span>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {member.skills.map((skill) => (
            <span
              key={skill}
              className={`px-2.5 py-1 text-xs rounded-full border ${getSkillColor(skill)}`}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Experience & Rate */}
        <div className="flex flex-wrap gap-2 mb-4">
          {member.experienceLevel && (
            <span
              className={`px-2.5 py-1 text-xs rounded-full border ${getExperienceColor(member.experienceLevel)}`}
            >
              {member.experienceLevel}
            </span>
          )}
          {member.rateRange && (
            <span className="px-2.5 py-1 text-xs rounded-full border bg-green-500/20 text-green-400 border-green-500/30">
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

        {/* Portfolio & Date */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
          {member.portfolio ? (
            <a
              href={member.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Portfolio
            </a>
          ) : (
            <span />
          )}
          {joinDate && (
            <span className="text-xs text-zinc-600">Joined {joinDate}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
