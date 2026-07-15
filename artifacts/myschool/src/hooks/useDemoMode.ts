import { useAuth } from "./useAuth";
import { isDemoUserId as _isDemoUserId } from "@/lib/shared-data";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

/** Returns true when the current session belongs to a demo account OR supabase is not configured */
export function useDemoMode() {
  const { user } = useAuth();
  return _isDemoUserId(user?.id) || !isSupabaseConfigured;
}

/** Standalone check — returns true for known demo IDs OR when supabase is not configured */
export function isDemoUserId(userId: string | undefined): boolean {
  return _isDemoUserId(userId) || !isSupabaseConfigured;
}
