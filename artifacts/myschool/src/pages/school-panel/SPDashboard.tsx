import { useOutletContext, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Eye, Star, Calendar, Briefcase, Image, QrCode, TrendingUp, ArrowUpRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { DUMMY_ADMISSIONS, DUMMY_SCHOOL_VIEWS, DUMMY_REVIEWS, DUMMY_EVENTS, DUMMY_JOBS } from "@/data/dummyData";

export default function SPDashboard() {
  const { school } = useOutletContext<any>();

  const { data: admissions = [] } = useQuery({
    queryKey: ["sp-admissions", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("admissions").select("*").eq("school_id", school.id).order("created_at", { ascending: false });
      if (data && data.length > 0) return data;
      return DUMMY_ADMISSIONS.filter((a) => a.school_id === school.id);
    },
  });

  const { data: views = [] } = useQuery({
    queryKey: ["sp-views", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("school_views").select("id").eq("school_id", school.id);
      if (data && data.length > 0) return data;
      return DUMMY_SCHOOL_VIEWS.filter((v) => v.school_id === school.id);
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["sp-reviews", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("id, rating, author, comment, created_at, status").eq("school_id", school.id).order("created_at", { ascending: false });
      if (data && data.length > 0) return data;
      return DUMMY_REVIEWS.filter((r) => r.school_id === school.id);
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["sp-events", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id, title, event_date").eq("school_id", school.id).order("event_date", { ascending: true }).limit(5);
      if (data && data.length > 0) return data;
      return DUMMY_EVENTS.filter((e) => e.school_id === school.id).slice(0, 5);
    },
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["sp-jobs-count", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("id").eq("school_id", school.id);
      if (data && data.length > 0) return data;
      return DUMMY_JOBS.filter((j) => j.school_id === school.id);
    },
  });

  const pending = admissions.filter(a => a.status === "pending").length;
  const approved = admissions.filter(a => a.status === "approved").length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "N/A";
  const recentAdmissions = admissions.slice(0, 5);
  const recentReviews = reviews.slice(0, 3);

  const stats = [
    { label: "Profile Views", value: views.length, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10", link: "/school-panel/analytics" },
    { label: "Admissions", value: admissions.length, sub: `${pending} pending`, icon: ClipboardList, color: "text-emerald-500", bg: "bg-emerald-500/10", link: "/school-panel/admissions" },
    { label: "Avg Rating", value: avgRating, sub: `${reviews.length} reviews`, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", link: "/school-panel/reviews" },
    { label: "Gallery", value: (school.gallery || []).length, sub: "photos", icon: Image, color: "text-pink-500", bg: "bg-pink-500/10", link: "/school-panel/gallery" },
    { label: "Events", value: events.length, sub: "upcoming", icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10", link: "/school-panel/events" },
    { label: "Jobs", value: jobs.length, sub: "active listings", icon: Briefcase, color: "text-orange-500", bg: "bg-orange-500/10", link: "/school-panel/jobs" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {school.name}
            {school.is_verified && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 px-2 py-0">Verified</Badge>}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{school.location} • {school.board}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/school-panel/admissions" className="btn-primary text-sm px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Manage Admissions
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(s => (
          <Link to={s.link} key={s.label}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-md transition-all group h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <ArrowUpRight className="h-3 w-3 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{s.label}</p>
                  {s.sub && <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate hidden sm:inline-block">({s.sub})</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Admissions</h2>
            <Link to="/school-panel/admissions" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="p-0 flex-1">
            {recentAdmissions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">No admissions yet</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAdmissions.map(a => (
                  <div key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{a.student_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Grade {a.grade} • {a.parent_name}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"} 
                        className={a.status === "approved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-none border-0" : 
                                  a.status === "pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 shadow-none border-0" : "shadow-none border-0"}
                      >
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </Badge>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(a.created_at), "MMM d")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Upload Photos", icon: Image, link: "/school-panel/gallery", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-500/10 hover:bg-pink-100 dark:hover:bg-pink-500/20" },
                { label: "View Analytics", icon: TrendingUp, link: "/school-panel/analytics", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20" },
                { label: "Add Event", icon: Calendar, link: "/school-panel/events", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20" },
                { label: "Order QR Code", icon: QrCode, link: "/school-panel/qr-orders", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20" },
              ].map(a => (
                <Link to={a.link} key={a.label}>
                  <div className={`${a.bg} rounded-lg p-3 flex items-center gap-3 transition-colors cursor-pointer`}>
                    <a.icon className={`h-5 w-5 ${a.color}`} />
                    <span className={`text-xs font-semibold ${a.color}`}>{a.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex-1 flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Reviews</h2>
              <Link to="/school-panel/reviews" className="text-sm text-primary font-medium hover:underline">View all</Link>
            </div>
            <div className="p-0 flex-1">
              {recentReviews.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">No reviews yet</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentReviews.map(r => (
                    <div key={r.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-900 dark:text-white">{r.author}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`} />
                            ))}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] shadow-none">{r.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
