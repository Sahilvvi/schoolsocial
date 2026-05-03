import colors from "@/constants/colors";

/**
 * Always returns the light (white) palette.
 * Dark mode is intentionally disabled — MySchool uses a white theme throughout.
 */
export function useColors() {
  return { ...colors.light, radius: colors.radius };
}
