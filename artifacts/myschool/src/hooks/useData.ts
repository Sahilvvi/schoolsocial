import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { isDemoUserId } from "./useDemoMode";
import {
  DUMMY_SCHOOLS, DUMMY_EVENTS, DUMMY_JOBS, DUMMY_TUTORS, DUMMY_NEWS,
  DUMMY_REVIEWS, DUMMY_ADMISSIONS, DUMMY_JOB_APPLICATIONS, DUMMY_TUTOR_BOOKINGS,
  DUMMY_TUITION_ENQUIRIES, DUMMY_QR_ORDERS, DUMMY_BATCHES,
  getDummyCount, getDummyTableData,
} from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

// Helper: return dummy data when Supabase returns empty or errors
function withFallback<T>(data: T[] | null | undefined, fallback: T[]): T[] {
  return data && data.length > 0 ? data : fallback;
}

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("*").order("is_featured", { ascending: false }).order("rating", { ascending: false });
      if (error) return DUMMY_SCHOOLS;
      return withFallback(data, DUMMY_SCHOOLS);
    },
  });
}

export function useSchoolBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["school", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("*").eq("slug", slug!).single();
      if (error || !data) {
        const dummy = DUMMY_SCHOOLS.find((s) => s.slug === slug);
        if (dummy) return dummy;
        throw error || new Error("School not found");
      }
      return data;
    },
    enabled: !!slug,
  });
}

export function useReviews(schoolId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").eq("school_id", schoolId!).order("created_at", { ascending: false });
      if (error) return DUMMY_REVIEWS.filter((r) => r.school_id === schoolId);
      return withFallback(data, DUMMY_REVIEWS.filter((r) => r.school_id === schoolId));
    },
    enabled: !!schoolId,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (review: { school_id: string; author: string; rating: number; comment: string; user_id?: string }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...review, id: `demo-${Date.now()}`, status: "pending", created_at: new Date().toISOString() };
        queryClient.setQueryData<any[]>(["reviews", review.school_id], (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from("reviews").insert(review).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      if (!isDemoUserId(user?.id)) queryClient.invalidateQueries({ queryKey: ["reviews", vars.school_id] });
    },
  });
}

export function useSubmitAdmission() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (admission: { school_id: string; student_name: string; parent_name: string; email: string; phone: string; grade: string }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...admission, id: `demo-${Date.now()}`, status: "pending", created_at: new Date().toISOString() };
        qc.setQueryData<any[]>(["admissions"], (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from("admissions").insert(admission).select().single();
      if (error) throw error;
      return data;
    },
  });
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").order("posted_date", { ascending: false });
      if (error) return DUMMY_JOBS;
      return withFallback(data, DUMMY_JOBS);
    },
  });
}

export function useSubmitJobApplication() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (app: { job_id: string; name: string; email: string; phone: string; experience: string }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...app, id: `demo-${Date.now()}`, created_at: new Date().toISOString() };
        qc.setQueryData<any[]>(["job_applications"], (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from("job_applications").insert(app).select().single();
      if (error) throw error;
      return data;
    },
  });
}

export function useTutors() {
  return useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tutors").select("*").order("rating", { ascending: false });
      if (error) return DUMMY_TUTORS;
      return withFallback(data, DUMMY_TUTORS);
    },
  });
}

export function useBookTutor() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: { tutor_id: string; name: string; email: string; message?: string }) => {
      if (isDemoUserId(user?.id)) {
        const fake = { ...booking, id: `demo-${Date.now()}`, status: "pending", created_at: new Date().toISOString() };
        qc.setQueryData<any[]>(["tutor_bookings"], (old = []) => [fake, ...old]);
        return fake;
      }
      const { data, error } = await supabase.from("tutor_bookings").insert(booking).select().single();
      if (error) throw error;
      return data;
    },
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: true });
      if (error) return DUMMY_EVENTS;
      return withFallback(data, DUMMY_EVENTS);
    },
  });
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").order("published_date", { ascending: false });
      if (error) return DUMMY_NEWS;
      return withFallback(data, DUMMY_NEWS);
    },
  });
}

// ─── Additional hooks used by admin pages ───

export function useAdmissions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["admissions"],
    queryFn: async () => {
      if (isDemoUserId(user?.id)) {
        const stored = getDemoData<any[] | null>("admin-admissions", null);
        if (stored) return stored;
        setDemoData("admin-admissions", DUMMY_ADMISSIONS);
        return DUMMY_ADMISSIONS;
      }
      const { data, error } = await supabase.from("admissions").select("*").order("created_at", { ascending: false });
      if (error) return DUMMY_ADMISSIONS;
      return withFallback(data, DUMMY_ADMISSIONS);
    },
  });
}

export function useJobApplications() {
  return useQuery({
    queryKey: ["job_applications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false });
      if (error) return DUMMY_JOB_APPLICATIONS;
      return withFallback(data, DUMMY_JOB_APPLICATIONS);
    },
  });
}

export function useTutorBookings() {
  return useQuery({
    queryKey: ["tutor_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tutor_bookings").select("*").order("created_at", { ascending: false });
      if (error) return DUMMY_TUTOR_BOOKINGS;
      return withFallback(data, DUMMY_TUTOR_BOOKINGS);
    },
  });
}

export function useTuitionEnquiries() {
  return useQuery({
    queryKey: ["tuition_enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tuition_enquiries").select("*").order("created_at", { ascending: false });
      if (error) return DUMMY_TUITION_ENQUIRIES;
      return withFallback(data, DUMMY_TUITION_ENQUIRIES);
    },
  });
}

// Count helper with dummy fallback
export function useCount(table: string) {
  return useQuery({
    queryKey: [table, "count"],
    queryFn: async () => {
      const { count, error } = await supabase.from(table as any).select("*", { count: "exact", head: true });
      if (error || count === 0 || count === null) return getDummyCount(table);
      return count;
    },
  });
}

// Admissions by day for admin chart
export function useAdmissionsByDay() {
  return useQuery({
    queryKey: ["admissions-by-day"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admissions").select("created_at").order("created_at", { ascending: true });
      if (error || !data || data.length === 0) {
        return DUMMY_ADMISSIONS.map((a) => ({ created_at: a.created_at }));
      }
      return data;
    },
  });
}
