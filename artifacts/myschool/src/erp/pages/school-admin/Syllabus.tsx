import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { useAuth } from "@/erp/hooks/use-auth";
import { BookMarked, Plus, Check, Clock, X, ChevronDown, Loader2, Trash2, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: BookOpen },
  completed: { label: "Completed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", icon: Check },
};

export default function Syllabus() {
  const { user } = useAuth();
  const schoolId = user?.schoolId || 1;
  const { toast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", chapter: "", topics: "", plannedDate: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => {
        const cls = d.classes || [];
        setClasses(cls);
        if (cls.length > 0) setSelectedClass(cls[0].id);
      });
  }, [schoolId]);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    fetch(`${BASE}/api/study-materials/syllabus?schoolId=${schoolId}&classId=${selectedClass}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setSyllabus(d.syllabus || [])).finally(() => setLoading(false));
  }, [selectedClass, schoolId]);

  const handleAdd = async () => {
    if (!form.subject || !form.chapter) { toast({ title: "Subject and chapter are required", variant: "destructive" }); return; }
    setSubmitting(true);
    const res = await fetch(`${BASE}/api/study-materials/syllabus`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ ...form, classId: selectedClass, schoolId, isCompleted: false }),
    });
    if (res.ok) {
      const d = await res.json();
      setSyllabus(s => [d.item, ...s]);
      setForm({ subject: "", chapter: "", topics: "", plannedDate: "" });
      setShowForm(false);
      toast({ title: "Topic added!" });
    } else toast({ title: "Failed to add", variant: "destructive" });
    setSubmitting(false);
  };

  const updateStatus = async (id: number, status: string) => {
    const isCompleted = status === "completed";
    const res = await fetch(`${BASE}/api/study-materials/syllabus/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ isCompleted, status }),
    });
    if (res.ok) {
      setSyllabus(s => s.map(item => item.id === id ? { ...item, isCompleted, status } : item));
      toast({ title: `Marked as ${status.replace("_", " ")}` });
    }
  };

  const deleteTopic = async (id: number) => {
    await fetch(`${BASE}/api/study-materials/syllabus/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    setSyllabus(s => s.filter(item => item.id !== id));
    toast({ title: "Topic removed" });
  };

  const grouped = syllabus.reduce((acc, item) => {
    const sub = item.subject || "General";
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const total = syllabus.length;
  const completed = syllabus.filter(s => s.isCompleted).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <AdminLayout title="Syllabus Planner" links={adminLinks}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black dark:text-white">Syllabus Planner</h1>
          <p className="text-muted-foreground text-sm">Manage curriculum and track topic completion</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-2" />Add Topic
        </Button>
      </div>

      {/* Class Selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {classes.map(c => (
          <button key={c.id} onClick={() => setSelectedClass(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedClass === c.id ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {c.name} {c.section}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <Card className="p-4 rounded-2xl mb-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-sm dark:text-white">Overall Progress</p>
            <p className="font-black text-primary">{progress}%</p>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span>{completed} completed</span>
            <span>{total - completed} remaining</span>
            <span>{total} total topics</span>
          </div>
        </Card>
      )}

      {/* Add Topic Form */}
      {showForm && (
        <Card className="p-5 rounded-2xl mb-6 dark:bg-gray-800 dark:border-gray-700 border-primary/20 border-2">
          <h3 className="font-bold mb-4 dark:text-white">Add New Topic</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Subject *</label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics" className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Chapter *</label>
              <Input value={form.chapter} onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))} placeholder="e.g. Chapter 3: Algebra" className="rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Topics / Sub-topics</label>
              <Input value={form.topics} onChange={e => setForm(f => ({ ...f, topics: e.target.value }))} placeholder="e.g. Linear equations, Variables" className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Planned Date</label>
              <Input type="date" value={form.plannedDate} onChange={e => setForm(f => ({ ...f, plannedDate: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAdd} disabled={submitting} className="rounded-xl font-bold">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" />Add Topic</>}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
          </div>
        </Card>
      )}

      {/* Syllabus grouped by subject */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20">
          <BookMarked className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-xl font-bold text-muted-foreground">No syllabus topics yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click "Add Topic" to start building the curriculum</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([subject, items]: [string, any]) => {
            const subCompleted = items.filter((i: any) => i.isCompleted).length;
            return (
              <div key={subject}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-lg dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />{subject}
                  </h3>
                  <Badge variant="secondary" className="font-bold">{subCompleted}/{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((item: any) => {
                    const statusKey = item.isCompleted ? "completed" : item.status === "in_progress" ? "in_progress" : "pending";
                    const cfg = STATUS_CONFIG[statusKey as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                    return (
                      <Card key={item.id} className={`p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700 ${item.isCompleted ? "opacity-75" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-bold dark:text-white ${item.isCompleted ? "line-through text-muted-foreground" : ""}`}>{item.chapter}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                            </div>
                            {item.topics && <p className="text-sm text-muted-foreground mt-0.5">{item.topics}</p>}
                            {item.plannedDate && <p className="text-xs text-muted-foreground mt-1">Planned: {item.plannedDate}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!item.isCompleted && (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => updateStatus(item.id, "in_progress")}
                                  className="h-7 w-7 rounded-lg text-blue-500 hover:bg-blue-50" title="Mark In Progress">
                                  <Clock className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => updateStatus(item.id, "completed")}
                                  className="h-7 w-7 rounded-lg text-green-500 hover:bg-green-50" title="Mark Complete">
                                  <Check className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                            {item.isCompleted && (
                              <Button size="icon" variant="ghost" onClick={() => updateStatus(item.id, "pending")}
                                className="h-7 w-7 rounded-lg text-gray-400 hover:bg-gray-50" title="Reopen">
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" onClick={() => deleteTopic(item.id)}
                              className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
