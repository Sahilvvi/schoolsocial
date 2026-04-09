import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("*").order("is_featured", { ascending: false }).order("rating", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSchoolBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["school", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("*").eq("slug", slug!).single();
      if (error) throw error;
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
      if (error) throw error;
      return data;
    },
    enabled: !!schoolId,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { school_id: string; author: string; rating: number; comment: string; user_id?: string }) => {
      const { data, error } = await supabase.from("reviews").insert(review).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", vars.school_id] });
    },
  });
}

export function useSubmitAdmission() {
  return useMutation({
    mutationFn: async (admission: { school_id: string; student_name: string; parent_name: string; email: string; phone: string; grade: string }) => {
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
      if (error) throw error;
      return data;
    },
  });
}

export function useSubmitJobApplication() {
  return useMutation({
    mutationFn: async (app: { job_id: string; name: string; email: string; phone: string; experience: string }) => {
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
      if (error) throw error;
      return data;
    },
  });
}

export function useBookTutor() {
  return useMutation({
    mutationFn: async (booking: { tutor_id: string; name: string; email: string; message?: string }) => {
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
      if (error) throw error;
      return data;
    },
  });
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").order("published_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
