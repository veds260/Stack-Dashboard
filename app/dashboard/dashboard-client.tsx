"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Sparkles, BarChart3, DollarSign } from "lucide-react";
import { Header } from "@/components/ui/header";
import { StatCard } from "@/components/ui/stat-card";
import { TalentCard } from "@/components/ui/talent-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { Footer } from "@/components/ui/footer";
import {
  SKILL_FILTERS,
  EXPERIENCE_FILTERS,
  RATE_FILTERS,
  matchesSkillFilter,
  matchesExperienceFilter,
  matchesRateFilter,
} from "@/lib/constants";
import type { TalentMember } from "@/lib/google-sheets";

interface DashboardClientProps {
  members: TalentMember[];
  stats: {
    totalMembers: number;
    topSkill: string;
    skillsCount: Record<string, number>;
    experienceCount: Record<string, number>;
    topRateRange: string;
    rateCount: Record<string, number>;
  };
  onLogout: () => Promise<void>;
}

export function DashboardClient({
  members,
  stats,
  onLogout,
}: DashboardClientProps) {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedRate, setSelectedRate] = useState("");

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const nameMatch = member.name.toLowerCase().includes(searchLower);
        const xMatch = member.xProfile.toLowerCase().includes(searchLower);
        if (!nameMatch && !xMatch) return false;
      }

      // Skills filter
      if (selectedSkills.length > 0) {
        const hasMatchingSkill = selectedSkills.some((filterSkill) =>
          matchesSkillFilter(member.skills, filterSkill)
        );
        if (!hasMatchingSkill) return false;
      }

      // Experience filter
      if (selectedExperience) {
        if (!matchesExperienceFilter(member.experienceLevel, selectedExperience)) {
          return false;
        }
      }

      // Rate filter
      if (selectedRate) {
        if (!matchesRateFilter(member.rateRange, selectedRate)) {
          return false;
        }
      }

      return true;
    });
  }, [members, search, selectedSkills, selectedExperience, selectedRate]);

  const clearFilters = () => {
    setSearch("");
    setSelectedSkills([]);
    setSelectedExperience("");
    setSelectedRate("");
  };

  // Get most common experience level
  const topExperience = useMemo(() => {
    const entries = Object.entries(stats.experienceCount);
    if (entries.length === 0) return "N/A";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [stats.experienceCount]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Header onLogout={onLogout} />

      <main className="relative max-w-6xl mx-auto px-6 pt-24 pb-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-light text-white mb-2 tracking-tight">
            Talent Pool
          </h1>
          <p className="text-zinc-400">
            Browse and filter Stack Daily community members
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Members"
            value={stats.totalMembers}
            icon={Users}
            delay={0.1}
          />
          <StatCard
            label="Top Skill"
            value={stats.topSkill}
            icon={Sparkles}
            delay={0.2}
          />
          <StatCard
            label="Most Common Level"
            value={topExperience.split(" ")[0]}
            icon={BarChart3}
            delay={0.3}
          />
          <StatCard
            label="Popular Rate"
            value={stats.topRateRange}
            icon={DollarSign}
            delay={0.4}
          />
        </div>

        {/* Filters */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedSkills={selectedSkills}
          onSkillsChange={setSelectedSkills}
          selectedExperience={selectedExperience}
          onExperienceChange={setSelectedExperience}
          selectedRate={selectedRate}
          onRateChange={setSelectedRate}
          availableSkills={[...SKILL_FILTERS]}
          availableExperience={[...EXPERIENCE_FILTERS]}
          availableRates={[...RATE_FILTERS]}
          onClear={clearFilters}
        />

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-5 text-sm text-zinc-500"
        >
          Showing <span className="text-white font-medium">{filteredMembers.length}</span> of {members.length} members
        </motion.div>

        {/* Talent Cards Grid */}
        {filteredMembers.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredMembers.map((member, index) => (
              <TalentCard key={member.id} member={member} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-zinc-500 mb-4">No members match your filters</p>
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all filters
            </motion.button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
