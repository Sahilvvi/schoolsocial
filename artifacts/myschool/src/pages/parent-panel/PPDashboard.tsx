import { useOutletContext, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ClipboardList, Heart, BookOpen, Bell, IndianRupee, ArrowUpRight, Sparkles
} from "lucide-react";

const STAT_COLORS = [
  { text: "text-blue-600",   bg: "bg-blue-50",   ring: "ring-blue-100"   },
  { text: "text-pink-600",   bg: "bg-pink-50",   ring: "ring-pink-100"   },
  { text: "text-violet-600", bg: "bg-violet-50", ring: "ring-violet-100" },
  { text: "text-emerald-600",bg: "bg-emerald-50",ring: "ring-emerald-100"},
];

export default function PPDashboard() {
  const { displayName, admissions, bookings, saved, notifications, homework, fees } = useOutletContext<any>();

  const pendingAdmissions = admissions.filter((a: any) => a.status === "pending").length;
  const unreadNotifs = notifications.filter((n: any) => !n.is_read).length;

  const stats = [
    { label: "Applications", value: admissions.length, sub: pendingAdmissions > 0 ? `${pendingAdmissions} pending` : "All processed", icon: ClipboardList, link: "/parent-panel/admissions" },
    { label: "Saved Schools", value: saved.length, sub: "bookmarked",  icon: Heart,         link: "/parent-panel/saved"      },
    { label: "Tutors",        value: bookings.length, sub: "bookings", icon: BookOpen,       link: "/parent-panel/bookings"   },
    { label: "Fees",          value: fees.length,    sub: "records",   icon: IndianRupee,    link: "/parent-panel/fees"       },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome, <span className="text-primary">{displayName}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track your children's education journey</p>
        </div>
        {unreadNotifs > 0 && (
          <Link to="/parent-panel/notifications">
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/12 transition-colors">
              <Bell className="h-4 w-4" />
              {unreadNotifs} new notification{unreadNotifs > 1 ? "s" : ""}
            </div>
          </Link>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const c = STAT_COLORS[i % STAT_COLORS.length];
          return (
            <Link to={s.link} key={s.label}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mb-0.5 tabular-nums">{s.value}</p>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{s.sub}</span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Lower panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">Recent Admissions</h2>
            </div>
            <Link to="/parent-panel/admissions" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex-1">
            {admissions.length === 0 ? (
              <div className="p-10 text-center">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400 font-medium">No applications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {admissions.slice(0, 3).map((a: any) => (
                  <div key={a.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{a.student_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{a.schools?.name} · Grade {a.grade}</p>
                    </div>
                    <Badge className={`text-[10px] font-bold shadow-none border-0 px-2 py-0.5 ${
                      a.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                      a.status === "pending"  ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fee Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">Fee Status</h2>
            </div>
            <Link to="/parent-panel/fees" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex-1">
            {fees.length === 0 ? (
              <div className="p-10 text-center">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <IndianRupee className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400 font-medium">No fee records found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {fees.slice(0, 3).map((fee: any) => (
                  <div key={fee.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{fee.fee_type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{fee.person_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900">₹{fee.amount.toLocaleString()}</p>
                      <Badge className={`mt-1 text-[10px] font-bold shadow-none border-0 px-2 py-0.5 ${
                        fee.status === "paid"    ? "bg-emerald-100 text-emerald-700" :
                        fee.status === "overdue" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {fee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Bell className="h-4 w-4 text-violet-600" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">Notifications</h2>
              {unreadNotifs > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-extrabold">
                  {unreadNotifs}
                </span>
              )}
            </div>
            <Link to="/parent-panel/notifications" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex-1">
            <div className="divide-y divide-slate-100">
              {notifications.slice(0, 4).map((n: any) => (
                <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3.5 transition-colors ${
                  n.is_read ? "hover:bg-slate-50" : "bg-primary/4 hover:bg-primary/6"
                }`}>
                  <div className="mt-1.5 shrink-0">
                    <div className={`h-2 w-2 rounded-full ${n.is_read ? "bg-slate-300" : "bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!n.is_read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.is_read && (
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                        <Sparkles className="h-2.5 w-2.5" /> New
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
