import { useState, useEffect } from "react";
import { superAdminLinks } from "./super-admin-links";
import { AdminLayout } from "@/erp/components/layouts";
import { Activity, Building2, Users, IndianRupee, Star, Settings, CheckCircle2, XCircle, Loader2, ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

const links = superAdminLinks;
type Review = {
  id: number;
  schoolId: number;
  schoolName?: string;
  reviewerName: string;
  reviewerEmail?: string;
  overallRating: number;
  teachingRating?: number;
  infrastructureRating?: number;
  comment?: string;
  approved: boolean;
  createdAt?: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
      <span className="text-xs font-bold text-foreground ml-1">{Number(rating).toFixed(1)}</span>
    </div>
  );
}

export default function SuperAdminReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE}/api/reviews`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await fetch(`${BASE}/api/reviews/${id}/approve`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
      toast({ title: "Review approved!" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    setActionLoading(null);
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await fetch(`${BASE}/api/reviews/${id}/reject`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: false } : r));
      toast({ title: "Review rejected." });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    setActionLoading(null);
  };

  const filtered = reviews.filter(r => {
    if (filter === "approved") return r.approved;
    if (filter === "pending") return !r.approved;
    return true;
  });

  const totalApproved = reviews.filter(r => r.approved).length;
  const totalPending = reviews.filter(r => !r.approved).length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length).toFixed(1)
    : "—";

  const stats = [
    { label: "Total Reviews", value: reviews.length.toString(), icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Approved", value: totalApproved.toString(), icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Pending", value: totalPending.toString(), icon: Loader2, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Avg Rating", value: avgRating.toString(), icon: Star, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <AdminLayout title="Reviews & Ratings" links={links}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5 rounded-2xl shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold font-display text-foreground">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="bg-secondary/50 p-1 rounded-xl h-auto">
          <TabsTrigger value="all" className="rounded-lg px-5 py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">All ({reviews.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-5 py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending ({totalPending})</TabsTrigger>
          <TabsTrigger value="approved" className="rounded-lg px-5 py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Approved ({totalApproved})</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(review => (
            <Card key={review.id} className="p-6 rounded-2xl border-border shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-foreground">{review.reviewerName}</h3>
                    {review.schoolName && (
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{review.schoolName}</span>
                    )}
                    <StarRating rating={review.overallRating} />
                  </div>
                  {review.comment && <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-3">{review.comment}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {review.teachingRating && <span>Teaching: {review.teachingRating}/5</span>}
                    {review.infrastructureRating && <span>Infrastructure: {review.infrastructureRating}/5</span>}
                    {review.createdAt && <span>{new Date(review.createdAt).toLocaleDateString("en-IN")}</span>}
                    {review.approved ? (
                      <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle2 className="w-3 h-3" /> Approved</span>
                    ) : (
                      <span className="text-orange-600 font-bold">Pending</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!review.approved && (
                    <Button size="sm" className="rounded-lg text-xs font-bold" onClick={() => handleApprove(review.id)} disabled={actionLoading === review.id}>
                      {actionLoading === review.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1" />} Approve
                    </Button>
                  )}
                  {review.approved && (
                    <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold text-destructive border-destructive/30"
                      onClick={() => handleReject(review.id)} disabled={actionLoading === review.id}>
                      {actionLoading === review.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5 mr-1" />} Unpublish
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
