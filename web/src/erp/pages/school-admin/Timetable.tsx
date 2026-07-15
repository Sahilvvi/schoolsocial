import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { Plus, Trash2, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }
function getUser() { try { return JSON.parse(localStorage.getItem("myschool_user") || "{}"); } catch { return {}; } }

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAY_LABELS: Record<string, string> = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat" };

interface TimetableEntry { id: number; dayOfWeek: string; periodNumber: number; subject: string; startTime: string; endTime: string; teacherId?: number; }
interface Class { id: number; name: string; section?: string; }

export default function Timetable() {
  const user = getUser();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ dayOfWeek: "monday", periodNumber: "1", subject: "", startTime: "08:00", endTime: "08:45" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/classes?schoolId=${user.schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => { setClasses(d.classes || []); if (d.classes?.length) setSelectedClass(d.classes[0].id); });
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    fetch(`${BASE}/api/timetable?schoolId=${user.schoolId}&classId=${selectedClass}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setEntries(d.timetable || []))
      .finally(() => setLoading(false));
  }, [selectedClass]);

  const handleAdd = async () => {
    if (!form.subject || !selectedClass) return;
    try {
      const res = await fetch(`${BASE}/api/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ schoolId: user.schoolId, classId: selectedClass, ...form, periodNumber: Number(form.periodNumber) }),
      });
      const data = await res.json();
      setEntries(prev => [...prev, data].sort((a, b) => DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek) || a.periodNumber - b.periodNumber));
      setOpen(false);
      setForm({ dayOfWeek: "monday", periodNumber: "1", subject: "", startTime: "08:00", endTime: "08:45" });
      toast({ title: "Period added!" });
    } catch { toast({ title: "Error", description: "Failed to add period", variant: "destructive" }); }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${BASE}/api/timetable/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    setEntries(prev => prev.filter(e => e.id !== id));
    toast({ title: "Period removed" });
  };

  const byDay = DAYS.reduce((acc, day) => ({ ...acc, [day]: entries.filter(e => e.dayOfWeek === day).sort((a, b) => a.periodNumber - b.periodNumber) }), {} as Record<string, TimetableEntry[]>);

  return (
    <AdminLayout title="Timetable" links={adminLinks}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage class schedules by day and period</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={String(selectedClass || "")} onValueChange={v => setSelectedClass(Number(v))}>
            <SelectTrigger className="w-44 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue placeholder="Select Class" /></SelectTrigger>
            <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` - ${c.section}` : ""}</SelectItem>)}</SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2"/>Add Period</Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader><DialogTitle className="dark:text-white">Add Timetable Period</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Day</Label>
                    <Select value={form.dayOfWeek} onValueChange={v => setForm(p => ({ ...p, dayOfWeek: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{DAY_LABELS[d]}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Period No.</Label>
                    <Input type="number" min="1" max="10" value={form.periodNumber} onChange={e => setForm(p => ({ ...p, periodNumber: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div>
                  <Label className="dark:text-gray-300">Subject *</Label>
                  <Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Mathematics" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Start Time</Label>
                    <Input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">End Time</Label>
                    <Input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Add Period</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"/></div>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-3 min-w-[700px]">
            {DAYS.map(day => (
              <div key={day} className="space-y-2">
                <div className="text-center py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm">{DAY_LABELS[day]}</div>
                {byDay[day].length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">No periods</div>
                ) : (
                  byDay[day].map(entry => (
                    <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 relative group">
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400">P{entry.periodNumber}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{entry.subject}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3"/>{entry.startTime} – {entry.endTime}
                      </div>
                      <button onClick={() => handleDelete(entry.id)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity">
                        <Trash2 className="w-3 h-3"/>
                      </button>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
