import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Trash2, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { DUMMY_REVIEWS, DUMMY_SCHOOLS } from "@/data/dummyData";

function useAllReviews() {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, schools(name)")
        .order("created_at", { ascending: false });
      if (error || !data || data.length === 0) {
        return DUMMY_REVIEWS.map((r) => ({
          ...r,
          schools: { name: DUMMY_SCHOOLS.find((s) => s.id === r.school_id)?.name ?? "Unknown School" },
        }));
      }
      return data;
    },
  });
}

export default function AdminReviews() {
  const { data: reviews = [], isLoading } = useAllReviews();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("reviews").update({ status } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review updated");
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted");
    },
  });

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    approved: "bg-emerald-500/10 text-emerald-600",
    rejected: "bg-red-500/10 text-red-600",
  };

  const pending = reviews.filter((r: any) => r.status === "pending");
  const approved = reviews.filter((r: any) => r.status === "approved");
  const rejected = reviews.filter((r: any) => r.status === "rejected");

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Reviews Moderation</h1>
        <p className="text-muted-foreground mt-1">
          {pending.length} pending · {approved.length} approved · {rejected.length} rejected
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="rounded-xl capitalize"
          >
            {f} {f === "all" ? `(${reviews.length})` : `(${reviews.filter((r: any) => r.status === f).length})`}
          </Button>
        ))}
      </div>

      {(() => {
        const displayed = filter === "all" ? reviews : reviews.filter((r: any) => r.status === filter);
        return displayed.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No {filter === "all" ? "" : filter} reviews</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((r: any) => (
            <Card key={r.id} className="bg-card/60 border-border/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{r.author}</span>
                      <Badge className={`text-[10px] ${statusColor[r.status] || ""}`}>{r.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {(r as any).schools?.name} · {new Date(r.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {r.status !== "approved" && (
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-500/10" onClick={() => updateStatus.mutate({ id: r.id, status: "approved" })}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {r.status !== "rejected" && (
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-orange-600 hover:bg-orange-500/10" onClick={() => updateStatus.mutate({ id: r.id, status: "rejected" })}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-destructive" onClick={() => deleteReview.mutate(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
      })()}
    </div>
  );
}
