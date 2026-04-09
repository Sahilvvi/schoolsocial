import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdminInsert<T extends Record<string, unknown>>(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: T) => {
      const { data, error } = await supabase.from(table as any).insert(row as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
}

export function useAdminUpdate<T extends Record<string, unknown>>(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...row }: T & { id: string }) => {
      const { data, error } = await supabase.from(table as any).update(row as any).eq("id", id as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
}

export function useAdminDelete(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as any).delete().eq("id", id as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
}
