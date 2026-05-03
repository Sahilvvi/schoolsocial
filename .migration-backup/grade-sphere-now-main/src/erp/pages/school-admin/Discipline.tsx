import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useAuth } from "@/erp/hooks/use-auth";
import { AlertTriangle, Plus, Loader2, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

const SEVERITY_COLOR: Record<string, string> = { minor: "bg-yellow-100 text-yellow-700", moderate: "bg-orange-100 text-orange-700", major: "bg-red-100 text-red-700" };
const STATUS_COLOR: Record<string, string> = { open: "bg-red-100 text-red-700", resolved: "bg-green-100 text-green-700", escalated: "bg-purple-100 text-purple-700" };

export default function Discipline() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [records, setRecords] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ studentId: "", incidentType: "", description: "", severity: "minor" as const, incidentDate: new Date().toISOString().split("T")[0], actionTaken: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [rRes, sRes] = await Promise.all([
      fetch(`${BASE}/api/discipline?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    setRecords((await rRes.json()).records || []);
    setStudents((await sRes.json()).students || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addRecord = async () => {
    const res = await fetch(`${BASE}/api/discipline`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(form) });
    if (res.ok) { toast({ title: "Discipline record added!" }); setOpen(false); fetchAll(); }
  };

  const resolve = async (id: number) => {
    await fetch(`${BASE}/api/discipline/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ status: "resolved" }) });
    toast({ title: "Marked as resolved" }); fetchAll();
  };

  const escalate = async (id: number, studentName: string) => {
    await fetch(`${BASE}/api/discipline/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ status: "escalated" }) });
    toast({ title: `Escalated — Parent notification sent for ${studentName}`, description: "Parents will be informed via the messaging system." });
    fetchAll();
  };

  const deleteRecord = async (id: number) => { await fetch(`${BASE}/api/discipline/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };

  return (
    <AdminLayout title="Discipline Records" links={adminLinks}>
      <div className="flex items-center justify-between mb-6">
        <div className="grid grid-cols-3 gap-3">
          {["open","resolved","escalated"].map(s => (
            <div key={s} className="text-center">
              <p className="text-lg font-bold dark:text-white">{records.filter(r => r.status === s).length}</p>
              <p className="text-xs text-muted-foreground capitalize">{s}</p>
            </div>
          ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />Add Incident</Button></DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader><DialogTitle>Record Discipline Incident</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><label className="text-sm font-medium dark:text-gray-300">Student *</label>
                <Select value={form.studentId} onValueChange={v => setForm(p => ({ ...p, studentId: v }))}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>{students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                </Select></div>
              <div><label className="text-sm font-medium dark:text-gray-300">Incident Type *</label><Input value={form.incidentType} onChange={e => setForm(p => ({ ...p, incidentType: e.target.value }))} placeholder="e.g. Bullying, Misconduct" className="dark:bg-gray-700 dark:border-gray-600" /></div>
              <div><label className="text-sm font-medium dark:text-gray-300">Description *</label><Textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the incident..." className="dark:bg-gray-700 dark:border-gray-600" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium dark:text-gray-300">Severity</label>
                  <Select value={form.severity} onValueChange={v => setForm(p => ({ ...p, severity: v as any }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="minor">Minor</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="major">Major</SelectItem></SelectContent>
                  </Select></div>
                <div><label className="text-sm font-medium dark:text-gray-300">Date</label><Input type="date" value={form.incidentDate} onChange={e => setForm(p => ({ ...p, incidentDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
              </div>
              <div><label className="text-sm font-medium dark:text-gray-300">Action Taken</label><Input value={form.actionTaken} onChange={e => setForm(p => ({ ...p, actionTaken: e.target.value }))} placeholder="e.g. Warning issued, Parents notified" className="dark:bg-gray-700 dark:border-gray-600" /></div>
              <Button onClick={addRecord} className="w-full">Record Incident</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      : records.length === 0 ? <div className="text-center py-16 text-muted-foreground"><AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No incidents recorded</p></div>
      : <div className="space-y-3">
          {records.map(r => (
            <Card key={r.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold dark:text-white">{r.studentName}</p>
                    <Badge className={`text-xs rounded-full ${SEVERITY_COLOR[r.severity]}`}>{r.severity}</Badge>
                    <Badge className={`text-xs rounded-full ${STATUS_COLOR[r.status]}`}>{r.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{r.incidentType} — {r.incidentDate}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                  {r.actionTaken && <p className="text-xs text-green-600 mt-1">Action: {r.actionTaken}</p>}
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  {r.status === "open" && <>
                    <Button size="sm" className="rounded-lg h-8 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => resolve(r.id)}><Check className="w-3 h-3 mr-1" />Resolve</Button>
                    <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs border-purple-300 text-purple-700 hover:bg-purple-50" onClick={() => escalate(r.id, r.studentName)}>Escalate</Button>
                  </>}
                  <button onClick={() => deleteRecord(r.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>}
    </AdminLayout>
  );
}
