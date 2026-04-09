import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { adminLinks } from "./admin-links";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Heart, Plus, Search, Loader2, X, Activity, Thermometer, AlertCircle } from "lucide-react";

const BASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const tok = () => localStorage.getItem("myschool_token") || "";

interface HealthRecord {
  id: number;
  studentId: number;
  studentName?: string;
  recordDate: string;
  temperature?: number;
  weight?: number;
  height?: number;
  bloodPressure?: string;
  notes?: string;
  conditions?: string;
  createdAt: string;
}

export default function HealthPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId;
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ studentId: "", recordDate: new Date().toISOString().split("T")[0], temperature: "", weight: "", height: "", bloodPressure: "", notes: "", conditions: "" });

  useEffect(() => {
    if (!schoolId) return;
    Promise.all([
      fetch(`${BASE()}/api/student-health?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
      fetch(`${BASE()}/api/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    ]).then(([h, s]) => {
      setRecords(h.records || []);
      setStudents(s.students || []);
    }).finally(() => setLoading(false));
  }, [schoolId]);

  const save = async () => {
    if (!form.studentId || !form.recordDate) { toast({ title: "Student and date required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const res = await fetch(`${BASE()}/api/student-health`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` }, body: JSON.stringify({ ...form, studentId: Number(form.studentId), schoolId, temperature: form.temperature ? Number(form.temperature) : undefined, weight: form.weight ? Number(form.weight) : undefined, height: form.height ? Number(form.height) : undefined }) });
      if (res.ok) { const d = await res.json(); setRecords(r => [d.record, ...r]); setShowForm(false); setForm({ studentId: "", recordDate: new Date().toISOString().split("T")[0], temperature: "", weight: "", height: "", bloodPressure: "", notes: "", conditions: "" }); toast({ title: "Health record saved!" }); }
      else toast({ title: "Failed to save", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const filtered = records.filter(r => {
    const student = students.find(s => s.id === r.studentId);
    const name = student?.name || r.studentName || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const getStudent = (id: number) => students.find(s => s.id === id);

  return (
    <AdminLayout links={adminLinks} title="Student Health Records">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Student Health</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track and manage student health records</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 rounded-xl font-bold shrink-0"><Plus className="w-4 h-4" />Add Record</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 rounded-xl"><p className="text-2xl font-bold text-foreground">{records.length}</p><p className="text-xs text-muted-foreground mt-0.5">Total Records</p></Card>
        <Card className="p-4 rounded-xl"><p className="text-2xl font-bold text-foreground">{new Set(records.map(r => r.studentId)).size}</p><p className="text-xs text-muted-foreground mt-0.5">Students</p></Card>
        <Card className="p-4 rounded-xl"><p className="text-2xl font-bold text-foreground">{records.filter(r => { const d = new Date(r.recordDate); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length}</p><p className="text-xs text-muted-foreground mt-0.5">This Month</p></Card>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="p-5 rounded-2xl border-2 border-primary/20 bg-primary/5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-foreground">New Health Record</p>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Student *</label>
              <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} className="w-full border border-border rounded-xl p-2.5 text-sm bg-background focus:outline-none focus:border-primary">
                <option value="">Select student...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} — Class {s.className}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Date *</label><Input type="date" value={form.recordDate} onChange={e => setForm(f => ({ ...f, recordDate: e.target.value }))} className="rounded-xl" /></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Temperature (°C)</label><Input type="number" step="0.1" placeholder="e.g. 37.2" value={form.temperature} onChange={e => setForm(f => ({ ...f, temperature: e.target.value }))} className="rounded-xl" /></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Blood Pressure</label><Input placeholder="e.g. 120/80" value={form.bloodPressure} onChange={e => setForm(f => ({ ...f, bloodPressure: e.target.value }))} className="rounded-xl" /></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Weight (kg)</label><Input type="number" step="0.1" placeholder="e.g. 45.0" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} className="rounded-xl" /></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Height (cm)</label><Input type="number" step="0.1" placeholder="e.g. 155" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} className="rounded-xl" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-bold text-muted-foreground block mb-1">Medical Conditions</label><Input placeholder="e.g. Asthma, Diabetes (comma separated)" value={form.conditions} onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))} className="rounded-xl" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-bold text-muted-foreground block mb-1">Notes</label><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:border-primary resize-none" placeholder="Additional notes..." /></div>
          </div>
          <Button onClick={save} disabled={saving} className="mt-4 w-full rounded-xl font-bold">{saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Health Record"}</Button>
        </Card>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by student name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
      </div>

      {/* Records */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-bold">No health records found</p>
          <p className="text-sm mt-1">Add your first record using the button above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const student = getStudent(r.studentId);
            const hasTemp = r.temperature && (r.temperature > 38 || r.temperature < 36);
            return (
              <Card key={r.id} className="p-4 rounded-xl border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasTemp ? "bg-red-100" : "bg-primary/10"}`}>
                    {hasTemp ? <AlertCircle className="w-5 h-5 text-red-600" /> : <Activity className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div><p className="font-bold text-foreground">{student?.name || `Student #${r.studentId}`}</p><p className="text-xs text-muted-foreground">{student ? `Class ${student.className}` : ""} • {new Date(r.recordDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div>
                      {r.conditions && <Badge className="text-xs bg-amber-100 text-amber-700 shrink-0">Has Conditions</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {r.temperature && <span className={`flex items-center gap-1 text-xs font-medium ${hasTemp ? "text-red-600" : "text-muted-foreground"}`}><Thermometer className="w-3 h-3" />{r.temperature}°C</span>}
                      {r.weight && <span className="text-xs text-muted-foreground font-medium">⚖️ {r.weight} kg</span>}
                      {r.height && <span className="text-xs text-muted-foreground font-medium">📏 {r.height} cm</span>}
                      {r.bloodPressure && <span className="text-xs text-muted-foreground font-medium">🩺 {r.bloodPressure}</span>}
                    </div>
                    {r.conditions && <p className="text-xs text-amber-700 mt-1.5 font-medium">Conditions: {r.conditions}</p>}
                    {r.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.notes}</p>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
