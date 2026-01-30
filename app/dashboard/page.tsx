import { redirect } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/auth";
import { fetchTalentData, getStats, TalentMember } from "@/lib/google-sheets";
import { DashboardClient } from "./dashboard-client";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/");
  }

  let members: TalentMember[] = [];
  let stats: {
    totalMembers: number;
    topSkill: string;
    skillsCount: Record<string, number>;
    experienceCount: Record<string, number>;
    topRateRange: string;
    rateCount: Record<string, number>;
  } = {
    totalMembers: 0,
    topSkill: "N/A",
    skillsCount: {},
    experienceCount: {},
    topRateRange: "N/A",
    rateCount: {},
  };

  try {
    members = await fetchTalentData();
    stats = getStats(members);
  } catch (error) {
    console.error("Failed to fetch talent data:", error);
  }

  async function handleLogout() {
    "use server";
    await logout();
    redirect("/");
  }

  return (
    <DashboardClient
      members={members}
      stats={stats}
      onLogout={handleLogout}
    />
  );
}
