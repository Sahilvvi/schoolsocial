import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, BookOpen, IndianRupee, TrendingUp, MessageSquare, Calendar, Bell, Star } from "lucide-react";

export default function TuPDashboard() {
  const { centerData, batches, enquiries, bookings, tutors, notifications } = useOutletContext<any>();

  const totalStudents = batches.reduce((s: number, b: any) => s + b.current_students, 0);
  const totalRevenue = batches.reduce((s: number, b: any) => s + b.current_students * b.fee_per_month, 0);
  const avgOccupancy = Math.round(batches.reduce((s: number, b: any) => s + (b.current_students / b.max_students) * 100, 0) / batches.length);
  const unreadNotifs = notifications.filter((n: any) => !n.is_read).length;

  const stats = [
    { label: "Total Students", value: totalStudents, sub: "across all batches", icon: Users, color: "from-blue-500 to-cyan-500", link: "/tuition-panel/batches" },
    { label: "Active Batches", value: batches.filter((b: any) => b.is_active).length, sub: `${batches.length} total`, icon: BookOpen, color: "from-violet-500 to-purple-500", link: "/tuition-panel/batches" },
    { label: "Monthly Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: "estimated", icon: IndianRupee, color: "from-emerald-500 to-green-500", link: "/tuition-panel/batches" },
    { label: "Avg Occupancy", value: `${avgOccupancy}%`, sub: "batch fill rate", icon: TrendingUp, color: "from-amber-500 to-orange-500", link: "/tuition-panel/batches" },
    { label: "Enquiries", value: enquiries.length, sub: `${enquiries.filter((e: any) => e.status === "new").length} new`, icon: MessageSquare, color: "from-rose-500 to-pink-500", link: "/tuition-panel/enquiries" },
    { label: "Tutors", value: tutors.length, sub: "active tutors", icon: Star, color: "from-cyan-500 to-blue-500", link: "/tuition-panel/tutors" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">{centerData.name}</h1>
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
      </div>
      <p className="text-muted-foreground mb-8">{centerData.location} • Est. {centerData.established}</p>

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
            <CardTitle className="text-lg">Recent Enquiries</CardTitle>
            <Link to="/tuition-panel/enquiries" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enquiries.slice(0, 4).map((enq: any) => (
                <div key={enq.id} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{enq.parent_name}</p>
                    <p className="text-xs text-muted-foreground">{enq.subject} • Class {enq.student_class}</p>
                  </div>
                  <Badge variant={enq.status === "new" ? "default" : "secondary"} className="text-xs">{enq.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <Link to="/tuition-panel/bookings" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.slice(0, 4).map((b: any) => (
                <div key={b.id} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.email}</p>
                  </div>
                  <Badge className={b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"} >{b.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Batch Overview</CardTitle>
            <Link to="/tuition-panel/batches" className="text-sm text-primary hover:underline">View all →</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {batches.slice(0, 4).map((batch: any) => (
                <div key={batch.id} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{batch.batch_name}</p>
                    <p className="text-xs text-muted-foreground">{batch.subject} • {batch.current_students}/{batch.max_students} students</p>
                  </div>
                  <Badge className={batch.is_active ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground"}>
                    {batch.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Link to="/tuition-panel/notifications" className="text-sm text-primary hover:underline">View all →</Link>
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
