import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useListClasses, useCreateClass, useListTeachers } from "@/erp/api-client";
import { useAuth } from "@/erp/hooks/use-auth";
import {
  Plus, Users, BookOpen, User, Loader2, Send, Search, Calendar,
  Phone, X, Trash2, Clock, GraduationCap, ChevronRight, UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat",
};
const DAY_COLORS: Record<string, string> = {
  monday: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
  tuesday: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800",
  wednesday: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
  thursday: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800",
  friday: "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800",
  saturday: "bg-gray-50 border-gray-200 dark:bg-gray-700/30 dark:border-gray-600",
};
const GENDER_COLOR: Record<string, string> = {
  male: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  female: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  other: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

export default function Classes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", section: "", room: "", teacherId: "" });

  const { data, isLoading, refetch } = useListClasses({ schoolId });
  const { data: teachersData } = useListTeachers({ schoolId });
  const createClass = useCreateClass();

  const classes = data?.classes || [];
  const teachers = teachersData?.teachers || [];

  // ─── Students modal state ─────────────────────────────────────────
  const [studentsModal, setStudentsModal] = useState<{ open: boolean; cls: any | null }>({ open: false, cls: null });
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [moveModal, setMoveModal] = useState<{ open: boolean; student: any | null }>({ open: false, student: null });
  const [moveTargetClass, setMoveTargetClass] = useState("");
  const [moveSaving, setMoveSaving] = useState(false);

  // ─── Schedule modal state ─────────────────────────────────────────
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; cls: any | null }>({ open: false, cls: null });
  const [timetable, setTimetable] = useState<any[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [addPeriodForm, setAddPeriodForm] = useState({ dayOfWeek: "monday", periodNumber: "1", subject: "", startTime: "08:00", endTime: "09:00", teacherId: "" });
  const [addPeriodOpen, setAddPeriodOpen] = useState(false);
  const [addPeriodSaving, setAddPeriodSaving] = useState(false);

  // ─── Load students for a class ─────────────────────────────────────
  const loadStudents = useCallback(async (cls: any) => {
    setStudentsLoading(true);
    setStudents([]);
    try {
      const res = await fetch(`${BASE}/api/students?schoolId=${schoolId}&classId=${cls.id}&limit=200`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setStudents(data.students || []);
    } catch {
      toast({ title: "Failed to load students", variant: "destructive" });
    }
    setStudentsLoading(false);
  }, [schoolId, toast]);

  // ─── Load timetable for a class ────────────────────────────────────
  const loadTimetable = useCallback(async (cls: any) => {
    setScheduleLoading(true);
    setTimetable([]);
    try {
      const res = await fetch(`${BASE}/api/timetable?schoolId=${schoolId}&classId=${cls.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setTimetable(data.timetable || []);
    } catch {
      toast({ title: "Failed to load schedule", variant: "destructive" });
    }
    setScheduleLoading(false);
  }, [schoolId, toast]);

  // Open students modal
  const openStudents = (cls: any) => {
    setStudentsModal({ open: true, cls });
    setStudentSearch("");
    loadStudents(cls);
  };

  // Open schedule modal
  const openSchedule = (cls: any) => {
    setScheduleModal({ open: true, cls });
    loadTimetable(cls);
  };

  // Move student to another class
  const handleMoveStudent = async () => {
    if (!moveTargetClass || !moveModal.student) return;
    setMoveSaving(true);
    try {
      const res = await fetch(`${BASE}/api/students/${moveModal.student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ classId: Number(moveTargetClass) }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Student moved", description: `${moveModal.student.name} has been moved to the new class.` });
      setMoveModal({ open: false, student: null });
      setMoveTargetClass("");
      if (studentsModal.cls) loadStudents(studentsModal.cls);
      refetch();
    } catch {
      toast({ title: "Failed to move student", variant: "destructive" });
    }
    setMoveSaving(false);
  };

  // Delete a timetable period
  const handleDeletePeriod = async (periodId: number) => {
    try {
      const res = await fetch(`${BASE}/api/timetable/${periodId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      setTimetable(prev => prev.filter(p => p.id !== periodId));
      toast({ title: "Period removed" });
    } catch {
      toast({ title: "Failed to remove period", variant: "destructive" });
    }
  };

  // Add a timetable period
  const handleAddPeriod = async () => {
    if (!addPeriodForm.subject || !addPeriodForm.startTime || !addPeriodForm.endTime) {
      toast({ title: "Fill in all required fields", variant: "destructive" }); return;
    }
    setAddPeriodSaving(true);
    try {
      const res = await fetch(`${BASE}/api/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          schoolId,
          classId: scheduleModal.cls?.id,
          dayOfWeek: addPeriodForm.dayOfWeek,
          periodNumber: Number(addPeriodForm.periodNumber),
          subject: addPeriodForm.subject,
          startTime: addPeriodForm.startTime,
          endTime: addPeriodForm.endTime,
          teacherId: addPeriodForm.teacherId ? Number(addPeriodForm.teacherId) : null,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Period added" });
      setAddPeriodOpen(false);
      setAddPeriodForm({ dayOfWeek: "monday", periodNumber: "1", subject: "", startTime: "08:00", endTime: "09:00", teacherId: "" });
      if (scheduleModal.cls) loadTimetable(scheduleModal.cls);
    } catch {
      toast({ title: "Failed to add period", variant: "destructive" });
    }
    setAddPeriodSaving(false);
  };

  // Create class
  const handleAdd = async () => {
    if (!form.name) {
      toast({ title: "Class name required", variant: "destructive" }); return;
    }
    try {
      await createClass.mutateAsync({ data: {
        schoolId, name: form.name,
        section: form.section || undefined,
        room: form.room || undefined,
        teacherId: form.teacherId ? Number(form.teacherId) : undefined,
      }});
      toast({ title: "Class created", description: `Class ${form.name}${form.section ? "-"+form.section : ""} created.` });
      setAddOpen(false);
      setForm({ name: "", section: "", room: "", teacherId: "" });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to create class.", variant: "destructive" });
    }
  };

  const filteredStudents = students.filter(s =>
    studentSearch === "" ||
    s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.admissionNo?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.parentName?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Group timetable by day
  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = timetable.filter(p => p.dayOfWeek === day).sort((a, b) => a.periodNumber - b.periodNumber);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <AdminLayout title="Classes & Sections" links={adminLinks}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Manage Classes</h2>
          <p className="text-muted-foreground font-medium">View students and weekly schedules for each class</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" /> Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-2xl dark:text-white">Create New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground dark:text-gray-300">Class Name *</label>
                  <Input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="e.g. 10, 9, LKG" className="h-11 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground dark:text-gray-300">Section</label>
                  <Input value={form.section} onChange={e => setForm(p => ({...p, section: e.target.value}))} placeholder="e.g. A, B, C" className="h-11 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground dark:text-gray-300">Room Number</label>
                <Input value={form.room} onChange={e => setForm(p => ({...p, room: e.target.value}))} placeholder="e.g. 101" className="h-11 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground dark:text-gray-300">Class Teacher</label>
                <Select value={form.teacherId} onValueChange={v => setForm(p => ({...p, teacherId: v}))}>
                  <SelectTrigger className="h-11 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Assign a teacher" /></SelectTrigger>
                  <SelectContent>
                    {teachers.map((t: any) => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} disabled={createClass.isPending} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                {createClass.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                Create Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Class cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold mb-2">No classes found</p>
          <p className="text-sm">Add a class using the button above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls: any) => {
            const teacher = teachers.find((t: any) => t.id === cls.teacherId);
            return (
              <Card key={cls.id} className="p-6 rounded-2xl border-border shadow-sm hover:shadow-md transition-all dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-2xl font-bold font-display shadow-lg shadow-primary/20">
                    {cls.name}<span className="text-sm ml-0.5 opacity-80">{cls.section}</span>
                  </div>
                  {cls.room && (
                    <div className="px-3 py-1 bg-secondary rounded-full text-xs font-bold text-muted-foreground border border-border flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Room {cls.room}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg dark:bg-gray-700">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Class Teacher</p>
                      <p className="text-sm font-bold text-foreground dark:text-white">{teacher?.name || cls.classTeacher || "Not assigned"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg dark:bg-gray-700">
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Students</p>
                      <p className="text-sm font-bold text-foreground dark:text-white">{cls.studentCount ?? "—"} enrolled</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border dark:border-gray-700 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl font-bold border-border dark:border-gray-600 dark:text-gray-200 hover:bg-primary/5 hover:border-primary/30 gap-2"
                    onClick={() => openStudents(cls)}
                  >
                    <Users className="w-4 h-4" /> Students
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl font-bold border-border dark:border-gray-600 dark:text-gray-200 hover:bg-primary/5 hover:border-primary/30 gap-2"
                    onClick={() => openSchedule(cls)}
                  >
                    <Calendar className="w-4 h-4" /> Schedule
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Students Modal ─────────────────────────────────────────────── */}
      <Dialog open={studentsModal.open} onOpenChange={open => { setStudentsModal(s => ({ ...s, open })); setStudentSearch(""); }}>
        <DialogContent className="max-w-2xl rounded-2xl dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Class {studentsModal.cls?.name}{studentsModal.cls?.section ? `-${studentsModal.cls.section}` : ""} — Students
            </DialogTitle>
          </DialogHeader>

          {/* Search bar */}
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              placeholder="Search by name, admission no, or parent..."
              className="pl-9 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Count badge */}
          {!studentsLoading && (
            <div className="shrink-0 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full font-bold">
                {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"}
              </Badge>
              {studentSearch && <span className="text-xs text-muted-foreground">matching "{studentSearch}"</span>}
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {studentsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold">{studentSearch ? "No students match your search" : "No students enrolled in this class"}</p>
                <p className="text-sm mt-1">Enroll students by editing their profile from the Students page</p>
              </div>
            ) : (
              filteredStudents.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 dark:bg-gray-700/40 hover:bg-secondary/70 dark:hover:bg-gray-700/70 transition-colors group">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {s.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-foreground dark:text-white truncate">{s.name}</span>
                      {s.gender && (
                        <Badge className={`text-[10px] capitalize rounded-full px-2 py-0 ${GENDER_COLOR[s.gender] || ""}`}>
                          {s.gender}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground font-medium">#{s.admissionNo}</span>
                      {s.parentName && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> {s.parentName}
                        </span>
                      )}
                      {s.parentPhone && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {s.parentPhone}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Move button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs rounded-lg h-8 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => { setMoveModal({ open: true, student: s }); setMoveTargetClass(""); }}
                  >
                    <ChevronRight className="w-4 h-4 mr-1" /> Move
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Move Student Modal ─────────────────────────────────────────── */}
      <Dialog open={moveModal.open} onOpenChange={open => setMoveModal(s => ({ ...s, open }))}>
        <DialogContent className="max-w-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Move Student to Another Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Moving <strong className="text-foreground dark:text-white">{moveModal.student?.name}</strong> from{" "}
              <strong className="text-foreground dark:text-white">
                Class {studentsModal.cls?.name}{studentsModal.cls?.section ? `-${studentsModal.cls.section}` : ""}
              </strong>
            </p>
            <div className="space-y-2">
              <label className="text-sm font-bold dark:text-gray-300">Destination Class</label>
              <Select value={moveTargetClass} onValueChange={setMoveTargetClass}>
                <SelectTrigger className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select target class" />
                </SelectTrigger>
                <SelectContent>
                  {classes
                    .filter((c: any) => c.id !== studentsModal.cls?.id)
                    .map((c: any) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        Class {c.name}{c.section ? `-${c.section}` : ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setMoveModal({ open: false, student: null })}>Cancel</Button>
              <Button className="flex-1 rounded-xl" disabled={!moveTargetClass || moveSaving} onClick={handleMoveStudent}>
                {moveSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Confirm Move
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Schedule Modal ─────────────────────────────────────────────── */}
      <Dialog open={scheduleModal.open} onOpenChange={open => setScheduleModal(s => ({ ...s, open }))}>
        <DialogContent className="max-w-3xl rounded-2xl dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Class {scheduleModal.cls?.name}{scheduleModal.cls?.section ? `-${scheduleModal.cls.section}` : ""} — Weekly Schedule
            </DialogTitle>
            <Button
              size="sm"
              className="rounded-xl h-8 text-xs gap-1.5 mr-8"
              onClick={() => setAddPeriodOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" /> Add Period
            </Button>
          </DialogHeader>

          {/* Add period inline form */}
          {addPeriodOpen && (
            <div className="shrink-0 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 space-y-3">
              <p className="text-sm font-bold text-foreground dark:text-white">New Period</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold dark:text-gray-300">Day</label>
                  <Select value={addPeriodForm.dayOfWeek} onValueChange={v => setAddPeriodForm(p => ({ ...p, dayOfWeek: v }))}>
                    <SelectTrigger className="h-9 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DAYS.map(d => <SelectItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold dark:text-gray-300">Period #</label>
                  <Select value={addPeriodForm.periodNumber} onValueChange={v => setAddPeriodForm(p => ({ ...p, periodNumber: v }))}>
                    <SelectTrigger className="h-9 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(n => <SelectItem key={n} value={String(n)}>Period {n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold dark:text-gray-300">Subject *</label>
                  <Input value={addPeriodForm.subject} onChange={e => setAddPeriodForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Mathematics" className="h-9 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold dark:text-gray-300">Start Time</label>
                  <Input type="time" value={addPeriodForm.startTime} onChange={e => setAddPeriodForm(p => ({ ...p, startTime: e.target.value }))} className="h-9 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold dark:text-gray-300">End Time</label>
                  <Input type="time" value={addPeriodForm.endTime} onChange={e => setAddPeriodForm(p => ({ ...p, endTime: e.target.value }))} className="h-9 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold dark:text-gray-300">Teacher</label>
                  <Select value={addPeriodForm.teacherId} onValueChange={v => setAddPeriodForm(p => ({ ...p, teacherId: v }))}>
                    <SelectTrigger className="h-9 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Optional" /></SelectTrigger>
                    <SelectContent>
                      {teachers.map((t: any) => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => setAddPeriodOpen(false)}>Cancel</Button>
                <Button size="sm" className="rounded-lg" disabled={addPeriodSaving} onClick={handleAddPeriod}>
                  {addPeriodSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Plus className="w-3.5 h-3.5 mr-1.5" />}
                  Save Period
                </Button>
              </div>
            </div>
          )}

          {/* Timetable grid */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {scheduleLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
            ) : timetable.length === 0 && !addPeriodOpen ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold">No schedule set yet</p>
                <p className="text-sm mt-1">Click "Add Period" above to build the weekly timetable</p>
              </div>
            ) : (
              DAYS.map(day => {
                const periods = byDay[day];
                if (periods.length === 0) return null;
                return (
                  <div key={day} className={`rounded-xl border p-3 ${DAY_COLORS[day]}`}>
                    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2.5">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </p>
                    <div className="space-y-2">
                      {periods.map((period: any) => {
                        const tch = teachers.find((t: any) => t.id === period.teacherId);
                        return (
                          <div key={period.id} className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/60 rounded-lg px-3 py-2 group">
                            <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-black flex items-center justify-center shrink-0">
                              {period.periodNumber}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-foreground dark:text-white">{period.subject}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {period.startTime} – {period.endTime}
                                </span>
                                {tch && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="w-3 h-3" /> {tch.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                              onClick={() => handleDeletePeriod(period.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
