import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { superAdminLinks } from "./super-admin-links";
import { CreditCard, Plus, Loader2, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

export default function Subscriptions() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ schoolId: "", plan: "free", maxStudents: "100", maxTeachers: "10", monthlyFee: "0", startDate: "", endDate: "", features: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [pRes, sRes] = await Promise.all([
      fetch(`${BASE}/api/admissions/plans`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/schools`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    setPlans((await pRes.json()).plans || []);
    setSchools((await sRes.json()).schools || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const save = async () => {
    if (editId) {
      await fetch(`${BASE}/api/admissions/plans/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(form) });
      toast({ title: "Plan updated!" });
    } else {
      await fetch(`${BASE}/api/admissions/plans`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(form) });
      toast({ title: "Plan assigned!" });
    }
    setOpen(false); setEditId(null); fetchAll();
  };

  const PLAN_COLOR: Record<string, string> = { free: "bg-gray-100 text-gray-700", basic: "bg-blue-100 text-blue-700", pro: "bg-purple-100 text-purple-700", enterprise: "bg-amber-100 text-amber-700" };
  const STATUS_COLOR: Record<string, string> = { active: "bg-green-100 text-green-700", expired: "bg-red-100 text-red-700", suspended: "bg-orange-100 text-orange-700" };

  return (
    <AdminLayout title="School Subscriptions" links={superAdminLinks}>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {["free","basic","pro","enterprise"].map(p => (
          <Card key={p} className="p-3 rounded-xl text-center dark:bg-gray-800 dark:border-gray-700">
            <p className="text-xl font-bold dark:text-white">{plans.filter(pl => pl.plan === p).length}</p>
            <p className="text-xs text-muted-foreground capitalize">{p}</p>
          </Card>
        ))}
      </div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) setEditId(null); }}>
          <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />Assign Plan</Button></DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader><DialogTitle>{editId ? "Update Plan" : "Assign Subscription Plan"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {!editId && <div><label className="text-sm font-medium dark:text-gray-300">School *</label>
                <Select value={form.schoolId} onValueChange={v => setForm(p => ({ ...p, schoolId: v }))}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select school" /></SelectTrigger>
                  <SelectContent>{schools.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                </Select></div>}
              <div><label className="text-sm font-medium dark:text-gray-300">Plan</label>
                <Select value={form.plan} onValueChange={v => setForm(p => ({ ...p, plan: v }))}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="free">Free</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="pro">Pro</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent>
                </Select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium dark:text-gray-300">Max Students</label><Input type="number" value={form.maxStudents} onChange={e => setForm(p => ({ ...p, maxStudents: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="text-sm font-medium dark:text-gray-300">Max Teachers</label><Input type="number" value={form.maxTeachers} onChange={e => setForm(p => ({ ...p, maxTeachers: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
              </div>
              <div><label className="text-sm font-medium dark:text-gray-300">Monthly Fee (₹)</label><Input type="number" value={form.monthlyFee} onChange={e => setForm(p => ({ ...p, monthlyFee: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium dark:text-gray-300">Start Date</label><Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="text-sm font-medium dark:text-gray-300">End Date</label><Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
              </div>
              <div><label className="text-sm font-medium dark:text-gray-300">Features (comma-separated)</label><Input value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} placeholder="library, transport, payroll" className="dark:bg-gray-700 dark:border-gray-600" /></div>
              <Button onClick={save} className="w-full">{editId ? "Update Plan" : "Assign Plan"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      : plans.length === 0 ? <div className="text-center py-16 text-muted-foreground"><CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No subscription plans assigned yet</p></div>
      : <div className="space-y-3">
          {plans.map(p => (
            <Card key={p.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold dark:text-white">{p.schoolName || `School ${p.schoolId}`}</p>
                    <Badge className={`text-xs rounded-full capitalize ${PLAN_COLOR[p.plan] || PLAN_COLOR.free}`}>{p.plan}</Badge>
                    <Badge className={`text-xs rounded-full ${STATUS_COLOR[p.status] || STATUS_COLOR.active}`}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Max: {p.maxStudents} students • {p.maxTeachers} teachers</p>
                  {p.monthlyFee && p.monthlyFee !== "0" && <p className="text-sm text-primary font-medium">₹{Number(p.monthlyFee).toLocaleString("en-IN")}/month</p>}
                  {p.features && <p className="text-xs text-muted-foreground">Features: {p.features}</p>}
                  {p.endDate && <p className="text-xs text-muted-foreground">Expires: {p.endDate}</p>}
                </div>
                <Button size="sm" variant="outline" onClick={() => { setEditId(p.id); setForm({ schoolId: String(p.schoolId), plan: p.plan, maxStudents: String(p.maxStudents), maxTeachers: String(p.maxTeachers), monthlyFee: p.monthlyFee || "0", startDate: p.startDate || "", endDate: p.endDate || "", features: p.features || "" }); setOpen(true); }} className="rounded-lg h-8 text-xs"><Edit2 className="w-3 h-3 mr-1" />Edit</Button>
              </div>
            </Card>
          ))}
        </div>}
    </AdminLayout>
  );
}
