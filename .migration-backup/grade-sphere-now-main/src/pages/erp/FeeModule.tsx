import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, IndianRupee, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useFeeRecords, useAddFeeRecord } from "@/hooks/useErp";

interface Props { schoolId: string; }

const statusColors: Record<string, string> = {
  paid: "bg-green-500/10 text-green-600 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  overdue: "bg-red-500/10 text-red-600 border-red-500/20",
  partial: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export default function FeeModule({ schoolId }: Props) {
  const { data: records = [] } = useFeeRecords(schoolId);
  const addFee = useAddFeeRecord();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ person_name: "", person_type: "student", amount: "", fee_type: "tuition", status: "pending", due_date: "", remarks: "" });

  const totalCollected = records.filter((r: any) => r.status === "paid").reduce((s: number, r: any) => s + Number(r.amount), 0);
  const totalPending = records.filter((r: any) => r.status !== "paid").reduce((s: number, r: any) => s + Number(r.amount), 0);

  const handleSubmit = async () => {
    if (!form.person_name || !form.amount) { toast.error("Name and amount required"); return; }
    try {
      await addFee.mutateAsync({ school_id: schoolId, person_name: form.person_name, person_type: form.person_type, amount: Number(form.amount), fee_type: form.fee_type, status: form.status, due_date: form.due_date || undefined, remarks: form.remarks || undefined });
      toast.success("Fee record added");
      setOpen(false);
      setForm({ person_name: "", person_type: "student", amount: "", fee_type: "tuition", status: "pending", due_date: "", remarks: "" });
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" />Fee Management</h2>
          <p className="text-sm text-muted-foreground">Track fees, salaries & payments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-xl gradient-primary border-0"><Plus className="h-4 w-4 mr-1" />Add Record</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Fee Record</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Person Name" value={form.person_name} onChange={(e) => setForm({ ...form, person_name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.person_type} onValueChange={(v) => setForm({ ...form, person_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="teacher">Teacher</SelectItem><SelectItem value="staff">Staff</SelectItem></SelectContent></Select>
                <Select value={form.fee_type} onValueChange={(v) => setForm({ ...form, fee_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="tuition">Tuition</SelectItem><SelectItem value="transport">Transport</SelectItem><SelectItem value="salary">Salary</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select>
              </div>
              <Input type="number" placeholder="Amount (₹)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="overdue">Overdue</SelectItem><SelectItem value="partial">Partial</SelectItem></SelectContent></Select>
              <Input type="date" placeholder="Due Date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              <Input placeholder="Remarks (optional)" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
              <Button onClick={handleSubmit} disabled={addFee.isPending} className="w-full rounded-xl gradient-primary border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-500/5 border-green-500/20"><CardContent className="pt-4 pb-3 text-center"><CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-green-500" /><p className="text-2xl font-bold">₹{totalCollected.toLocaleString()}</p><p className="text-xs text-muted-foreground">Collected</p></CardContent></Card>
        <Card className="bg-amber-500/5 border-amber-500/20"><CardContent className="pt-4 pb-3 text-center"><AlertCircle className="h-5 w-5 mx-auto mb-1 text-amber-500" /><p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card className="bg-primary/5 border-primary/20"><CardContent className="pt-4 pb-3 text-center"><TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" /><p className="text-2xl font-bold">{records.length}</p><p className="text-xs text-muted-foreground">Total Records</p></CardContent></Card>
      </div>

      <div className="space-y-2">
        {records.map((r: any) => (
          <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/30">
            <div>
              <p className="font-medium text-sm">{r.person_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{r.person_type} • {r.fee_type}{r.due_date ? ` • Due: ${r.due_date}` : ""}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">₹{Number(r.amount).toLocaleString()}</span>
              <Badge variant="outline" className={statusColors[r.status] || ""}>{r.status}</Badge>
            </div>
          </motion.div>
        ))}
        {records.length === 0 && <p className="text-center text-muted-foreground py-8">No fee records yet</p>}
      </div>
    </div>
  );
}
