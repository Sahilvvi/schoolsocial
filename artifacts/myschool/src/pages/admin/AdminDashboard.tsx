import { motion } from "framer-motion";
import {
  School, Calendar, Briefcase, BookOpen, Newspaper, ClipboardList,
  Users, MessageSquare, TrendingUp, ArrowUpRight, Activity
} from "lucide-react";
import { useSchools, useEvents, useJobs, useTutors, useNews, useCount, useAdmissionsByDay } from "@/hooks/useData";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";

const STAT_COLORS = [
  { text: "text-blue-600",   bg: "bg-blue-50",    ring: "ring-blue-100",   glow: "shadow-blue-100"   },
  { text: "text-emerald-600",bg: "bg-emerald-50",  ring: "ring-emerald-100",glow: "shadow-emerald-100"},
  { text: "text-violet-600", bg: "bg-violet-50",   ring: "ring-violet-100", glow: "shadow-violet-100" },
  { text: "text-amber-600",  bg: "bg-amber-50",    ring: "ring-amber-100",  glow: "shadow-amber-100"  },
  { text: "text-pink-600",   bg: "bg-pink-50",     ring: "ring-pink-100",   glow: "shadow-pink-100"   },
  { text: "text-cyan-600",   bg: "bg-cyan-50",     ring: "ring-cyan-100",   glow: "shadow-cyan-100"   },
  { text: "text-indigo-600", bg: "bg-indigo-50",   ring: "ring-indigo-100", glow: "shadow-indigo-100" },
  { text: "text-rose-600",   bg: "bg-rose-50",     ring: "ring-rose-100",   glow: "shadow-rose-100"   },
];

export default function AdminDashboard() {
  const { data: schools = [] }        = useSchools();
  const { data: events = [] }         = useEvents();
  const { data: jobs = [] }           = useJobs();
  const { data: tutors = [] }         = useTutors();
  const { data: news = [] }           = useNews();
  const { data: admissionsCount = 0 } = useCount("admissions");
  const { data: jobAppsCount = 0 }    = useCount("job_applications");
  const { data: bookingsCount = 0 }   = useCount("tutor_bookings");
  const { data: admissionsRaw = [] }  = useAdmissionsByDay();

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    admissionsRaw.forEach((a: any) => {
      const day = new Date(a.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [admissionsRaw]);

  const stats = [
    { label: "Schools",    value: schools.length,   icon: School,        path: "/admin/schools"          },
    { label: "Events",     value: events.length,    icon: Calendar,      path: "/admin/events"           },
    { label: "Jobs",       value: jobs.length,      icon: Briefcase,     path: "/admin/jobs"             },
    { label: "Tutors",     value: tutors.length,    icon: BookOpen,      path: "/admin/tutors"           },
    { label: "News",       value: news.length,      icon: Newspaper,     path: "/admin/news"             },
    { label: "Admissions", value: admissionsCount,  icon: ClipboardList, path: "/admin/admissions"       },
    { label: "Job Apps",   value: jobAppsCount,     icon: Users,         path: "/admin/job-applications" },
    { label: "Bookings",   value: bookingsCount,    icon: MessageSquare, path: "/admin/tutor-bookings"   },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Platform metrics and analytics for MySchool ecosystem</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Data
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const c = STAT_COLORS[i % STAT_COLORS.length];
          return (
            <Link key={s.label} to={s.path}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mb-0.5 tabular-nums">{s.value}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admission Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Admission Trends</h2>
              <p className="text-sm text-slate-500 mt-0.5">Daily admission inquiries across all schools</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-primary/8 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} tickLine={false} axisLine={false} dy={8} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} tickLine={false} axisLine={false} dx={-4} />
                  <Tooltip
                    cursor={{ fill: "#f8fafc", radius: 6 }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.08)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">No admission data yet</p>
            </div>
          )}
        </div>

        {/* Quick Links Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <Activity className="h-4.5 w-4.5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Quick Access</h2>
              <p className="text-xs text-slate-500">Jump to key sections</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {stats.map((s, i) => {
              const c = STAT_COLORS[i % STAT_COLORS.length];
              return (
                <Link key={s.label} to={s.path}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className={`h-7 w-7 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                      <s.icon className={`h-3.5 w-3.5 ${c.text}`} />
                    </div>
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 flex-1 transition-colors">{s.label}</span>
                    <span className="text-xs font-bold text-slate-400 tabular-nums">{s.value}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
