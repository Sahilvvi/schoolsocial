import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { adminLinks } from "./admin-links";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, IndianRupee, TrendingUp, TrendingDown, PieChart, Download, Filter } from "lucide-react";

const BASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const tok = () => localStorage.getItem("myschool_token") || "";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function FinancialReports() {
  const { user } = useAuth();
  const schoolId = user?.schoolId;
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(-1);

  useEffect(() => {
    if (!schoolId) return;
    Promise.all([
      fetch(`${BASE()}/api/fees?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
      fetch(`${BASE()}/api/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    ]).then(([f, s]) => { setFees(f.fees || []); setStudents(s.students || []); }).finally(() => setLoading(false));
  }, [schoolId]);

  const filtered = fees.filter(f => {
    const d = new Date(f.createdAt || f.paidAt || f.dueDate);
    if (filterMonth >= 0 && d.getMonth() !== filterMonth) return false;
    if (d.getFullYear() !== filterYear) return false;
    return true;
  });

  const paid = filtered.filter(f => f.status === "paid");
  const pending = filtered.filter(f => f.status !== "paid");
  const totalCollected = paid.reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const totalPending = pending.reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const totalAmount = filtered.reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const collectionRate = totalAmount > 0 ? Math.round((totalCollected / totalAmount) * 100) : 0;

  // Monthly breakdown
  const monthlyData = MONTHS.map((m, mi) => {
    const monthFees = fees.filter(f => {
      const d = new Date(f.createdAt || f.paidAt || f.dueDate);
      return d.getFullYear() === filterYear && d.getMonth() === mi;
    });
    return { month: m, collected: monthFees.filter(f => f.status === "paid").reduce((s, f) => s + Number(f.amount || 0), 0), pending: monthFees.filter(f => f.status !== "paid").reduce((s, f) => s + Number(f.amount || 0), 0) };
  });
  const maxBar = Math.max(...monthlyData.map(d => d.collected + d.pending), 1);

  // Top defaulters
  const studentPending: Record<number, number> = {};
  pending.forEach(f => { if (f.studentId) studentPending[f.studentId] = (studentPending[f.studentId] || 0) + Number(f.amount || 0); });
  const defaulters = Object.entries(studentPending).map(([id, amt]) => ({ student: students.find(s => s.id === Number(id)), amount: amt })).filter(d => d.student).sort((a, b) => b.amount - a.amount).slice(0, 5);

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

  const exportCSV = () => {
    const rows = [["Student", "Amount", "Status", "Type", "Due Date", "Paid At"]];
    filtered.forEach(f => {
      const s = students.find(st => st.id === f.studentId);
      rows.push([s?.name || f.studentId, f.amount, f.status, f.feeType || "", f.dueDate || "", f.paidAt || ""]);
    });
    const csv = rows.map(r => r.map(String).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `fee-report-${filterYear}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <AdminLayout links={adminLinks} title="Financial Reports"><div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout links={adminLinks} title="Financial Reports">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Financial Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fee collection analytics and insights</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="gap-2 rounded-xl font-bold shrink-0"><Download className="w-4 h-4" />Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select value={filterYear} onChange={e => setFilterYear(Number(e.target.value))} className="border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary">
          {[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filterMonth} onChange={e => setFilterMonth(Number(e.target.value))} className="border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary">
          <option value={-1}>All Months</option>
          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="p-4 rounded-xl border-green-200 bg-green-50/50 dark:bg-green-900/10">
          <div className="flex items-center gap-2 mb-1"><IndianRupee className="w-4 h-4 text-green-600" /><p className="text-xs font-bold text-green-600 uppercase tracking-wide">Collected</p></div>
          <p className="text-2xl font-bold text-green-700">{fmt(totalCollected)}</p>
          <p className="text-xs text-green-600 mt-0.5">{paid.length} payments</p>
        </Card>
        <Card className="p-4 rounded-xl border-red-200 bg-red-50/50 dark:bg-red-900/10">
          <div className="flex items-center gap-2 mb-1"><IndianRupee className="w-4 h-4 text-red-500" /><p className="text-xs font-bold text-red-500 uppercase tracking-wide">Pending</p></div>
          <p className="text-2xl font-bold text-red-600">{fmt(totalPending)}</p>
          <p className="text-xs text-red-500 mt-0.5">{pending.length} unpaid</p>
        </Card>
        <Card className="p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-primary" /><p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Total</p></div>
          <p className="text-2xl font-bold text-foreground">{fmt(totalAmount)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} records</p>
        </Card>
        <Card className="p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1"><PieChart className="w-4 h-4 text-primary" /><p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Rate</p></div>
          <p className={`text-2xl font-bold ${collectionRate >= 75 ? "text-green-600" : collectionRate >= 50 ? "text-amber-600" : "text-red-600"}`}>{collectionRate}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">Collection rate</p>
        </Card>
      </div>

      {/* Monthly Bar Chart */}
      <Card className="p-5 rounded-2xl border-border shadow-sm mb-6">
        <p className="font-bold text-foreground mb-4">Monthly Fee Collection — {filterYear}</p>
        <div className="space-y-2">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <p className="text-xs font-bold text-muted-foreground w-7 shrink-0">{d.month}</p>
              <div className="flex-1 flex gap-1 h-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {d.collected > 0 && <div className="bg-green-500 rounded-lg transition-all" style={{ width: `${(d.collected / maxBar) * 100}%` }} title={`Collected: ${fmt(d.collected)}`} />}
                {d.pending > 0 && <div className="bg-red-400 rounded-lg transition-all" style={{ width: `${(d.pending / maxBar) * 100}%` }} title={`Pending: ${fmt(d.pending)}`} />}
              </div>
              <p className="text-xs text-muted-foreground w-14 text-right shrink-0">{fmt(d.collected + d.pending)}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs text-muted-foreground">Collected</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-400" /><span className="text-xs text-muted-foreground">Pending</span></div>
        </div>
      </Card>

      {/* Top Defaulters */}
      {defaulters.length > 0 && (
        <Card className="p-5 rounded-2xl border-border shadow-sm mb-6">
          <p className="font-bold text-foreground mb-4">Top Pending Amounts</p>
          <div className="space-y-3">
            {defaulters.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{i + 1}</div>
                  <div><p className="font-bold text-sm text-foreground">{d.student.name}</p><p className="text-xs text-muted-foreground">Class {d.student.className}</p></div>
                </div>
                <Badge className="bg-red-100 text-red-700 font-bold">{fmt(d.amount)}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detailed Table */}
      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border"><p className="font-bold text-foreground">Fee Records ({filtered.length})</p></div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground"><IndianRupee className="w-10 h-10 mx-auto mb-2 opacity-20" /><p className="font-bold">No fee records for this period</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50"><tr><th className="text-left p-3 font-bold text-muted-foreground text-xs">Student</th><th className="text-left p-3 font-bold text-muted-foreground text-xs">Type</th><th className="text-right p-3 font-bold text-muted-foreground text-xs">Amount</th><th className="text-left p-3 font-bold text-muted-foreground text-xs">Due</th><th className="text-left p-3 font-bold text-muted-foreground text-xs">Status</th></tr></thead>
              <tbody>
                {filtered.slice(0, 50).map(f => {
                  const student = students.find(s => s.id === f.studentId);
                  return (<tr key={f.id} className="border-t border-border hover:bg-secondary/30 transition-colors"><td className="p-3"><p className="font-medium text-foreground">{student?.name || `#${f.studentId}`}</p>{student?.className && <p className="text-xs text-muted-foreground">Class {student.className}</p>}</td><td className="p-3 text-muted-foreground">{f.feeType || "Fee"}</td><td className="p-3 text-right font-bold text-foreground">₹{Number(f.amount).toLocaleString("en-IN")}</td><td className="p-3 text-muted-foreground">{f.dueDate ? new Date(f.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</td><td className="p-3"><Badge className={`text-xs ${f.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{f.status}</Badge></td></tr>);
                })}
              </tbody>
            </table>
            {filtered.length > 50 && <div className="p-3 text-center text-xs text-muted-foreground border-t border-border">Showing 50 of {filtered.length} records. Export CSV to see all.</div>}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
