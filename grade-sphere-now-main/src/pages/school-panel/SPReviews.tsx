import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Filter } from "lucide-react";
import { format } from "date-fns";
import { DUMMY_REVIEWS } from "@/data/dummyData";

export default function SPReviews() {
  const { school } = useOutletContext<any>();
  const [filter, setFilter] = useState<string>("all");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["sp-reviews-full", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").eq("school_id", school.id).order("created_at", { ascending: false });
      if (data && data.length > 0) return data;
      return DUMMY_REVIEWS.filter((r) => r.school_id === school.id);
    },
  });

  const filtered = filter === "all" ? reviews : reviews.filter(r => r.status === filter);
  const counts = {
    all: reviews.length,
    approved: reviews.filter(r => r.status === "approved").length,
    pending: reviews.filter(r => r.status === "pending").length,
    rejected: reviews.filter(r => r.status === "rejected").length,
  };
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

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
            Average rating: <span className="font-semibold text-yellow-500">{avgRating}</span> ⭐ from {reviews.length} reviews
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
