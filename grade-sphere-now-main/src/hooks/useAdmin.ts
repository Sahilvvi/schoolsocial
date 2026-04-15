import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_USERS } from "@/data/dummyData";

export function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return false;
      // Demo admin bypass
      if (user.id === DEMO_USERS.admin.id) return true;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
    enabled: !!user,
  });
}
