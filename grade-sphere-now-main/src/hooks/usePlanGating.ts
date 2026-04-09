import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PlanTier = "free" | "starter" | "growth" | "elite";

export interface SchoolPlan {
  id: string;
  school_id: string;
  plan_tier: PlanTier;
  max_photos: number;
  max_admission_forms: number;
  max_custom_fields: number;
  can_post_jobs: boolean;
  can_post_events: boolean;
  is_featured: boolean;
  priority_alerts: boolean;
  physical_qr_count: number;
  expires_at: string | null;
}

const DEFAULT_PLAN: Omit<SchoolPlan, "id" | "school_id"> = {
  plan_tier: "free",
  max_photos: 3,
  max_admission_forms: 0,
  max_custom_fields: 0,
  can_post_jobs: false,
  can_post_events: false,
  is_featured: false,
  priority_alerts: false,
  physical_qr_count: 0,
  expires_at: null,
};

export const PLAN_LIMITS: Record<PlanTier, Omit<SchoolPlan, "id" | "school_id" | "expires_at">> = {
  free: { plan_tier: "free", max_photos: 3, max_admission_forms: 0, max_custom_fields: 0, can_post_jobs: false, can_post_events: false, is_featured: false, priority_alerts: false, physical_qr_count: 0 },
  starter: { plan_tier: "starter", max_photos: 5, max_admission_forms: 1, max_custom_fields: 0, can_post_jobs: false, can_post_events: false, is_featured: false, priority_alerts: false, physical_qr_count: 0 },
  growth: { plan_tier: "growth", max_photos: 15, max_admission_forms: 2, max_custom_fields: 1, can_post_jobs: true, can_post_events: true, is_featured: false, priority_alerts: false, physical_qr_count: 1 },
  elite: { plan_tier: "elite", max_photos: 999, max_admission_forms: 3, max_custom_fields: 2, can_post_jobs: true, can_post_events: true, is_featured: true, priority_alerts: true, physical_qr_count: 2 },
};

export function useSchoolPlan(schoolId: string | undefined) {
  return useQuery({
    queryKey: ["school-plan", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_plans")
        .select("*")
        .eq("school_id", schoolId!)
        .maybeSingle();
      if (error) throw error;
      return (data as SchoolPlan | null) ?? { ...DEFAULT_PLAN, school_id: schoolId!, id: "" };
    },
    enabled: !!schoolId,
  });
}

export function useAdmissionForms(schoolId: string | undefined) {
  return useQuery({
    queryKey: ["admission-forms", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_forms")
        .select("*")
        .eq("school_id", schoolId!)
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!schoolId,
  });
}
