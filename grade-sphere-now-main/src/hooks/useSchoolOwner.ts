import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useSchoolOwner() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["school-owner", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_owners")
        .select("*, schools(*)")
        .eq("user_id", user!.id)
        .maybeSingle();

      // Demo Bypass: If no school linked to admin@dps.in, provide the seeded school (Delhi Public School)
      if (user?.email === "admin@dps.in" && !data) {
        const { data: school } = await supabase.from("schools").select("*").eq("name", "Delhi Public School").maybeSingle();
        if (school) return { user_id: user.id, school_id: school.id, schools: school };
      }

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
