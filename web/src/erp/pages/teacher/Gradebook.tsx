import { useState, useEffect } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

interface Props { schoolId: number; teacherId: number; }

function getGrade(pct: number) {
  if (pct >= 91) return { grade: "A1", color: "bg-green-100 text-green-700" };
  if (pct >= 81) return { grade: "A2", color: "bg-green-100 text-green-700" };
  if (pct >= 71) return { grade: "B1", color: "bg-blue-100 text-blue-700" };
  if (pct >= 61) return { grade: "B2", color: "bg-blue-100 text-blue-700" };
  if (pct >= 51) return { grade: "C1", color: "bg-yellow-100 text-yellow-700" };
  if (pct >= 41) return { grade: "C2", color: "bg-yellow-100 text-yellow-700" };
  if (pct >= 33) return { grade: "D", color: "bg-orange-100 text-orange-700" };
  return { grade: "E", color: "bg-red-100 text-red-700" };
}

export default function Gradebook({ schoolId, teacherId }: Props) {
  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState("all");
  const [filterExam, setFilterExam] = useState("all");

  useEffect(() => {
    const f = async () => {
      setLoading(true);
      const [eRes, sRes, cRes, mRes] = await Promise.all([
        fetch(`${BASE}/api/exams?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        fetch(`${BASE}/api/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        fetch(`${BASE}/api/exams/marks?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      ]);
      setExams((await eRes.json()).exams || []);
      setStudents((await sRes.json()).students || []);
      setClasses((await cRes.json()).classes || []);
      setMarks((await mRes.json()).marks || []);
      setLoading(false);
    };
    f();
  }, [schoolId]);

  const filteredStudents = filterClass === "all" ? students : students.filter(s => s.classId === Number(filterClass));
  const filteredExams = filterExam === "all" ? exams : exams.filter(e => String(e.id) === filterExam);

  const getStudentMarks = (studentId: number, examId: number) => marks.find(m => m.studentId === studentId && m.examId === examId);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-36 dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Classes</SelectItem>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterExam} onValueChange={setFilterExam}>
          <SelectTrigger className="w-40 dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="All Exams" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Exams</SelectItem>{exams.map(e => <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      : filteredStudents.length === 0 ? <div className="text-center py-12 text-muted-foreground"><BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No students to show</p></div>
      : <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 dark:bg-gray-800">
              <th className="text-left p-3 font-medium text-muted-foreground">Student</th>
              {filteredExams.map(e => <th key={e.id} className="text-center p-3 font-medium text-muted-foreground">{e.name}<br /><span className="text-xs font-normal">{e.subject}</span></th>)}
              <th className="text-center p-3 font-medium text-muted-foreground">Overall</th>
            </tr></thead>
            <tbody>
              {filteredStudents.map(s => {
                const studentMarks = filteredExams.map(e => getStudentMarks(s.id, e.id));
                const validMarks = studentMarks.filter(m => m && m.marksObtained != null);
                const avgPct = validMarks.length > 0 ? validMarks.reduce((sum, m) => sum + Math.round((m.marksObtained / m.maxMarks) * 100), 0) / validMarks.length : 0;
                const overall = avgPct > 0 ? getGrade(avgPct) : null;
                return (
                  <tr key={s.id} className="border-t dark:border-gray-700 hover:bg-muted/20 dark:hover:bg-gray-800/50">
                    <td className="p-3 font-medium dark:text-white">{s.name}</td>
                    {filteredExams.map(e => {
                      const m = getStudentMarks(s.id, e.id);
                      if (!m) return <td key={e.id} className="p-3 text-center text-muted-foreground">—</td>;
                      const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                      const g = getGrade(pct);
                      return <td key={e.id} className="p-3 text-center"><span className="font-bold dark:text-white">{m.marksObtained}/{m.maxMarks}</span><br /><Badge className={`text-xs rounded-full ${g.color}`}>{g.grade}</Badge></td>;
                    })}
                    <td className="p-3 text-center">{overall ? <Badge className={`text-xs rounded-full ${overall.color}`}>{overall.grade} ({Math.round(avgPct)}%)</Badge> : <span className="text-muted-foreground">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>}
    </div>
  );
}
