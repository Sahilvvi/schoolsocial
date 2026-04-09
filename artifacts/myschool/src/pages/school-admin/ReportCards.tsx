import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { adminLinks } from "./admin-links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Printer, User, Award, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

const GRADE = (p: number) => p >= 90 ? { g: "A+", c: "text-green-600" } : p >= 80 ? { g: "A", c: "text-green-500" } : p >= 70 ? { g: "B+", c: "text-blue-600" } : p >= 60 ? { g: "B", c: "text-blue-500" } : p >= 50 ? { g: "C", c: "text-yellow-600" } : p >= 40 ? { g: "D", c: "text-orange-600" } : { g: "F", c: "text-red-600" };
const REMARK = (p: number) => p >= 90 ? "Outstanding" : p >= 80 ? "Excellent" : p >= 70 ? "Very Good" : p >= 60 ? "Good" : p >= 50 ? "Average" : p >= 40 ? "Below Average" : "Needs Improvement";

export default function ReportCards() {
  const { user } = useAuth();
  const schoolId = user?.schoolId;
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    Promise.all([
      fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
      fetch(`${BASE}/api/exams?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
      fetch(`${BASE}/api/schools/${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()).catch(() => ({})),
    ]).then(([cd, ed, sd]) => { setClasses(cd.classes || []); setExams(ed.exams || []); setSchool(sd.school || null); });
  }, [schoolId]);

  useEffect(() => {
    if (!selectedClass || !schoolId) return;
    fetch(`${BASE}/api/students?schoolId=${schoolId}&classId=${selectedClass}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setStudents(d.students || []));
  }, [selectedClass, schoolId]);

  useEffect(() => {
    if (!selectedExam || !selectedStudent) { setResults([]); return; }
    setLoading(true);
    fetch(`${BASE}/api/exams/${selectedExam}/results?studentId=${selectedStudent}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setResults(d.results || [])).finally(() => setLoading(false));
  }, [selectedExam, selectedStudent]);

  const student = students.find(s => String(s.id) === selectedStudent);
  const exam = exams.find(e => String(e.id) === selectedExam);
  const classObj = classes.find(c => String(c.id) === selectedClass);
  const totalMarks = results.reduce((s, r) => s + (r.marksObtained || 0), 0);
  const totalMax = results.reduce((s, r) => s + (r.maxMarks || 100), 0);
  const percentage = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0;
  const { g: overallGrade, c: gradeColor } = GRADE(percentage);

  const handlePrint = () => window.print();

  return (
    <AdminLayout title="Report Cards" links={adminLinks}>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div><h2 className="text-2xl font-bold dark:text-white">Generate Report Cards</h2><p className="text-sm text-muted-foreground">Select class, student and exam to generate</p></div>
        {results.length > 0 && <Button onClick={handlePrint} className="rounded-xl gap-2 bg-primary"><Printer className="w-4 h-4" /> Print Report Card</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:hidden">
        <Select value={selectedClass} onValueChange={v => { setSelectedClass(v); setSelectedStudent(""); setResults([]); }}>
          <SelectTrigger className="rounded-xl dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="Select Class" /></SelectTrigger>
          <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name} {c.section && `- ${c.section}`}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={!selectedClass}>
          <SelectTrigger className="rounded-xl dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="Select Student" /></SelectTrigger>
          <SelectContent>{students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="rounded-xl dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="Select Exam" /></SelectTrigger>
          <SelectContent>{exams.map(e => <SelectItem key={e.id} value={String(e.id)}>{e.examName}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {!selectedStudent || !selectedExam ? (
        <div className="text-center py-20 text-muted-foreground print:hidden">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-bold">Select a student and exam</p>
          <p className="text-sm">Report card will appear here</p>
        </div>
      ) : loading ? (
        <div className="text-center py-20 text-muted-foreground print:hidden">Loading results...</div>
      ) : (
        <div className="max-w-3xl mx-auto" id="report-card">
          <Card className="p-8 rounded-2xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 print:shadow-none print:border-gray-300">
            {/* Header */}
            <div className="text-center border-b-2 border-primary/20 pb-6 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"><Award className="w-8 h-8 text-primary" /></div>
              <h1 className="text-2xl font-black text-primary">{school?.name || "School Name"}</h1>
              <p className="text-sm text-muted-foreground">{school?.address || ""} {school?.board && `· ${school.board}`}</p>
              <p className="text-lg font-bold mt-2 dark:text-white">PROGRESS REPORT CARD</p>
              <p className="text-sm text-muted-foreground">{exam?.examName} · {exam?.subject || "All Subjects"}</p>
            </div>
            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div><span className="text-xs text-muted-foreground uppercase tracking-wide">Student Name</span><p className="font-bold dark:text-white">{student?.name}</p></div>
              <div><span className="text-xs text-muted-foreground uppercase tracking-wide">Admission No.</span><p className="font-bold dark:text-white">{student?.admissionNo || "—"}</p></div>
              <div><span className="text-xs text-muted-foreground uppercase tracking-wide">Class</span><p className="font-bold dark:text-white">{classObj?.name} {classObj?.section}</p></div>
              <div><span className="text-xs text-muted-foreground uppercase tracking-wide">Academic Year</span><p className="font-bold dark:text-white">{new Date().getFullYear()}-{new Date().getFullYear() + 1}</p></div>
            </div>
            {/* Marks Table */}
            <table className="w-full mb-6">
              <thead><tr className="bg-primary/10 rounded-lg"><th className="text-left p-3 text-sm font-bold dark:text-white">Subject</th><th className="text-center p-3 text-sm font-bold dark:text-white">Max Marks</th><th className="text-center p-3 text-sm font-bold dark:text-white">Obtained</th><th className="text-center p-3 text-sm font-bold dark:text-white">%</th><th className="text-center p-3 text-sm font-bold dark:text-white">Grade</th><th className="text-center p-3 text-sm font-bold dark:text-white">Remark</th></tr></thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No results recorded for this exam</td></tr>
                ) : results.map((r: any, i: number) => {
                  const pct = r.maxMarks > 0 ? Math.round((r.marksObtained / r.maxMarks) * 100) : 0;
                  const { g, c } = GRADE(pct);
                  return (
                    <tr key={i} className={`border-b dark:border-gray-700 ${i % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-700/20" : ""}`}>
                      <td className="p-3 font-medium dark:text-white">{r.subject || exam?.subject}</td>
                      <td className="p-3 text-center text-muted-foreground">{r.maxMarks}</td>
                      <td className="p-3 text-center font-bold dark:text-white">{r.marksObtained ?? "—"}</td>
                      <td className="p-3 text-center">{pct}%</td>
                      <td className={`p-3 text-center font-black ${c}`}>{g}</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">{REMARK(pct)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
              <div className="text-center"><p className="text-xs text-muted-foreground">Total Marks</p><p className="text-2xl font-black dark:text-white">{totalMarks}/{totalMax}</p></div>
              <div className="text-center"><p className="text-xs text-muted-foreground">Percentage</p><p className="text-2xl font-black text-primary">{percentage}%</p></div>
              <div className="text-center"><p className="text-xs text-muted-foreground">Overall Grade</p><p className={`text-2xl font-black ${gradeColor}`}>{overallGrade}</p></div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
              <p className="font-bold text-sm dark:text-white">Overall Remark: <span className="text-primary">{REMARK(percentage)}</span></p>
            </div>
            <div className="mt-8 flex justify-between pt-4 border-t dark:border-gray-700">
              <div className="text-center"><div className="w-24 border-t border-gray-400 mb-1"></div><p className="text-xs text-muted-foreground">Class Teacher</p></div>
              <div className="text-center"><div className="w-24 border-t border-gray-400 mb-1"></div><p className="text-xs text-muted-foreground">Principal</p></div>
              <div className="text-center"><div className="w-24 border-t border-gray-400 mb-1"></div><p className="text-xs text-muted-foreground">Parent/Guardian</p></div>
            </div>
          </Card>
        </div>
      )}
      <style>{`@media print { .print\\:hidden { display: none !important; } body { background: white; } }`}</style>
    </AdminLayout>
  );
}
