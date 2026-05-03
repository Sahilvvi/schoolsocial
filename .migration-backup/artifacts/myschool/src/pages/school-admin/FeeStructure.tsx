import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { useAuth } from "@/hooks/use-auth";
import { CreditCard, Plus, Trash2, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

export default function FeeStructure() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [structures, setStructures] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkStructureId, setBulkStructureId] = useState("");
  const [bulkClassId, setBulkClassId] = useState("all");
  const [form, setForm] = useState({ name: "", feeType: "", amount: "", frequency: "annual", classId: "", description: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [sRes, cRes, stRes] = await Promise.all([
      fetch(`${BASE}/api/admissions/fee-structures?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    setStructures((await sRes.json()).structures || []);
    setClasses((await cRes.json()).classes || []);
    setStudents((await stRes.json()).students || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addStructure = async () => {
    const res = await fetch(`${BASE}/api/admissions/fee-structures`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(form) });
    if (res.ok) { toast({ title: "Fee structure created!" }); setOpen(false); fetchAll(); }
  };

  const bulkAssign = async () => {
    const str = structures.find(s => s.id === Number(bulkStructureId));
    if (!str) return;
    const targetStudents = bulkClassId !== "all" ? students.filter(s => s.classId === Number(bulkClassId)) : students;
    const today = new Date(); today.setFullYear(today.getFullYear() + 1);
    const dueDate = today.toISOString().split("T")[0];
    let count = 0;
    for (const s of targetStudents) {
      await fetch(`${BASE}/api/fees`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ studentId: s.id, schoolId, feeType: str.feeType, amount: str.amount, dueDate, description: str.name }) });
      count++;
    }
    toast({ title: `Fee assigned to ${count} students!` }); setBulkOpen(false);
  };

  const deleteStructure = async (id: number) => { await fetch(`${BASE}/api/admissions/fee-structures/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };

  const FREQ_COLOR: Record<string, string> = { annual: "bg-blue-100 text-blue-700", monthly: "bg-green-100 text-green-700", quarterly: "bg-purple-100 text-purple-700", "one-time": "bg-gray-100 text-gray-700" };

  return (
    <AdminLayout title="Fee Structure & Bulk Assignment" links={adminLinks}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-muted-foreground text-sm">{structures.length} fee structures defined</p>
        <div className="flex gap-2">
          <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
            <DialogTrigger asChild><Button variant="outline" className="rounded-xl"><Users className="w-4 h-4 mr-2" />Bulk Assign Fee</Button></DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader><DialogTitle>Bulk Fee Assignment</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><label className="text-sm font-medium dark:text-gray-300">Fee Structure *</label>
                  <Select value={bulkStructureId} onValueChange={setBulkStructureId}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select fee structure" /></SelectTrigger>
                    <SelectContent>{structures.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name} — ₹{Number(s.amount).toLocaleString("en-IN")}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div><label className="text-sm font-medium dark:text-gray-300">Assign to Class (optional)</label>
                  <Select value={bulkClassId} onValueChange={setBulkClassId}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="All students" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All Students</SelectItem>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
                  </Select></div>
                <p className="text-sm text-muted-foreground">This will create fee records for {bulkClassId !== "all" ? students.filter(s => s.classId === Number(bulkClassId)).length : students.length} students.</p>
                <Button onClick={bulkAssign} className="w-full">Assign Fee to All</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />New Structure</Button></DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader><DialogTitle>Create Fee Structure</DialogTitle></DialogHeader>
              <div className="space-y-3">
                {[["Name *", "name", "e.g. Annual Tuition Fee"], ["Fee Type *", "feeType", "tuition / transport / sports"], ["Amount (₹) *", "amount", "15000"], ["Description", "description", "Optional details"]].map(([l, k, ph]) => (
                  <div key={k}><label className="text-sm font-medium dark:text-gray-300">{l}</label><Input value={(form as any)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                ))}
                <div><label className="text-sm font-medium dark:text-gray-300">Frequency</label>
                  <Select value={form.frequency} onValueChange={v => setForm(p => ({ ...p, frequency: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="annual">Annual</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem><SelectItem value="one-time">One-Time</SelectItem></SelectContent>
                  </Select></div>
                <div><label className="text-sm font-medium dark:text-gray-300">Applicable Class (optional)</label>
                  <Select value={form.classId || "__none__"} onValueChange={v => setForm(p => ({ ...p, classId: v === "__none__" ? "" : v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="All classes" /></SelectTrigger>
                    <SelectContent><SelectItem value="__none__">All Classes</SelectItem>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}{c.section ? ` ${c.section}` : ""}</SelectItem>)}</SelectContent>
                  </Select></div>
                <Button onClick={addStructure} className="w-full">Create Structure</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      : structures.length === 0 ? <div className="text-center py-16 text-muted-foreground"><CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No fee structures defined yet</p><p className="text-sm">Create structures, then bulk-assign to classes</p></div>
      : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {structures.map(s => (
            <Card key={s.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0"><CreditCard className="w-5 h-5 text-green-600" /></div>
                <button onClick={() => deleteStructure(s.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="font-bold dark:text-white">{s.name}</p>
              <p className="text-2xl font-bold text-primary mt-1">₹{Number(s.amount).toLocaleString("en-IN")}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs rounded-full capitalize">{s.feeType}</Badge>
                <Badge className={`text-xs rounded-full ${FREQ_COLOR[s.frequency] || FREQ_COLOR.annual}`}>{s.frequency}</Badge>
                {s.description && <p className="text-xs text-muted-foreground w-full mt-1">{s.description}</p>}
              </div>
            </Card>
          ))}
        </div>}
    </AdminLayout>
  );
}
