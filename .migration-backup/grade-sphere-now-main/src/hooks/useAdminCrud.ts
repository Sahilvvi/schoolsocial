import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { isDemoUserId } from "./useDemoMode";
import { setDemoData } from "@/lib/demoStorage";

/**
 * Demo-aware CRUD hooks.
 * For demo users every mutation is applied to the React-Query cache only
 * (no Supabase call). For real users the behaviour is unchanged.
 */

export function useAdminInsert<T extends Record<string, unknown>>(table: string) {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (row: T) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...row, id: `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`, created_at: new Date().toISOString() } as T & { id: string };
        qc.setQueryData<any[]>([table], (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from(table as any).insert(row as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, _v, _c) => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>([table]);
        if (current) setDemoData(`admin-${table}`, current);
      } else {
        qc.invalidateQueries({ queryKey: [table] });
      }
    },
  });
}

export function useAdminUpdate<T extends Record<string, unknown>>(table: string) {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...row }: T & { id: string }) => {
      if (isDemoUserId(user?.id)) {
        // Patch the item in every query whose key starts with `table`
        qc.setQueriesData<any[]>({ queryKey: [table] }, (old = []) =>
          old.map((item) => (item.id === id ? { ...item, ...row } : item)),
        );
        // Also patch query keys that are more specific (e.g. ["admissions"])
        return { id, ...row };
      }
      const { data, error } = await supabase.from(table as any).update(row as any).eq("id", id as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>([table]);
        if (current) setDemoData(`admin-${table}`, current);
      } else {
        qc.invalidateQueries({ queryKey: [table] });
      }
    },
  });
}

export function useAdminDelete(table: string) {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemoUserId(user?.id)) {
        qc.setQueriesData<any[]>({ queryKey: [table] }, (old = []) =>
          old.filter((item) => item.id !== id),
        );
        return;
      }
      const { error } = await supabase.from(table as any).delete().eq("id", id as any);
      if (error) throw error;
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>([table]);
        if (current) setDemoData(`admin-${table}`, current);
      } else {
        qc.invalidateQueries({ queryKey: [table] });
      }
    },
  });
}
