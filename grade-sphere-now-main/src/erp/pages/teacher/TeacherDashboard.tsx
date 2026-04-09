import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useAuth } from "@/erp/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { useListClasses, useListStudents, useListNotices, useListTeachers, useMarkAttendance } from "@/erp/api-client";
import { BookOpen, CalendarCheck, Bell, User, LayoutDashboard, CheckCircle2, XCircle, Send, Loader2, ClipboardList, Calendar, Plus, Trash2, Clock, Award, Save, Edit2, MessageSquare, Eye, BarChart3, FileText, Phone, Heart, Activity, Sparkles, GraduationCap, Users, ClipboardCheck } from "lucide-react";
import TeacherAssignments from "./Assignments";
import TeacherMaterials from "./TeacherMaterials";
import Gradebook from "./Gradebook";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

const teacherLinks = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/teacher/classes", label: "My Classes", icon: BookOpen, group: "Teaching" },
  { href: "/teacher/attendance", label: "Attendance", icon: CalendarCheck, group: "Teaching" },
  { href: "/teacher/timetable", label: "Timetable", icon: Clock, group: "Teaching" },
  { href: "/teacher/homework", label: "Homework", icon: ClipboardList, group: "Teaching" },
  { href: "/teacher/assignments", label: "Assignments", icon: ClipboardCheck, group: "Teaching" },
  { href: "/teacher/gradebook", label: "Gradebook", icon: BarChart3, group: "Teaching" },
  { href: "/teacher/materials", label: "Study Materials", icon: FileText, group: "Teaching" },
  { href: "/teacher/syllabus", label: "Syllabus", icon: BookOpen, group: "Teaching" },
  { href: "/teacher/quiz", label: "Quizzes", icon: Award, group: "Teaching" },
  { href: "/teacher/examEntry", label: "Exam Marks", icon: Award, group: "Exams" },
  { href: "/teacher/performance", label: "Class Analytics", icon: BarChart3, group: "Exams" },
  { href: "/teacher/parentContact", label: "Parent Contact", icon: Phone, group: "Students" },
  { href: "/teacher/studentHealth", label: "Health Records", icon: Heart, group: "Students" },
  { href: "/teacher/notices", label: "Notices", icon: Bell, group: "Personal" },
  { href: "/teacher/leaves", label: "Leave Requests", icon: Calendar, group: "Personal" },
  { href: "/teacher/messages", label: "Messages", icon: MessageSquare, group: "Personal" },
  { href: "/teacher/profile", label: "My Profile", icon: User, group: "Personal" },
];

type Tab = "overview" | "classes" | "attendance" | "timetable" | "homework" | "examEntry" | "leaves" | "notices" | "profile" | "messages" | "performance" | "gradebook" | "assignments" | "materials" | "syllabus" | "parentContact" | "studentHealth" | "quiz";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const params = useParams<{ tab?: string }>();
  const [, setLocation] = useLocation();
  const activeTab = ((params.tab as Tab) || "overview");
  const setActiveTab = (tab: Tab) => setLocation(`/teacher/${tab}`);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, "present" | "absent" | "late">>({});
  const [submitting, setSubmitting] = useState(false);

  // Homework state
  const [homework, setHomework] = useState<any[]>([]);
  const [hwOpen, setHwOpen] = useState(false);
  const [hwForm, setHwForm] = useState({ classId: "", subject: "", title: "", description: "", dueDate: "" });
  const [hwLoading, setHwLoading] = useState(false);
  const [viewingSubmissionsForHw, setViewingSubmissionsForHw] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);

  // Performance analytics state
  const [perfClassId, setPerfClassId] = useState("");
  const [perfExams, setPerfExams] = useState<any[]>([]);
  const [perfResults, setPerfResults] = useState<any[]>([]);
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfExamId, setPerfExamId] = useState("");

  // Leave state
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ leaveType: "casual", fromDate: "", toDate: "", reason: "" });
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [myTeacherId, setMyTeacherId] = useState<number | null>(null);

  // Timetable state
  const [timetableClassId, setTimetableClassId] = useState<string>("");
  const [timetable, setTimetable] = useState<any[]>([]);
  const [ttLoading, setTtLoading] = useState(false);

  // Exam entry state
  const [exams, setExams] = useState<any[]>([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [examStudents, setExamStudents] = useState<any[]>([]);
  const [marksMap, setMarksMap] = useState<Record<number, string>>({});
  const [savingMarks, setSavingMarks] = useState(false);

  // Profile state
  const [myTeacher, setMyTeacher] = useState<any | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});

  // Messages state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [msgContacts, setMsgContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [contactsLoading, setContactsLoading] = useState(false);
  const bottomMsgRef = useRef<HTMLDivElement>(null);

  const markAttendanceMutation = useMarkAttendance();
  const { data: classesData, isLoading: classesLoading } = useListClasses({ schoolId });
  const classes = classesData?.classes || [];
  const effectiveClassId = selectedClassId ?? (classes[0]?.id ?? null);
  const { data: studentsData, isLoading: studentsLoading } = useListStudents({ schoolId, classId: effectiveClassId ?? undefined }, { enabled: !!effectiveClassId });
  const students = studentsData?.students || [];
  const { data: noticesData } = useListNotices({ schoolId });
  const notices = noticesData?.notices || [];
  const { data: teachersData } = useListTeachers({ schoolId });

  useEffect(() => {
    const myRecord = teachersData?.teachers?.find((t: any) => t.userId === user?.id) || teachersData?.teachers?.[0];
    if (myRecord?.id) { setMyTeacherId(myRecord.id); setMyTeacher(myRecord); setProfileForm({ name: myRecord.name || "", subject: myRecord.subject || "", phone: myRecord.phone || "", email: myRecord.email || user?.email || "", qualification: myRecord.qualification || "", experience: myRecord.experience || "" }); }
  }, [teachersData]);

  useEffect(() => {
    if (activeTab === "homework" && myTeacherId) {
      setHwLoading(true);
      fetch(`${BASE}/api/homework?schoolId=${schoolId}&teacherId=${myTeacherId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setHomework(d.homework || [])).finally(() => setHwLoading(false));
    }
  }, [activeTab, myTeacherId]);

  useEffect(() => {
    if (activeTab === "leaves" && myTeacherId) {
      setLeaveLoading(true);
      fetch(`${BASE}/api/leaves?schoolId=${schoolId}&teacherId=${myTeacherId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setLeaves(d.leaves || [])).finally(() => setLeaveLoading(false));
    }
  }, [activeTab, myTeacherId]);

  useEffect(() => {
    if (activeTab === "timetable" && timetableClassId) fetchTimetable(timetableClassId);
  }, [activeTab, timetableClassId]);

  useEffect(() => {
    if (classes.length > 0 && !timetableClassId) setTimetableClassId(String(classes[0]?.id));
  }, [classes]);

  useEffect(() => {
    if (activeTab === "examEntry") {
      setExamsLoading(true);
      fetch(`${BASE}/api/exams?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setExams(d.exams || [])).finally(() => setExamsLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "messages" && user?.id) {
      setContactsLoading(true);
      fetch(`${BASE}/api/messages/contacts`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setMsgContacts(d.contacts || [])).finally(() => setContactsLoading(false));
    }
  }, [activeTab, user?.id]);

  useEffect(() => {
    if (selectedContact && user?.id) {
      setMsgLoading(true);
      fetch(`${BASE}/api/messages?withUserId=${selectedContact.id}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setChatMessages(d.messages || [])).finally(() => setMsgLoading(false));
    }
  }, [selectedContact, user?.id]);

  useEffect(() => {
    if (activeTab === "messages") {
      setTimeout(() => bottomMsgRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [chatMessages, activeTab]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !selectedContact) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ schoolId, senderId: user.id, receiverId: selectedContact.id, senderRole: "teacher", message: newMessage }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, data.message || data]);
      setNewMessage("");
    } catch { toast({ title: "Failed to send message", variant: "destructive" }); }
    finally { setSending(false); }
  };

  const fetchTimetable = (classId: string) => {
    setTtLoading(true);
    fetch(`${BASE}/api/timetable?schoolId=${schoolId}&classId=${classId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setTimetable(d.timetable || [])).finally(() => setTtLoading(false));
  };

  const handleSelectExam = async (exam: any) => {
    setSelectedExam(exam);
    setMarksMap({});
    const res = await fetch(`${BASE}/api/students?schoolId=${schoolId}&classId=${exam.classId}`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const d = await res.json();
    const studs = d.students || [];
    setExamStudents(studs);
    const existing = await fetch(`${BASE}/api/exams/${exam.id}/results`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const eData = await existing.json();
    const map: Record<number, string> = {};
    (eData.results || []).forEach((r: any) => { map[r.studentId] = String(r.marksObtained); });
    setMarksMap(map);
  };

  const handleSaveMarks = async () => {
    if (!selectedExam) return;
    setSavingMarks(true);
    try {
      const results = examStudents.map(s => ({ studentId: s.id, marksObtained: Number(marksMap[s.id] || 0), remarks: "" }));
      await fetch(`${BASE}/api/exams/${selectedExam.id}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ results }),
      });
      toast({ title: "Marks saved!", description: `Results saved for ${results.length} students.` });
      setSelectedExam(null);
    } catch {
      toast({ title: "Error", description: "Failed to save marks", variant: "destructive" });
    } finally {
      setSavingMarks(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!myTeacherId) return;
    try {
      await fetch(`${BASE}/api/teachers/${myTeacherId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(profileForm),
      });
      setMyTeacher((prev: any) => ({ ...prev, ...profileForm }));
      setEditingProfile(false);
      toast({ title: "Profile updated!" });
    } catch {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  const handleAddHomework = async () => {
    if (!hwForm.classId || !hwForm.subject || !hwForm.title || !hwForm.dueDate) return;
    const res = await fetch(`${BASE}/api/homework`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ schoolId, teacherId: myTeacherId, ...hwForm, classId: Number(hwForm.classId) }),
    });
    const data = await res.json();
    setHomework(prev => [data, ...prev]);
    setHwOpen(false);
    setHwForm({ classId: "", subject: "", title: "", description: "", dueDate: "" });
    toast({ title: "Homework assigned!" });
  };

  const handleDeleteHomework = async (id: number) => {
    await fetch(`${BASE}/api/homework/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    setHomework(prev => prev.filter(h => h.id !== id));
    toast({ title: "Homework removed" });
  };

  const handleSubmitLeave = async () => {
    if (!leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason || !myTeacherId) return;
    const res = await fetch(`${BASE}/api/leaves`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ schoolId, teacherId: myTeacherId, ...leaveForm }),
    });
    const data = await res.json();
    setLeaves(prev => [data, ...prev]);
    setLeaveOpen(false);
    setLeaveForm({ leaveType: "casual", fromDate: "", toDate: "", reason: "" });
    toast({ title: "Leave request submitted!" });
  };

  const getStatusColor = (s: string) =>
    s === "present" ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
    : s === "absent" ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"
    : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";

  const cycleStatus = (id: number) => {
    setAttendanceMap(prev => {
      const cur = prev[id] ?? "present";
      const next: "present" | "absent" | "late" = cur === "present" ? "absent" : cur === "absent" ? "late" : "present";
      return { ...prev, [id]: next };
    });
  };

  const handleSubmitAttendance = async () => {
    if (!effectiveClassId || !students.length) return;
    setSubmitting(true);
    try {
      const records = students.map((s: any) => ({ studentId: s.id, status: attendanceMap[s.id] ?? "present" }));
      await markAttendanceMutation.mutateAsync({ data: { schoolId, classId: effectiveClassId, date: attendanceDate, records } as any });
      toast({ title: "Attendance saved!", description: `Marked for ${records.length} students.` });
    } catch { toast({ title: "Error", description: "Failed to save attendance", variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  const markAll = (status: "present" | "absent") => {
    const map: Record<number, "present" | "absent" | "late"> = {};
    students.forEach((s: any) => { map[s.id] = status; });
    setAttendanceMap(map);
  };

  const LEAVE_STATUS_COLOR: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timetableByDay = DAYS.map(day => ({ day, periods: timetable.filter((p: any) => p.day === day) })).filter(d => d.periods.length > 0);

  return (
    <AdminLayout title="Teacher Dashboard" links={teacherLinks}>

      {/* OVERVIEW TAB */}
      {(activeTab === "overview" || !activeTab) && (
        <TeacherOverview
          user={user}
          schoolId={schoolId}
          classes={classes}
          students={students}
          myTeacher={myTeacher}
          onNavigate={setActiveTab}
        />
      )}

      {/* CLASSES TAB */}
      {activeTab === "classes" && (
        <div>
          <h2 className="text-xl font-bold mb-6 dark:text-white">My Classes <span className="text-muted-foreground font-medium text-base ml-1">({classes.length})</span></h2>
          {classesLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : classes.length === 0 ? <div className="text-center py-20 text-muted-foreground"><BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" /><p className="text-xl font-bold">No classes assigned</p></div>
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls: any) => (
                <Card key={cls.id} className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => { setSelectedClassId(cls.id); setActiveTab("attendance"); }}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">{cls.name?.charAt(0)}</div>
                  <h3 className="text-lg font-bold dark:text-white">{cls.name}{cls.section ? `-${cls.section}` : ""}</h3>
                  <p className="text-sm text-muted-foreground">{cls.subject || "General"}</p>
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold dark:border-gray-600 dark:text-gray-300"
                      onClick={e => { e.stopPropagation(); setHwForm(p => ({ ...p, classId: String(cls.id) })); setActiveTab("homework"); }}>
                      Assign HW
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold dark:border-gray-600 dark:text-gray-300"
                      onClick={e => { e.stopPropagation(); setSelectedClassId(cls.id); setActiveTab("attendance"); }}>
                      Attendance
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg text-xs font-bold dark:border-gray-600 dark:text-gray-300"
                      onClick={e => { e.stopPropagation(); setTimetableClassId(String(cls.id)); setActiveTab("timetable"); }}>
                      Timetable
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ATTENDANCE TAB */}
      {activeTab === "attendance" && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
            <h2 className="text-xl font-bold dark:text-white">Mark Attendance</h2>
            <div className="flex gap-3 flex-wrap items-center">
              <Select value={effectiveClassId?.toString() ?? ""} onValueChange={v => setSelectedClassId(Number(v))}>
                <SelectTrigger className="w-44 rounded-xl h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select Class" /></SelectTrigger>
                <SelectContent>{classes.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}{c.section ? `-${c.section}` : ""}</SelectItem>)}</SelectContent>
              </Select>
              <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
                className="rounded-xl border border-border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 h-10 text-sm font-medium bg-background focus:outline-none" />
              <Button variant="outline" size="sm" className="h-10 dark:border-gray-600 dark:text-gray-300" onClick={() => markAll("present")}><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600" />All Present</Button>
              <Button variant="outline" size="sm" className="h-10 dark:border-gray-600 dark:text-gray-300" onClick={() => markAll("absent")}><XCircle className="w-3.5 h-3.5 mr-1.5 text-red-500" />All Absent</Button>
            </div>
          </div>
          {studentsLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : students.length === 0 ? <div className="text-center py-16 text-muted-foreground"><User className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No students</p></div>
          : (
            <>
              <div className="space-y-3 mb-6">
                {students.map((student: any) => {
                  const status = attendanceMap[student.id] ?? "present";
                  return (
                    <Card key={student.id} className="p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{student.name?.charAt(0)}</div>
                        <div><p className="font-bold dark:text-white">{student.name}</p><p className="text-xs text-muted-foreground">{student.admissionNo}</p></div>
                      </div>
                      <button onClick={() => cycleStatus(student.id)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${getStatusColor(status)}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>
                    </Card>
                  );
                })}
              </div>
              <Button onClick={handleSubmitAttendance} disabled={submitting} className="w-full h-12 rounded-xl font-bold text-base">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                Submit Attendance ({students.length} students)
              </Button>
            </>
          )}
        </div>
      )}

      {/* TIMETABLE TAB */}
      {activeTab === "timetable" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-white">Class Timetable</h2>
            <Select value={timetableClassId} onValueChange={v => { setTimetableClassId(v); fetchTimetable(v); }}>
              <SelectTrigger className="w-48 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select Class" /></SelectTrigger>
              <SelectContent>{classes.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? `-${c.section}` : ""}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {ttLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : timetable.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">No timetable set for this class</p>
              <p className="text-sm mt-1">Ask the school admin to add periods</p>
            </div>
          ) : timetableByDay.length === 0 ? (
            <div className="space-y-3">
              {timetable.map((p: any, i) => (
                <Card key={i} className="p-4 rounded-xl flex items-center gap-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="text-center w-20 shrink-0">
                    <p className="text-xs font-bold text-primary">{p.startTime}</p>
                    <p className="text-xs text-muted-foreground">{p.endTime}</p>
                  </div>
                  <div className="w-px h-8 bg-border dark:bg-gray-600" />
                  <div><p className="font-bold dark:text-white">{p.subject}</p><p className="text-xs text-muted-foreground">{p.day}{p.room ? ` • Room ${p.room}` : ""}</p></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {timetableByDay.map(({ day, periods }) => (
                <div key={day}>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">{day}</h3>
                  <div className="space-y-2">
                    {periods.map((p: any, i: number) => (
                      <Card key={i} className="p-4 rounded-xl flex items-center gap-4 dark:bg-gray-800 dark:border-gray-700">
                        <div className="text-center w-20 shrink-0">
                          <p className="text-xs font-bold text-primary">{p.startTime}</p>
                          <p className="text-xs text-muted-foreground">{p.endTime}</p>
                        </div>
                        <div className="w-px h-8 bg-border dark:bg-gray-600" />
                        <div className="flex-1">
                          <p className="font-bold dark:text-white">{p.subject}</p>
                          {p.room && <p className="text-xs text-muted-foreground">Room {p.room}</p>}
                        </div>
                        <Badge variant="secondary" className="text-xs rounded-full">{p.subject}</Badge>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HOMEWORK TAB */}
      {activeTab === "homework" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-white">Homework Assignments</h2>
            <Dialog open={hwOpen} onOpenChange={setHwOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2"/>Assign Homework</Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader><DialogTitle className="dark:text-white">Assign Homework</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="dark:text-gray-300">Class *</Label>
                    <Select value={hwForm.classId} onValueChange={v => setHwForm(p => ({ ...p, classId: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>{classes.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` - ${c.section}` : ""}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="dark:text-gray-300">Subject *</Label><Input value={hwForm.subject} onChange={e => setHwForm(p => ({ ...p, subject: e.target.value }))} placeholder="Mathematics" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><Label className="dark:text-gray-300">Due Date *</Label><Input type="date" value={hwForm.dueDate} onChange={e => setHwForm(p => ({ ...p, dueDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                  </div>
                  <div><Label className="dark:text-gray-300">Title *</Label><Input value={hwForm.title} onChange={e => setHwForm(p => ({ ...p, title: e.target.value }))} placeholder="Complete exercises 1-10" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                  <div><Label className="dark:text-gray-300">Description</Label><Textarea rows={3} value={hwForm.description} onChange={e => setHwForm(p => ({ ...p, description: e.target.value }))} placeholder="Additional instructions..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                  <Button onClick={handleAddHomework} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Assign Homework</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {hwLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : homework.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"/>
              <p className="text-gray-500 dark:text-gray-400">No homework assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {homework.map((hw: any) => (
                <Card key={hw.id} className="p-4 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400"/></div>
                    <div>
                      <p className="font-semibold dark:text-white">{hw.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{hw.subject} • Due: {new Date(hw.dueDate).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={async () => {
                      setViewingSubmissionsForHw(hw);
                      setSubsLoading(true);
                      fetch(`${BASE}/api/homework/${hw.id}/submissions`, { headers: { Authorization: `Bearer ${getToken()}` } })
                        .then(r => r.json()).then(d => setSubmissions(d.submissions || [])).finally(() => setSubsLoading(false));
                    }} className="text-blue-500 hover:text-blue-700 p-2 text-xs font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4"/> Submissions
                    </button>
                    <button onClick={() => handleDeleteHomework(hw.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {viewingSubmissionsForHw && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-lg p-6 rounded-2xl dark:bg-gray-800 dark:border-gray-700 max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div><h3 className="font-bold dark:text-white">Submissions — {viewingSubmissionsForHw.title}</h3><p className="text-xs text-muted-foreground">{viewingSubmissionsForHw.subject}</p></div>
                  <button onClick={() => { setViewingSubmissionsForHw(null); setSubmissions([]); }} className="text-muted-foreground hover:text-foreground">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {subsLoading ? <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
                  : submissions.length === 0 ? <div className="text-center py-8 text-muted-foreground"><ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No submissions yet</p></div>
                  : submissions.map((sub: any) => (
                    <div key={sub.id} className="p-3 bg-secondary/50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm dark:text-white">{sub.student?.name || "Student"}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${sub.status === "submitted" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : sub.status === "late" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>{sub.status}</span>
                      </div>
                      {sub.note && <p className="text-xs text-muted-foreground">{sub.note}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString("en-IN") : ""}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* EXAM ENTRY TAB */}
      {activeTab === "examEntry" && (
        <div>
          {selectedExam ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button onClick={() => setSelectedExam(null)} className="text-sm text-primary font-bold hover:underline mb-1">← Back to exams</button>
                  <h2 className="text-xl font-bold dark:text-white">Enter Marks: {selectedExam.examName || selectedExam.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedExam.subject} • Max Marks: {selectedExam.maxMarks} • Pass: {selectedExam.passingMarks}</p>
                </div>
                <Button onClick={handleSaveMarks} disabled={savingMarks} className="rounded-xl font-bold">
                  {savingMarks ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Marks
                </Button>
              </div>
              {examStudents.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground"><User className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No students in this class</p></div>
              ) : (
                <div className="space-y-3">
                  {examStudents.map((s: any) => {
                    const marks = marksMap[s.id] ?? "";
                    const numMarks = Number(marks);
                    const pct = marks ? (numMarks / selectedExam.maxMarks) * 100 : null;
                    const grade = pct !== null ? (pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C+" : pct >= 40 ? "C" : pct >= 35 ? "D" : "F") : "";
                    const passed = pct !== null ? numMarks >= selectedExam.passingMarks : null;
                    return (
                      <Card key={s.id} className="p-4 rounded-xl flex items-center gap-4 dark:bg-gray-800 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">{s.name?.charAt(0)}</div>
                        <div className="flex-1">
                          <p className="font-bold dark:text-white">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.admissionNo}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number" min={0} max={selectedExam.maxMarks}
                            value={marks}
                            onChange={e => setMarksMap(prev => ({ ...prev, [s.id]: e.target.value }))}
                            placeholder={`/ ${selectedExam.maxMarks}`}
                            className="w-24 text-center rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                          {grade && <span className={`text-sm font-bold w-8 text-center ${passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{grade}</span>}
                          {passed !== null && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${passed ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                              {passed ? "Pass" : "Fail"}
                            </span>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-6 dark:text-white">Select Exam to Enter Marks</h2>
              {examsLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              : exams.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-bold">No exams scheduled yet</p>
                  <p className="text-sm mt-1">Ask the school admin to schedule exams</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exams.map((exam: any) => (
                    <Card key={exam.id} className="p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-shadow dark:bg-gray-800 dark:border-gray-700 border-border hover:border-primary/50"
                      onClick={() => handleSelectExam(exam)}>
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold dark:text-white">{exam.examName || exam.name}</h3>
                      <p className="text-sm text-muted-foreground">{exam.subject}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="secondary" className="text-xs capitalize rounded-full">{exam.examType?.replace("_", " ")}</Badge>
                        <span className="text-xs text-muted-foreground">{exam.examDate ? new Date(exam.examDate).toLocaleDateString("en-IN") : ""}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Max: {exam.maxMarks} | Pass: {exam.passingMarks}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LEAVES TAB */}
      {activeTab === "leaves" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-white">Leave Requests</h2>
            <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2"/>Apply Leave</Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader><DialogTitle className="dark:text-white">Apply for Leave</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="dark:text-gray-300">Leave Type</Label>
                    <Select value={leaveForm.leaveType} onValueChange={v => setLeaveForm(p => ({ ...p, leaveType: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual Leave</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="earned">Earned Leave</SelectItem>
                        <SelectItem value="maternity">Maternity Leave</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="dark:text-gray-300">From Date *</Label><Input type="date" value={leaveForm.fromDate} onChange={e => setLeaveForm(p => ({ ...p, fromDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><Label className="dark:text-gray-300">To Date *</Label><Input type="date" value={leaveForm.toDate} onChange={e => setLeaveForm(p => ({ ...p, toDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                  </div>
                  <div><Label className="dark:text-gray-300">Reason *</Label><Textarea rows={3} value={leaveForm.reason} onChange={e => setLeaveForm(p => ({ ...p, reason: e.target.value }))} placeholder="Reason for leave..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                  <Button onClick={handleSubmitLeave} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Submit Request</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {leaveLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : leaves.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"/>
              <p className="text-gray-500 dark:text-gray-400">No leave requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaves.map((leave: any) => (
                <Card key={leave.id} className="p-4 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold dark:text-white capitalize">{leave.leaveType?.replace("_", " ")} Leave</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${LEAVE_STATUS_COLOR[leave.status] || ""}`}>{leave.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(leave.fromDate).toLocaleDateString("en-IN")} — {new Date(leave.toDate).toLocaleDateString("en-IN")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{leave.reason}</p>
                      {leave.adminNote && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Admin note: {leave.adminNote}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NOTICES TAB */}
      {activeTab === "notices" && (
        <div>
          <h2 className="text-xl font-bold mb-4 dark:text-white">School Notices</h2>
          {notices.length === 0 ? <div className="text-center py-16 text-muted-foreground"><Bell className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No notices</p></div>
          : (
            <div className="space-y-4">
              {notices.map((notice: any) => (
                <Card key={notice.id} className="p-5 rounded-2xl shadow-sm flex items-start gap-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className={`p-3 rounded-xl shrink-0 ${notice.type === "exam" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" : "bg-primary/10 text-primary"}`}><Bell className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold dark:text-white">{notice.title}</h3>
                    {notice.body && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notice.body}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary" className="text-xs capitalize rounded-full">{notice.type}</Badge>
                      <span className="text-xs text-muted-foreground">{notice.createdAt ? new Date(notice.createdAt).toLocaleDateString("en-IN") : ""}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CLASS PERFORMANCE ANALYTICS TAB */}
      {activeTab === "performance" && (
        <div>
          <h2 className="text-xl font-bold dark:text-white mb-6">Class Performance Analytics</h2>
          <div className="flex gap-3 flex-wrap mb-6">
            <Select value={perfClassId} onValueChange={async (v) => {
              setPerfClassId(v);
              setPerfExamId("");
              setPerfResults([]);
              const res = await fetch(`${BASE}/api/exams?schoolId=${schoolId}&classId=${v}`, { headers: { Authorization: `Bearer ${getToken()}` } });
              const d = await res.json(); setPerfExams(d.exams || []);
            }}>
              <SelectTrigger className="w-44 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>{classes.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
            </Select>
            {perfExams.length > 0 && (
              <Select value={perfExamId} onValueChange={async (v) => {
                setPerfExamId(v);
                setPerfLoading(true);
                try {
                  const res = await fetch(`${BASE}/api/exams/${v}/results`, { headers: { Authorization: `Bearer ${getToken()}` } });
                  const d = await res.json(); setPerfResults(d.results || []);
                } finally { setPerfLoading(false); }
              }}>
                <SelectTrigger className="w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select exam" /></SelectTrigger>
                <SelectContent>{perfExams.map((e: any) => <SelectItem key={e.id} value={String(e.id)}>{e.title}</SelectItem>)}</SelectContent>
              </Select>
            )}
          </div>
          {!perfClassId && <div className="text-center py-16 text-muted-foreground"><Award className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Select a class to view performance analytics</p></div>}
          {perfClassId && !perfExamId && perfExams.length > 0 && <div className="text-center py-12 text-muted-foreground"><p>Select an exam to view results</p></div>}
          {perfClassId && perfExams.length === 0 && <div className="text-center py-12 text-muted-foreground"><p>No exams found for this class</p></div>}
          {perfLoading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
          {perfExamId && !perfLoading && perfResults.length > 0 && (() => {
            const subjects = [...new Set(perfResults.map((r: any) => r.subject))];
            const students = [...new Set(perfResults.map((r: any) => r.studentId))];
            const avgBySubject = subjects.map(sub => {
              const marks = perfResults.filter((r: any) => r.subject === sub && r.marksObtained != null);
              const avg = marks.length ? marks.reduce((s: number, r: any) => s + Number(r.marksObtained), 0) / marks.length : 0;
              const max = marks.length ? Number(marks[0].totalMarks) : 100;
              return { sub, avg: Math.round(avg * 10) / 10, max, pct: Math.round((avg / max) * 100) };
            });
            const topStudents = students.map(sid => {
              const rs = perfResults.filter((r: any) => r.studentId === sid);
              const total = rs.reduce((s: number, r: any) => s + Number(r.marksObtained || 0), 0);
              const max = rs.reduce((s: number, r: any) => s + Number(r.totalMarks || 100), 0);
              return { name: rs[0]?.studentName || `Student ${sid}`, total, max, pct: max ? Math.round((total / max) * 100) : 0 };
            }).sort((a, b) => b.pct - a.pct);
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[{ label: "Students", val: students.length }, { label: "Subjects", val: subjects.length }, { label: "Class Avg", val: `${Math.round(topStudents.reduce((s, x) => s + x.pct, 0) / topStudents.length)}%` }, { label: "Top Score", val: `${topStudents[0]?.pct || 0}%` }].map(m => (
                    <Card key={m.label} className="p-4 rounded-xl text-center dark:bg-gray-800 dark:border-gray-700"><p className="text-xs text-muted-foreground mb-1">{m.label}</p><p className="text-2xl font-bold dark:text-white">{m.val}</p></Card>
                  ))}
                </div>
                <Card className="p-5 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold mb-4 dark:text-white">Subject-wise Performance</h3>
                  <div className="space-y-3">
                    {avgBySubject.map(s => (
                      <div key={s.sub}>
                        <div className="flex justify-between text-sm mb-1"><span className="font-medium dark:text-gray-300">{s.sub}</span><span className="text-muted-foreground">{s.avg}/{s.max} ({s.pct}%)</span></div>
                        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${s.pct >= 75 ? "bg-green-500" : s.pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${s.pct}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-5 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold mb-4 dark:text-white">Student Rankings</h3>
                  <div className="space-y-2">
                    {topStudents.slice(0, 10).map((s, i) => (
                      <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 dark:bg-gray-700/50">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-200 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-secondary text-muted-foreground"}`}>{i + 1}</span>
                        <p className="flex-1 font-medium text-sm dark:text-white">{s.name}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.pct >= 75 ? "bg-green-100 text-green-700" : s.pct >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })()}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === "messages" && (
        <div>
          <h2 className="text-xl font-bold mb-4 dark:text-white">Messages</h2>
          <div className="flex gap-4 h-[580px]">
            {/* Contacts panel */}
            <Card className="w-72 shrink-0 rounded-2xl dark:bg-gray-800 dark:border-gray-700 flex flex-col overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700">
                <p className="font-bold text-sm dark:text-white">Conversations</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {contactsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
                ) : msgContacts.length === 0 ? (
                  <div className="text-center py-10 px-4 text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm font-medium">No conversations yet</p>
                    <p className="text-xs mt-1">Messages you receive will appear here</p>
                  </div>
                ) : msgContacts.map((c: any) => (
                  <button key={c.id} onClick={() => setSelectedContact(c)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700/50 ${selectedContact?.id === c.id ? "bg-primary/10 dark:bg-primary/20" : ""}`}>
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">{c.name?.[0] || "?"}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm dark:text-white truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{c.unread}</span>}
                  </button>
                ))}
              </div>
            </Card>
            {/* Chat panel */}
            <Card className="flex-1 rounded-2xl dark:bg-gray-800 dark:border-gray-700 flex flex-col overflow-hidden">
              {!selectedContact ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">Select a conversation</p><p className="text-sm mt-1">Choose a contact from the left to start chatting</p></div>
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{selectedContact.name?.[0]}</div>
                    <p className="font-bold text-sm dark:text-white">{selectedContact.name}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {msgLoading ? (
                      <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>
                    ) : chatMessages.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground"><p className="text-sm">No messages yet. Say hello!</p></div>
                    ) : chatMessages.map((msg: any) => {
                      const isMine = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMine ? "bg-primary text-white rounded-br-sm" : "bg-secondary dark:bg-gray-700 dark:text-gray-100 rounded-bl-sm"}`}>
                            <p>{msg.message}</p>
                            <p className="text-xs mt-1 opacity-60">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomMsgRef} />
                  </div>
                  <div className="border-t dark:border-gray-700 p-3 flex gap-2">
                    <input className="flex-1 px-4 py-2 rounded-xl border dark:border-gray-600 bg-transparent dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()} disabled={sending} />
                    <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()} className="rounded-xl">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-white">My Profile</h2>
            <Button variant="outline" className="rounded-xl dark:border-gray-600 dark:text-gray-300" onClick={() => setEditingProfile(!editingProfile)}>
              <Edit2 className="w-4 h-4 mr-2" /> {editingProfile ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
          {!myTeacher ? (
            <div className="text-center py-16 text-muted-foreground"><User className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">Profile not found</p></div>
          ) : editingProfile ? (
            <Card className="p-6 rounded-2xl dark:bg-gray-800 dark:border-gray-700 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="dark:text-gray-300">Full Name</Label><Input value={profileForm.name} onChange={e => setProfileForm((p: any) => ({ ...p, name: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                <div><Label className="dark:text-gray-300">Subject</Label><Input value={profileForm.subject} onChange={e => setProfileForm((p: any) => ({ ...p, subject: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                <div><Label className="dark:text-gray-300">Phone</Label><Input value={profileForm.phone} onChange={e => setProfileForm((p: any) => ({ ...p, phone: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                <div><Label className="dark:text-gray-300">Email</Label><Input value={profileForm.email} onChange={e => setProfileForm((p: any) => ({ ...p, email: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                <div><Label className="dark:text-gray-300">Qualification</Label><Input value={profileForm.qualification} onChange={e => setProfileForm((p: any) => ({ ...p, qualification: e.target.value }))} placeholder="B.Ed, M.Sc..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                <div><Label className="dark:text-gray-300">Experience (years)</Label><Input type="number" value={profileForm.experience} onChange={e => setProfileForm((p: any) => ({ ...p, experience: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
              </div>
              <Button onClick={handleSaveProfile} className="w-full rounded-xl font-bold"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </Card>
          ) : (
            <Card className="p-6 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border dark:border-gray-700">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                  {(myTeacher.name || "T")[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold dark:text-white">{myTeacher.name}</h3>
                  <p className="text-primary font-medium">{myTeacher.subject || "Teacher"}</p>
                  <p className="text-sm text-muted-foreground">{myTeacher.qualification || "—"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Employee ID", value: myTeacher.employeeId || `EMP-${myTeacher.id}` },
                  { label: "Subject", value: myTeacher.subject || "—" },
                  { label: "Phone", value: myTeacher.phone || "—" },
                  { label: "Email", value: myTeacher.email || user?.email || "—" },
                  { label: "Qualification", value: myTeacher.qualification || "—" },
                  { label: "Experience", value: myTeacher.experience ? `${myTeacher.experience} years` : "—" },
                  { label: "Joined", value: myTeacher.joiningDate ? new Date(myTeacher.joiningDate).toLocaleDateString("en-IN") : "—" },
                  { label: "Status", value: myTeacher.status || "Active" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-secondary/30 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-xs font-bold text-muted-foreground mb-0.5">{label}</p>
                    <p className="text-sm font-bold dark:text-white capitalize">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* GRADEBOOK TAB */}
      {activeTab === "gradebook" && (
        <div>
          <h2 className="text-xl font-bold mb-6 dark:text-white">Student Gradebook</h2>
          <Gradebook schoolId={schoolId} teacherId={myTeacherId || 0} />
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {activeTab === "assignments" && (
        <div>
          <h2 className="text-xl font-bold mb-6 dark:text-white">Assignments</h2>
          <TeacherAssignments schoolId={schoolId} teacherId={myTeacherId || 0} />
        </div>
      )}

      {/* MATERIALS TAB */}
      {activeTab === "materials" && (
        <div>
          <h2 className="text-xl font-bold mb-6 dark:text-white">Study Materials</h2>
          <TeacherMaterials schoolId={schoolId} teacherId={myTeacherId || 0} />
        </div>
      )}

      {/* SYLLABUS TAB */}
      {activeTab === "syllabus" && (
        <TeacherSyllabus schoolId={schoolId} teacherId={myTeacherId || 0} classes={classes} />
      )}

      {activeTab === "parentContact" && (
        <TeacherParentContact schoolId={schoolId} classes={classes} students={students} />
      )}

      {activeTab === "studentHealth" && (
        <TeacherStudentHealth schoolId={schoolId} students={students} />
      )}

      {/* QUIZ TAB */}
      {activeTab === "quiz" && (
        <TeacherQuizBuilder schoolId={schoolId} classes={classes} teacherId={myTeacherId || 0} />
      )}

    </AdminLayout>
  );
}

function TeacherSyllabus({ schoolId, teacherId, classes }: { schoolId: number; teacherId: number; classes: any[] }) {
  const [selClass, setSelClass] = useState<number | null>(classes[0]?.id || null);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", chapter: "", topics: "", plannedDate: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (!selClass) return;
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/api/study-materials/syllabus?schoolId=${schoolId}&classId=${selClass}`, { headers: { Authorization: `Bearer ${localStorage.getItem("myschool_token")}` } })
      .then(r => r.json()).then(d => setSyllabus(d.syllabus || [])).finally(() => setLoading(false));
  }, [selClass, schoolId]);

  const addTopic = async () => {
    if (!form.subject || !form.chapter) { toast({ title: "Subject and chapter required", variant: "destructive" }); return; }
    const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
    const res = await fetch(`${BASE}/api/study-materials/syllabus`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("myschool_token")}` },
      body: JSON.stringify({ ...form, classId: selClass, schoolId, teacherId, isCompleted: false }),
    });
    if (res.ok) { const d = await res.json(); setSyllabus(s => [d.item, ...s]); setForm({ subject: "", chapter: "", topics: "", plannedDate: "" }); setShowForm(false); toast({ title: "Topic added!" }); }
  };

  const mark = async (id: number, isCompleted: boolean) => {
    const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
    await fetch(`${BASE}/api/study-materials/syllabus/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("myschool_token")}` }, body: JSON.stringify({ isCompleted }) });
    setSyllabus(s => s.map(i => i.id === id ? { ...i, isCompleted } : i));
  };

  const del = async (id: number) => {
    const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
    await fetch(`${BASE}/api/study-materials/syllabus/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("myschool_token")}` } });
    setSyllabus(s => s.filter(i => i.id !== id));
  };

  const completed = syllabus.filter(s => s.isCompleted).length;
  const pct = syllabus.length > 0 ? Math.round((completed / syllabus.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white">Syllabus Planner</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="rounded-xl font-bold"><Plus className="w-4 h-4 mr-1" />Add Topic</Button>
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {classes.map(c => (
          <button key={c.id} onClick={() => setSelClass(c.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${selClass === c.id ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {c.name} {c.section}
          </button>
        ))}
      </div>
      {syllabus.length > 0 && (
        <div className="mb-5 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex justify-between text-sm font-bold mb-2"><span className="dark:text-white">Progress</span><span className="text-primary">{pct}%</span></div>
          <div className="w-full bg-secondary rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
          <p className="text-xs text-muted-foreground mt-1">{completed} of {syllabus.length} topics covered</p>
        </div>
      )}
      {showForm && (
        <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 mb-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Subject *</label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Mathematics" className="rounded-xl" /></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Chapter *</label><Input value={form.chapter} onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))} placeholder="Quadratic Equations" className="rounded-xl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Topics</label><Input value={form.topics} onChange={e => setForm(f => ({ ...f, topics: e.target.value }))} placeholder="Roots, discriminant..." className="rounded-xl" /></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Planned Date</label><Input type="date" value={form.plannedDate} onChange={e => setForm(f => ({ ...f, plannedDate: e.target.value }))} className="rounded-xl" /></div>
          </div>
          <div className="flex gap-2"><Button onClick={addTopic} size="sm" className="rounded-xl font-bold"><Plus className="w-3 h-3 mr-1" />Add</Button><Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button></div>
        </div>
      )}
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      : syllabus.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No syllabus topics yet</p><p className="text-sm mt-1">Add topics to track your curriculum progress</p></div>
      ) : (
        <div className="space-y-2">
          {syllabus.map(item => (
            <div key={item.id} className={`p-4 rounded-xl border dark:border-gray-700 dark:bg-gray-800 flex items-center gap-3 ${item.isCompleted ? "opacity-60" : ""}`}>
              <button onClick={() => mark(item.id, !item.isCompleted)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${item.isCompleted ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-primary"}`}>
                {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <p className={`font-bold text-sm dark:text-white ${item.isCompleted ? "line-through" : ""}`}>{item.chapter}</p>
                <p className="text-xs text-muted-foreground">{item.subject}{item.topics ? ` • ${item.topics}` : ""}</p>
                {item.plannedDate && <p className="text-xs text-muted-foreground mt-0.5">Planned: {item.plannedDate}</p>}
              </div>
              <button onClick={() => del(item.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const TBASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const TTOK = () => localStorage.getItem("myschool_token") || "";

function TeacherParentContact({ schoolId, classes, students }: { schoolId: number; classes: any[]; students: any[] }) {
  const [selClass, setSelClass] = useState<number | null>(classes[0]?.id || null);
  const [msgStudent, setMsgStudent] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const classStudents = students.filter(s => s.classId === selClass);

  const sendMessage = async () => {
    if (!msgStudent || !message.trim()) { toast({ title: "Select a student and write a message", variant: "destructive" }); return; }
    setSending(true);
    try {
      const res = await fetch(`${TBASE()}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TTOK()}` },
        body: JSON.stringify({ schoolId, message: `[Re: ${msgStudent.name}] ${message}` })
      });
      if (res.ok) { toast({ title: "Note recorded!", description: `Message about ${msgStudent.name} logged.` }); setMessage(""); setMsgStudent(null); }
      else toast({ title: "Failed to send", variant: "destructive" });
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold font-display text-foreground">Parent Contact</h2>
      <div className="flex gap-3 flex-wrap">
        {classes.map(c => (<button key={c.id} onClick={() => setSelClass(c.id)} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${selClass === c.id ? "bg-primary text-white" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>Class {c.name}</button>))}
      </div>
      {msgStudent && (
        <Card className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-3">
          <div className="flex items-center justify-between"><p className="font-bold text-sm">Send message about <span className="text-primary">{msgStudent.name}</span></p><button onClick={() => setMsgStudent(null)} className="text-muted-foreground hover:text-foreground"><XCircle className="w-4 h-4" /></button></div>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:border-primary resize-none" placeholder="Write your message to the parent..." />
          <button onClick={sendMessage} disabled={sending} className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60">{sending ? "Sending..." : "Send to Parent"}</button>
        </Card>
      )}
      {classStudents.length === 0 ? <p className="text-center py-8 text-muted-foreground">No students in this class</p>
      : <div className="space-y-2">
          {classStudents.map(s => (
            <Card key={s.id} className="p-3 rounded-xl border-border/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold">{s.name?.[0]}</div><div><p className="font-bold text-sm text-foreground">{s.name}</p>{s.parentPhone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{s.parentPhone}</p>}</div></div>
              <div className="flex gap-2">
                {s.parentPhone && <a href={`tel:${s.parentPhone}`} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Phone className="w-3.5 h-3.5" /></a>}
                <button onClick={() => setMsgStudent(s)} className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"><MessageSquare className="w-3.5 h-3.5" /></button>
              </div>
            </Card>
          ))}
        </div>}
    </div>
  );
}

function TeacherStudentHealth({ schoolId, students }: { schoolId: number; students: any[] }) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId: "", recordDate: new Date().toISOString().split("T")[0], notes: "", conditions: "", temperature: "" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${TBASE()}/api/student-health?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${TTOK()}` } })
      .then(r => r.json()).then(d => setRecords(d.records || [])).finally(() => setLoading(false));
  }, [schoolId]);

  const save = async () => {
    if (!form.studentId) { toast({ title: "Select a student", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const res = await fetch(`${TBASE()}/api/student-health`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${TTOK()}` }, body: JSON.stringify({ ...form, studentId: Number(form.studentId), schoolId, temperature: form.temperature ? Number(form.temperature) : undefined }) });
      if (res.ok) { const d = await res.json(); setRecords(r => [d.record, ...r]); setShowForm(false); setForm({ studentId: "", recordDate: new Date().toISOString().split("T")[0], notes: "", conditions: "", temperature: "" }); toast({ title: "Health note saved!" }); }
    } finally { setSaving(false); }
  };

  const filtered = records.filter(r => { const s = students.find(st => st.id === r.studentId); return !search || s?.name?.toLowerCase().includes(search.toLowerCase()); });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-display text-foreground">Student Health Notes</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90"><Plus className="w-4 h-4" />Add Note</button>
      </div>
      {showForm && (
        <Card className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Student</label><select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background focus:outline-none focus:border-primary"><option value="">Select student...</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Date</label><input type="date" value={form.recordDate} onChange={e => setForm(f => ({ ...f, recordDate: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background focus:outline-none focus:border-primary" /></div>
          </div>
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">Temperature (°C)</label><input type="number" step="0.1" value={form.temperature} onChange={e => setForm(f => ({ ...f, temperature: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background focus:outline-none focus:border-primary" placeholder="e.g. 38.5" /></div>
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">Conditions</label><input value={form.conditions} onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background focus:outline-none focus:border-primary" placeholder="e.g. Headache, Fever" /></div>
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">Notes</label><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:border-primary resize-none" placeholder="Observations..." /></div>
          <button onClick={save} disabled={saving} className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60">{saving ? "Saving..." : "Save Health Note"}</button>
        </Card>
      )}
      <div className="relative"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="w-full pl-9 border border-border rounded-xl p-2.5 text-sm bg-background focus:outline-none focus:border-primary" /><Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /></div>
      {loading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      : filtered.length === 0 ? <p className="text-center py-8 text-muted-foreground">No health notes yet. Add your first one!</p>
      : <div className="space-y-2">{filtered.map(r => { const s = students.find(st => st.id === r.studentId); const hasTemp = r.temperature && r.temperature > 38; return (<Card key={r.id} className={`p-3 rounded-xl ${hasTemp ? "border-red-200 bg-red-50/50 dark:bg-red-900/10" : "border-border/50"}`}><div className="flex items-start gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${hasTemp ? "bg-red-100" : "bg-primary/10"}`}><Activity className={`w-4 h-4 ${hasTemp ? "text-red-600" : "text-primary"}`} /></div><div className="flex-1"><div className="flex items-center justify-between gap-2"><p className="font-bold text-sm text-foreground">{s?.name || `#${r.studentId}`}</p><span className="text-xs text-muted-foreground">{new Date(r.recordDate).toLocaleDateString("en-IN")}</span></div>{r.temperature && <p className={`text-xs mt-0.5 font-medium ${hasTemp ? "text-red-600" : "text-muted-foreground"}`}>🌡 {r.temperature}°C{hasTemp ? " (High!)" : ""}</p>}{r.conditions && <p className="text-xs text-amber-700 mt-0.5">Conditions: {r.conditions}</p>}{r.notes && <p className="text-xs text-muted-foreground mt-0.5">{r.notes}</p>}</div></div></Card>); })}</div>}
    </div>
  );
}

const TBASE2 = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const TTOK2 = () => localStorage.getItem("myschool_token") || "";

function TeacherQuizBuilder({ schoolId, classes, teacherId }: { schoolId: number; classes: any[]; teacherId: number }) {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [viewingQuiz, setViewingQuiz] = useState<any | null>(null);
  const [form, setForm] = useState({ classId: "", title: "", subject: "", description: "", timeLimit: "", isPublished: false });
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQ, setNewQ] = useState({ question: "", options: ["", "", "", ""], correctAnswer: "" });
  const { toast } = useToast();

  const fetchQuizzes = () => {
    setLoading(true);
    fetch(`${TBASE2()}/api/quizzes?schoolId=${schoolId}&teacherId=${teacherId}`, { headers: { Authorization: `Bearer ${TTOK2()}` } })
      .then(r => r.json()).then(d => setQuizzes(d.quizzes || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuizzes(); }, [schoolId, teacherId]);

  const addQuestion = () => {
    if (!newQ.question || !newQ.correctAnswer || newQ.options.some(o => !o)) {
      toast({ title: "Fill all question fields and options", variant: "destructive" }); return;
    }
    setQuestions(q => [...q, { ...newQ }]);
    setNewQ({ question: "", options: ["", "", "", ""], correctAnswer: "" });
  };

  const createQuiz = async () => {
    if (!form.classId || !form.title) { toast({ title: "Class and title are required", variant: "destructive" }); return; }
    const res = await fetch(`${TBASE2()}/api/quizzes`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${TTOK2()}` }, body: JSON.stringify({ ...form, schoolId, classId: Number(form.classId), teacherId, questions, timeLimit: form.timeLimit ? Number(form.timeLimit) : null }) });
    if (res.ok) { toast({ title: "Quiz created!" }); setCreating(false); setForm({ classId: "", title: "", subject: "", description: "", timeLimit: "", isPublished: false }); setQuestions([]); fetchQuizzes(); }
    else toast({ title: "Failed to create quiz", variant: "destructive" });
  };

  const togglePublish = async (quiz: any) => {
    const res = await fetch(`${TBASE2()}/api/quizzes/${quiz.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${TTOK2()}` }, body: JSON.stringify({ isPublished: !quiz.isPublished }) });
    if (res.ok) { toast({ title: quiz.isPublished ? "Quiz unpublished" : "Quiz published to students!" }); fetchQuizzes(); }
  };

  const deleteQuiz = async (id: number) => {
    await fetch(`${TBASE2()}/api/quizzes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${TTOK2()}` } });
    toast({ title: "Quiz deleted" }); fetchQuizzes();
  };

  if (viewingQuiz) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setViewingQuiz(null)} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80"><Award className="w-4 h-4" /></button>
          <div><h2 className="text-xl font-bold dark:text-white">{viewingQuiz.title}</h2><p className="text-sm text-muted-foreground">{viewingQuiz.subject} • {(viewingQuiz.questions || []).length} questions</p></div>
        </div>
        {(viewingQuiz.questions || []).length === 0 ? <div className="text-center py-8 text-muted-foreground"><p>No questions added</p></div>
        : (viewingQuiz.questions || []).map((q: any, i: number) => (
          <Card key={i} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
            <p className="font-bold dark:text-white mb-2">{i + 1}. {q.question}</p>
            <div className="grid grid-cols-2 gap-2">
              {(q.options || []).map((o: string, j: number) => (
                <div key={j} className={`p-2 rounded-lg text-sm ${o === q.correctAnswer ? "bg-green-100 text-green-800 font-bold border border-green-300" : "bg-secondary/50 dark:bg-gray-700/50 text-foreground"}`}>
                  {String.fromCharCode(65 + j)}. {o}
                  {o === q.correctAnswer && <span className="ml-1 text-xs">✓ Correct</span>}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (creating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setCreating(false)} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80">←</button>
          <h2 className="text-xl font-bold dark:text-white">Create New Quiz</h2>
        </div>
        <Card className="p-5 rounded-2xl dark:bg-gray-800 dark:border-gray-700 space-y-4">
          <h3 className="font-bold dark:text-white">Quiz Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="dark:text-gray-300">Class *</Label>
              <select value={form.classId} onChange={e => setForm(p => ({ ...p, classId: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section && `- ${c.section}`}</option>)}
              </select></div>
            <div><Label className="dark:text-gray-300">Subject</Label><Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Mathematics" className="dark:bg-gray-700 dark:border-gray-600 mt-1" /></div>
          </div>
          <div><Label className="dark:text-gray-300">Quiz Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Chapter 5 Quiz" className="dark:bg-gray-700 dark:border-gray-600 mt-1" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="dark:text-gray-300">Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional" className="dark:bg-gray-700 dark:border-gray-600 mt-1" /></div>
            <div><Label className="dark:text-gray-300">Time Limit (minutes)</Label><Input type="number" value={form.timeLimit} onChange={e => setForm(p => ({ ...p, timeLimit: e.target.value }))} placeholder="e.g. 30" className="dark:bg-gray-700 dark:border-gray-600 mt-1" /></div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="publish" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} className="w-4 h-4 accent-primary" />
            <Label htmlFor="publish" className="dark:text-gray-300 cursor-pointer">Publish immediately (students can see)</Label>
          </div>
        </Card>

        <Card className="p-5 rounded-2xl dark:bg-gray-800 dark:border-gray-700 space-y-4">
          <h3 className="font-bold dark:text-white">Questions ({questions.length})</h3>
          {questions.map((q, i) => (
            <div key={i} className="p-3 bg-secondary/30 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-start justify-between">
                <p className="text-sm font-bold dark:text-white">{i + 1}. {q.question}</p>
                <button onClick={() => setQuestions(qs => qs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 ml-2"><Trash2 className="w-3 h-3" /></button>
              </div>
              <p className="text-xs text-green-600 mt-1">Answer: {q.correctAnswer}</p>
            </div>
          ))}
          <div className="border border-dashed border-primary/40 rounded-xl p-4 space-y-3">
            <p className="text-sm font-bold text-primary">Add Question</p>
            <Input value={newQ.question} onChange={e => setNewQ(p => ({ ...p, question: e.target.value }))} placeholder="Question text *" className="dark:bg-gray-700 dark:border-gray-600" />
            <div className="grid grid-cols-2 gap-2">
              {newQ.options.map((opt, idx) => (
                <Input key={idx} value={opt} onChange={e => setNewQ(p => { const o = [...p.options]; o[idx] = e.target.value; return { ...p, options: o }; })} placeholder={`Option ${String.fromCharCode(65 + idx)} *`} className="dark:bg-gray-700 dark:border-gray-600" />
              ))}
            </div>
            <select value={newQ.correctAnswer} onChange={e => setNewQ(p => ({ ...p, correctAnswer: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="">Select correct answer *</option>
              {newQ.options.filter(Boolean).map((opt, i) => <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>)}
            </select>
            <Button onClick={addQuestion} variant="outline" size="sm" className="w-full rounded-xl dark:border-gray-600 dark:text-gray-300">+ Add Question</Button>
          </div>
        </Card>

        <Button onClick={createQuiz} className="w-full rounded-xl font-bold py-3" disabled={questions.length === 0 || !form.title || !form.classId}>
          {questions.length === 0 ? "Add at least 1 question to create quiz" : `Create Quiz (${questions.length} questions)`}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold dark:text-white">Online Quizzes</h2><p className="text-sm text-muted-foreground">{quizzes.length} quizzes created</p></div>
        <Button onClick={() => setCreating(true)} className="rounded-xl font-bold"><Plus className="w-4 h-4 mr-2" />Create Quiz</Button>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      : quizzes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Award className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold">No quizzes yet</p>
          <p className="text-sm mt-2">Create your first quiz to assess students</p>
          <Button onClick={() => setCreating(true)} className="mt-6 rounded-xl font-bold"><Plus className="w-4 h-4 mr-2" />Create First Quiz</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map(q => (
            <Card key={q.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold dark:text-white">{q.title}</p>
                    <Badge className={`text-xs rounded-full ${q.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>{q.isPublished ? "Published" : "Draft"}</Badge>
                  </div>
                  {q.subject && <p className="text-sm text-muted-foreground">{q.subject}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">{(q.questions || []).length} questions{q.timeLimit ? ` • ${q.timeLimit} min` : ""}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => setViewingQuiz(q)} className="rounded-lg h-8 text-xs dark:border-gray-600 dark:text-gray-300">Preview</Button>
                  <Button size="sm" variant={q.isPublished ? "outline" : "default"} onClick={() => togglePublish(q)} className={`rounded-lg h-8 text-xs ${q.isPublished ? "border-orange-200 text-orange-700 hover:bg-orange-50" : ""}`}>{q.isPublished ? "Unpublish" : "Publish"}</Button>
                  <button onClick={() => deleteQuiz(q.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const OV_BASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const OV_TOK = () => localStorage.getItem("myschool_token") || "";

function TeacherOverview({ user, schoolId, classes, students, myTeacher, onNavigate }: { user: any; schoolId: number; classes: any[]; students: any[]; myTeacher: any; onNavigate: (tab: any) => void; }) {
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [hwCount, setHwCount] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(12);
  const aiEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myTeacher?.id) {
      fetch(`${OV_BASE()}/api/homework?schoolId=${schoolId}&teacherId=${myTeacher.id}`, { headers: { Authorization: `Bearer ${OV_TOK()}` } })
        .then(r => r.json()).then(d => setHwCount((d.homework || []).length)).catch(() => {});
    }
  }, [myTeacher, schoolId]);

  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages]);

  const sendAiMessage = async (text?: string) => {
    const msg = text || aiInput.trim();
    if (!msg || aiLoading) return;
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", content: msg }]);
    setAiLoading(true);
    try {
      const res = await fetch(`${OV_BASE()}/api/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OV_TOK()}` },
        body: JSON.stringify({ query: msg, schoolId }),
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: "assistant", content: data.answer || data.reply || data.message || "I'm here to help!" }]);
    } catch { setAiMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't connect right now. Please try again." }]); }
    finally { setAiLoading(false); }
  };

  const QUICK_QUESTIONS = [
    "How do I improve student engagement?",
    "Give me tips for lesson planning",
    "How to handle classroom discipline?",
    "Best practices for grading assignments?",
  ];

  const stats = [
    { label: "My Classes", value: classes.length, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "My Students", value: students.length, icon: Users, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Homework Given", value: hwCount, icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Leave Balance", value: leaveBalance, icon: Calendar, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
  ];

  const quickActions = [
    { label: "Mark Attendance", tab: "attendance" as const, color: "from-blue-500 to-blue-600", icon: CalendarCheck },
    { label: "Assign Homework", tab: "homework" as const, color: "from-purple-500 to-purple-600", icon: ClipboardList },
    { label: "Enter Exam Marks", tab: "examEntry" as const, color: "from-emerald-500 to-emerald-600", icon: Award },
    { label: "View Gradebook", tab: "gradebook" as const, color: "from-orange-500 to-orange-600", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Welcome back, {myTeacher?.name?.split(" ")[0] || user?.name?.split(" ")[0] || "Teacher"} 👋</h1>
        <p className="text-muted-foreground mt-1">{myTeacher?.subject ? `${myTeacher.subject} Teacher` : "Teacher"} • {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="p-5 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <div className={`p-2 rounded-xl ${s.bg}`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <p className="text-3xl font-bold dark:text-white">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold mb-3 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(a => (
            <button key={a.label} onClick={() => onNavigate(a.tab)}
              className={`p-4 rounded-2xl bg-gradient-to-br ${a.color} text-white text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}>
              <a.icon className="w-5 h-5 mb-2 opacity-90" />
              <p className="text-sm font-bold">{a.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
      <div>
        <style>{`
          @keyframes tSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          @keyframes tBounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-5px); } }
          @keyframes tPulseRing { 0% { transform:scale(1); opacity:.5; } 100% { transform:scale(2); opacity:0; } }
          @keyframes tFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
          @keyframes tGrad { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        `}</style>

        <h2 className="text-base font-bold mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-sm">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          AI Teaching Assistant
        </h2>

        <Card className="rounded-2xl overflow-hidden border-border shadow-lg">
          {/* Header */}
          <div className="relative overflow-hidden p-5" style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 45%, #4f46e5 100%)",
            backgroundSize: "200% 200%",
            animation: "tGrad 8s ease infinite",
          }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 40%, white 1px, transparent 1px), radial-gradient(circle at 75% 70%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute top-2 right-8 w-20 h-20 rounded-full bg-white/10 blur-xl" />
            <div className="absolute bottom-0 left-12 w-14 h-14 rounded-full bg-white/10 blur-lg" />
            <div className="absolute top-3 right-20 w-4 h-4 rounded-full bg-yellow-300/50" style={{ animation: "tFloat 4s ease-in-out infinite" }} />

            <div className="relative flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-xl bg-white/30" style={{ animation: "tPulseRing 2s ease-out infinite" }} />
                <div className="absolute inset-0 rounded-xl bg-white/20" style={{ animation: "tPulseRing 2s ease-out .6s infinite" }} />
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg" style={{ animation: "tFloat 3s ease-in-out infinite" }}>
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-white font-black text-lg leading-none">EduBot AI</h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-400/20 border border-emerald-300/40 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-200">LIVE</span>
                  </span>
                </div>
                <p className="text-white/70 text-xs">Your personal teaching & classroom assistant</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/20 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span className="text-white text-xs font-bold">{aiMessages.length > 0 ? `${Math.ceil(aiMessages.length / 2)} chats` : "Ask me anything"}</span>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="h-88 min-h-[22rem] overflow-y-auto p-4 space-y-4 bg-secondary/10">
            {aiMessages.length === 0 && !aiLoading && (
              <div className="h-full flex flex-col items-center justify-center gap-5 py-4" style={{ animation: "tSlideIn 0.4s ease-out forwards" }}>
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-7 h-7 text-violet-600" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground mb-1">How can I help you today?</p>
                  <p className="text-xs text-muted-foreground">Ask about teaching tips, lesson plans, or student data</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button key={q} onClick={() => sendAiMessage(q)}
                      style={{ animation: `tSlideIn 0.35s ease-out ${0.05 + idx * 0.07}s forwards`, opacity: 0 }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-violet-400/60 hover:bg-violet-50 hover:shadow-sm hover:-translate-y-0.5 transition-all text-left group">
                      <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 group-hover:bg-violet-200 transition-colors">
                        <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                      </div>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {aiMessages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex gap-2.5 items-end ${isUser ? "flex-row-reverse" : ""}`}
                  style={{ animation: "tSlideIn 0.3s ease-out forwards", opacity: 0, animationDelay: `${i * 0.04}s` }}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-md text-white ${isUser ? "bg-gradient-to-br from-violet-600 to-indigo-600" : "bg-gradient-to-br from-violet-500 to-purple-600"}`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap relative ${
                    isUser
                      ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm shadow-violet-200/60"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}>
                    {!isUser && (
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                    )}
                    {m.content}
                  </div>
                </div>
              );
            })}

            {aiLoading && (
              <div className="flex gap-2.5 items-end" style={{ animation: "tSlideIn 0.3s ease-out forwards" }}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full bg-violet-500/70"
                        style={{ animation: `tBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={aiEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-card">
            <form onSubmit={e => { e.preventDefault(); sendAiMessage(); }} className="flex gap-2">
              <input
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAiMessage()}
                placeholder="Ask EduBot about teaching, students, lesson plans..."
                disabled={aiLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400/60 transition-all disabled:opacity-60"
              />
              <Button type="submit" disabled={!aiInput.trim() || aiLoading}
                className="rounded-xl px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200/50 transition-all shrink-0">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
            <p className="text-center text-[10px] text-muted-foreground mt-2">EduBot uses your school's live data to answer questions</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
