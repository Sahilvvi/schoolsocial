import { useAuth } from "./useAuth";
import { DEMO_USERS } from "@/data/dummyData";

const DEMO_IDS = new Set(Object.values(DEMO_USERS).map((u) => u.id));

/** Returns true when the current session belongs to a demo account */
export function useDemoMode() {
  const { user } = useAuth();
  return DEMO_IDS.has(user?.id ?? "");
}

/** Standalone check — works outside React components */
export function isDemoUserId(userId: string | undefined): boolean {
  return !!userId && DEMO_IDS.has(userId);
}
