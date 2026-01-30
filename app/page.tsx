import { redirect } from "next/navigation";
import { isAuthenticated, createSession, validatePassword } from "@/lib/auth";
import { PasswordGate } from "@/components/password-gate";

export default async function Home() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/dashboard");
  }

  async function handleLogin(password: string): Promise<boolean> {
    "use server";

    const valid = await validatePassword(password);
    if (valid) {
      await createSession();
      redirect("/dashboard");
    }
    return false;
  }

  return <PasswordGate onSubmit={handleLogin} />;
}
