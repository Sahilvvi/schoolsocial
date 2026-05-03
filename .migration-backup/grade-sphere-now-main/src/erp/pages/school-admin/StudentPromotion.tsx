import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { ArrowRight, Users, CheckCircle, AlertTriangle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }
function getUser() { try { return JSON.parse(localStorage.getItem("myschool_user") || "{}"); } catch { return {}; } }

interface Class { id: number; name: string; section?: string; }
interface Student { id: number; name: string; admissionNo: string; classId: number; }

export default function StudentPromotion() {
  const user = getUser();
  const [classes, setClasses] = useState<Class[]>([]);
  const [fromClass, setFromClass] = useState<number | null>(null);
  const [toClass, setToClass] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [promoting, setPromoting] = useState(false);
  const [promoted, setPromoted] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/classes?schoolId=${user.schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setClasses(d.classes || []));
  }, []);

  useEffect(() => {
    if (!fromClass) return;
    setStudents([]);
    setSelected(new Set());
    setPromoted(false);
    fetch(`${BASE}/api/students?schoolId=${user.schoolId}&classId=${fromClass}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => {
        const list = d.students || [];
        setStudents(list);
        setSelected(new Set(list.map((s: Student) => s.id)));
      });
  }, [fromClass]);

  const toggleStudent = (id: number) => {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const handlePromote = async () => {
    if (!fromClass || !toClass || selected.size === 0) return;
    setPromoting(true);
    try {
      const ids = Array.from(selected);
      for (const id of ids) {
        await fetch(`${BASE}/api/students/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ classId: toClass }),
        });
      }
      setPromoted(true);
      toast({ title: `${ids.length} students promoted successfully!` });
    } catch { toast({ title: "Error", description: "Promotion failed", variant: "destructive" }); }
    finally { setPromoting(false); }
  };

  const fromClassName = classes.find(c => c.id === fromClass);
  const toClassName = classes.find(c => c.id === toClass);

  return (
    <AdminLayout title="Student Promotion" links={adminLinks}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Promotion</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Move students from one class to the next at year-end</p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"/>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">This action will permanently move selected students to the new class. This cannot be undone automatically.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-40">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">From Class</label>
            <Select value={String(fromClass || "")} onValueChange={v => setFromClass(Number(v))}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select source class" /></SelectTrigger>
              <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` - ${c.section}` : ""}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <ArrowRight className="w-8 h-8 text-blue-500 mt-5 flex-shrink-0"/>
          <div className="flex-1 min-w-40">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">To Class</label>
            <Select value={String(toClass || "")} onValueChange={v => setToClass(Number(v))}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select target class" /></SelectTrigger>
              <SelectContent>{classes.filter(c => c.id !== fromClass).map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` - ${c.section}` : ""}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500"/>
              <span className="font-semibold text-gray-900 dark:text-white">{students.length} Students in {fromClassName?.name}</span>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{selected.size} selected</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set(students.map(s => s.id)))} className="text-xs dark:text-gray-400">Select All</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} className="text-xs dark:text-gray-400">Clear</Button>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-72 overflow-y-auto">
            {students.map(s => (
              <div key={s.id} onClick={() => toggleStudent(s.id)} className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${selected.has(s.id) ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-750"}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${selected.has(s.id) ? "bg-blue-600 border-blue-600" : "border-gray-300 dark:border-gray-600"}`}>
                  {selected.has(s.id) && <CheckCircle className="w-3 h-3 text-white"/>}
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">{s.name[0]}</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">#{s.admissionNo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {students.length > 0 && toClass && !promoted && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={selected.size === 0}>
              <GraduationCap className="w-4 h-4 mr-2"/>
              Promote {selected.size} Students → {toClassName?.name}
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader><DialogTitle className="dark:text-white">Confirm Promotion</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">You are about to promote <strong>{selected.size}</strong> students from <strong>{fromClassName?.name}</strong> to <strong>{toClassName?.name}</strong>.</p>
              <p className="text-sm text-red-600 dark:text-red-400">This action cannot be reversed automatically.</p>
              <div className="flex gap-3">
                <Button onClick={handlePromote} disabled={promoting} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  {promoting ? "Promoting..." : "Confirm Promotion"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {promoted && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3"/>
          <h3 className="font-semibold text-green-700 dark:text-green-400">{selected.size} students promoted successfully!</h3>
          <p className="text-sm text-green-600 dark:text-green-500 mt-1">Students have been moved to {toClassName?.name}</p>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
