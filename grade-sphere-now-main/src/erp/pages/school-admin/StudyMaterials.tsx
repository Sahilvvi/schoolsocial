import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useAuth } from "@/erp/hooks/use-auth";
import { FileText, Plus, Trash2, Loader2, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

export default function StudyMaterials() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [materials, setMaterials] = useState<any[]>([]);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"materials" | "syllabus">("materials");
  const [matOpen, setMatOpen] = useState(false);
  const [sylOpen, setSylOpen] = useState(false);
  const [filterClass, setFilterClass] = useState("all");
  const [matForm, setMatForm] = useState({ classId: "", subject: "", title: "", description: "", fileUrl: "", materialType: "notes" });
  const [sylForm, setSylForm] = useState({ classId: "", subject: "", chapter: "", topics: "", plannedDate: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [mRes, sRes, cRes] = await Promise.all([
      fetch(`${BASE}/api/study-materials?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/study-materials/syllabus?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    setMaterials((await mRes.json()).materials || []);
    setSyllabus((await sRes.json()).syllabus || []);
    setClasses((await cRes.json()).classes || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addMaterial = async () => {
    const res = await fetch(`${BASE}/api/study-materials`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(matForm) });
    if (res.ok) { toast({ title: "Material uploaded!" }); setMatOpen(false); fetchAll(); }
  };

  const addSyllabus = async () => {
    const res = await fetch(`${BASE}/api/study-materials/syllabus`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(sylForm) });
    if (res.ok) { toast({ title: "Syllabus entry added!" }); setSylOpen(false); fetchAll(); }
  };

  const toggleComplete = async (id: number, current: boolean) => {
    await fetch(`${BASE}/api/study-materials/syllabus/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ isCompleted: !current, completedDate: !current ? new Date().toISOString().split("T")[0] : null }) });
    fetchAll();
  };

  const deleteMat = async (id: number) => { await fetch(`${BASE}/api/study-materials/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };
  const deleteSyl = async (id: number) => { await fetch(`${BASE}/api/study-materials/syllabus/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };

  const filteredMats = filterClass === "all" ? materials : materials.filter(m => m.classId === Number(filterClass));
  const filteredSyl = filterClass === "all" ? syllabus : syllabus.filter(s => s.classId === Number(filterClass));

  const TYPE_COLOR: Record<string, string> = { notes: "bg-blue-100 text-blue-700", video: "bg-purple-100 text-purple-700", pdf: "bg-red-100 text-red-700", assignment: "bg-green-100 text-green-700", other: "bg-gray-100 text-gray-700" };

  return (
    <AdminLayout title="Study Materials & Syllabus" links={adminLinks}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {(["materials", "syllabus"] as const).map(t => (
            <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)} className="rounded-xl capitalize">{t === "materials" ? "Study Materials" : "Syllabus Tracker"}</Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-36 dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="All Classes" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Classes</SelectItem>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
          </Select>
          {tab === "materials" && (
            <Dialog open={matOpen} onOpenChange={setMatOpen}>
              <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />Add Material</Button></DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader><DialogTitle>Upload Study Material</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><label className="text-sm font-medium dark:text-gray-300">Class *</label>
                    <Select value={matForm.classId} onValueChange={v => setMatForm(p => ({ ...p, classId: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium dark:text-gray-300">Subject *</label><Input value={matForm.subject} onChange={e => setMatForm(p => ({ ...p, subject: e.target.value }))} placeholder="Mathematics" className="dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div><label className="text-sm font-medium dark:text-gray-300">Type</label>
                      <Select value={matForm.materialType} onValueChange={v => setMatForm(p => ({ ...p, materialType: v }))}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="notes">Notes</SelectItem><SelectItem value="pdf">PDF</SelectItem><SelectItem value="video">Video Link</SelectItem><SelectItem value="assignment">Assignment</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                      </Select></div>
                  </div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Title *</label><Input value={matForm.title} onChange={e => setMatForm(p => ({ ...p, title: e.target.value }))} placeholder="Chapter 5 - Algebra Notes" className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Description</label><Textarea rows={2} value={matForm.description} onChange={e => setMatForm(p => ({ ...p, description: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">File/Link URL</label><Input value={matForm.fileUrl} onChange={e => setMatForm(p => ({ ...p, fileUrl: e.target.value }))} placeholder="https://..." className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <Button onClick={addMaterial} className="w-full">Upload Material</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {tab === "syllabus" && (
            <Dialog open={sylOpen} onOpenChange={setSylOpen}>
              <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />Add Chapter</Button></DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader><DialogTitle>Add Syllabus Entry</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><label className="text-sm font-medium dark:text-gray-300">Class *</label>
                    <Select value={sylForm.classId} onValueChange={v => setSylForm(p => ({ ...p, classId: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium dark:text-gray-300">Subject *</label><Input value={sylForm.subject} onChange={e => setSylForm(p => ({ ...p, subject: e.target.value }))} placeholder="Science" className="dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div><label className="text-sm font-medium dark:text-gray-300">Planned Date</label><Input type="date" value={sylForm.plannedDate} onChange={e => setSylForm(p => ({ ...p, plannedDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  </div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Chapter *</label><Input value={sylForm.chapter} onChange={e => setSylForm(p => ({ ...p, chapter: e.target.value }))} placeholder="Chapter 3 - Photosynthesis" className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Topics</label><Textarea rows={2} value={sylForm.topics} onChange={e => setSylForm(p => ({ ...p, topics: e.target.value }))} placeholder="Topics covered in this chapter..." className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <Button onClick={addSyllabus} className="w-full">Add Chapter</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <>
          {tab === "materials" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMats.length === 0 ? <div className="col-span-2 text-center py-16 text-muted-foreground"><FileText className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No materials uploaded yet</p></div>
              : filteredMats.map(m => (
                <Card key={m.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-primary" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm dark:text-white">{m.title}</p>
                          <Badge className={`text-xs rounded-full ${TYPE_COLOR[m.materialType] || TYPE_COLOR.other}`}>{m.materialType}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{m.subject}</p>
                        {m.description && <p className="text-xs text-muted-foreground mt-1">{m.description}</p>}
                        {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"><Download className="w-3 h-3" />View/Download</a>}
                      </div>
                    </div>
                    <button onClick={() => deleteMat(m.id)} className="text-red-400 hover:text-red-600 ml-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {tab === "syllabus" && (
            <div className="space-y-3">
              {filteredSyl.length === 0 ? <div className="text-center py-16 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No syllabus entries yet</p></div>
              : filteredSyl.map(s => (
                <Card key={s.id} className={`p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700 border-l-4 ${s.isCompleted ? "border-l-green-500" : "border-l-blue-500"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm dark:text-white">{s.chapter}</p>
                        <Badge variant="outline" className="text-xs rounded-full">{s.subject}</Badge>
                        {s.isCompleted && <Badge className="text-xs rounded-full bg-green-100 text-green-700">Completed</Badge>}
                      </div>
                      {s.topics && <p className="text-xs text-muted-foreground">{s.topics}</p>}
                      {s.plannedDate && <p className="text-xs text-muted-foreground mt-1">Planned: {s.plannedDate}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant={s.isCompleted ? "outline" : "default"} onClick={() => toggleComplete(s.id, s.isCompleted)} className="rounded-lg h-8 text-xs">{s.isCompleted ? "Mark Pending" : "Mark Done"}</Button>
                      <button onClick={() => deleteSyl(s.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
