import { createClient } from "@/lib/supabase/server";
import { ForbiddenError, UnauthorizedError } from "./account";

const PLATFORM_ADMIN_EMAILS = (process.env.PLATFORM_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function requirePlatformAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    throw new UnauthorizedError();
  }

  if (!PLATFORM_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    throw new ForbiddenError("Platform admin access required");
  }

  return { userId: user.id, email: user.email };
}
