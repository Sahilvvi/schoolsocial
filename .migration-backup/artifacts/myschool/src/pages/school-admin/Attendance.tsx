import { useState } from "react";
import { AdminLayout } from "@/components/layouts";
import { useListStudents, useListClasses, useMarkAttendance } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { adminLinks } from "./admin-links";
import { useToast } from "@/hooks/use-toast";

type AttendanceStatus = "P" | "A" | "L";
const statusMap: Record<AttendanceStatus, string> = { P: "present", A: "absent", L: "late" };

export default function Attendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState<string>("");
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);

  const { data: classesData, isLoading: loadingClasses } = useListClasses({ schoolId });
  const { data: studentsData, isLoading: loadingStudents } = useListStudents({ schoolId, classId: classId ? Number(classId) : undefined });
  const markAttendance = useMarkAttendance();

  const classes = classesData?.classes || [];
  const students = studentsData?.students || [];

  const presentCount = Object.values(attendance).filter(v => v === "P").length;
  const absentCount = Object.values(attendance).filter(v => v === "A").length;
  const lateCount = Object.values(attendance).filter(v => v === "L").length;

  const handleClassChange = (val: string) => {
    setClassId(val);
    setAttendance({});
  };

  const handleSave = async () => {
    if (!classId) {
      toast({ title: "Select a class", description: "Please select a class before saving attendance.", variant: "destructive" });
      return;
    }
    if (students.length === 0) {
      toast({ title: "No students", description: "No students in this class.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const records = students.map((s: any) => ({
        studentId: s.id,
        status: statusMap[attendance[s.id] || "P"] as any,
      }));
      for (const record of records) {
        await markAttendance.mutateAsync({ data: { schoolId, classId: Number(classId), date, ...record } });
      }
      toast({ title: "Attendance saved", description: `Saved attendance for ${records.length} students on ${date}.` });
    } catch {
      toast({ title: "Error", description: "Failed to save attendance. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setAttendance({});

  const markAll = (status: AttendanceStatus) => {
    const next: Record<number, AttendanceStatus> = {};
    students.forEach((s: any) => { next[s.id] = status; });
    setAttendance(next);
  };

  return (
    <AdminLayout title="Attendance Management" links={adminLinks}>
      <Card className="p-6 rounded-2xl border-border shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select Class</label>
              {loadingClasses ? (
                <div className="w-[180px] h-11 rounded-xl bg-secondary/50 animate-pulse" />
              ) : (
                <Select value={classId} onValueChange={handleClassChange}>
                  <SelectTrigger className="w-[180px] h-11 rounded-xl border-border">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c: any) => (
                      <SelectItem key={c.id} value={String(c.id)}>Class {c.name}{c.section ? "-"+c.section : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</label>
              <div className="relative">
                <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="pl-10 h-11 rounded-xl border-border w-[180px]" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {students.length > 0 && (
              <div className="flex gap-2">
                <button onClick={() => markAll("P")} className="text-xs font-bold px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">Mark All Present</button>
                <button onClick={() => markAll("A")} className="text-xs font-bold px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">Mark All Absent</button>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm font-bold bg-secondary/50 px-4 py-2 rounded-xl">
              <span className="flex items-center gap-1.5 text-green-600"><CheckCircle2 className="w-4 h-4"/> {presentCount}</span>
              <span className="flex items-center gap-1.5 text-destructive"><XCircle className="w-4 h-4"/> {absentCount}</span>
              <span className="flex items-center gap-1.5 text-accent"><Clock className="w-4 h-4"/> {lateCount}</span>
            </div>
          </div>
        </div>
      </Card>

      {!classId ? (
        <div className="text-center py-20 text-muted-foreground">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold mb-2">Select a class to mark attendance</p>
          <p className="text-sm">Choose a class from the dropdown above</p>
        </div>
      ) : loadingStudents ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl font-bold mb-2">No students found</p>
          <p className="text-sm">This class has no enrolled students</p>
        </div>
      ) : (
        <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 font-bold">#</th>
                  <th className="px-6 py-4 font-bold">Student Name</th>
                  <th className="px-6 py-4 font-bold">Admission No</th>
                  <th className="px-6 py-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any, idx: number) => (
                  <tr key={student.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-muted-foreground">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{student.name}</td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{student.admissionNo || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {(["P", "A", "L"] as AttendanceStatus[]).map(status => (
                          <button
                            key={status}
                            onClick={() => setAttendance(p => ({...p, [student.id]: status}))}
                            className={`w-11 h-11 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                              attendance[student.id] === status
                                ? status === 'P' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                  : status === 'A' ? 'bg-destructive text-white shadow-lg shadow-destructive/30'
                                  : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                            }`}
                          >
                            {status === 'P' ? 'P' : status === 'A' ? 'A' : 'L'}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-secondary/20 flex justify-between items-center border-t border-border">
            <p className="text-sm font-medium text-muted-foreground">{students.length} students • {date}</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleReset} className="font-bold rounded-xl h-12 px-8">Reset</Button>
              <Button onClick={handleSave} disabled={saving} className="font-bold rounded-xl h-12 px-8 shadow-lg shadow-primary/20">
                {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                Save Attendance
              </Button>
            </div>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
}
