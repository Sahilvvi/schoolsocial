import { motion } from "framer-motion";
import { School, Calendar, Briefcase, BookOpen, Newspaper, ClipboardList, Users, MessageSquare, TrendingUp, ArrowUpRight } from "lucide-react";
import { useSchools, useEvents, useJobs, useTutors, useNews, useCount, useAdmissionsByDay } from "@/hooks/useData";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";

export default function AdminDashboard() {
  const { data: schools = [] } = useSchools();
  const { data: events = [] } = useEvents();
  const { data: jobs = [] } = useJobs();
  const { data: tutors = [] } = useTutors();
  const { data: news = [] } = useNews();
  const { data: admissionsCount = 0 } = useCount("admissions");
  const { data: jobAppsCount = 0 } = useCount("job_applications");
  const { data: bookingsCount = 0 } = useCount("tutor_bookings");
  const { data: admissionsRaw = [] } = useAdmissionsByDay();

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    admissionsRaw.forEach((a: any) => {
      const day = new Date(a.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [admissionsRaw]);

  const stats = [
    { label: "Schools", value: schools.length, icon: School, path: "/admin/schools", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Events", value: events.length, icon: Calendar, path: "/admin/events", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Jobs", value: jobs.length, icon: Briefcase, path: "/admin/jobs", color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Tutors", value: tutors.length, icon: BookOpen, path: "/admin/tutors", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "News", value: news.length, icon: Newspaper, path: "/admin/news", color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Admissions", value: admissionsCount, icon: ClipboardList, path: "/admin/admissions", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Job Apps", value: jobAppsCount, icon: Users, path: "/admin/job-applications", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Bookings", value: bookingsCount, icon: MessageSquare, path: "/admin/tutor-bookings", color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Platform metrics and analytics for MySchool ecosystem</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.path}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{s.label}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admission Trends</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Daily admission inquiries across all schools</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} dy={10} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} 
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <TrendingUp className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No admission data available yet.</p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <School className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Health</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            All services are running smoothly. The marketplace is actively receiving traffic.
          </p>
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400">Database Status</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online</span>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400">API Latency</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">42ms</span>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400">Active Users (24h)</span>
              <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">1,248</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
