import { useAuth } from "./useAuth";
import { isDemoUserId as _isDemoUserId } from "@workspace/shared-data";

/** Returns true when the current session belongs to a demo account */
export function useDemoMode() {
  const { user } = useAuth();
  return _isDemoUserId(user?.id);
}

/** Standalone check — works outside React components */
export { isDemoUserId } from "@workspace/shared-data";
