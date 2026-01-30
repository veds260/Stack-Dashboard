"use client";

import { motion } from "framer-motion";
import { ExternalLink, ChevronDown, ChevronUp, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { TalentMember } from "@/lib/google-sheets";

interface TalentCardProps {
  member: TalentMember;
  index: number;
}

export function TalentCard({ member, index }: TalentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Extract username from X profile URL (same approach as landing page)
  const getUsername = (xProfile: string): string | null => {
    if (!xProfile) return null;
    // Remove URL prefix and trailing slash, then remove query params
    let username = xProfile
      .replace(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i, '')
      .replace(/\/$/, '')
      .split('?')[0]
      .split('/')[0];
    // Strip leading @ if present to avoid double @
    if (username.startsWith('@')) {
      username = username.slice(1);
    }
    return username || null;
  };

  const username = getUsername(member.xProfile);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load with IntersectionObserver to prevent rate limiting
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (username && isVisible) {
      const unavatarUrl = `https://unavatar.io/twitter/${username}`;
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(unavatarUrl)}`;
      setProfilePicUrl(proxyUrl);
    }
  }, [username, isVisible]);

  const joinDate = member.timestamp
    ? new Date(member.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      ref={cardRef}
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
        {/* Header with pfp and name */}
        <div className="flex items-center gap-3 mb-4">
          {/* Profile Picture */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700/50 group-hover:border-red-500/30 transition-colors flex-shrink-0">
            {profilePicUrl && !imgError ? (
              <>
                <img
                  src={profilePicUrl}
                  alt={member.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                />
                {!imgLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                    <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                <User className="w-5 h-5 text-zinc-500" />
              </div>
            )}
            {/* Glow ring on hover */}
            <div className="absolute inset-0 rounded-full ring-2 ring-red-500/0 group-hover:ring-red-500/20 transition-all duration-500" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-medium text-white group-hover:text-red-50 transition-colors truncate">{member.name}</h3>
            {/* X handle */}
            {username && (
              <a
                href={member.xProfile.startsWith('http') ? member.xProfile : `https://x.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                @{username}
              </a>
            )}
          </div>
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
