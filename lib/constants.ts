// Predefined skill categories for filtering
export const SKILL_FILTERS = [
  "Ghostwriting",
  "Copywriting",
  "Content Strategy",
  "Content Creation",
  "Social Media & Community",
  "Video Editing",
  "Graphic Design",
  "Motion Graphics",
  "UI/UX Design",
  "Web3 Marketing",
  "Digital Marketing",
  "Sales & BD",
  "Project Management",
  "Research",
  "KOL",
  "Clipping",
  "Others",
] as const;

// Predefined experience levels
export const EXPERIENCE_FILTERS = [
  "Beginner (less than a year)",
  "Intermediate (1-2 years)",
  "Advanced (3+ years)",
  "Wizard 10+",
] as const;

// Predefined rate ranges
export const RATE_FILTERS = [
  "Under $500",
  "$500 - $1,000",
  "$1,000 - $2,000",
  "$2,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000+",
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

// Helper to check if rate matches filter
export function matchesRateFilter(memberRate: string, filterRate: string): boolean {
  if (!memberRate) return false;

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
  if (filterRate === "$5,000+") {
    return memberMin >= 5000 || memberMax >= 5000;
  }

  // For other ranges, check overlap
  if (filterNumbers.length >= 2) {
    const filterMin = Math.min(...filterNumbers);
    const filterMax = Math.max(...filterNumbers);
    return memberMin <= filterMax && memberMax >= filterMin;
  }

  return false;
}
