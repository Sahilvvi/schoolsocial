import { useOutletContext, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Heart, BookOpen, Bell, Calendar, Star, FileText, IndianRupee, Clock, ArrowUpRight } from "lucide-react";

export default function PPDashboard() {
  const { displayName, admissions, bookings, saved, notifications, homework, fees } = useOutletContext<any>();

  const pendingAdmissions = admissions.filter((a: any) => a.status === "pending").length;
  const unreadNotifs = notifications.filter((n: any) => !n.is_read).length;

  const stats = [
    { label: "Applications", value: admissions.length, sub: pendingAdmissions > 0 ? `${pendingAdmissions} pending` : "All processed", icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-500/10", link: "/parent-panel/admissions" },
    { label: "Saved Schools", value: saved.length, sub: "bookmarked", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10", link: "/parent-panel/saved" },
    { label: "Tutors", value: bookings.length, sub: "bookings", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10", link: "/parent-panel/bookings" },
    { label: "Fees", value: fees.length, sub: "records", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10", link: "/parent-panel/fees" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {displayName}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your children's education journey</p>
        </div>
        {unreadNotifs > 0 && (
          <Link to="/parent-panel/notifications" className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            <Bell className="h-4 w-4" />
            {unreadNotifs} new notifications
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Link to={s.link} key={s.label}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-all group h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{s.label}</p>
                  <span className="text-[10px] text-slate-400">{s.sub}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Admissions</h2>
            <Link to="/parent-panel/admissions" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="p-0 flex-1">
            {admissions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">No applications found</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {admissions.slice(0, 3).map((a: any) => (
                  <div key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{a.student_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.schools?.name} • Grade {a.grade}</p>
                    </div>
                    <Badge className={a.status === "approved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none border-0 dark:bg-emerald-500/10 dark:text-emerald-400" : 
                                     a.status === "pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-100 shadow-none border-0 dark:bg-amber-500/10 dark:text-amber-400" : "shadow-none border-0"}>
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fee Status</h2>
            <Link to="/parent-panel/fees" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="p-0 flex-1">
            {fees.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">No fee records found</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {fees.slice(0, 3).map((fee: any) => (
                  <div key={fee.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{fee.fee_type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{fee.person_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">₹{fee.amount.toLocaleString()}</p>
                      <Badge className={`mt-1 text-[10px] shadow-none border-0 px-1.5 py-0 ${fee.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : fee.status === "overdue" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>{fee.status}</Badge>
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
            <Link to="/parent-panel/notifications" className="text-sm text-primary font-medium hover:underline">View all</Link>
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
