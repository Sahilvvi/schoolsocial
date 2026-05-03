import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/layouts";
import { useListStudents, useListAttendance, useListNotices, useListTeachers } from "@workspace/api-client-react";
import {
  Home, Calendar, Book, Bell, User, CheckCircle2, XCircle, Clock, Loader2,
  ClipboardList, Award, MessageSquare, Send, FileText, Download, BookOpen,
  CalendarCheck, Plus, Trash2, Play
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import NotificationBell from "@/components/NotificationBell";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

type Tab = "home" | "schedule" | "homework" | "results" | "messages" | "notices" | "profile" | "materials" | "assignments" | "leave" | "library" | "calendar" | "syllabus" | "quiz";

const studentLinks = [
  { href: "/student/home",        label: "Home",       icon: Home,         group: "Overview" },
  { href: "/student/profile",     label: "ID Card",    icon: User,         group: "Overview" },
  { href: "/student/schedule",    label: "Schedule",   icon: Calendar,     group: "Academics" },
  { href: "/student/homework",    label: "Homework",   icon: Book,         group: "Academics" },
  { href: "/student/assignments", label: "Assignments",icon: ClipboardList,group: "Academics" },
  { href: "/student/results",     label: "Results",    icon: Award,        group: "Academics" },
  { href: "/student/materials",   label: "Materials",  icon: FileText,     group: "Academics" },
  { href: "/student/syllabus",    label: "Syllabus",   icon: BookOpen,     group: "Academics" },
  { href: "/student/notices",     label: "Notices",    icon: Bell,         group: "School" },
  { href: "/student/calendar",    label: "Attendance", icon: CalendarCheck,group: "School" },
  { href: "/student/library",     label: "Library",    icon: BookOpen,     group: "School" },
  { href: "/student/quiz",        label: "Quiz",       icon: Award,        group: "School" },
  { href: "/student/messages",    label: "Messages",   icon: MessageSquare,group: "Communication" },
  { href: "/student/leave",       label: "Leave",      icon: Calendar,     group: "Communication" },
];

function StatusIcon({ status }: { status: string }) {
  if (status === "present") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === "absent") return <XCircle className="w-4 h-4 text-destructive" />;
  return <Clock className="w-4 h-4 text-amber-500" />;
}

const GRADE_COLOR: Record<string, string> = {
  "A+": "bg-green-100 text-green-700", "A":  "bg-green-100 text-green-700",
  "B+": "bg-blue-100 text-blue-700",   "B":  "bg-blue-100 text-blue-700",
  "C+": "bg-yellow-100 text-yellow-700","C": "bg-yellow-100 text-yellow-700",
  "D":  "bg-orange-100 text-orange-700","F": "bg-red-100 text-red-700",
};

function StudentMaterials({ schoolId, classId }: { schoolId: number; classId?: number }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    fetch(`${BASE}/api/study-materials?schoolId=${schoolId}&classId=${classId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setMaterials(d.materials || [])).finally(() => setLoading(false));
  }, [schoolId, classId]);
  const TYPE_COLOR: Record<string, string> = { notes: "bg-blue-100 text-blue-700", pdf: "bg-red-100 text-red-700", video: "bg-purple-100 text-purple-700", assignment: "bg-green-100 text-green-700", other: "bg-gray-100 text-gray-700" };
  if (!classId) return <div className="text-center py-12 text-muted-foreground"><FileText className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No class assigned yet</p></div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Study Materials</h2>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      : materials.length === 0 ? <div className="text-center py-12 text-muted-foreground"><FileText className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No materials uploaded by your teachers yet</p></div>
      : <div className="space-y-3">
          {materials.map(m => (
            <Card key={m.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-primary" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm">{m.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLOR[m.materialType] || TYPE_COLOR.other}`}>{m.materialType}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{m.subject}</p>
                  {m.description && <p className="text-xs text-muted-foreground mt-1">{m.description}</p>}
                  {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary mt-2"><Download className="w-3 h-3" />View / Download</a>}
                </div>
              </div>
            </Card>
          ))}
        </div>}
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const params = useParams<{ tab?: string }>();
  const [, setLocation] = useLocation();

  const activeTab = (params.tab || "home") as Tab;
  const setTab = (tab: Tab) => setLocation(`/student/${tab}`);

  const schoolId = user?.schoolId || 1;
  const userId   = (user as any)?.id;

  const [homework,      setHomework]      = useState<any[]>([]);
  const [timetable,     setTimetable]     = useState<any[]>([]);
  const [examResults,   setExamResults]   = useState<any[]>([]);
  const [hwLoading,     setHwLoading]     = useState(false);
  const [ttLoading,     setTtLoading]     = useState(false);
  const [resultsLoading,setResultsLoading]= useState(false);

  const [submittingHw,  setSubmittingHw]  = useState<number | null>(null);
  const [hwNote,        setHwNote]        = useState<Record<number, string>>({});
  const [submittedHwIds,setSubmittedHwIds]= useState<Set<number>>(new Set());

  const submitHomework = async (hwId: number) => {
    if (!myStudent?.id) return;
    setSubmittingHw(hwId);
    try {
      const res = await fetch(`${BASE}/api/homework/${hwId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ studentId: myStudent.id, schoolId, note: hwNote[hwId] || "" }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmittedHwIds(prev => new Set([...prev, hwId]));
      toast({ title: "Homework submitted!", description: "Your teacher will review it." });
    } catch { toast({ title: "Submission failed", variant: "destructive" }); }
    finally { setSubmittingHw(null); }
  };

  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [chatMessages,    setChatMessages]    = useState<any[]>([]);
  const [newMessage,      setNewMessage]      = useState("");
  const [sending,         setSending]         = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const studentName = user?.name?.split(" ")[0] || "Student";
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const { data: studentsData, isLoading: studentLoading } = useListStudents({ schoolId });
  const allStudents = studentsData?.students || [];
  const myStudent = useMemo(() => {
    const byUserId = allStudents.find((s: any) => s.userId === user?.id);
    return byUserId || allStudents[0] || null;
  }, [allStudents, user]);

  const today        = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const { data: attendanceData, isLoading: attendanceLoading } = useListAttendance(
    { studentId: myStudent?.id, startDate: thirtyDaysAgo, endDate: today },
    { enabled: !!myStudent?.id }
  );
  const attendanceRecords = attendanceData?.attendance || [];
  const presentCount  = attendanceRecords.filter((a: any) => a.status === "present").length;
  const absentCount   = attendanceRecords.filter((a: any) => a.status === "absent").length;
  const lateCount     = attendanceRecords.filter((a: any) => a.status === "late").length;
  const attendancePct = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;

  const { data: noticesData, isLoading: noticesLoading } = useListNotices({ schoolId });
  const notices = noticesData?.notices || [];
  const { data: teachersData } = useListTeachers({ schoolId });
  const teachers = teachersData?.teachers || [];

  useEffect(() => {
    if (myStudent?.classId) {
      setHwLoading(true);
      fetch(`${BASE}/api/homework?schoolId=${schoolId}&classId=${myStudent.classId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setHomework(d.homework || [])).finally(() => setHwLoading(false));
    }
  }, [myStudent?.classId]);

  useEffect(() => {
    if (activeTab === "schedule" && myStudent?.classId) {
      setTtLoading(true);
      fetch(`${BASE}/api/timetable?schoolId=${schoolId}&classId=${myStudent.classId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setTimetable(d.timetable || [])).finally(() => setTtLoading(false));
    }
  }, [activeTab, myStudent?.classId]);

  useEffect(() => {
    if (activeTab === "results" && myStudent?.id) {
      setResultsLoading(true);
      fetch(`${BASE}/api/exams/results/student/${myStudent.id}?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setExamResults(d.results || [])).finally(() => setResultsLoading(false));
    }
  }, [activeTab, myStudent?.id]);

  const loadChat = (teacher: any) => {
    setSelectedTeacher(teacher);
    fetch(`${BASE}/api/messages?withUserId=${teacher.userId || teacher.id}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => {
        setChatMessages(d.messages || []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedTeacher) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          schoolId, receiverId: selectedTeacher.userId || selectedTeacher.id,
          senderRole: "student", message: newMessage,
        }),
      });
      const msg = await res.json();
      setChatMessages(prev => [...prev, msg]);
      setNewMessage("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { toast({ title: "Error", description: "Failed to send", variant: "destructive" }); }
    finally { setSending(false); }
  };

  const admissionNo = myStudent?.admissionNo || "ADM-2023-001";
  const className   = myStudent?.className   || "10";
  const section     = myStudent?.section     || "A";

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timetableByDay = DAYS
    .map(day => ({ day, periods: timetable.filter((p: any) => p.day === day) }))
    .filter(d => d.periods.length > 0);

  return (
    <AdminLayout title="Student Portal" links={studentLinks}>
      {/* HOME TAB */}
      {activeTab === "home" && (
        <div className="space-y-5 max-w-2xl">
          <div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full mb-2">Class {className}-{section}</span>
            <h1 className="text-2xl font-display font-bold text-foreground">{greeting}, {studentName}!</h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">Ready to learn something new today?</p>
          </div>
          {studentLoading ? <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : (
            <>
              <Card className="bg-primary p-5 rounded-3xl text-white shadow-xl shadow-primary/25 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-bl-[80px]" />
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">MySchool Student ID</p>
                <h2 className="text-xl font-bold text-white">{user?.name || "Student"}</h2>
                <p className="text-sm text-white/80 font-medium">Class {className}-{section} • {admissionNo}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div><p className="text-xs text-white/60">Attendance</p><p className="text-2xl font-bold text-white">{attendancePct}%</p></div>
                  <div className="w-16 h-16 bg-white rounded-xl p-1.5"><QRCode value={`student:${myStudent?.id || 1}:${admissionNo}`} size={52} /></div>
                </div>
              </Card>
              <Card className="p-4 rounded-2xl border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-3">This Month's Attendance</h3>
                {attendanceLoading ? <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
                : (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-green-600">{presentCount}</p><p className="text-xs text-green-700 dark:text-green-400 font-medium">Present</p></div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-destructive">{absentCount}</p><p className="text-xs text-destructive font-medium">Absent</p></div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-amber-600">{lateCount}</p><p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Late</p></div>
                  </div>
                )}
              </Card>
              <Card className="p-4 rounded-2xl border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-3">Recent Homework</h3>
                {homework.slice(0, 3).length === 0 ? <p className="text-sm text-muted-foreground text-center py-2">No homework assigned</p>
                : homework.slice(0, 3).map((hw: any) => (
                  <div key={hw.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{hw.subject?.charAt(0)}</div>
                    <div className="flex-1"><p className="text-sm font-bold text-foreground">{hw.subject}</p><p className="text-xs text-muted-foreground">{hw.title}</p></div>
                    <span className="text-xs font-bold text-primary">{new Date(hw.dueDate).toLocaleDateString("en-IN")}</span>
                  </div>
                ))}
              </Card>
            </>
          )}
        </div>
      )}

      {/* SCHEDULE TAB */}
      {activeTab === "schedule" && (
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-xl font-bold font-display mb-4">Timetable</h2>
          {ttLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : timetable.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">No timetable set up yet</p>
              <p className="text-sm">Your school admin will add the timetable soon</p>
            </div>
          ) : timetableByDay.length > 0 ? (
            timetableByDay.map(({ day, periods }) => (
              <div key={day} className="mb-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">{day}</h3>
                <div className="space-y-2">
                  {periods.map((period: any, i: number) => (
                    <Card key={i} className="p-4 rounded-xl border-border shadow-sm flex items-center gap-4">
                      <div className="text-right shrink-0 w-16"><p className="text-xs font-bold text-primary">{period.startTime || "—"}</p><p className="text-xs text-muted-foreground">{period.endTime || ""}</p></div>
                      <div className="w-px h-10 bg-border" />
                      <div className="flex-1"><p className="font-bold">{period.subject}</p><p className="text-xs text-muted-foreground">{period.room ? `Room ${period.room}` : ""}</p></div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            timetable.map((period: any, i: number) => (
              <Card key={i} className="p-4 rounded-xl border-border shadow-sm flex items-center gap-4">
                <div className="text-right shrink-0 w-16"><p className="text-xs font-bold text-primary">{period.startTime || "—"}</p><p className="text-xs text-muted-foreground">{period.day || ""}</p></div>
                <div className="w-px h-10 bg-border" />
                <div className="flex-1"><p className="font-bold">{period.subject}</p><p className="text-xs text-muted-foreground">{period.teacherName ? `${period.teacherName} • ` : ""}{period.room || ""}</p></div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* HOMEWORK TAB */}
      {activeTab === "homework" && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold font-display mb-4">Homework</h2>
          {hwLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : homework.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No homework assigned</p><p className="text-sm">All caught up!</p></div>
          ) : homework.map((hw: any) => {
            const isSubmitted = submittedHwIds.has(hw.id);
            const isPast = new Date(hw.dueDate) < new Date();
            return (
              <Card key={hw.id} className="p-4 rounded-xl border-border shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${isSubmitted ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                    {isSubmitted ? <CheckCircle2 className="w-5 h-5" /> : hw.subject?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold">{hw.subject}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPast ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>Due: {new Date(hw.dueDate).toLocaleDateString("en-IN")}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{hw.title}</p>
                    {hw.description && <p className="text-xs text-muted-foreground mt-1">{hw.description}</p>}
                    {!isSubmitted && (
                      <div className="mt-3 space-y-2">
                        <Input placeholder="Add a note (optional)..." value={hwNote[hw.id] || ""} onChange={e => setHwNote(prev => ({ ...prev, [hw.id]: e.target.value }))} className="text-xs h-8 rounded-lg" />
                        <Button size="sm" className="rounded-lg h-8 text-xs gap-1" onClick={() => submitHomework(hw.id)} disabled={submittingHw === hw.id}>
                          {submittingHw === hw.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                          Submit Homework
                        </Button>
                      </div>
                    )}
                    {isSubmitted && <p className="text-xs text-green-600 font-semibold mt-2">✓ Submitted successfully</p>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* EXAM RESULTS TAB */}
      {activeTab === "results" && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold font-display mb-4">My Report Card</h2>
          {resultsLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : examResults.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">No exam results yet</p>
              <p className="text-sm mt-1">Your results will appear here once your teacher enters marks</p>
            </div>
          ) : (
            <>
              <Card className="p-4 rounded-xl bg-primary/5 border-primary/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Total Exams</p>
                  <p className="text-2xl font-bold text-foreground">{examResults.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Average Grade</p>
                  <p className="text-2xl font-bold text-primary">
                    {(() => {
                      const avg = examResults.reduce((s, r) => s + (r.exam?.maxMarks ? (r.marksObtained / r.exam.maxMarks) * 100 : 0), 0) / examResults.length;
                      return avg >= 90 ? "A+" : avg >= 80 ? "A" : avg >= 70 ? "B+" : avg >= 60 ? "B" : avg >= 50 ? "C+" : avg >= 40 ? "C" : avg >= 35 ? "D" : "F";
                    })()}
                  </p>
                </div>
              </Card>
              {examResults.map((result: any) => (
                <Card key={result.id} className="p-4 rounded-xl border-border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold">{result.exam?.examName || result.exam?.name || "Exam"}</p>
                      <p className="text-sm text-muted-foreground">{result.exam?.subject || "—"}</p>
                      {result.exam?.examDate && <p className="text-xs text-muted-foreground">{new Date(result.exam.examDate).toLocaleDateString("en-IN")}</p>}
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-bold text-lg">{result.marksObtained}<span className="text-sm text-muted-foreground font-normal">/{result.exam?.maxMarks || "—"}</span></p>
                        {result.exam?.passingMarks && <p className="text-xs text-muted-foreground">Pass: {result.exam.passingMarks}</p>}
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${GRADE_COLOR[result.grade] || "bg-gray-100 text-gray-700"}`}>{result.grade}</span>
                    </div>
                  </div>
                  {result.remarks && <p className="text-xs text-muted-foreground mt-2 italic">{result.remarks}</p>}
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === "messages" && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          {selectedTeacher ? (
            <div className="flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => setSelectedTeacher(null)} className="text-sm text-primary font-bold">← Back</button>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{(selectedTeacher.name || "T")[0]}</div>
                <div><p className="font-bold text-sm">{selectedTeacher.name}</p><p className="text-xs text-muted-foreground">{selectedTeacher.subject} Teacher</p></div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl p-4 mb-3">
                {chatMessages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start a conversation!</p>}
                {chatMessages.map((msg: any, i) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-primary text-white rounded-tr-sm" : "bg-white dark:bg-gray-700 border border-border text-foreground rounded-tl-sm shadow-sm"}`}>
                        {msg.message}
                        <p className={`text-xs mt-1 ${isMe ? "text-white/60" : "text-muted-foreground"}`}>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <div className="flex gap-2">
                <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Type a message..." className="flex-1 rounded-xl" />
                <Button onClick={handleSend} disabled={sending || !newMessage.trim()} className="rounded-xl px-4">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">Message your teachers directly</p>
              {teachers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No teachers available</p></div>
              ) : teachers.map((teacher: any) => (
                <Card key={teacher.id} className="p-4 rounded-xl border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors" onClick={() => loadChat(teacher)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{(teacher.name || "T")[0]}</div>
                    <div className="flex-1">
                      <p className="font-bold">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">{teacher.subject || "Teacher"}</p>
                    </div>
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NOTICES TAB */}
      {activeTab === "notices" && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold font-display">School Notices</h2>
          {noticesLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : notices.length === 0 ? <div className="text-center py-16 text-muted-foreground"><Bell className="w-16 h-16 mx-auto mb-4 opacity-20" /><p className="text-xl font-bold">No notices yet</p></div>
          : notices.map((notice: any) => (
            <Card key={notice.id} className="p-5 rounded-xl border-border/50 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${notice.type === "alert" ? "bg-destructive/10 text-destructive" : notice.type === "event" ? "bg-primary/10 text-primary" : notice.type === "exam" ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"}`}><Bell className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{notice.title}</p>
                  {notice.body && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notice.body}</p>}
                  <p className="text-xs text-muted-foreground font-medium mt-1">{notice.createdAt ? new Date(notice.createdAt).toLocaleDateString("en-IN") : ""}</p>
                </div>
                <Badge variant="secondary" className="text-xs font-bold capitalize shrink-0">{notice.type}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ID CARD TAB */}
      {activeTab === "profile" && (
        <div className="max-w-sm mx-auto space-y-5">
          <h2 className="text-xl font-bold font-display">Student ID Card</h2>
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-[100px]" />
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">MySchool</p>
                <p className="text-lg font-bold text-white/90 mt-0.5">Student Identity Card</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center font-bold text-2xl text-white">{(user?.name || "S")[0]}</div>
              <div>
                <p className="text-xl font-bold text-white">{user?.name}</p>
                <p className="text-sm text-white/80">Class {className}-{section}</p>
                <p className="text-xs text-white/60">{myStudent?.rollNo ? `Roll No. ${myStudent.rollNo}` : admissionNo}</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div><p className="text-xs text-white/60">Admission No.</p><p className="text-sm font-bold text-white">{admissionNo}</p></div>
                {myStudent?.bloodGroup && <div><p className="text-xs text-white/60">Blood Group</p><p className="text-sm font-bold text-white">{myStudent.bloodGroup}</p></div>}
              </div>
              <div className="bg-white rounded-2xl p-2">
                <QRCode value={`student:${myStudent?.id || 1}:${admissionNo}:${user?.name}`} size={80} />
              </div>
            </div>
          </div>
          <Card className="p-4 rounded-xl border-border shadow-sm">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">Student Details</h3>
            <div className="space-y-2">
              {[
                { label: "Full Name",     value: user?.name || "—" },
                { label: "Class",         value: `${className}-${section}` },
                { label: "Admission No.", value: admissionNo },
                { label: "Blood Group",   value: myStudent?.bloodGroup || "—" },
                { label: "Parent Name",   value: myStudent?.parentName || "—" },
                { label: "Parent Phone",  value: myStudent?.parentPhone || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground font-medium">{label}</span>
                  <span className="text-sm font-bold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* MATERIALS TAB */}
      {activeTab === "materials" && (
        <div className="max-w-2xl">
          <StudentMaterials schoolId={schoolId} classId={myStudent?.classId} />
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {activeTab === "assignments" && (
        <div className="max-w-2xl">
          <StudentAssignmentSubmissions schoolId={schoolId} studentId={myStudent?.id} classId={myStudent?.classId} />
        </div>
      )}

      {/* LEAVE TAB */}
      {activeTab === "leave" && (
        <div className="max-w-2xl">
          <StudentLeaveTab schoolId={schoolId} studentId={myStudent?.id} />
        </div>
      )}

      {/* LIBRARY TAB */}
      {activeTab === "library" && (
        <div className="max-w-2xl">
          <StudentLibraryTab schoolId={schoolId} studentId={myStudent?.id} />
        </div>
      )}

      {/* ATTENDANCE CALENDAR TAB */}
      {activeTab === "calendar" && (
        <div className="max-w-2xl">
          <StudentAttendanceCalendar schoolId={schoolId} studentId={myStudent?.id} />
        </div>
      )}

      {/* SYLLABUS TAB */}
      {activeTab === "syllabus" && (
        <div className="max-w-2xl">
          <StudentSyllabusTab schoolId={schoolId} classId={myStudent?.classId} />
        </div>
      )}

      {/* QUIZ TAB */}
      {activeTab === "quiz" && (
        <div className="max-w-2xl">
          <StudentQuizTab schoolId={schoolId} classId={myStudent?.classId} />
        </div>
      )}
    </AdminLayout>
  );
}

const SBASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const STOK  = () => localStorage.getItem("myschool_token") || "";

function StudentAssignmentSubmissions({ schoolId, studentId, classId }: { schoolId: number; studentId?: number; classId?: number }) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState<number | null>(null);
  const [notes,       setNotes]       = useState<Record<number, string>>({});
  const [submitted,   setSubmitted]   = useState<Set<number>>(new Set());
  const [feedback,    setFeedback]    = useState<Record<number, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    fetch(`${SBASE()}/api/assignments?schoolId=${schoolId}&classId=${classId}`, { headers: { Authorization: `Bearer ${STOK()}` } })
      .then(r => r.json()).then(d => setAssignments(d.assignments || [])).finally(() => setLoading(false));
  }, [schoolId, classId]);

  const submit = async (assignmentId: number) => {
    if (!studentId) return;
    setSubmitting(assignmentId);
    try {
      const res = await fetch(`${SBASE()}/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${STOK()}` },
        body: JSON.stringify({ studentId, schoolId, note: notes[assignmentId] || "" }),
      });
      if (res.ok) {
        const d = await res.json();
        setSubmitted(s => new Set([...s, assignmentId]));
        setFeedback(f => ({ ...f, [assignmentId]: d.submission }));
        toast({ title: "Assignment submitted!", description: "Your teacher will review it soon." });
      } else { toast({ title: "Submission failed", variant: "destructive" }); }
    } finally { setSubmitting(null); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const now     = new Date();
  const pending = assignments.filter(a => !submitted.has(a.id) && new Date(a.dueDate) >= now);
  const overdue = assignments.filter(a => !submitted.has(a.id) && new Date(a.dueDate) < now);
  const done    = assignments.filter(a => submitted.has(a.id));

  const AssignmentCard = ({ a, isOverdue }: { a: any; isOverdue?: boolean }) => (
    <Card className={`p-4 rounded-xl border-border shadow-sm ${isOverdue ? "border-destructive/30 bg-destructive/5" : ""}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div><p className="font-bold text-sm text-foreground">{a.title}</p><p className="text-xs text-muted-foreground">{a.subject}</p></div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${isOverdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{isOverdue ? "Overdue" : "Due"}: {a.dueDate ? new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</span>
      </div>
      {a.description && <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{a.description}</p>}
      <textarea className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:border-primary resize-none" rows={2} placeholder="Write your answer or notes..." value={notes[a.id] || ""} onChange={e => setNotes(n => ({ ...n, [a.id]: e.target.value }))} />
      <Button size="sm" className="w-full mt-2 rounded-xl font-bold" onClick={() => submit(a.id)} disabled={submitting === a.id}>
        {submitting === a.id ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Submitting...</> : <><Send className="w-3 h-3 mr-1" />Submit</>}
      </Button>
    </Card>
  );

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">My Assignments</h2>
      {assignments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No assignments yet</p><p className="text-sm mt-1">Your teacher hasn't posted any assignments</p></div>
      ) : (
        <>
          {pending.length > 0 && <><h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Pending ({pending.length})</h3>{pending.map(a => <AssignmentCard key={a.id} a={a} />)}</>}
          {overdue.length > 0 && <><h3 className="text-sm font-bold text-destructive uppercase tracking-wide mt-2">Overdue ({overdue.length})</h3>{overdue.map(a => <AssignmentCard key={a.id} a={a} isOverdue />)}</>}
          {done.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-green-600 uppercase tracking-wide mt-2">Submitted ({done.length})</h3>
              {done.map(a => (
                <Card key={a.id} className="p-4 rounded-xl border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <div className="flex items-center justify-between"><p className="font-bold text-sm text-foreground">{a.title}</p><span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Submitted</span></div>
                  {feedback[a.id]?.feedback && <p className="text-sm text-muted-foreground mt-2"><strong>Feedback:</strong> {feedback[a.id].feedback}</p>}
                  {feedback[a.id]?.marksObtained && <p className="text-sm text-primary font-bold mt-1">Marks: {feedback[a.id].marksObtained}</p>}
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

function StudentLeaveTab({ schoolId, studentId }: { schoolId: number; studentId?: number }) {
  const [leaves,     setLeaves]     = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ leaveType: "sick", fromDate: "", toDate: "", reason: "" });
  const { toast } = useToast();
  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    fetch(`${SBASE()}/api/student-leaves?schoolId=${schoolId}&studentId=${studentId}`, { headers: { Authorization: `Bearer ${STOK()}` } })
      .then(r => r.json()).then(d => setLeaves(d.leaves || [])).finally(() => setLoading(false));
  }, [studentId, schoolId]);
  const submit = async () => {
    if (!form.fromDate || !form.toDate || !form.reason) { toast({ title: "All fields required", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${SBASE()}/api/student-leaves`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${STOK()}` }, body: JSON.stringify({ ...form, studentId, schoolId, appliedBy: "student" }) });
      if (res.ok) { const d = await res.json(); setLeaves(l => [d.leave, ...l]); setForm({ leaveType: "sick", fromDate: "", toDate: "", reason: "" }); toast({ title: "Leave application submitted!" }); }
    } finally { setSubmitting(false); }
  };
  const S = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" } as Record<string, string>;
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold font-display">Leave Application</h2>
      <Card className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">Type</label><select value={form.leaveType} onChange={e => setForm(f => ({ ...f, leaveType: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background text-foreground focus:outline-none focus:border-primary"><option value="sick">Sick Leave</option><option value="family">Family</option><option value="festival">Festival</option><option value="other">Other</option></select></div>
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">From</label><Input type="date" value={form.fromDate} onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))} className="rounded-xl text-sm" /></div>
        </div>
        <div><label className="text-xs font-bold text-muted-foreground block mb-1">To Date</label><Input type="date" value={form.toDate} onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))} className="rounded-xl text-sm" /></div>
        <div><label className="text-xs font-bold text-muted-foreground block mb-1">Reason</label><textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={2} className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:border-primary resize-none" placeholder="Describe your reason..." /></div>
        <Button onClick={submit} disabled={submitting} className="w-full rounded-xl font-bold">{submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Apply for Leave"}</Button>
      </Card>
      <div className="space-y-2">
        <p className="text-sm font-bold text-muted-foreground">My Applications</p>
        {leaves.length === 0 ? <p className="text-center py-8 text-muted-foreground text-sm">No applications yet</p>
        : leaves.map((l: any) => (
          <Card key={l.id} className="p-4 rounded-xl border-border/50">
            <div className="flex items-start justify-between gap-2">
              <div><p className="font-bold text-sm capitalize">{l.leaveType} Leave</p><p className="text-xs text-muted-foreground">{l.fromDate} → {l.toDate}</p><p className="text-xs text-muted-foreground">{l.reason}</p></div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${S[l.status] || "bg-gray-100 text-gray-600"}`}>{l.status}</span>
            </div>
            {l.adminNote && <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">Note: {l.adminNote}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function StudentLibraryTab({ schoolId, studentId }: { schoolId: number; studentId?: number }) {
  const [books,       setBooks]       = useState<any[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  useEffect(() => {
    Promise.all([
      fetch(`${SBASE()}/api/library?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${STOK()}` } }).then(r => r.json()),
      studentId ? fetch(`${SBASE()}/api/library/issues?schoolId=${schoolId}&studentId=${studentId}`, { headers: { Authorization: `Bearer ${STOK()}` } }).then(r => r.json()) : Promise.resolve({ issues: [] }),
    ]).then(([bd, id]) => { setBooks(bd.books || []); setIssuedBooks(id.issues || []); }).finally(() => setLoading(false));
  }, [schoolId, studentId]);
  const issued = issuedBooks.filter(i => !i.returnedAt);
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold font-display">School Library</h2>
      {issued.length > 0 && (
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Currently Issued ({issued.length})</p>
          <div className="space-y-2">
            {issued.map((i: any) => {
              const book = books.find((b: any) => b.id === i.bookId);
              const due  = i.dueDate ? new Date(i.dueDate) : null;
              const overdue = due && due < new Date();
              return (
                <Card key={i.id} className={`p-4 rounded-xl shadow-sm ${overdue ? "border-red-200 bg-red-50 dark:bg-red-900/10" : "border-border"}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5 text-primary" /></div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{book?.title || `Book #${i.bookId}`}</p>
                      {book?.author && <p className="text-xs text-muted-foreground">by {book.author}</p>}
                      <p className={`text-xs mt-0.5 font-medium ${overdue ? "text-red-600" : "text-muted-foreground"}`}>Due: {due ? due.toLocaleDateString("en-IN") : "—"}{overdue ? " (Overdue!)" : ""}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Available Books ({books.length})</p>
        <div className="space-y-2">
          {books.length === 0 ? <p className="text-center py-8 text-muted-foreground text-sm">No books in library</p>
          : books.map((b: any) => (
            <Card key={b.id} className="p-3 rounded-xl border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0"><BookOpen className="w-4 h-4 text-muted-foreground" /></div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{b.title}</p>
                  {b.author && <p className="text-xs text-muted-foreground">by {b.author}</p>}
                  {b.subject && <p className="text-xs text-muted-foreground">{b.subject}</p>}
                </div>
                <Badge className={`text-xs ${b.availableCopies > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.availableCopies > 0 ? `${b.availableCopies} avail.` : "Unavailable"}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentAttendanceCalendar({ schoolId, studentId }: { schoolId: number; studentId?: number }) {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [month, setMonth] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    fetch(`${SBASE()}/api/attendance?schoolId=${schoolId}&studentId=${studentId}`, { headers: { Authorization: `Bearer ${STOK()}` } })
      .then(r => r.json()).then(d => setAttendance(d.attendance || [])).finally(() => setLoading(false));
  }, [studentId, schoolId]);
  const present = attendance.filter(a => a.status === "present").length;
  const absent  = attendance.filter(a => a.status === "absent").length;
  const pct     = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;
  const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();
  const firstDay    = new Date(month.year, month.month, 1).getDay();
  const attMap: Record<string, string> = {};
  attendance.forEach(a => { if (a.date) attMap[a.date.split("T")[0]] = a.status; });
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="text-xl font-bold font-display">Attendance Calendar</h2>
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 rounded-xl text-center"><p className="text-2xl font-bold text-green-600">{present}</p><p className="text-xs text-muted-foreground mt-0.5">Present</p></Card>
        <Card className="p-3 rounded-xl text-center"><p className="text-2xl font-bold text-red-500">{absent}</p><p className="text-xs text-muted-foreground mt-0.5">Absent</p></Card>
        <Card className="p-3 rounded-xl text-center"><p className={`text-2xl font-bold ${pct >= 75 ? "text-green-600" : "text-red-500"}`}>{pct}%</p><p className="text-xs text-muted-foreground mt-0.5">Attendance</p></Card>
      </div>
      <Card className="p-4 rounded-xl border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMonth(m => { const d = new Date(m.year, m.month - 1); return { year: d.getFullYear(), month: d.getMonth() }; })} className="p-1 rounded-lg hover:bg-secondary">‹</button>
          <p className="font-bold text-foreground">{MONTHS[month.month]} {month.year}</p>
          <button onClick={() => setMonth(m => { const d = new Date(m.year, m.month + 1); return { year: d.getFullYear(), month: d.getMonth() }; })} className="p-1 rounded-lg hover:bg-secondary">›</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {["S","M","T","W","T","F","S"].map((d, i) => <p key={i} className="text-[10px] font-bold text-muted-foreground">{d}</p>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day     = i + 1;
            const dateStr = `${month.year}-${String(month.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status  = attMap[dateStr];
            return <div key={day} className={`h-8 w-full flex items-center justify-center rounded-lg text-xs font-bold ${status === "present" ? "bg-green-100 text-green-700 dark:bg-green-900/40" : status === "absent" ? "bg-red-100 text-red-600 dark:bg-red-900/40" : "text-foreground/40"}`}>{day}</div>;
          })}
        </div>
        <div className="flex gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-400" /><span className="text-xs text-muted-foreground">Present</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-400" /><span className="text-xs text-muted-foreground">Absent</span></div>
        </div>
      </Card>
    </div>
  );
}

function StudentSyllabusTab({ schoolId, classId }: { schoolId: number; classId?: number }) {
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    fetch(`${SBASE()}/api/study-materials/syllabus?schoolId=${schoolId}&classId=${classId}`, { headers: { Authorization: `Bearer ${STOK()}` } })
      .then(r => r.json()).then(d => setSyllabus(d.syllabus || [])).finally(() => setLoading(false));
  }, [classId, schoolId]);
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold font-display">Syllabus</h2>
      {syllabus.length === 0 ? <div className="text-center py-16 text-muted-foreground"><FileText className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No syllabus uploaded yet</p><p className="text-sm mt-1">Check with your teacher</p></div>
      : syllabus.map((s: any) => (
        <Card key={s.id} className="p-4 rounded-xl border-border shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-primary" /></div>
            <div className="flex-1"><p className="font-bold text-foreground">{s.title}</p>{s.subject && <p className="text-sm text-muted-foreground">{s.subject}</p>}{s.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{s.description}</p>}</div>
            {s.fileUrl && <a href={s.fileUrl} target="_blank" rel="noreferrer" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 shrink-0"><Download className="w-4 h-4" /></a>}
          </div>
        </Card>
      ))}
    </div>
  );
}

function StudentQuizTab({ schoolId, classId }: { schoolId: number; classId?: number }) {
  const [quizzes,   setQuizzes]   = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeQuiz,setActiveQuiz]= useState<any>(null);
  const [answers,   setAnswers]   = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score,     setScore]     = useState<number | null>(null);
  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    fetch(`${SBASE()}/api/quizzes?schoolId=${schoolId}&classId=${classId}`, { headers: { Authorization: `Bearer ${STOK()}` } })
      .then(r => r.json()).then(d => setQuizzes(d.quizzes || [])).catch(() => setQuizzes([])).finally(() => setLoading(false));
  }, [classId, schoolId]);
  const submitQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    (activeQuiz.questions || []).forEach((q: any, i: number) => { if (answers[i] === q.correctAnswer) correct++; });
    setScore(correct); setSubmitted(true);
  };
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (activeQuiz && !submitted) return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3"><button onClick={() => { setActiveQuiz(null); setAnswers({}); }} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80">←</button><h2 className="text-xl font-bold font-display">{activeQuiz.title}</h2></div>
      {(activeQuiz.questions || []).map((q: any, i: number) => (
        <Card key={i} className="p-4 rounded-xl border-border shadow-sm">
          <p className="font-bold text-sm mb-3">{i + 1}. {q.question}</p>
          <div className="space-y-2">
            {(q.options || []).map((o: string, j: number) => (
              <button key={j} onClick={() => setAnswers(a => ({ ...a, [i]: o }))} className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-all ${answers[i] === o ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>{o}</button>
            ))}
          </div>
        </Card>
      ))}
      <Button onClick={submitQuiz} className="w-full rounded-xl font-bold">Submit Quiz</Button>
    </div>
  );
  if (activeQuiz && submitted) return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold font-display">Quiz Result</h2>
      <Card className="p-8 rounded-2xl text-center border-primary/20 bg-primary/5">
        <p className="text-5xl font-bold text-primary">{score}/{(activeQuiz.questions || []).length}</p>
        <p className="text-muted-foreground mt-2 font-medium">Questions Correct</p>
        <p className={`text-lg font-bold mt-2 ${(score || 0) / (activeQuiz.questions?.length || 1) >= 0.6 ? "text-green-600" : "text-red-500"}`}>{(score || 0) / (activeQuiz.questions?.length || 1) >= 0.6 ? "Great Job!" : "Keep Practising!"}</p>
      </Card>
      <Button variant="outline" onClick={() => { setActiveQuiz(null); setAnswers({}); setSubmitted(false); setScore(null); }} className="w-full rounded-xl">Back to Quizzes</Button>
    </div>
  );
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold font-display">Online Quizzes</h2>
      {quizzes.length === 0 ? <div className="text-center py-16 text-muted-foreground"><Award className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No quizzes available</p><p className="text-sm mt-1">Your teacher will add quizzes here</p></div>
      : quizzes.map((q: any) => (
        <Card key={q.id} className="p-4 rounded-xl border-border shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Award className="w-5 h-5 text-primary" /></div>
            <div className="flex-1"><p className="font-bold text-foreground">{q.title}</p>{q.subject && <p className="text-sm text-muted-foreground">{q.subject}</p>}<p className="text-xs text-muted-foreground mt-0.5">{(q.questions || []).length} questions</p></div>
            <Button size="sm" onClick={() => { setActiveQuiz(q); setAnswers({}); setSubmitted(false); setScore(null); }} className="rounded-xl shrink-0">Start</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
