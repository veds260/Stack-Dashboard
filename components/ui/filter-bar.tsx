"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-5 mb-6"
    >
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or X profile..."
          className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-zinc-800/60 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:border-zinc-700 transition-colors"
        />
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="text-xs text-zinc-500 mb-2.5 flex items-center gap-1.5">
          Skills
        </div>
        <div className="flex flex-wrap gap-1.5">
          {availableSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedSkills.includes(skill)
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-700/60 hover:border-zinc-600"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <div className="text-xs text-zinc-500 mb-2.5">Experience Level</div>
        <div className="flex flex-wrap gap-1.5">
          {availableExperience.map((exp) => (
            <button
              key={exp}
              onClick={() =>
                onExperienceChange(selectedExperience === exp ? "" : exp)
              }
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedExperience === exp
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-700/60 hover:border-zinc-600"
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Rate Range */}
      <div>
        <div className="text-xs text-zinc-500 mb-2.5">Rate Range</div>
        <div className="flex flex-wrap gap-1.5">
          {availableRates.map((rate) => (
            <button
              key={rate}
              onClick={() => onRateChange(selectedRate === rate ? "" : rate)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedRate === rate
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-700/60 hover:border-zinc-600"
              }`}
            >
              {rate}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-3 h-3" />
          Clear filters
        </button>
      )}
    </motion.div>
  );
}
