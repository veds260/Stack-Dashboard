"use client";

import { motion } from "framer-motion";
import { Search, X, Filter } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  selectedExperience: string;
  onExperienceChange: (experience: string) => void;
  selectedRate: string;
  onRateChange: (rate: string) => void;
  availableSkills: string[];
  availableExperience: string[];
  availableRates: string[];
  onClear: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  selectedSkills,
  onSkillsChange,
  selectedExperience,
  onExperienceChange,
  selectedRate,
  onRateChange,
  availableSkills,
  availableExperience,
  availableRates,
  onClear,
}: FilterBarProps) {
  const hasFilters =
    search || selectedSkills.length > 0 || selectedExperience || selectedRate;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter((s) => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 p-6 mb-8"
    >
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or X profile..."
          className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-white placeholder:text-zinc-500 focus:border-red-500/50 transition-colors"
        />
      </div>

      {/* Filter sections */}
      <div className="space-y-4">
        {/* Skills */}
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
            <Filter className="w-4 h-4" />
            Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedSkills.includes(skill)
                    ? "bg-red-500/20 text-red-400 border-red-500/50"
                    : "bg-zinc-900/50 text-zinc-400 border-zinc-800/50 hover:border-zinc-700/50"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <div className="text-sm text-zinc-500 mb-2">Experience Level</div>
          <div className="flex flex-wrap gap-2">
            {availableExperience.map((exp) => (
              <button
                key={exp}
                onClick={() =>
                  onExperienceChange(selectedExperience === exp ? "" : exp)
                }
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedExperience === exp
                    ? "bg-red-500/20 text-red-400 border-red-500/50"
                    : "bg-zinc-900/50 text-zinc-400 border-zinc-800/50 hover:border-zinc-700/50"
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {/* Rate Range */}
        <div>
          <div className="text-sm text-zinc-500 mb-2">Rate Range</div>
          <div className="flex flex-wrap gap-2">
            {availableRates.map((rate) => (
              <button
                key={rate}
                onClick={() => onRateChange(selectedRate === rate ? "" : rate)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedRate === rate
                    ? "bg-red-500/20 text-red-400 border-red-500/50"
                    : "bg-zinc-900/50 text-zinc-400 border-zinc-800/50 hover:border-zinc-700/50"
                }`}
              >
                {rate}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-4 flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}
    </motion.div>
  );
}
