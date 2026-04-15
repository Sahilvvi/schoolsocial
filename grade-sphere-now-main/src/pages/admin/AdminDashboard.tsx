import { motion } from "framer-motion";
import { School, Calendar, Briefcase, BookOpen, Newspaper, ClipboardList, Users, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    { label: "Schools", value: schools.length, icon: School, path: "/admin/schools", color: "from-blue-500 to-blue-600" },
    { label: "Events", value: events.length, icon: Calendar, path: "/admin/events", color: "from-emerald-500 to-emerald-600" },
    { label: "Jobs", value: jobs.length, icon: Briefcase, path: "/admin/jobs", color: "from-purple-500 to-purple-600" },
    { label: "Tutors", value: tutors.length, icon: BookOpen, path: "/admin/tutors", color: "from-orange-500 to-orange-600" },
    { label: "News", value: news.length, icon: Newspaper, path: "/admin/news", color: "from-pink-500 to-pink-600" },
    { label: "Admissions", value: admissionsCount, icon: ClipboardList, path: "/admin/admissions", color: "from-cyan-500 to-cyan-600" },
    { label: "Job Apps", value: jobAppsCount, icon: Users, path: "/admin/job-applications", color: "from-indigo-500 to-indigo-600" },
    { label: "Bookings", value: bookingsCount, icon: MessageSquare, path: "/admin/tutor-bookings", color: "from-rose-500 to-rose-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your MySchool ecosystem</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.path}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Day-wise Admission Analytics */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/30 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" /> Day-wise Admission Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Admissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No admission data yet. Chart will appear once admissions are submitted.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-sm border-border/30">
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 text-primary/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Welcome to Admin Panel</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your schools, events, jobs, tutors, and news from here. Use the sidebar to navigate between different sections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
