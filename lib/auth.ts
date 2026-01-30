import { cookies } from "next/headers";

const SESSION_COOKIE = "dashboard_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function validatePassword(password: string): Promise<boolean> {
  const correctPassword = process.env.DASHBOARD_PASSWORD;
  if (!correctPassword) {
    console.error("DASHBOARD_PASSWORD environment variable not set");
    return false;
  }
  return password === correctPassword;
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  cookieStore.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === "authenticated";
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
