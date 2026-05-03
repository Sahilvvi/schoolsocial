import { useOutletContext, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, IndianRupee, TrendingUp, MessageSquare, Star, ArrowUpRight } from "lucide-react";

export default function TuPDashboard() {
  const { centerData, batches, enquiries, bookings, tutors, notifications } = useOutletContext<any>();

  const totalStudents = batches.reduce((s: number, b: any) => s + b.current_students, 0);
  const totalRevenue = batches.reduce((s: number, b: any) => s + b.current_students * b.fee_per_month, 0);
  const avgOccupancy = Math.round(batches.reduce((s: number, b: any) => s + (b.current_students / b.max_students) * 100, 0) / batches.length) || 0;
  const newEnquiries = enquiries.filter((e: any) => e.status === "new").length;

  const stats = [
    { label: "Total Students", value: totalStudents, sub: "active", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", link: "/tuition-panel/batches" },
    { label: "Active Batches", value: batches.filter((b: any) => b.is_active).length, sub: "running", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10", link: "/tuition-panel/batches" },
    { label: "Est. Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: "/month", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10", link: "/tuition-panel/batches" },
    { label: "Occupancy", value: `${avgOccupancy}%`, sub: "avg fill rate", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", link: "/tuition-panel/batches" },
    { label: "Enquiries", value: newEnquiries, sub: "new leads", icon: MessageSquare, color: "text-rose-500", bg: "bg-rose-500/10", link: "/tuition-panel/enquiries" },
    { label: "Tutors", value: tutors.length, sub: "faculty", icon: Star, color: "text-cyan-500", bg: "bg-cyan-500/10", link: "/tuition-panel/tutors" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {centerData.name}
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 px-2 py-0">Active</Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{centerData.location} • Est. {centerData.established}</p>
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Enquiries</h2>
            <Link to="/tuition-panel/enquiries" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="p-0 flex-1">
            {enquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">No enquiries found</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {enquiries.slice(0, 4).map((enq: any) => (
                  <div key={enq.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{enq.parent_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{enq.subject} • Class {enq.student_class}</p>
                    </div>
                    <Badge className={enq.status === "new" ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 shadow-none border-0" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-none border-slate-200 dark:border-slate-700"}>
                      {enq.status.charAt(0).toUpperCase() + enq.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Batch Overview</h2>
            <Link to="/tuition-panel/batches" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="p-0 flex-1">
            {batches.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">No batches found</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {batches.slice(0, 4).map((batch: any) => (
                  <div key={batch.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{batch.batch_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{batch.subject} • {batch.current_students}/{batch.max_students} students</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge className={batch.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-none border-0 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 shadow-none border-0"}>
                        {batch.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(batch.current_students / batch.max_students) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col lg:col-span-2">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
            <Link to="/tuition-panel/notifications" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="p-0 flex-1">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.slice(0, 4).map((n: any) => (
                <div key={n.id} className={`p-4 flex items-start gap-3 transition-colors ${n.is_read ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10'}`}>
                  <div className="mt-1 shrink-0">
                    {!n.is_read ? (
                      <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm ${!n.is_read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>{n.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
