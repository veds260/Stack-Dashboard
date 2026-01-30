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
    <div className="min-h-screen bg-black">
      <Header onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-normal text-white mb-1">
            Talent Pool
          </h1>
          <p className="text-sm text-zinc-500">
            Browse and filter Stack Daily community members
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total Members"
            value={stats.totalMembers}
            icon={Users}
            delay={0}
          />
          <StatCard
            label="Top Skill"
            value={stats.topSkill}
            icon={Sparkles}
            delay={0.05}
          />
          <StatCard
            label="Most Common Level"
            value={topExperience.split(" ")[0]}
            icon={BarChart3}
            delay={0.1}
          />
          <StatCard
            label="Popular Rate"
            value={stats.topRateRange}
            icon={DollarSign}
            delay={0.15}
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
        <div className="mb-4 text-xs text-zinc-500">
          Showing {filteredMembers.length} of {members.length} members
        </div>

        {/* Talent Cards Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, index) => (
              <TalentCard key={member.id} member={member} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-sm text-zinc-500">No members match your filters</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
