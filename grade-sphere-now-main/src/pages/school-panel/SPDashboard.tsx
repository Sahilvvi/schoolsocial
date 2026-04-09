import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Eye, Star, Calendar, Briefcase, Image, QrCode, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function SPDashboard() {
  const { school } = useOutletContext<any>();

  const { data: admissions = [] } = useQuery({
    queryKey: ["sp-admissions", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("admissions").select("*").eq("school_id", school.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: views = [] } = useQuery({
    queryKey: ["sp-views", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("school_views").select("id").eq("school_id", school.id);
      return data || [];
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["sp-reviews", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("id, rating, author, comment, created_at, status").eq("school_id", school.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["sp-events", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id, title, event_date").eq("school_id", school.id).order("event_date", { ascending: true }).limit(5);
      return data || [];
    },
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["sp-jobs-count", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("id").eq("school_id", school.id);
      return data || [];
    },
  });

  const pending = admissions.filter(a => a.status === "pending").length;
  const approved = admissions.filter(a => a.status === "approved").length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "N/A";
  const recentAdmissions = admissions.slice(0, 5);
  const recentReviews = reviews.slice(0, 3);

  const stats = [
    { label: "Total Views", value: views.length, icon: Eye, color: "text-blue-500", link: "/school-panel/analytics" },
    { label: "Admissions", value: admissions.length, sub: `${pending} pending · ${approved} approved`, icon: ClipboardList, color: "text-green-500", link: "/school-panel/admissions" },
    { label: "Avg Rating", value: avgRating, sub: `${reviews.length} reviews`, icon: Star, color: "text-yellow-500", link: "/school-panel/reviews" },
    { label: "Gallery", value: `${(school.gallery || []).length} photos`, icon: Image, color: "text-pink-500", link: "/school-panel/gallery" },
    { label: "Events", value: events.length, icon: Calendar, color: "text-purple-500", link: "/school-panel/events" },
    { label: "Jobs Posted", value: jobs.length, icon: Briefcase, color: "text-orange-500", link: "/school-panel/jobs" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">{school.name}</h1>
        <div className="flex items-center gap-2">
          {school.is_verified && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">✓ Verified</Badge>}
          {school.is_featured && <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">⭐ Featured</Badge>}
        </div>
      </div>
      <p className="text-muted-foreground mb-8">{school.location} • {school.board} • {school.fees}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link to={s.link} key={s.label}>
            <Card className="border-border/30 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                {s.sub && <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Admissions</CardTitle>
            <Link to="/school-panel/admissions" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            {recentAdmissions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No admissions yet</p>
            ) : (
              <div className="space-y-3">
                {recentAdmissions.map(a => (
                  <div key={a.id} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{a.student_name}</p>
                      <p className="text-xs text-muted-foreground">Grade {a.grade} • {a.parent_name}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"} className="text-xs">
                        {a.status}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(a.created_at), "dd MMM")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Reviews</CardTitle>
            <Link to="/school-panel/reviews" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No reviews yet</p>
            ) : (
              <div className="space-y-3">
                {recentReviews.map(r => (
                  <div key={r.id} className="border-b border-border/20 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{r.author}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />
                          ))}
                        </div>
                      </div>
                      <Badge variant={r.status === "approved" ? "default" : "secondary"} className="text-[10px]">{r.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <Link to="/school-panel/events" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {events.map(e => (
                  <div key={e.id} className="flex items-center gap-3 border-b border-border/20 pb-3 last:border-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(e.event_date), "dd MMM yyyy")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/30">
          <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: "Upload Photos", icon: Image, link: "/school-panel/gallery", color: "bg-pink-500/10 text-pink-600" },
              { label: "View Analytics", icon: TrendingUp, link: "/school-panel/analytics", color: "bg-blue-500/10 text-blue-600" },
              { label: "Manage Admissions", icon: ClipboardList, link: "/school-panel/admissions", color: "bg-green-500/10 text-green-600" },
              { label: "Order QR Code", icon: QrCode, link: "/school-panel/qr-orders", color: "bg-purple-500/10 text-purple-600" },
            ].map(a => (
              <Link to={a.link} key={a.label}>
                <div className={`${a.color} rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer`}>
                  <a.icon className="h-6 w-6" />
                  <span className="text-xs font-semibold text-center">{a.label}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
