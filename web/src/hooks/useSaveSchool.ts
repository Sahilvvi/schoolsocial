import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useSavedSchoolIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-school-ids", user?.id],
    queryFn: async () => {
      if (!isSupabaseConfigured) return new Set<string>();
      const { data, error } = await supabase
        .from("saved_schools")
        .select("school_id")
        .eq("user_id", user!.id);
      if (error) return new Set<string>();
      return new Set(data.map((d: any) => d.school_id as string));
    },
    enabled: !!user,
  });
}

export function useToggleSaveSchool() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ schoolId, saved }: { schoolId: string; saved: boolean }) => {
      if (!user) throw new Error("Login required");
      if (!isSupabaseConfigured) {
        // Demo mode: toggle in local state
        qc.setQueryData<Set<string>>(["saved-school-ids", user.id], (old = new Set()) => {
          const next = new Set(old);
          if (saved) next.delete(schoolId); else next.add(schoolId);
          return next;
        });
        return;
      }
      if (saved) {
        const { error } = await supabase.from("saved_schools").delete().eq("user_id", user.id).eq("school_id", schoolId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("saved_schools").insert({ user_id: user.id, school_id: schoolId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { saved }) => {
      if (isSupabaseConfigured) {
        qc.invalidateQueries({ queryKey: ["saved-school-ids"] });
        qc.invalidateQueries({ queryKey: ["saved-schools"] });
      }
      toast.success(saved ? "School removed from saved" : "School saved!");
    },
  });
}
