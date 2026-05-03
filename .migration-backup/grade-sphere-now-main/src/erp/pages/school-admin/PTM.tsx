import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useAuth } from "@/erp/hooks/use-auth";
import { Calendar, Plus, Trash2, Loader2, Users, Clock } from "lucide-react";
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

const STATUS_COLOR: Record<string, string> = { available: "bg-green-100 text-green-700", booked: "bg-blue-100 text-blue-700", completed: "bg-gray-100 text-gray-600", cancelled: "bg-red-100 text-red-700" };

export default function PTM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [slots, setSlots] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [form, setForm] = useState({ teacherId: "", date: "", startTime: "", endTime: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [sRes, tRes] = await Promise.all([
      fetch(`${BASE}/api/ptm?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/teachers?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    setSlots((await sRes.json()).slots || []);
    setTeachers((await tRes.json()).teachers || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addSlot = async () => {
    const res = await fetch(`${BASE}/api/ptm`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ ...form, schoolId }) });
    if (res.ok) { toast({ title: "Slot created!" }); setOpen(false); fetchAll(); }
  };

  const deleteSlot = async (id: number) => { await fetch(`${BASE}/api/ptm/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };

  const filtered = filterTeacher === "all" ? slots : slots.filter(s => s.teacherId === Number(filterTeacher));
  const byDate: Record<string, typeof filtered> = {};
  filtered.forEach(s => { if (!byDate[s.date]) byDate[s.date] = []; byDate[s.date].push(s); });

  return (
    <AdminLayout title="Parent-Teacher Meeting (PTM)" links={adminLinks}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="grid grid-cols-3 gap-3">
          {["available","booked","completed"].map(st => (
            <div key={st} className="text-center">
              <p className="text-lg font-bold dark:text-white">{slots.filter(s => s.status === st).length}</p>
              <p className="text-xs text-muted-foreground capitalize">{st}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Select value={filterTeacher} onValueChange={setFilterTeacher}>
            <SelectTrigger className="w-44 dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="All Teachers" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Teachers</SelectItem>{teachers.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />Add Slot</Button></DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader><DialogTitle>Create PTM Slot</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><label className="text-sm font-medium dark:text-gray-300">Teacher *</label>
                  <Select value={form.teacherId} onValueChange={v => setForm(p => ({ ...p, teacherId: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select teacher" /></SelectTrigger>
                    <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div><label className="text-sm font-medium dark:text-gray-300">Date *</label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium dark:text-gray-300">Start Time</label><Input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">End Time</label><Input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                </div>
                <Button onClick={addSlot} className="w-full">Create Slot</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      : Object.keys(byDate).length === 0 ? <div className="text-center py-16 text-muted-foreground"><Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No PTM slots created yet</p><p className="text-sm">Create slots for parents to book</p></div>
      : Object.entries(byDate).sort().map(([date, daySlots]) => (
        <div key={date} className="mb-6">
          <p className="font-bold dark:text-white mb-3">{new Date(date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {daySlots.map((s: any) => (
              <Card key={s.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold text-sm dark:text-white">{s.startTime} – {s.endTime}</span>
                      <Badge className={`text-xs rounded-full ${STATUS_COLOR[s.status]}`}>{s.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.teacherName}</p>
                    {s.studentName && <p className="text-xs text-primary">Booked: {s.studentName}</p>}
                    {s.notes && <p className="text-xs text-muted-foreground">{s.notes}</p>}
                  </div>
                  <button onClick={() => deleteSlot(s.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}
