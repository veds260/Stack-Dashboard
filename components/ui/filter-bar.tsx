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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 mb-6 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or X profile..."
            className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:border-red-500/50 focus:bg-zinc-800/70 transition-all duration-300"
          />
        </div>

        {/* Skills */}
        <div className="mb-5">
          <div className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">Skills</div>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill, i) => (
              <motion.button
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                onClick={() => toggleSkill(skill)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                  selectedSkills.includes(skill)
                    ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25"
                    : "bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800"
                }`}
              >
                {skill}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-5">
          <div className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">Experience Level</div>
          <div className="flex flex-wrap gap-2">
            {availableExperience.map((exp, i) => (
              <motion.button
                key={exp}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.03 }}
                onClick={() =>
                  onExperienceChange(selectedExperience === exp ? "" : exp)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                  selectedExperience === exp
                    ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25"
                    : "bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800"
                }`}
              >
                {exp}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Rate Range */}
        <div>
          <div className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">Rate Range</div>
          <div className="flex flex-wrap gap-2">
            {availableRates.map((rate, i) => (
              <motion.button
                key={rate}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.03 }}
                onClick={() => onRateChange(selectedRate === rate ? "" : rate)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                  selectedRate === rate
                    ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25"
                    : "bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800"
                }`}
              >
                {rate}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClear}
            whileHover={{ scale: 1.05 }}
            className="mt-5 flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
