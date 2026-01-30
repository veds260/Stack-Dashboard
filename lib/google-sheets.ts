import { google } from "googleapis";

export interface TalentMember {
  id: string;
  timestamp: string;
  name: string;
  xProfile: string;
  telegram: string;
  skills: string[];
  experienceLevel: string;
  rateRange: string;
  biggestWin: string;
  portfolio: string;
}

let cachedData: TalentMember[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getGoogleAuth() {
  const serviceAccountBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!serviceAccountBase64) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT environment variable not set");
  }

  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
  );

  return new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function fetchTalentData(): Promise<TalentMember[]> {
  // Check cache first
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID environment variable not set");
  }

  // Get spreadsheet metadata to find the first sheet name
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
  });

  const firstSheetName = metadata.data.sheets?.[0]?.properties?.title || "Sheet1";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${firstSheetName}'!A2:I`, // Skip header row, use actual sheet name
  });

  const rows = response.data.values || [];

  const members: TalentMember[] = rows.map((row, index) => ({
    id: String(index + 1),
    timestamp: row[0] || "",
    name: row[1] || "",
    xProfile: row[2] || "",
    telegram: row[3] || "",
    skills: row[4] ? row[4].split(",").map((s: string) => s.trim()) : [],
    experienceLevel: row[5] || "",
    rateRange: row[6] || "",
    biggestWin: row[7] || "",
    portfolio: row[8] || "",
  }));

  // Update cache
  cachedData = members;
  cacheTimestamp = Date.now();

  return members;
}

export function getStats(members: TalentMember[]) {
  const totalMembers = members.length;

  // Skills distribution
  const skillsCount: Record<string, number> = {};
  members.forEach((member) => {
    member.skills.forEach((skill) => {
      skillsCount[skill] = (skillsCount[skill] || 0) + 1;
    });
  });
  const topSkill =
    Object.entries(skillsCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Experience breakdown
  const experienceCount: Record<string, number> = {};
  members.forEach((member) => {
    if (member.experienceLevel) {
      experienceCount[member.experienceLevel] =
        (experienceCount[member.experienceLevel] || 0) + 1;
    }
  });

  // Rate range distribution
  const rateCount: Record<string, number> = {};
  members.forEach((member) => {
    if (member.rateRange) {
      rateCount[member.rateRange] = (rateCount[member.rateRange] || 0) + 1;
    }
  });
  const topRateRange =
    Object.entries(rateCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return {
    totalMembers,
    topSkill,
    skillsCount,
    experienceCount,
    topRateRange,
    rateCount,
  };
}
