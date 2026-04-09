import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useSavedSchoolIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-school-ids", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_schools")
        .select("school_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set(data.map((d) => d.school_id));
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
      if (saved) {
        const { error } = await supabase.from("saved_schools").delete().eq("user_id", user.id).eq("school_id", schoolId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("saved_schools").insert({ user_id: user.id, school_id: schoolId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { saved }) => {
      qc.invalidateQueries({ queryKey: ["saved-school-ids"] });
      qc.invalidateQueries({ queryKey: ["saved-schools"] });
      toast.success(saved ? "School removed from saved" : "School saved!");
    },
  });
}
