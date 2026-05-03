import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/erp/hooks/use-auth";
import { AdminLayout } from "@/erp/components/layouts";
import { useListStudents, useListFees, useListAttendance, useListNotices, useListTeachers, usePayFee } from "@/erp/api-client";
import {
  Home, Users, CreditCard, Bell, CheckCircle2, XCircle, Clock, Loader2, IndianRupee,
  Award, MessageSquare, ClipboardList, Send, CalendarDays, ChevronDown, Calendar,
  BookOpen, Bus, FileText, MapPin, Plus, Trash2, HelpCircle, ChevronUp, AlertCircle,
  Link2, X, ExternalLink, Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/erp/hooks/use-toast";
import NotificationBell from "@/erp/components/NotificationBell";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

type Tab = "home" | "children" | "fees" | "reports" | "homework" | "messages" | "notices" | "attendance" | "ptm" | "assignments" | "events" | "materials" | "transport" | "leave" | "support";

const parentLinks = [
  { href: "/parent/home",        label: "Home",         icon: Home,          group: "Overview" },
  { href: "/parent/children",    label: "My Children",  icon: Users,         group: "Overview" },
  { href: "/parent/attendance",  label: "Attendance",   icon: CalendarDays,  group: "Academics" },
  { href: "/parent/fees",        label: "Fees",         icon: CreditCard,    group: "Academics" },
  { href: "/parent/reports",     label: "Results",      icon: Award,         group: "Academics" },
  { href: "/parent/homework",    label: "Homework",     icon: ClipboardList, group: "Academics" },
  { href: "/parent/assignments", label: "Assignments",  icon: ClipboardList, group: "Academics" },
  { href: "/parent/notices",     label: "Notices",      icon: Bell,          group: "School" },
  { href: "/parent/events",      label: "Events",       icon: CalendarDays,  group: "School" },
  { href: "/parent/ptm",         label: "PTM",          icon: Calendar,      group: "School" },
  { href: "/parent/materials",   label: "Materials",    icon: BookOpen,      group: "School" },
  { href: "/parent/transport",   label: "Transport",    icon: Bus,           group: "School" },
  { href: "/parent/messages",    label: "Messages",     icon: MessageSquare, group: "Communication" },
  { href: "/parent/leave",       label: "Leave",        icon: FileText,      group: "Communication" },
  { href: "/parent/support",     label: "Support",      icon: HelpCircle,    group: "Communication" },
];

function getStatusIcon(status: string) {
  if (status === "present") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === "absent") return <XCircle className="w-4 h-4 text-destructive" />;
  return <Clock className="w-4 h-4 text-amber-500" />;
}

const GRADE_COLOR: Record<string, string> = {
  "A+": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "A":  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "B+": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "B":  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "C+": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "C":  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "D":  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "F":  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function PTMTab({ schoolId, childId }: { schoolId: number; childId?: number }) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${BASE}/api/ptm?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(async r => {
        if (!r.ok) throw new Error(`Server error ${r.status}`);
        return r.json();
      })
      .then(d => setSlots(d.slots || []))
      .catch(err => setError(err.message || "Failed to load PTM slots"))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const bookSlot = async (slotId: number) => {
    const res = await fetch(`${BASE}/api/ptm/${slotId}/book`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ studentId: childId }),
    });
    if (res.ok) {
      toast({ title: "Slot booked successfully!" });
      setSlots(s => s.map(sl => sl.id === slotId ? { ...sl, status: "booked" } : sl));
    } else toast({ title: "Booking failed", variant: "destructive" });
  };

  const cancelSlot = async (slotId: number) => {
    await fetch(`${BASE}/api/ptm/${slotId}/cancel`, { method: "PATCH", headers: { Authorization: `Bearer ${getToken()}` } });
    toast({ title: "Booking cancelled" });
    setSlots(s => s.map(sl => sl.id === slotId ? { ...sl, status: "available", studentId: null } : sl));
  };

  const available  = slots.filter(s => s.status === "available");
  const myBookings = slots.filter(s => s.status === "booked" && Number(s.studentId) === Number(childId));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  if (error) return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-destructive opacity-60" />
      <p className="font-bold text-destructive">Could not load PTM slots</p>
      <p className="text-sm text-muted-foreground mt-1">{error}</p>
      <Button size="sm" variant="outline" className="mt-4 rounded-xl" onClick={() => { setError(null); setLoading(true); fetch(`${BASE}/api/ptm?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()).then(d => setSlots(d.slots || [])).catch(e => setError(e.message)).finally(() => setLoading(false)); }}>Retry</Button>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 dark:text-white">Parent-Teacher Meetings</h2>
      {myBookings.length > 0 && (
        <div className="mb-6">
          <p className="font-bold text-sm mb-3 dark:text-white">My Bookings</p>
          {myBookings.map(s => (
            <Card key={s.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700 mb-3 border-l-4 border-l-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold dark:text-white">{s.teacherName}</p>
                  <p className="text-sm text-muted-foreground">{s.date} • {s.startTime} - {s.endTime}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => cancelSlot(s.id)} className="rounded-lg h-8 text-xs text-red-600 border-red-200">Cancel</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <p className="font-bold text-sm mb-3 dark:text-white">Available Slots ({available.length})</p>
      {available.length === 0
        ? <div className="text-center py-8 text-muted-foreground"><Calendar className="w-10 h-10 mx-auto mb-2 opacity-20" /><p>No available slots at this time</p><p className="text-sm mt-1">Check back after your school admin schedules PTM slots</p></div>
        : available.map(s => (
          <Card key={s.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold dark:text-white">{s.teacherName}</p>
                <p className="text-sm text-muted-foreground">{s.date} • {s.startTime} - {s.endTime}</p>
              </div>
              <Button size="sm" onClick={() => bookSlot(s.id)} className="rounded-lg h-8 text-xs"><Calendar className="w-3 h-3 mr-1" />Book</Button>
            </div>
          </Card>
        ))
      }
    </div>
  );
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const params = useParams<{ tab?: string }>();
  const [, setLocation] = useLocation();

  const activeTab = ((params.tab || "home") as Tab);
  const setTab = (tab: Tab) => setLocation(`/parent/${tab}`);

  const schoolId  = user?.schoolId || 1;
  const userId    = (user as any)?.id;
  const firstName = user?.name?.split(" ")[0] || "Parent";
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const { data: studentsData, isLoading: studentsLoading } = useListStudents({ schoolId });
  const allStudents = studentsData?.students || [];

  const [linkedChildIds, setLinkedChildIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("parent_linked_children") || "[]"); } catch { return []; }
  });

  const myChildren = useMemo(() => {
    const byPhone = allStudents.filter((s: any) => s.parentPhone && user?.phone && s.parentPhone === user.phone);
    const byLinked = allStudents.filter((s: any) => linkedChildIds.includes(s.id) && !byPhone.find((b: any) => b.id === s.id));
    const merged = [...byPhone, ...byLinked];
    return merged.length > 0 ? merged : allStudents.slice(0, 2);
  }, [allStudents, user, linkedChildIds]);

  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const child = useMemo(() => {
    if (selectedChildId) return myChildren.find((c: any) => c.id === selectedChildId) || myChildren[0];
    return myChildren[0];
  }, [myChildren, selectedChildId]) as any;

  const { data: feesData,       isLoading: feesLoading }       = useListFees({ studentId: child?.id }, { enabled: !!child?.id });
  const fees = feesData?.fees || [];

  const today       = new Date().toISOString().split("T")[0];
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const { data: attendanceData, isLoading: attendanceLoading } = useListAttendance({ studentId: child?.id, startDate: sixMonthsAgo, endDate: today }, { enabled: !!child?.id });
  const attendanceRecords = attendanceData?.attendance || [];
  const { data: noticesData,    isLoading: noticesLoading }    = useListNotices({ schoolId });
  const notices = noticesData?.notices || [];
  const { data: teachersData } = useListTeachers({ schoolId });
  const teachers = teachersData?.teachers || [];
  const payFeeMutation = usePayFee();

  const presentCount   = attendanceRecords.filter((a: any) => a.status === "present").length;
  const attendancePct  = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;
  const pendingFees    = fees.filter((f: any) => f.status === "pending" || f.status === "overdue");
  const totalPending   = pendingFees.reduce((s: number, f: any) => s + Number(f.amount || 0), 0);

  const [examResults,    setExamResults]    = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [homework,       setHomework]       = useState<any[]>([]);
  const [hwLoading,      setHwLoading]      = useState(false);
  const [threads,        setThreads]        = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [chatMessages,   setChatMessages]   = useState<any[]>([]);
  const [newMessage,     setNewMessage]     = useState("");
  const [msgsLoading,    setMsgsLoading]    = useState(false);
  const [sending,        setSending]        = useState(false);
  const [payingFee,      setPayingFee]      = useState<any | null>(null);
  const [payMethod,      setPayMethod]      = useState<"upi" | "card" | "netbanking" | null>(null);
  const [payStep,        setPayStep]        = useState<"select" | "processing" | "done">("select");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [showLinkDialog,  setShowLinkDialog]  = useState(false);
  const [admissionInput,  setAdmissionInput]  = useState("");
  const [linkResult,      setLinkResult]      = useState<any | null>(null);
  const [linkSearched,    setLinkSearched]    = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    if (activeTab === "reports" && child?.id) {
      setReportsLoading(true);
      fetch(`${BASE}/api/exams/results/student/${child.id}?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setExamResults(d.results || [])).finally(() => setReportsLoading(false));
    }
  }, [activeTab, child?.id]);

  useEffect(() => {
    if (activeTab === "homework" && child?.classId) {
      setHwLoading(true);
      fetch(`${BASE}/api/homework?schoolId=${schoolId}&classId=${child.classId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setHomework(d.homework || [])).finally(() => setHwLoading(false));
    }
  }, [activeTab, child?.classId]);

  useEffect(() => {
    if (activeTab === "messages" && userId) {
      setMsgsLoading(true);
      fetch(`${BASE}/api/messages/contacts`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then(r => r.json()).then(d => setThreads(d.contacts || [])).catch(() => setThreads([])).finally(() => setMsgsLoading(false));
    }
  }, [activeTab, userId]);

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
          senderRole: "parent", message: newMessage,
        }),
      });
      const msg = await res.json();
      setChatMessages(prev => [...prev, msg]);
      setNewMessage("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { toast({ title: "Error", description: "Failed to send", variant: "destructive" }); }
    finally { setSending(false); }
  };

  const handlePayFee = async (feeId: number) => {
    try {
      await payFeeMutation.mutateAsync({ feeId });
      toast({ title: "Payment recorded!", description: "Fee marked as paid." });
    } catch { toast({ title: "Payment error", description: "Failed to record payment.", variant: "destructive" }); }
  };

  const openPayModal = (fee: any) => { setPayingFee(fee); setPayMethod(null); setPayStep("select"); };

  const confirmPayment = async () => {
    if (!payingFee || !payMethod) return;
    setPayStep("processing");
    await new Promise(r => setTimeout(r, 1800));
    await handlePayFee(payingFee.id);
    setPayStep("done");
    setTimeout(() => { setPayingFee(null); setPayStep("select"); }, 2000);
  };

  const printReceipt = (fee: any) => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Fee Receipt</title><style>body{font-family:sans-serif;padding:24px;max-width:400px;margin:auto}h2{color:#1a56db}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px 4px;border-bottom:1px solid #eee}.total{font-weight:bold;font-size:1.1em}</style></head><body><h2>MySchool Fee Receipt</h2><p><strong>Student:</strong> ${child?.name || "—"}</p><p><strong>Admission No:</strong> ${child?.admissionNo || "—"}</p><hr/><table><tr><td>Fee Type</td><td>${fee.feeType || fee.type || "Fee"}</td></tr><tr><td>Description</td><td>${fee.description || "—"}</td></tr><tr><td>Amount</td><td>₹${Number(fee.amount).toLocaleString("en-IN")}</td></tr><tr><td>Due Date</td><td>${fee.dueDate ? new Date(fee.dueDate).toLocaleDateString("en-IN") : "—"}</td></tr><tr><td>Status</td><td style="color:${fee.status === "paid" ? "green" : "orange"};text-transform:capitalize">${fee.status}</td></tr></table><br/><p style="color:#888;font-size:12px">Generated by MySchool Platform • ${new Date().toLocaleDateString("en-IN")}</p></body></html>`);
    w.document.close(); w.print();
  };

  const searchChild = () => {
    const q = admissionInput.trim().toLowerCase();
    if (!q) return;
    const found = allStudents.find((s: any) =>
      (s.admissionNo || "").toLowerCase() === q ||
      (s.name || "").toLowerCase().includes(q)
    );
    setLinkResult(found || null);
    setLinkSearched(true);
  };

  const confirmLinkChild = (student: any) => {
    const next = [...new Set([...linkedChildIds, student.id])];
    setLinkedChildIds(next);
    localStorage.setItem("parent_linked_children", JSON.stringify(next));
    setSelectedChildId(student.id);
    setShowLinkDialog(false);
    setAdmissionInput("");
    setLinkResult(null);
    setLinkSearched(false);
    toast({ title: `${student.name} added!`, description: "You can now view their details." });
  };

  const removeLinkedChild = (studentId: number) => {
    const next = linkedChildIds.filter(id => id !== studentId);
    setLinkedChildIds(next);
    localStorage.setItem("parent_linked_children", JSON.stringify(next));
    if (selectedChildId === studentId) setSelectedChildId(null);
  };

  return (
    <AdminLayout title="Parent Portal" links={parentLinks}>
      {/* Child switcher — shown on all tabs */}
      {myChildren.length > 0 && (
        <div className="mb-6">
          {myChildren.length > 1 && <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Select Child</p>}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {myChildren.map((c: any) => {
              const isActive = child?.id === c.id;
              return (
                <button key={c.id} onClick={() => setSelectedChildId(c.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl whitespace-nowrap transition-all border-2 min-w-fit ${isActive ? "bg-primary text-white border-primary shadow-lg shadow-primary/25" : "bg-card border-border text-foreground hover:border-primary/40 hover:shadow-md"}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${isActive ? "bg-white/25 text-white" : "bg-primary/10 text-primary"}`}>{c.name?.charAt(0)}</div>
                  <div className="text-left">
                    <p className={`text-sm font-bold leading-tight ${isActive ? "text-white" : "text-foreground"}`}>{c.name?.split(" ")[0]}</p>
                    <p className={`text-[11px] font-medium leading-tight ${isActive ? "text-white/75" : "text-muted-foreground"}`}>{c.className ? `Class ${c.className}${c.section ? `-${c.section}` : ""}` : "—"}</p>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-white/60 ml-1 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* HOME TAB */}
      {activeTab === "home" && (
        <div className="space-y-5 max-w-2xl">
          <div>
            <p className="text-muted-foreground font-medium">{greeting},</p>
            <h1 className="text-2xl font-display font-bold text-foreground">{firstName}</h1>
          </div>
          {studentsLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : child ? (
            <>
              <Card className="p-5 rounded-2xl border-border/50 shadow-lg shadow-black/5 bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-[100px]" />
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-bold text-2xl text-white">{child.name?.charAt(0)}</div>
                  <div>
                    <h3 className="font-bold text-xl text-white">{child.name}</h3>
                    <p className="text-sm font-medium text-white/80">Class {child.className || "—"}{child.section ? `-${child.section}` : ""}</p>
                    <p className="text-xs text-white/60 mt-0.5">{child.admissionNo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/15 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-white">{attendancePct}%</p><p className="text-xs text-white/70 font-medium">Attendance</p></div>
                  <div className="bg-white/15 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-white">{pendingFees.length}</p><p className="text-xs text-white/70 font-medium">Pending Fees</p></div>
                  <div className="bg-white/15 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-white">{notices.length}</p><p className="text-xs text-white/70 font-medium">Notices</p></div>
                </div>
              </Card>
              {totalPending > 0 && (
                <Card className="p-4 rounded-xl border-destructive/20 bg-destructive/5 flex items-center gap-4">
                  <div className="p-2 bg-destructive/10 rounded-lg"><IndianRupee className="w-5 h-5 text-destructive" /></div>
                  <div className="flex-1"><p className="font-bold text-destructive">Fee Due</p><p className="text-sm text-muted-foreground">₹{totalPending.toLocaleString("en-IN")} pending</p></div>
                  <Button size="sm" className="rounded-lg font-bold text-xs" onClick={() => setTab("fees")}>Pay Now</Button>
                </Card>
              )}
              <div className="space-y-3">
                <h3 className="font-bold text-foreground text-base">Recent Attendance (Last 30 Days)</h3>
                {attendanceLoading ? <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                : attendanceRecords.length === 0 ? <p className="text-sm text-muted-foreground font-medium text-center py-4">No attendance records yet</p>
                : attendanceRecords.slice(0, 7).map((rec: any) => (
                  <Card key={rec.id} className="p-3 rounded-xl border-border/50 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{new Date(rec.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(rec.status)}
                      <span className={`text-xs font-bold capitalize ${rec.status === "present" ? "text-green-600" : rec.status === "absent" ? "text-destructive" : "text-amber-600"}`}>{rec.status}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold">No children linked yet</p>
              <p className="text-sm mt-2">Go to "My Children" to link your child's profile</p>
              <Button className="mt-4 rounded-xl" onClick={() => setTab("children")}><Link2 className="w-4 h-4 mr-2" />Link a Child</Button>
            </div>
          )}
        </div>
      )}

      {/* CHILDREN TAB */}
      {activeTab === "children" && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">My Children</h2>
            <Button size="sm" className="rounded-xl font-bold" onClick={() => { setShowLinkDialog(true); setAdmissionInput(""); setLinkResult(null); setLinkSearched(false); }}>
              <Plus className="w-4 h-4 mr-1" />Link Child
            </Button>
          </div>
          {studentsLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : myChildren.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold">No children linked yet</p>
              <p className="text-sm mt-2">Click "Link Child" to add your child by admission number</p>
            </div>
          ) : myChildren.map((c: any) => (
            <Card key={c.id} className="p-5 rounded-2xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">{c.name?.charAt(0)}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">{c.name}</h3>
                  <p className="text-sm text-primary font-medium">Class {c.className || "—"}{c.section ? `-${c.section}` : ""}</p>
                  <p className="text-xs text-muted-foreground">{c.admissionNo} • {c.gender || "—"}</p>
                </div>
                {linkedChildIds.includes(c.id) && (
                  <button onClick={() => removeLinkedChild(c.id)} className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors" title="Unlink child">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Blood Group",  value: c.bloodGroup || "—" },
                  { label: "Attendance",   value: `${attendancePct}%` },
                  { label: "Fee Status",   value: pendingFees.length > 0 ? `₹${totalPending.toLocaleString("en-IN")} due` : "Clear" },
                  { label: "Parent Name",  value: c.parentName || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-secondary/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-muted-foreground mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          <Card className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">You can link a child using their Admission Number. If the admission number is not found, please contact your school admin to confirm the number.</p>
            </div>
          </Card>
        </div>
      )}

      {/* FEES TAB */}
      {activeTab === "fees" && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold font-display">Fee Records</h2>
          {feesLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : fees.length === 0 ? <div className="text-center py-16 text-muted-foreground"><CreditCard className="w-16 h-16 mx-auto mb-4 opacity-20" /><p className="text-xl font-bold">No fee records yet</p></div>
          : fees.map((fee: any) => (
            <Card key={fee.id} className="p-4 rounded-xl border-border shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-bold text-foreground">{fee.description || fee.feeType || "Fee"}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">Due: {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString("en-IN") : "—"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-lg">₹{Number(fee.amount || 0).toLocaleString("en-IN")}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${fee.status === "paid" ? "bg-green-100 text-green-700" : fee.status === "overdue" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{fee.status}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {(fee.status === "pending" || fee.status === "overdue") && (
                  <Button size="sm" className="flex-1 rounded-lg font-bold" onClick={() => openPayModal(fee)}>Pay ₹{Number(fee.amount || 0).toLocaleString("en-IN")}</Button>
                )}
                <Button size="sm" variant="outline" className="rounded-lg font-bold text-xs" onClick={() => printReceipt(fee)}>Receipt</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === "reports" && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Report Card</h2>
          {reportsLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : examResults.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><Award className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No exam results yet</p><p className="text-sm mt-1">Results will appear here after exams are marked</p></div>
          ) : (
            <>
              <Card className="p-4 rounded-xl bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">Overall Performance</p>
                    <p className="text-2xl font-bold text-foreground">{child?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{examResults.filter(r => r.grade === "A+" || r.grade === "A").length > examResults.length / 2 ? "A" : "B"}</p>
                    <p className="text-xs text-muted-foreground">{examResults.length} exams</p>
                  </div>
                </div>
              </Card>
              <div className="space-y-3">
                {examResults.map((result: any) => (
                  <Card key={result.id} className="p-4 rounded-xl border-border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{result.exam?.examName || result.exam?.name || "Exam"}</p>
                        <p className="text-sm text-muted-foreground">{result.exam?.subject || "—"} • {result.exam?.examDate ? new Date(result.exam.examDate).toLocaleDateString("en-IN") : ""}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-bold text-lg">{result.marksObtained}<span className="text-sm text-muted-foreground font-normal">/{result.exam?.maxMarks || "—"}</span></p>
                          <p className="text-xs text-muted-foreground">{result.exam?.passingMarks ? `Pass: ${result.exam.passingMarks}` : ""}</p>
                        </div>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${GRADE_COLOR[result.grade] || "bg-gray-100 text-gray-700"}`}>{result.grade}</span>
                      </div>
                    </div>
                    {result.remarks && <p className="text-xs text-muted-foreground mt-2 italic">{result.remarks}</p>}
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* HOMEWORK TAB */}
      {activeTab === "homework" && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Homework</h2>
          <p className="text-sm text-muted-foreground -mt-2">For {child?.name} • Class {child?.className}{child?.section ? `-${child?.section}` : ""}</p>
          {hwLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : homework.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No homework assigned</p><p className="text-sm">Check back later</p></div>
          ) : homework.map((hw: any) => (
            <Card key={hw.id} className="p-4 rounded-xl border-border shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">{hw.subject?.charAt(0)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold">{hw.subject}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Due: {new Date(hw.dueDate).toLocaleDateString("en-IN")}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{hw.title}</p>
                  {hw.description && <p className="text-xs text-muted-foreground mt-1">{hw.description}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === "messages" && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          {selectedTeacher ? (
            <div className="flex flex-col" style={{ height: "calc(100vh - 14rem)" }}>
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
              <p className="text-sm text-muted-foreground mb-4">Contact your child's teachers directly</p>
              {msgsLoading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              : teachers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No teachers available</p></div>
              ) : teachers.map((teacher: any) => {
                const thread = threads.find((t: any) => t.userId === teacher.userId);
                return (
                  <Card key={teacher.id} className="p-4 rounded-xl border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors" onClick={() => loadChat(teacher)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{(teacher.name || "T")[0]}</div>
                      <div className="flex-1">
                        <p className="font-bold">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{teacher.subject || "Teacher"}</p>
                        {thread?.lastMessage && <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>}
                      </div>
                      {thread?.unreadCount > 0 && <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{thread.unreadCount}</span>}
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ATTENDANCE TAB */}
      {activeTab === "attendance" && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Attendance History</h2>
            {child && <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-full">{child.name?.split(" ")[0]}</span>}
          </div>
          {!attendanceLoading && attendanceRecords.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Present", count: attendanceRecords.filter((a: any) => a.status === "present").length, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
                { label: "Absent",  count: attendanceRecords.filter((a: any) => a.status === "absent").length,  color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
                { label: "Late",    count: attendanceRecords.filter((a: any) => a.status === "late").length,    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" },
              ].map(({ label, count, color }) => (
                <div key={label} className={`rounded-xl p-3 text-center ${color}`}>
                  <p className="text-2xl font-bold font-display">{count}</p>
                  <p className="text-xs font-bold mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
          {!attendanceLoading && attendanceRecords.length > 0 && (
            <Card className="p-4 rounded-2xl border-border/50 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-foreground">Overall Attendance</span>
                <span className={`text-sm font-bold ${attendancePct >= 75 ? "text-green-600" : "text-red-600"}`}>{attendancePct}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${attendancePct >= 75 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${attendancePct}%` }} />
              </div>
              {attendancePct < 75 && <p className="text-xs text-red-500 font-medium mt-2">Below 75% — attendance is insufficient. Please contact the school.</p>}
            </Card>
          )}
          {attendanceLoading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : attendanceRecords.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold">No attendance records</p>
              <p className="text-sm mt-1">Records will appear once the teacher marks attendance</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...attendanceRecords].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((rec: any) => (
                <Card key={rec.id} className="p-4 rounded-xl border-border/50 shadow-sm flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${rec.status === "present" ? "bg-green-50 dark:bg-green-900/20" : rec.status === "absent" ? "bg-red-50 dark:bg-red-900/20" : "bg-yellow-50 dark:bg-yellow-900/20"}`}>
                    {rec.status === "present" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : rec.status === "absent" ? <XCircle className="w-5 h-5 text-red-500" /> : <Clock className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-sm">{new Date(rec.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <Badge variant={rec.status === "present" ? "default" : rec.status === "absent" ? "destructive" : "secondary"} className="text-xs font-bold capitalize">{rec.status}</Badge>
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

      {/* PTM TAB */}
      {activeTab === "ptm" && (
        <div className="max-w-2xl">
          <PTMTab schoolId={schoolId} childId={child?.id} />
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {activeTab === "assignments" && (
        <div className="max-w-2xl">
          <ParentAssignmentsTab schoolId={schoolId} child={child} />
        </div>
      )}

      {/* EVENTS TAB */}
      {activeTab === "events" && (
        <div className="max-w-2xl">
          <ParentEventsTab schoolId={schoolId} onEventClick={setSelectedEvent} />
        </div>
      )}

      {/* MATERIALS TAB */}
      {activeTab === "materials" && (
        <div className="max-w-2xl">
          <ParentMaterialsTab schoolId={schoolId} child={child} />
        </div>
      )}

      {/* TRANSPORT TAB */}
      {activeTab === "transport" && (
        <div className="max-w-2xl">
          <ParentTransportTab schoolId={schoolId} child={child} />
        </div>
      )}

      {/* LEAVE TAB */}
      {activeTab === "leave" && (
        <div className="max-w-2xl">
          <ParentLeaveTab schoolId={schoolId} child={child} />
        </div>
      )}

      {/* SUPPORT TAB */}
      {activeTab === "support" && (
        <div className="max-w-2xl">
          <ParentSupportTab schoolId={schoolId} />
        </div>
      )}

      {/* Payment Dialog */}
      <Dialog open={!!payingFee} onOpenChange={open => { if (!open && payStep !== "processing") setPayingFee(null); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">{payStep === "done" ? "Payment Successful!" : "Pay Fees"}</DialogTitle>
          </DialogHeader>
          {payStep === "done" ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-green-600" /></div>
              <p className="font-bold text-green-700 text-lg">₹{Number(payingFee?.amount || 0).toLocaleString("en-IN")} Paid</p>
              <p className="text-sm text-muted-foreground mt-1">Fee has been marked as paid</p>
            </div>
          ) : payStep === "processing" ? (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="font-bold text-foreground">Processing payment…</p>
              <p className="text-sm text-muted-foreground mt-1">Please wait, do not close this window</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">{payingFee?.description || payingFee?.feeType || "Fee"}</p>
                <p className="text-3xl font-bold text-primary">₹{Number(payingFee?.amount || 0).toLocaleString("en-IN")}</p>
              </div>
              <p className="text-sm font-bold text-muted-foreground">Select Payment Method</p>
              {[
                { key: "upi",        label: "UPI / QR Code",         desc: "Pay via Google Pay, PhonePe, Paytm", icon: "🎯" },
                { key: "card",       label: "Debit / Credit Card",   desc: "Visa, Mastercard, RuPay",            icon: "💳" },
                { key: "netbanking", label: "Net Banking",           desc: "All major banks supported",          icon: "🏦" },
              ].map(m => (
                <button key={m.key} onClick={() => setPayMethod(m.key as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${payMethod === m.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1"><p className="font-bold text-sm text-foreground">{m.label}</p><p className="text-xs text-muted-foreground">{m.desc}</p></div>
                  {payMethod === m.key && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                </button>
              ))}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                <strong>Demo Mode:</strong> No real payment will be processed. This simulates a payment gateway.
              </div>
              <Button className="w-full rounded-xl font-bold h-11" disabled={!payMethod} onClick={confirmPayment}>
                Confirm & Pay ₹{Number(payingFee?.amount || 0).toLocaleString("en-IN")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Link Child Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={open => { if (!open) { setShowLinkDialog(false); setAdmissionInput(""); setLinkResult(null); setLinkSearched(false); } }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Link2 className="w-5 h-5 text-primary" />Link a Child</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <p className="text-sm text-muted-foreground">Enter your child's admission number or name to link them to your account.</p>
            <div className="flex gap-2">
              <Input
                value={admissionInput}
                onChange={e => { setAdmissionInput(e.target.value); setLinkSearched(false); setLinkResult(null); }}
                onKeyDown={e => e.key === "Enter" && searchChild()}
                placeholder="Admission No. or name..."
                className="rounded-xl flex-1"
              />
              <Button onClick={searchChild} className="rounded-xl px-4" disabled={!admissionInput.trim()}>Search</Button>
            </div>
            {linkSearched && !linkResult && (
              <div className="text-center py-4 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-bold">No student found</p>
                <p className="text-xs mt-1">Try the exact admission number or contact your school admin</p>
              </div>
            )}
            {linkResult && (
              <Card className="p-4 rounded-xl border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{linkResult.name?.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-foreground">{linkResult.name}</p>
                    <p className="text-sm text-muted-foreground">Class {linkResult.className || "—"} • {linkResult.admissionNo}</p>
                  </div>
                </div>
                {linkedChildIds.includes(linkResult.id) || myChildren.find((c: any) => c.id === linkResult.id)
                  ? <p className="text-xs text-center text-green-600 font-bold">Already linked to your account</p>
                  : <Button className="w-full rounded-xl font-bold" onClick={() => confirmLinkChild(linkResult)}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />Add {linkResult.name?.split(" ")[0]}
                    </Button>
                }
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={open => { if (!open) setSelectedEvent(null); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <p className="text-2xl font-bold text-primary leading-none">{new Date(selectedEvent.eventDate).getDate()}</p>
                  <p className="text-xs font-bold text-primary/70">{new Date(selectedEvent.eventDate).toLocaleString("en-IN", { month: "short", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">{selectedEvent.title}</p>
                  {selectedEvent.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{selectedEvent.location}</p>
                  )}
                </div>
              </div>
              {selectedEvent.description && (
                <div className="bg-secondary/30 rounded-xl p-3">
                  <p className="text-sm text-foreground leading-relaxed">{selectedEvent.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-secondary/30 rounded-xl p-3">
                  <p className="font-bold text-muted-foreground mb-0.5">Date</p>
                  <p className="font-bold text-foreground">{new Date(selectedEvent.eventDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>
                {selectedEvent.eventTime && (
                  <div className="bg-secondary/30 rounded-xl p-3">
                    <p className="font-bold text-muted-foreground mb-0.5">Time</p>
                    <p className="font-bold text-foreground">{selectedEvent.eventTime}</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full rounded-xl" onClick={() => setSelectedEvent(null)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

const BASE_URL = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const tok = () => localStorage.getItem("myschool_token") || "";

function ParentAssignmentsTab({ schoolId, child }: { schoolId: number; child: any }) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!child?.classId) { setLoading(false); return; }
    fetch(`${BASE_URL()}/api/assignments?schoolId=${schoolId}&classId=${child.classId}`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json()).then(d => setAssignments(d.assignments || [])).finally(() => setLoading(false));
  }, [child?.classId, schoolId]);
  const now = new Date();
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!child) return <div className="text-center py-16 text-muted-foreground"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">Select a child first</p></div>;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-display">{child.name}'s Assignments</h2>
      {assignments.length === 0 ? <div className="text-center py-16 text-muted-foreground"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No assignments yet</p></div>
      : assignments.map((a: any) => {
        const isOverdue = a.dueDate && new Date(a.dueDate) < now;
        return (
          <Card key={a.id} className={`p-4 rounded-xl border-border shadow-sm ${isOverdue ? "border-red-200 bg-red-50 dark:bg-red-900/10" : ""}`}>
            <div className="flex items-start justify-between gap-2">
              <div><p className="font-bold text-foreground">{a.title}</p><p className="text-sm text-muted-foreground">{a.subject}</p></div>
              <Badge className={`text-xs shrink-0 ${isOverdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{isOverdue ? "Overdue" : "Due"}: {a.dueDate ? new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</Badge>
            </div>
            {a.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{a.description}</p>}
          </Card>
        );
      })}
    </div>
  );
}

function ParentEventsTab({ schoolId, onEventClick }: { schoolId: number; onEventClick: (event: any) => void }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${BASE_URL()}/api/events?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json()).then(d => setEvents(d.events || [])).finally(() => setLoading(false));
  }, [schoolId]);
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.eventDate) >= now).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  const past     = events.filter(e => new Date(e.eventDate) < now).sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold font-display">School Events</h2>
      {upcoming.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upcoming</p>
          {upcoming.map((e: any) => (
            <button key={e.id} className="w-full text-left" onClick={() => onEventClick(e)}>
              <Card className="p-4 rounded-xl border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <p className="text-lg font-bold text-primary leading-none">{new Date(e.eventDate).getDate()}</p>
                    <p className="text-[10px] font-bold text-primary/70">{new Date(e.eventDate).toLocaleString("en-IN", { month: "short" })}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{e.title}</p>
                    {e.location && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</p>}
                    {e.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{e.description}</p>}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
              </Card>
            </button>
          ))}
        </>
      )}
      {past.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2">Past Events</p>
          {past.slice(0, 5).map((e: any) => (
            <button key={e.id} className="w-full text-left" onClick={() => onEventClick(e)}>
              <Card className="p-3 rounded-xl border-border/50 shadow-sm opacity-70 hover:opacity-100 hover:border-primary/40 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0"><CalendarDays className="w-4 h-4 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(e.eventDate).toLocaleDateString("en-IN")}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </div>
              </Card>
            </button>
          ))}
        </>
      )}
      {events.length === 0 && <div className="text-center py-16 text-muted-foreground"><CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No events yet</p></div>}
    </div>
  );
}

function ParentMaterialsTab({ schoolId, child }: { schoolId: number; child: any }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!child?.classId) { setLoading(false); return; }
    fetch(`${BASE_URL()}/api/study-materials?schoolId=${schoolId}&classId=${child.classId}`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json()).then(d => setMaterials(d.materials || [])).finally(() => setLoading(false));
  }, [child?.classId, schoolId]);
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!child) return <div className="text-center py-16 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">Select a child first</p></div>;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-display">{child.name}'s Study Materials</h2>
      {materials.length === 0 ? <div className="text-center py-16 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No materials uploaded yet</p></div>
      : materials.map((m: any) => (
        <Card key={m.id} className="p-4 rounded-xl border-border shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5 text-primary" /></div>
            <div className="flex-1"><p className="font-bold text-foreground">{m.title}</p><p className="text-sm text-muted-foreground">{m.subject}</p>{m.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.description}</p>}</div>
            {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noreferrer" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary/20"><FileText className="w-4 h-4" /></a>}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ParentTransportTab({ schoolId, child }: { schoolId: number; child: any }) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [myRoute, setMyRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!schoolId) return;
    fetch(`${BASE_URL()}/api/transport?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json()).then(d => {
        const rs = d.routes || [];
        setRoutes(rs);
        if (child?.id) {
          fetch(`${BASE_URL()}/api/transport/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r2 => r2.json()).then(d2 => {
              const assigned = (d2.students || []).find((s: any) => s.studentId === child.id);
              if (assigned) setMyRoute(rs.find((r: any) => r.id === assigned.routeId) || null);
            }).catch(() => {});
        }
      }).finally(() => setLoading(false));
  }, [schoolId, child?.id]);
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-display">School Transport</h2>
      {myRoute ? (
        <Card className="p-5 rounded-2xl border-primary/20 bg-primary/5">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{child?.name}'s Bus Route</p>
          <p className="text-xl font-bold text-foreground">{myRoute.routeName}</p>
          {myRoute.vehicleNo  && <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1"><Bus className="w-4 h-4" />Vehicle: {myRoute.vehicleNo}</p>}
          {myRoute.driverName && <p className="text-sm text-muted-foreground mt-0.5">Driver: {myRoute.driverName}{myRoute.driverPhone ? ` • ${myRoute.driverPhone}` : ""}</p>}
          {myRoute.stops && <div className="mt-3"><p className="text-xs font-bold text-muted-foreground mb-2">Stops</p><div className="flex flex-wrap gap-1">{String(myRoute.stops).split(",").map((s: string, i: number) => (<span key={i} className="text-xs bg-white dark:bg-gray-800 border border-border px-2 py-0.5 rounded-full font-medium">{s.trim()}</span>))}</div></div>}
        </Card>
      ) : child && (
        <Card className="p-4 rounded-xl border-border/50 text-center py-8 text-muted-foreground"><Bus className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="font-bold">No transport assigned for {child.name}</p><p className="text-sm mt-1">Contact school admin to assign a bus route</p></Card>
      )}
      {routes.length > 0 && (
        <div>
          <p className="text-sm font-bold text-muted-foreground mb-3 mt-4">All School Routes ({routes.length})</p>
          <div className="space-y-2">
            {routes.map((r: any) => (
              <Card key={r.id} className="p-3 rounded-xl border-border/50 flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0"><Bus className="w-4 h-4 text-muted-foreground" /></div>
                <div><p className="font-bold text-sm text-foreground">{r.routeName}</p>{r.vehicleNo && <p className="text-xs text-muted-foreground">Vehicle: {r.vehicleNo}</p>}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ParentLeaveTab({ schoolId, child }: { schoolId: number; child: any }) {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ leaveType: "sick", fromDate: "", toDate: "", reason: "" });
  const { toast } = useToast();
  useEffect(() => {
    if (!child?.id) { setLoading(false); return; }
    fetch(`${BASE_URL()}/api/student-leaves?schoolId=${schoolId}&studentId=${child.id}`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json()).then(d => setLeaves(d.leaves || [])).finally(() => setLoading(false));
  }, [child?.id, schoolId]);
  const submit = async () => {
    if (!form.fromDate || !form.toDate || !form.reason) { toast({ title: "All fields required", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL()}/api/student-leaves`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` }, body: JSON.stringify({ ...form, studentId: child.id, schoolId, appliedBy: "parent" }) });
      if (res.ok) { const d = await res.json(); setLeaves(l => [d.leave, ...l]); setForm({ leaveType: "sick", fromDate: "", toDate: "", reason: "" }); toast({ title: "Leave application submitted!" }); }
    } finally { setSubmitting(false); }
  };
  const STATUS_COLOR: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!child) return <div className="text-center py-16 text-muted-foreground"><FileText className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">Select a child first</p></div>;
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold font-display">Leave Application</h2>
      <Card className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-3">
        <p className="font-bold text-sm text-foreground">Apply Leave for {child.name}</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">Type</label><select value={form.leaveType} onChange={e => setForm(f => ({ ...f, leaveType: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background text-foreground focus:outline-none focus:border-primary"><option value="sick">Sick Leave</option><option value="family">Family Reason</option><option value="festival">Festival</option><option value="other">Other</option></select></div>
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">From Date</label><Input type="date" value={form.fromDate} onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))} className="rounded-xl text-sm" /></div>
        </div>
        <div><label className="text-xs font-bold text-muted-foreground block mb-1">To Date</label><Input type="date" value={form.toDate} onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))} className="rounded-xl text-sm" /></div>
        <div><label className="text-xs font-bold text-muted-foreground block mb-1">Reason *</label><textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={2} className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:border-primary resize-none" placeholder="Reason for leave..." /></div>
        <Button onClick={submit} disabled={submitting} className="w-full rounded-xl font-bold">{submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Apply for Leave"}</Button>
      </Card>
      <div className="space-y-2">
        <p className="text-sm font-bold text-muted-foreground">Past Applications</p>
        {leaves.length === 0 ? <p className="text-center text-muted-foreground py-6 text-sm">No leave applications yet</p>
        : leaves.map((l: any) => (
          <Card key={l.id} className="p-4 rounded-xl border-border/50 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div><p className="font-bold text-sm text-foreground capitalize">{l.leaveType.replace("_", " ")} Leave</p><p className="text-xs text-muted-foreground">{l.fromDate} → {l.toDate}</p><p className="text-xs text-muted-foreground mt-0.5">{l.reason}</p></div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${STATUS_COLOR[l.status] || "bg-gray-100 text-gray-600"}`}>{l.status}</span>
            </div>
            {l.adminNote && <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">Admin note: {l.adminNote}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ParentSupportTab({ schoolId }: { schoolId: number }) {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", category: "general", priority: "medium" });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL()}/api/support/tickets?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${tok()}` } });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch { setTickets([]); }
    setLoading(false);
  };

  useEffect(() => { if (schoolId) fetchTickets(); }, [schoolId]);

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.description.trim()) {
      toast({ title: "Subject and description required", variant: "destructive" }); return;
    }
    setSubmitting(true);
    try {
      await fetch(`${BASE_URL()}/api/support/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
        body: JSON.stringify({ ...form, schoolId }),
      });
      toast({ title: "Ticket submitted!", description: "Our team will respond within 24 hours." });
      setShowForm(false);
      setForm({ subject: "", description: "", category: "general", priority: "medium" });
      fetchTickets();
    } catch { toast({ title: "Failed to submit ticket", variant: "destructive" }); }
    setSubmitting(false);
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const STATUS_COLOR: Record<string, string> = {
    open: "bg-blue-100 text-blue-700", in_progress: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-display">Help & Support</h2>
        <Button size="sm" className="rounded-xl font-bold" onClick={() => setShowForm(v => !v)}>
          <Plus className="w-4 h-4 mr-1" />{showForm ? "Cancel" : "New Ticket"}
        </Button>
      </div>
      {showForm && (
        <Card className="p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 space-y-3">
          <p className="font-bold text-sm text-foreground">Raise a Support Ticket</p>
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">Subject *</label><input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="What do you need help with?" className="w-full border border-border rounded-xl p-2.5 text-sm bg-background focus:outline-none focus:border-primary" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Category</label><select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background focus:outline-none focus:border-primary"><option value="general">General</option><option value="technical">Technical</option><option value="billing">Billing/Fees</option><option value="complaint">Complaint</option></select></div>
            <div><label className="text-xs font-bold text-muted-foreground block mb-1">Priority</label><select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full border border-border rounded-xl p-2 text-sm bg-background focus:outline-none focus:border-primary"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
          </div>
          <div><label className="text-xs font-bold text-muted-foreground block mb-1">Description *</label><textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your issue or question in detail..." className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:border-primary resize-none" /></div>
          <Button onClick={handleSubmit} disabled={submitting} className="w-full rounded-xl font-bold">
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit Ticket"}
          </Button>
        </Card>
      )}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-bold">No tickets yet</p>
          <p className="text-sm mt-1">Raise a ticket if you need help with anything</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-bold text-muted-foreground">Your Tickets</p>
          {tickets.map(ticket => (
            <Card key={ticket.id} className="rounded-xl border-border/50 shadow-sm overflow-hidden">
              <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-sm text-foreground truncate">{ticket.subject}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize shrink-0 ${STATUS_COLOR[ticket.status] || STATUS_COLOR.open}`}>{ticket.status?.replace("_", " ")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{ticket.category} • {timeAgo(ticket.createdAt)}</p>
                  </div>
                  {expanded === ticket.id ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
                </div>
              </button>
              {expanded === ticket.id && (
                <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-2">
                  <p className="text-sm text-foreground">{ticket.description}</p>
                  {ticket.resolution ? (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                      <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1">Admin Response</p>
                      <p className="text-sm text-green-800 dark:text-green-300">{ticket.resolution}</p>
                    </div>
                  ) : <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Awaiting response</p>}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <Card className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300"><strong>Need urgent help?</strong> Call us at +91 0000000000 (Mon–Sat, 9am–6pm)</p>
        </div>
      </Card>
    </div>
  );
}
