import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { CalendarCheck, Users, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "@/erp/hooks/use-auth";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";
const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];

export default function AttendanceReports() {
  const { user } = useAuth();
  const schoolId = user?.schoolId;
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    Promise.all([
      fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
      fetch(`${BASE}/api/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
    ]).then(([cd, sd]) => { setClasses(cd.classes || []); setStudents(sd.students || []); });
  }, [schoolId]);

  useEffect(() => {
    if (!schoolId) return;
    setLoading(true);
    const [yr, mo] = month.split("-");
    const lastDay = new Date(Number(yr), Number(mo), 0).getDate();
    const startDate = `${month}-01`;
    const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;
    const classParam = selectedClass !== "all" ? `&classId=${selectedClass}` : "";
    fetch(`${BASE}/api/attendance?schoolId=${schoolId}${classParam}&startDate=${startDate}&endDate=${endDate}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setAttendance(d.attendance || [])).finally(() => setLoading(false));
  }, [schoolId, selectedClass, month]);

  const filteredStudents = selectedClass !== "all" ? students.filter(s => String(s.classId) === selectedClass) : students;
  const present = attendance.filter(a => a.status === "present").length;
  const absent = attendance.filter(a => a.status === "absent").length;
  const late = attendance.filter(a => a.status === "late").length;
  const total = attendance.length;
  const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0;

  // Per-student summary
  const studentSummary = filteredStudents.map(s => {
    const sAtt = attendance.filter(a => a.studentId === s.id);
    const sPresent = sAtt.filter(a => a.status === "present").length;
    const sTotal = sAtt.length;
    const pct = sTotal > 0 ? Math.round((sPresent / sTotal) * 100) : 0;
    return { id: s.id, name: s.name, present: sPresent, absent: sAtt.filter(a => a.status === "absent").length, total: sTotal, pct };
  }).filter(s => s.total > 0).sort((a, b) => b.pct - a.pct);

  // Daily chart data
  const dayMap = new Map<string, { present: number; absent: number }>();
  attendance.forEach(a => {
    const existing = dayMap.get(a.date) || { present: 0, absent: 0 };
    if (a.status === "present") existing.present++;
    else if (a.status === "absent") existing.absent++;
    dayMap.set(a.date, existing);
  });
  const chartData = Array.from(dayMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({
    date: new Date(date).getDate().toString(),
    present: v.present,
    absent: v.absent,
  }));

  const pieData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Late", value: late },
  ].filter(d => d.value > 0);

  return (
    <AdminLayout title="Attendance Reports" links={adminLinks}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Attendance Reports & Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Monthly attendance summary with charts and per-student breakdown</p>
      </div>
      <div className="flex gap-3 mb-6 flex-wrap">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48 rounded-xl dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Classes</SelectItem>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name} {c.section}</SelectItem>)}</SelectContent>
        </Select>
        <Input type="month" value={month} onChange={e => setMonth(e.target.value)} className="w-44 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Overall Attendance", value: `${attendancePct}%`, color: "text-primary", bg: "bg-primary/10", icon: TrendingUp },
          { label: "Present", value: present, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", icon: CalendarCheck },
          { label: "Absent", value: absent, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", icon: TrendingDown },
          { label: "Students Tracked", value: filteredStudents.length, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", icon: Users },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <Card key={label} className="p-4 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-2`}><Icon className={`w-4 h-4 ${color}`} /></div>
            <div className={`text-2xl font-black ${color}`}>{loading ? "..." : value}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{label}</div>
          </Card>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-5 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-bold dark:text-white mb-4">Daily Attendance — {month}</h3>
          {loading ? <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div> : chartData.length === 0 ? <div className="h-48 flex items-center justify-center text-muted-foreground">No data for selected period</div> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="present" fill="#22c55e" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="p-5 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-bold dark:text-white mb-4">Status Breakdown</h3>
          {pieData.length === 0 ? <div className="h-48 flex items-center justify-center text-muted-foreground">No data</div> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
      {/* Per-student table */}
      {studentSummary.length > 0 && (
        <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700"><h3 className="font-bold dark:text-white">Student-wise Breakdown</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50"><tr>
                <th className="text-left px-4 py-3 font-semibold dark:text-gray-300">Student</th>
                <th className="text-center px-4 py-3 font-semibold dark:text-gray-300">Present</th>
                <th className="text-center px-4 py-3 font-semibold dark:text-gray-300">Absent</th>
                <th className="text-center px-4 py-3 font-semibold dark:text-gray-300">Total Days</th>
                <th className="text-center px-4 py-3 font-semibold dark:text-gray-300">Attendance %</th>
                <th className="text-center px-4 py-3 font-semibold dark:text-gray-300">Status</th>
              </tr></thead>
              <tbody>{studentSummary.map(s => (
                <tr key={s.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium dark:text-white">{s.name}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-bold">{s.present}</td>
                  <td className="px-4 py-3 text-center text-red-600 font-bold">{s.absent}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{s.total}</td>
                  <td className="px-4 py-3 text-center font-bold dark:text-white">{s.pct}%</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`text-xs rounded-full ${s.pct >= 75 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : s.pct >= 60 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                      {s.pct >= 75 ? "Good" : s.pct >= 60 ? "Low" : "Critical"}
                    </Badge>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
}
