import { createClient } from "@/lib/supabase/server";

/**
 * Check if the current request is authenticated.
 * Returns the user if authenticated, null otherwise.
 * In demo mode (no auth), API routes fall back to mock data.
 */
export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
