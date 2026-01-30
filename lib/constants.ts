// Predefined skill categories - matching landing page
export const SKILL_FILTERS = [
  "Social Media & Community",
  "Project Management",
  "Sales & BD",
  "Ghostwriting",
  "Graphic Design",
  "Video Editing",
  "Product & Dev",
  "Others",
] as const;

// Predefined experience levels - matching landing page
export const EXPERIENCE_FILTERS = [
  "Beginner (less than a year)",
  "Intermediate (1-2 years)",
  "Advanced (3+ years)",
  "Others",
] as const;

// Predefined rate ranges - matching landing page
export const RATE_FILTERS = [
  "Under $500",
  "$500 - $1,000",
  "$1,000 - $2,000",
  "$2,000 - $2,500",
  "Others",
] as const;

// Helper to check if a skill matches a filter category
export function matchesSkillFilter(memberSkills: string[], filterSkill: string): boolean {
  if (filterSkill === "Others") {
    // Check if member has any skill that doesn't match predefined filters
    const predefinedSkills = SKILL_FILTERS.filter(s => s !== "Others");
    return memberSkills.some(skill => {
      const normalizedSkill = skill.toLowerCase().trim();
      return !predefinedSkills.some(predefined =>
        normalizedSkill.includes(predefined.toLowerCase()) ||
        predefined.toLowerCase().includes(normalizedSkill)
      );
    });
  }

  // Check if any member skill matches the filter (case-insensitive, partial match)
  const filterLower = filterSkill.toLowerCase();
  return memberSkills.some(skill => {
    const skillLower = skill.toLowerCase().trim();
    return skillLower.includes(filterLower) || filterLower.includes(skillLower);
  });
}

// Helper to check if experience matches filter
export function matchesExperienceFilter(memberExp: string, filterExp: string): boolean {
  if (!memberExp) return false;

  if (filterExp === "Others") {
    const predefinedExp = EXPERIENCE_FILTERS.filter(e => e !== "Others");
    const expLower = memberExp.toLowerCase();
    return !predefinedExp.some(predefined => {
      const predefinedLower = predefined.toLowerCase();
      return expLower.includes(predefinedLower) || predefinedLower.includes(expLower) ||
        predefined.split(/[\s()]+/).filter(Boolean).some(kw =>
          kw.length > 2 && expLower.includes(kw.toLowerCase())
        );
    });
  }

  const expLower = memberExp.toLowerCase();
  const filterLower = filterExp.toLowerCase();

  if (expLower.includes(filterLower) || filterLower.includes(expLower)) {
    return true;
  }

  // Check for partial keyword matches
  const expKeywords = filterExp.split(/[\s()]+/).filter(Boolean);
  return expKeywords.some(kw => kw.length > 2 && expLower.includes(kw.toLowerCase()));
}

// Helper to check if rate matches filter
export function matchesRateFilter(memberRate: string, filterRate: string): boolean {
  if (!memberRate) return false;

  if (filterRate === "Others") {
    const predefinedRates = RATE_FILTERS.filter(r => r !== "Others");
    // Check if member rate doesn't match any predefined range
    return !predefinedRates.some(predefined => matchesRateFilter(memberRate, predefined));
  }

  const rateLower = memberRate.toLowerCase();
  const filterLower = filterRate.toLowerCase();

  // Direct match
  if (rateLower.includes(filterLower) || filterLower.includes(rateLower)) {
    return true;
  }

  // Parse numeric values for range matching
  const extractNumbers = (str: string) => {
    const matches = str.match(/[\d,]+/g);
    return matches ? matches.map(n => parseInt(n.replace(/,/g, ''))) : [];
  };

  const memberNumbers = extractNumbers(memberRate);
  const filterNumbers = extractNumbers(filterRate);

  if (memberNumbers.length === 0) return false;

  const memberMax = Math.max(...memberNumbers);
  const memberMin = Math.min(...memberNumbers);

  // Handle specific filter ranges
  if (filterRate === "Under $500") {
    return memberMax < 500 || rateLower.includes("under");
  }

  // For other ranges, check overlap
  if (filterNumbers.length >= 2) {
    const filterMin = Math.min(...filterNumbers);
    const filterMax = Math.max(...filterNumbers);
    return memberMin <= filterMax && memberMax >= filterMin;
  }

  return false;
}
