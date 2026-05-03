import { useState, useEffect } from "react";
import { FileText, Plus, Loader2, Trash2, Download, BookOpen } from "lucide-react";
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

export default function TeacherMaterials({ schoolId, teacherId }: Props) {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"materials" | "syllabus">("materials");
  const [matOpen, setMatOpen] = useState(false);
  const [matForm, setMatForm] = useState({ classId: "", subject: "", title: "", description: "", fileUrl: "", materialType: "notes" });

  const fetchAll = async () => {
    setLoading(true);
    const [mRes, sRes, cRes] = await Promise.all([
      fetch(`${BASE}/api/study-materials?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/study-materials/syllabus?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    setMaterials((await mRes.json()).materials?.filter((m: any) => m.teacherId === teacherId) || []);
    setSyllabus((await sRes.json()).syllabus?.filter((s: any) => s.teacherId === teacherId) || []);
    setClasses((await cRes.json()).classes || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addMat = async () => {
    const res = await fetch(`${BASE}/api/study-materials`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ ...matForm, schoolId, teacherId }) });
    if (res.ok) { toast({ title: "Material added!" }); setMatOpen(false); fetchAll(); }
  };

  const del = async (id: number) => { await fetch(`${BASE}/api/study-materials/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };
  const toggleSyl = async (id: number, done: boolean) => { await fetch(`${BASE}/api/study-materials/syllabus/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ isCompleted: !done }) }); fetchAll(); };

  const TYPE_COLOR: Record<string, string> = { notes: "bg-blue-100 text-blue-700", pdf: "bg-red-100 text-red-700", video: "bg-purple-100 text-purple-700", assignment: "bg-green-100 text-green-700", other: "bg-gray-100 text-gray-700" };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["materials", "syllabus"] as const).map(t => <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)} className="rounded-xl capitalize">{t === "materials" ? "My Materials" : "Syllabus"}</Button>)}
        {tab === "materials" && (
          <Dialog open={matOpen} onOpenChange={setMatOpen}>
            <DialogTrigger asChild><Button className="rounded-xl ml-auto"><Plus className="w-4 h-4 mr-2" />Add Material</Button></DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader><DialogTitle>Upload Study Material</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><label className="text-sm font-medium dark:text-gray-300">Class *</label>
                  <Select value={matForm.classId} onValueChange={v => setMatForm(p => ({ ...p, classId: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium dark:text-gray-300">Subject</label><Input value={matForm.subject} onChange={e => setMatForm(p => ({ ...p, subject: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Type</label>
                    <Select value={matForm.materialType} onValueChange={v => setMatForm(p => ({ ...p, materialType: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="notes">Notes</SelectItem><SelectItem value="pdf">PDF</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent>
                    </Select></div>
                </div>
                <div><label className="text-sm font-medium dark:text-gray-300">Title *</label><Input value={matForm.title} onChange={e => setMatForm(p => ({ ...p, title: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="text-sm font-medium dark:text-gray-300">File URL</label><Input value={matForm.fileUrl} onChange={e => setMatForm(p => ({ ...p, fileUrl: e.target.value }))} placeholder="https://..." className="dark:bg-gray-700 dark:border-gray-600" /></div>
                <Button onClick={addMat} className="w-full">Upload</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {loading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
        <>
          {tab === "materials" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {materials.length === 0 ? <div className="col-span-2 text-center py-12 text-muted-foreground"><FileText className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No materials uploaded yet</p></div>
              : materials.map(m => (
                <Card key={m.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-primary" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2"><p className="font-bold text-sm dark:text-white">{m.title}</p><Badge className={`text-xs rounded-full ${TYPE_COLOR[m.materialType] || TYPE_COLOR.other}`}>{m.materialType}</Badge></div>
                      <p className="text-xs text-muted-foreground">{m.subject}</p>
                      {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1"><Download className="w-3 h-3" />View</a>}
                    </div>
                    <button onClick={() => del(m.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {tab === "syllabus" && (
            <div className="space-y-2">
              {syllabus.length === 0 ? <div className="text-center py-12 text-muted-foreground"><BookOpen className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No syllabus assigned to you yet</p></div>
              : syllabus.map(s => (
                <Card key={s.id} className={`p-3 rounded-xl dark:bg-gray-800 dark:border-gray-700 border-l-4 ${s.isCompleted ? "border-l-green-500" : "border-l-blue-500"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2"><p className="font-bold text-sm dark:text-white">{s.chapter}</p><Badge variant="outline" className="text-xs rounded-full">{s.subject}</Badge></div>
                      {s.topics && <p className="text-xs text-muted-foreground">{s.topics}</p>}
                    </div>
                    <Button size="sm" variant={s.isCompleted ? "outline" : "default"} onClick={() => toggleSyl(s.id, s.isCompleted)} className="rounded-lg h-7 text-xs">{s.isCompleted ? "Undo" : "Done"}</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
