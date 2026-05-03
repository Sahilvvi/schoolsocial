import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { useAuth } from "@/erp/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/erp/hooks/use-toast";
import { ClipboardList, Plus, Search, Loader2, X, Filter } from "lucide-react";

const BASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const tok = () => localStorage.getItem("myschool_token") || "";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  description?: string;
  dueDate?: string;
  classId?: number;
  className?: string;
  teacherId?: number;
  teacherName?: string;
  createdAt: string;
}

export default function HomeworkAdmin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", description: "", dueDate: "", classId: "", teacherId: "" });

  useEffect(() => {
    if (!schoolId) return;
    Promise.all([
      fetch(`${BASE()}/api/assignments?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
      fetch(`${BASE()}/api/teachers?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
      fetch(`${BASE()}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } }).then(r => r.json()),
    ]).then(([a, t, c]) => { setAssignments(a.assignments || []); setTeachers(t.teachers || []); setClasses(c.classes || []); }).finally(() => setLoading(false));
  }, [schoolId]);

  const save = async () => {
    if (!form.title || !form.subject) { toast({ title: "Title and subject required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const res = await fetch(`${BASE()}/api/assignments`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` }, body: JSON.stringify({ ...form, schoolId, classId: form.classId ? Number(form.classId) : undefined, teacherId: form.teacherId ? Number(form.teacherId) : undefined }) });
      if (res.ok) { const d = await res.json(); setAssignments(a => [d.assignment, ...a]); setShowForm(false); setForm({ title: "", subject: "", description: "", dueDate: "", classId: "", teacherId: "" }); toast({ title: "Assignment created!" }); }
      else toast({ title: "Failed to create", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const deleteAssignment = async (id: number) => {
    if (!confirm("Delete this assignment?")) return;
    const res = await fetch(`${BASE()}/api/assignments/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } });
    if (res.ok) { setAssignments(a => a.filter(x => x.id !== id)); toast({ title: "Deleted" }); }
  };

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase());
    const matchClass = !filterClass || String(a.classId) === filterClass;
    return matchSearch && matchClass;
  });
  const now = new Date();

  return (
    <AdminLayout links={adminLinks} title="Homework & Assignments">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Homework Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Oversee all class assignments and homework</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 rounded-xl font-bold shrink-0"><Plus className="w-4 h-4" />Add Assignment</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 rounded-xl"><p className="text-2xl font-bold text-foreground">{assignments.length}</p><p className="text-xs text-muted-foreground">Total</p></Card>
        <Card className="p-4 rounded-xl"><p className="text-2xl font-bold text-amber-600">{assignments.filter(a => a.dueDate && new Date(a.dueDate) >= now).length}</p><p className="text-xs text-muted-foreground">Upcoming</p></Card>
        <Card className="p-4 rounded-xl"><p className="text-2xl font-bold text-red-500">{assignments.filter(a => a.dueDate && new Date(a.dueDate) < now).length}</p><p className="text-xs text-muted-foreground">Past Due</p></Card>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="p-5 rounded-2xl border-2 border-primary/20 bg-primary/5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-foreground">New Assignment</p>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Title *</label><Input placeholder="e.g. Chapter 5 Questions" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="rounded-xl" /></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Subject *</label><Input placeholder="e.g. Mathematics" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="rounded-xl" /></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Class</label>
              <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))} className="w-full border border-border rounded-xl p-2.5 text-sm bg-background focus:outline-none focus:border-primary">
                <option value="">All classes</option>
                {classes.map(c => <option key={c.id} value={c.id}>Class {c.name}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Teacher</label>
              <select value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))} className="w-full border border-border rounded-xl p-2.5 text-sm bg-background focus:outline-none focus:border-primary">
                <option value="">Select teacher</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Due Date</label><Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="rounded-xl" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-bold text-muted-foreground block mb-1">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:border-primary resize-none" placeholder="Assignment details..." /></div>
          </div>
          <Button onClick={save} disabled={saving} className="mt-4 w-full rounded-xl font-bold">{saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Create Assignment"}</Button>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search title or subject..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="border border-border rounded-xl px-3 text-sm bg-background focus:outline-none focus:border-primary">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>Class {c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No assignments found</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const isOverdue = a.dueDate && new Date(a.dueDate) < now;
            const teacher = teachers.find(t => t.id === a.teacherId);
            return (
              <Card key={a.id} className={`p-4 rounded-xl shadow-sm ${isOverdue ? "border-red-200 bg-red-50/50 dark:bg-red-900/10" : "border-border"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><ClipboardList className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="font-bold text-foreground">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.subject}{a.className ? ` • Class ${a.className}` : ""}{teacher ? ` • ${teacher.name}` : ""}</p>
                      {a.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {a.dueDate && <Badge className={`text-xs ${isOverdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{isOverdue ? "Overdue" : "Due"}: {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</Badge>}
                    <button onClick={() => deleteAssignment(a.id)} className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"><X className="w-3 h-3" /></button>
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
