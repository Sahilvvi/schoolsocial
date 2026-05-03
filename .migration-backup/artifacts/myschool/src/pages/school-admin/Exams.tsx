import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { adminLinks } from "./admin-links";
import { Plus, Trash2, BookOpen, Award, ChevronDown, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }
function getUser() { try { return JSON.parse(localStorage.getItem("myschool_user") || "{}"); } catch { return {}; } }

interface Exam { id: number; examName: string; subject: string; examType: string; examDate: string; maxMarks: number; passingMarks: number; classId: number; }
interface Student { id: number; name: string; admissionNo: string; }
interface Class { id: number; name: string; section?: string; }

const EXAM_TYPE_COLORS: Record<string, string> = {
  unit_test: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  mid_term: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  final: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  practical: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function Exams() {
  const user = getUser();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [marksOpen, setMarksOpen] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, string>>({});
  const [form, setForm] = useState({ subject: "", examName: "", examType: "unit_test", examDate: "", maxMarks: "100", passingMarks: "35" });

  useEffect(() => {
    fetch(`${BASE}/api/classes?schoolId=${user.schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => { setClasses(d.classes || []); if (d.classes?.length) setSelectedClass(d.classes[0].id); });
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    Promise.all([
      fetch(`${BASE}/api/exams?schoolId=${user.schoolId}&classId=${selectedClass}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
      fetch(`${BASE}/api/students?schoolId=${user.schoolId}&classId=${selectedClass}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
    ]).then(([eData, sData]) => {
      setExams(eData.exams || []);
      setStudents(sData.students || []);
    });
  }, [selectedClass]);

  const handleCreate = async () => {
    if (!form.subject || !form.examName || !form.examDate || !selectedClass) return;
    const res = await fetch(`${BASE}/api/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ schoolId: user.schoolId, classId: selectedClass, ...form, maxMarks: Number(form.maxMarks), passingMarks: Number(form.passingMarks) }),
    });
    const data = await res.json();
    setExams(prev => [...prev, data]);
    setOpen(false);
    setForm({ subject: "", examName: "", examType: "unit_test", examDate: "", maxMarks: "100", passingMarks: "35" });
    toast({ title: "Exam created!" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`${BASE}/api/exams/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    setExams(prev => prev.filter(e => e.id !== id));
    toast({ title: "Exam deleted" });
  };

  const openMarks = async (examId: number) => {
    setMarksOpen(examId);
    const res = await fetch(`${BASE}/api/exams/${examId}/results`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    const map: Record<number, string> = {};
    (data.results || []).forEach((r: any) => { map[r.studentId] = String(r.marksObtained ?? ""); });
    setResults(map);
  };

  const saveMarks = async (examId: number) => {
    const payload = students.map(s => ({ studentId: s.id, marksObtained: Number(results[s.id] || 0) }));
    await fetch(`${BASE}/api/exams/${examId}/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ results: payload }),
    });
    setMarksOpen(null);
    toast({ title: "Marks saved!" });
  };

  return (
    <AdminLayout title="Exams" links={adminLinks}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Schedule exams and enter student marks</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={String(selectedClass || "")} onValueChange={v => setSelectedClass(Number(v))}>
            <SelectTrigger className="w-44 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select Class" /></SelectTrigger>
            <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` - ${c.section}` : ""}</SelectItem>)}</SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2"/>Schedule Exam</Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader><DialogTitle className="dark:text-white">Schedule New Exam</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Exam Name *</Label>
                    <Input value={form.examName} onChange={e => setForm(p => ({ ...p, examName: e.target.value }))} placeholder="Unit Test 1" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Subject *</Label>
                    <Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Mathematics" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Exam Type</Label>
                    <Select value={form.examType} onValueChange={v => setForm(p => ({ ...p, examType: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit_test">Unit Test</SelectItem>
                        <SelectItem value="mid_term">Mid Term</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                        <SelectItem value="practical">Practical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Date *</Label>
                    <Input type="date" value={form.examDate} onChange={e => setForm(p => ({ ...p, examDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Max Marks</Label>
                    <Input type="number" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Passing Marks</Label>
                    <Input type="number" value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <Button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Schedule Exam</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {exams.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"/>
            <p className="text-gray-500 dark:text-gray-400">No exams scheduled for this class</p>
          </div>
        ) : exams.map(exam => (
          <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{exam.examName}</span>
                    <Badge className={`text-xs ${EXAM_TYPE_COLORS[exam.examType]}`}>{exam.examType.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{exam.subject} • {new Date(exam.examDate).toLocaleDateString("en-IN")} • Max: {exam.maxMarks} marks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => marksOpen === exam.id ? setMarksOpen(null) : openMarks(exam.id)} className="dark:border-gray-600 dark:text-gray-300">
                  {marksOpen === exam.id ? <ChevronDown className="w-4 h-4 mr-1"/> : <ChevronRight className="w-4 h-4 mr-1"/>}
                  Enter Marks
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(exam.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4"/>
                </Button>
              </div>
            </div>
            {marksOpen === exam.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {students.map(s => (
                    <div key={s.id} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-400 flex-shrink-0">{s.name[0]}</span>
                      <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{s.name} <span className="text-gray-400 text-xs">#{s.admissionNo}</span></span>
                      <Input
                        type="number" min="0" max={exam.maxMarks}
                        value={results[s.id] ?? ""}
                        onChange={e => setResults(prev => ({ ...prev, [s.id]: e.target.value }))}
                        placeholder={`/ ${exam.maxMarks}`}
                        className="w-24 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={() => saveMarks(exam.id)} className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full">
                  <Check className="w-4 h-4 mr-2"/>Save All Marks
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}
