import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ClipboardList, Plus, Loader2, Eye, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

interface Props { schoolId: number; teacherId: number; }

export default function TeacherAssignments({ schoolId, teacherId }: Props) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewSubs, setViewSubs] = useState<{ assignment: any; subs: any[] } | null>(null);
  const [form, setForm] = useState({ classId: "", subject: "", title: "", description: "", dueDate: "", maxMarks: "100", assignmentType: "project" });
  const [gradeForm, setGradeForm] = useState<Record<number, { marks: string; feedback: string }>>({});

  const fetchAll = async () => {
    setLoading(true);
    const [aRes, cRes] = await Promise.all([
      fetch(`${BASE}/api/assignments?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    setAssignments((await aRes.json()).assignments || []);
    setClasses((await cRes.json()).classes || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const add = async () => {
    const res = await fetch(`${BASE}/api/assignments`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ ...form, schoolId, teacherId }) });
    if (res.ok) { toast({ title: "Assignment created!" }); setOpen(false); fetchAll(); }
  };

  const viewSubmissions = async (a: any) => {
    const res = await fetch(`${BASE}/api/assignments/${a.id}/submissions`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    setViewSubs({ assignment: a, subs: data.submissions || [] });
  };

  const grade = async (assignmentId: number, subId: number) => {
    const g = gradeForm[subId];
    if (!g) return;
    await fetch(`${BASE}/api/assignments/${assignmentId}/submissions/${subId}/grade`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ marks: Number(g.marks), feedback: g.feedback }) });
    toast({ title: "Graded!" }); if (viewSubs) viewSubmissions(viewSubs.assignment);
  };

  const del = async (id: number) => { await fetch(`${BASE}/api/assignments/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />New Assignment</Button></DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader><DialogTitle>Create Assignment</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><label className="text-sm font-medium dark:text-gray-300">Class *</label>
                <Select value={form.classId} onValueChange={v => setForm(p => ({ ...p, classId: v }))}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium dark:text-gray-300">Subject</label><Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Mathematics" className="dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="text-sm font-medium dark:text-gray-300">Type</label>
                  <Select value={form.assignmentType} onValueChange={v => setForm(p => ({ ...p, assignmentType: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="project">Project</SelectItem><SelectItem value="essay">Essay</SelectItem><SelectItem value="lab">Lab</SelectItem><SelectItem value="presentation">Presentation</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                  </Select></div>
              </div>
              <div><label className="text-sm font-medium dark:text-gray-300">Title *</label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Assignment title" className="dark:bg-gray-700 dark:border-gray-600" /></div>
              <div><label className="text-sm font-medium dark:text-gray-300">Description</label><Textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium dark:text-gray-300">Due Date</label><Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="text-sm font-medium dark:text-gray-300">Max Marks</label><Input type="number" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
              </div>
              <Button onClick={add} className="w-full">Create Assignment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      : assignments.length === 0 ? <div className="text-center py-16 text-muted-foreground"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No assignments created yet</p></div>
      : assignments.map(a => (
        <Card key={a.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold dark:text-white">{a.title}</p>
                <Badge variant="outline" className="text-xs rounded-full">{a.subject}</Badge>
                <Badge variant="outline" className="text-xs rounded-full capitalize">{a.assignmentType}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Due: {a.dueDate} • Max: {a.maxMarks} marks</p>
              {a.description && <p className="text-xs text-muted-foreground mt-1">{a.description}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => viewSubmissions(a)} className="rounded-lg h-8 text-xs"><Eye className="w-3 h-3 mr-1" />Submissions</Button>
              <button onClick={() => del(a.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          {viewSubs !== null && viewSubs.assignment?.id === a.id && (
            <div className="mt-3 pt-3 border-t dark:border-gray-700">
              <p className="text-sm font-bold mb-2 dark:text-white">{viewSubs.subs.length} Submissions</p>
              <div className="space-y-2">
                {viewSubs.subs.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-white">{s.studentName}</p>
                      {s.note && <p className="text-xs text-muted-foreground">{s.note}</p>}
                      {s.feedback && <p className="text-xs text-green-600">Feedback: {s.feedback}</p>}
                    </div>
                    <Badge className={`text-xs rounded-full ${s.status === "graded" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{s.status === "graded" ? `${s.marksObtained}/${a.maxMarks}` : s.status}</Badge>
                    {s.status !== "graded" && (
                      <div className="flex gap-1 items-center">
                        <Input type="number" placeholder="Marks" value={gradeForm[s.id]?.marks || ""} onChange={e => setGradeForm(p => ({ ...p, [s.id]: { ...p[s.id], marks: e.target.value } }))} className="w-16 h-7 text-xs dark:bg-gray-700" />
                        <Input placeholder="Feedback" value={gradeForm[s.id]?.feedback || ""} onChange={e => setGradeForm(p => ({ ...p, [s.id]: { ...p[s.id], feedback: e.target.value } }))} className="w-28 h-7 text-xs dark:bg-gray-700" />
                        <Button size="sm" onClick={() => grade(a.id, s.id)} className="h-7 text-xs rounded-lg"><Star className="w-3 h-3" /></Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button size="sm" variant="ghost" onClick={() => setViewSubs(null)} className="mt-2 text-xs">Hide</Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
