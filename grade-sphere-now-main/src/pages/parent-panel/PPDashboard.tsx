import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Heart, BookOpen, Bell, Calendar, Star, FileText, IndianRupee, Clock } from "lucide-react";

export default function PPDashboard() {
  const { displayName, admissions, bookings, saved, notifications, homework, fees } = useOutletContext<any>();

  const pendingAdmissions = admissions.filter((a: any) => a.status === "pending").length;
  const unreadNotifs = notifications.filter((n: any) => !n.is_read).length;

  const stats = [
    { label: "Admissions", value: admissions.length, sub: `${pendingAdmissions} pending`, icon: ClipboardList, color: "from-blue-500 to-cyan-500", link: "/parent-panel/admissions" },
    { label: "Saved Schools", value: saved.length, sub: "schools saved", icon: Heart, color: "from-rose-500 to-pink-500", link: "/parent-panel/saved" },
    { label: "Tutor Bookings", value: bookings.length, sub: `${bookings.filter((b: any) => b.status === "confirmed").length} confirmed`, icon: BookOpen, color: "from-violet-500 to-purple-500", link: "/parent-panel/bookings" },
    { label: "Fee Records", value: fees.length, sub: `${fees.filter((f: any) => f.status === "overdue").length} overdue`, icon: IndianRupee, color: "from-emerald-500 to-green-500", link: "/parent-panel/fees" },
    { label: "Homework", value: homework.length, sub: "pending items", icon: FileText, color: "from-amber-500 to-orange-500", link: "/parent-panel/children" },
    { label: "Notifications", value: unreadNotifs, sub: "unread", icon: Bell, color: "from-cyan-500 to-blue-500", link: "/parent-panel/notifications" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
      </div>
      <p className="text-muted-foreground mb-8">Track admissions, saved schools, and tutor bookings — all in one place</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link to={s.link} key={s.label}>
            <Card className="border-border/30 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shrink-0`}>
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  {s.sub && <p className="text-[10px] text-muted-foreground/60">{s.sub}</p>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Admissions</CardTitle>
            <Link to="/parent-panel/admissions" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {admissions.slice(0, 3).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{a.student_name} — Grade {a.grade}</p>
                    <p className="text-xs text-muted-foreground">{a.schools?.name}</p>
                  </div>
                  <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"} className="text-xs">{a.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Homework</CardTitle>
            <Link to="/parent-panel/children" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {homework.map((hw: any) => (
                <div key={hw.id} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{hw.title}</p>
                    <p className="text-xs text-muted-foreground">{hw.subject} • {hw.class_name}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(hw.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Fee Records</CardTitle>
            <Link to="/parent-panel/fees" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fees.slice(0, 3).map((fee: any) => (
                <div key={fee.id} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{fee.fee_type}</p>
                    <p className="text-xs text-muted-foreground">{fee.person_name} • ₹{fee.amount.toLocaleString()}</p>
                  </div>
                  <Badge className={fee.status === "paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : fee.status === "overdue" ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"}>{fee.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Link to="/parent-panel/notifications" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((n: any) => (
                <div key={n.id} className="flex items-center gap-3 border-b border-border/20 pb-3 last:border-0">
                  {!n.is_read && <div className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />}
                  <div>
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
