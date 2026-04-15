import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { isDemoUserId } from "./useDemoMode";
import {
  DUMMY_ATTENDANCE, DUMMY_FEE_RECORDS, DUMMY_HOMEWORK, DUMMY_BATCHES,
  DUMMY_NOTIFICATIONS, DUMMY_QR_ORDERS,
} from "@/data/dummyData";

function withFallback<T>(data: T[] | null | undefined, fallback: T[]): T[] {
  return data && data.length > 0 ? data : fallback;
}

// Attendance
export function useAttendance(schoolId: string, date?: string) {
  return useQuery({
    queryKey: ["attendance", schoolId, date],
    queryFn: async () => {
      let q = supabase.from("attendance_records").select("*").eq("school_id", schoolId);
      if (date) q = q.eq("attendance_date", date);
      const { data, error } = await q.order("person_name");
      const fallback = DUMMY_ATTENDANCE.filter((a) => a.school_id === schoolId && (!date || a.attendance_date === date));
      if (error) return fallback;
      return withFallback(data, fallback);
    },
    enabled: !!schoolId,
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (record: { school_id: string; person_name: string; person_type: string; attendance_date: string; status: string; class_name?: string; remarks?: string }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...record, id: `demo-${Date.now()}`, created_at: new Date().toISOString() };
        qc.setQueriesData<any[]>({ queryKey: ["attendance"] }, (old = []) => {
          const idx = old.findIndex((a) => a.person_name === record.person_name && a.attendance_date === record.attendance_date);
          if (idx >= 0) { const next = [...old]; next[idx] = { ...next[idx], ...record }; return next; }
          return [fake, ...old];
        });
        return fake;
      }
      const { data, error } = await supabase.from("attendance_records").upsert(record, { onConflict: "school_id,person_name,attendance_date" }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { if (!isDemoUserId(user?.id)) qc.invalidateQueries({ queryKey: ["attendance"] }); },
  });
}

// Fee Records
export function useFeeRecords(schoolId: string) {
  return useQuery({
    queryKey: ["fee-records", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase.from("fee_records").select("*").eq("school_id", schoolId).order("created_at", { ascending: false });
      const fallback = DUMMY_FEE_RECORDS.filter((f) => f.school_id === schoolId);
      if (error) return fallback;
      return withFallback(data, fallback);
    },
    enabled: !!schoolId,
  });
}

export function useAddFeeRecord() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (record: { school_id: string; person_name: string; person_type: string; amount: number; fee_type: string; status: string; due_date?: string; remarks?: string }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...record, id: `demo-${Date.now()}`, created_at: new Date().toISOString() };
        qc.setQueriesData<any[]>({ queryKey: ["fee-records"] }, (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from("fee_records").insert(record).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { if (!isDemoUserId(user?.id)) qc.invalidateQueries({ queryKey: ["fee-records"] }); },
  });
}

// Homework
export function useHomework(schoolId: string) {
  return useQuery({
    queryKey: ["homework", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase.from("homework_notes").select("*").eq("school_id", schoolId).order("created_at", { ascending: false });
      const fallback = DUMMY_HOMEWORK.filter((h) => h.school_id === schoolId);
      if (error) return fallback;
      return withFallback(data, fallback);
    },
    enabled: !!schoolId,
  });
}

export function useAddHomework() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (record: { school_id: string; title: string; description: string; subject: string; class_name: string; doc_type: string; file_url?: string; created_by: string }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...record, id: `demo-${Date.now()}`, created_at: new Date().toISOString() };
        qc.setQueriesData<any[]>({ queryKey: ["homework"] }, (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from("homework_notes").insert(record).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { if (!isDemoUserId(user?.id)) qc.invalidateQueries({ queryKey: ["homework"] }); },
  });
}

// Tuition Batches
export function useTuitionBatches(tutorId?: string) {
  return useQuery({
    queryKey: ["tuition-batches", tutorId],
    queryFn: async () => {
      let q = supabase.from("tuition_batches").select("*");
      if (tutorId) q = q.eq("tutor_id", tutorId);
      const { data, error } = await q.order("created_at", { ascending: false });
      const fallback = tutorId ? DUMMY_BATCHES.filter((b) => b.tutor_id === tutorId) : DUMMY_BATCHES;
      if (error) return fallback;
      return withFallback(data, fallback);
    },
  });
}

export function useAddBatch() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (batch: { tutor_id: string; batch_name: string; subject: string; schedule: string; max_students: number; fee_per_month: number }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...batch, id: `demo-${Date.now()}`, is_active: true, current_students: 0, created_at: new Date().toISOString() };
        qc.setQueriesData<any[]>({ queryKey: ["tuition-batches"] }, (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from("tuition_batches").insert(batch).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { if (!isDemoUserId(user?.id)) qc.invalidateQueries({ queryKey: ["tuition-batches"] }); },
  });
}

// Notifications
export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId!).order("created_at", { ascending: false }).limit(50);
      const fallback = DUMMY_NOTIFICATIONS.filter((n) => n.user_id === userId);
      if (error) return fallback;
      return withFallback(data, fallback);
    },
    enabled: !!userId,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemoUserId(user?.id)) {
        qc.setQueriesData<any[]>({ queryKey: ["notifications"] }, (old = []) =>
          old.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        );
        return;
      }
      const { error } = await supabase.from("notifications").update({ is_read: true } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { if (!isDemoUserId(user?.id)) qc.invalidateQueries({ queryKey: ["notifications"] }); },
  });
}

// QR Orders
export function useQrOrders() {
  return useQuery({
    queryKey: ["qr-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("qr_orders").select("*").order("created_at", { ascending: false });
      if (error) return DUMMY_QR_ORDERS;
      return withFallback(data, DUMMY_QR_ORDERS);
    },
  });
}

export function useCreateQrOrder() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (order: { school_id: string; order_type: string; shipping_address: string; contact_phone: string; contact_name: string; user_id?: string }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...order, id: `demo-${Date.now()}`, status: "pending", created_at: new Date().toISOString() };
        qc.setQueryData<any[]>(["qr-orders"], (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from("qr_orders").insert(order).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { if (!isDemoUserId(user?.id)) qc.invalidateQueries({ queryKey: ["qr-orders"] }); },
  });
}
