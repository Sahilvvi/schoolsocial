import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Check, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { DUMMY_REVIEWS } from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

export default function SPReviews() {
  const { school } = useOutletContext<any>();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const queryKey = ["sp-reviews-full", school.id];

  const { data: reviews = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (isDemoUserId(user?.id)) {
        const stored = getDemoData<any[] | null>("sp-reviews", null);
        if (stored) return stored;
        const fallback = DUMMY_REVIEWS.filter((r) => r.school_id === school.id);
        setDemoData("sp-reviews", fallback);
        return fallback;
      }
      const { data } = await supabase.from("reviews").select("*").eq("school_id", school.id).order("created_at", { ascending: false });
      if (data && data.length > 0) return data;
      return DUMMY_REVIEWS.filter((r) => r.school_id === school.id);
    },
  });

  const updateReviewStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (isDemoUserId(user?.id)) {
        qc.setQueryData<any[]>(queryKey, (old = []) =>
          old.map(r => r.id === id ? { ...r, status } : r),
        );
        return;
      }
      const { error } = await supabase.from("reviews").update({ status } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>(queryKey);
        if (current) setDemoData("sp-reviews", current);
      } else {
        qc.invalidateQueries({ queryKey });
      }
      toast.success("Review updated");
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      if (isDemoUserId(user?.id)) {
        qc.setQueryData<any[]>(queryKey, (old = []) => old.filter(r => r.id !== id));
        return;
      }
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>(queryKey);
        if (current) setDemoData("sp-reviews", current);
      } else {
        qc.invalidateQueries({ queryKey });
      }
      toast.success("Review removed");
    },
  });

  const filtered = filter === "all" ? reviews : reviews.filter(r => r.status === filter);
  const counts = {
    all: reviews.length,
    approved: reviews.filter(r => r.status === "approved").length,
    pending: reviews.filter(r => r.status === "pending").length,
    rejected: reviews.filter(r => r.status === "rejected").length,
  };
  const avgRating = reviews.length ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  const statusColor = (s: string): "default" | "destructive" | "secondary" => 
    s === "approved" ? "default" : s === "rejected" ? "destructive" : "secondary";

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Average rating: <span className="font-semibold text-yellow-500">{avgRating}</span> from {reviews.length} reviews
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <Button
            key={t.key}
            size="sm"
            variant={filter === t.key ? "default" : "outline"}
            onClick={() => setFilter(t.key)}
            className="gap-1.5"
          >
            {t.label}
            <span className="text-xs opacity-70">({counts[t.key as keyof typeof counts]})</span>
          </Button>
        ))}
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No {filter !== "all" ? filter : ""} reviews</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <Card key={r.id} className="border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {r.author?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold">{r.author}</span>
                      <div className="flex mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status !== "approved" && (
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-500/10" onClick={() => updateReviewStatus.mutate({ id: r.id, status: "approved" })}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {r.status !== "rejected" && (
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-orange-600 hover:bg-orange-500/10" onClick={() => updateReviewStatus.mutate({ id: r.id, status: "rejected" })}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive" onClick={() => deleteReview.mutate(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Badge variant={statusColor(r.status)}>{r.status}</Badge>
                    <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), "dd MMM yyyy")}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 pl-[52px]">{r.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
