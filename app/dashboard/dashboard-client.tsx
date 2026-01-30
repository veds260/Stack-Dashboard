"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Sparkles, BarChart3, DollarSign } from "lucide-react";
import { Header } from "@/components/ui/header";
import { StatCard } from "@/components/ui/stat-card";
import { TalentCard } from "@/components/ui/talent-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { Footer } from "@/components/ui/footer";
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

  // Get unique filter options
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    members.forEach((m) => m.skills.forEach((s) => skills.add(s)));
    return Array.from(skills).sort();
  }, [members]);

  const availableExperience = useMemo(() => {
    const exp = new Set<string>();
    members.forEach((m) => {
      if (m.experienceLevel) exp.add(m.experienceLevel);
    });
    return Array.from(exp);
  }, [members]);

  const availableRates = useMemo(() => {
    const rates = new Set<string>();
    members.forEach((m) => {
      if (m.rateRange) rates.add(m.rateRange);
    });
    return Array.from(rates);
  }, [members]);

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
        const hasSkill = selectedSkills.some((skill) =>
          member.skills.includes(skill)
        );
        if (!hasSkill) return false;
      }

      // Experience filter
      if (selectedExperience && member.experienceLevel !== selectedExperience) {
        return false;
      }

      // Rate filter
      if (selectedRate && member.rateRange !== selectedRate) {
        return false;
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
    <div className="min-h-screen relative">
      {/* Background glow orbs */}
      <div className="fixed top-1/4 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <Header onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">
            Talent Pool
          </h1>
          <p className="text-zinc-500">
            Browse and filter Stack Daily community members
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            delay={0.1}
          />
          <StatCard
            label="Most Common Level"
            value={topExperience.split(" ")[0]}
            icon={BarChart3}
            delay={0.2}
          />
          <StatCard
            label="Popular Rate"
            value={stats.topRateRange}
            icon={DollarSign}
            delay={0.3}
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
          availableSkills={availableSkills}
          availableExperience={availableExperience}
          availableRates={availableRates}
          onClear={clearFilters}
        />

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-sm text-zinc-500"
        >
          Showing {filteredMembers.length} of {members.length} members
        </motion.div>

        {/* Talent Cards Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <TalentCard key={member.id} member={member} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-zinc-500">No members match your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
