import { useState } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useListFees, useCreateFee, usePayFee, useListStudents } from "@/erp/api-client";
import { useAuth } from "@/erp/hooks/use-auth";
import { Plus, Search, IndianRupee, Download, Check, Clock, AlertCircle, Loader2, Send, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/erp/hooks/use-toast";

export default function Fees() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ studentId: "", amount: "", feeType: "tuition", dueDate: "", description: "" });

  const { data, isLoading, refetch } = useListFees({ schoolId });
  const { data: studentsData } = useListStudents({ schoolId });
  const createFee = useCreateFee();
  const payFee = usePayFee();

  const allFees = data?.fees || [];
  const filtered = allFees.filter(f => {
    const matchTab = activeTab === "all" || f.status === activeTab;
    const matchSearch = !search || f.studentName?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalCollected = data?.totalPaid || 0;
  const totalPending = data?.totalPending || 0;

  const handleCreate = async () => {
    if (!form.studentId || !form.amount || !form.dueDate) {
      toast({ title: "Missing fields", description: "Student, amount, and due date are required.", variant: "destructive" });
      return;
    }
    try {
      await createFee.mutateAsync({ data: { schoolId, studentId: Number(form.studentId), amount: Number(form.amount), feeType: form.feeType as any, dueDate: form.dueDate, description: form.description || undefined } });
      toast({ title: "Fee created", description: "Fee record added successfully." });
      setDialogOpen(false);
      setForm({ studentId: "", amount: "", feeType: "tuition", dueDate: "", description: "" });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to create fee record.", variant: "destructive" });
    }
  };

  const handlePay = async (feeId: number) => {
    try {
      await payFee.mutateAsync({ feeId });
      toast({ title: "Marked paid", description: "Fee marked as paid successfully." });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to mark fee as paid.", variant: "destructive" });
    }
  };

  const students = studentsData?.students || [];

  return (
    <AdminLayout title="Fee Collection" links={adminLinks}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 rounded-2xl border-border bg-green-500/5 shadow-none">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-green-500/20 text-green-600 rounded-xl"><Check className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
              <h3 className="text-2xl font-bold font-display text-foreground">₹{totalCollected.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 rounded-2xl border-border bg-orange-500/5 shadow-none">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-orange-500/20 text-orange-500 rounded-xl"><Clock className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
              <h3 className="text-2xl font-bold font-display text-foreground">₹{totalPending.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 rounded-2xl font-bold text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 px-8 w-full md:w-auto">
                <Plus className="w-6 h-6 mr-2"/> Collect Fee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display font-bold text-2xl">Create Fee Record</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Student</label>
                  <Select value={form.studentId} onValueChange={v => setForm(p => ({...p, studentId: v}))}>
                    <SelectTrigger className="h-11 rounded-xl bg-secondary/50">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((s: any) => (
                        <SelectItem key={s.id} value={String(s.id)}>{s.name} — Class {s.className}{s.section ? "-"+s.section : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Fee Type</label>
                    <Select value={form.feeType} onValueChange={v => setForm(p => ({...p, feeType: v}))}>
                      <SelectTrigger className="h-11 rounded-xl bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tuition">Tuition</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Amount (₹)</label>
                    <Input value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))} placeholder="e.g. 25000" type="number" className="h-11 rounded-xl bg-secondary/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Due Date</label>
                  <Input value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate: e.target.value}))} type="date" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Description (optional)</label>
                  <Input value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="e.g. Q3 tuition fee" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <Button onClick={handleCreate} disabled={createFee.isPending} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                  {createFee.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                  Create Fee Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-secondary/50 p-1 rounded-xl h-auto">
              <TabsTrigger value="all" className="rounded-lg px-5 py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="paid" className="rounded-lg px-5 py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Paid</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg px-5 py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
              <TabsTrigger value="overdue" className="rounded-lg px-5 py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..." className="pl-9 h-11 rounded-xl bg-secondary/50 border-none" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <IndianRupee className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-bold">No fee records found</p>
            <p className="text-sm">Create a fee record using the button above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
                <tr>
                  <th className="px-6 py-4 font-bold">Student</th>
                  <th className="px-6 py-4 font-bold">Fee Type</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Due Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((fee: any) => (
                  <tr key={fee.id} className="border-b border-border/50 hover:bg-secondary/10">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{fee.studentName || "—"}</div>
                      <div className="text-xs text-muted-foreground">{fee.className || ""}</div>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-muted-foreground">{fee.feeType}</td>
                    <td className="px-6 py-4 font-bold text-foreground">₹{Number(fee.amount).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{fee.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        fee.status === 'paid' ? 'bg-green-100 text-green-700' :
                        fee.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {fee.status === 'paid' && <Check className="w-3 h-3" />}
                        {fee.status === 'pending' && <Clock className="w-3 h-3" />}
                        {fee.status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {fee.status !== 'paid' && (
                        <Button size="sm" variant="outline" onClick={() => handlePay(fee.id)} disabled={payFee.isPending} className="font-bold text-green-600 hover:bg-green-50 border-green-200 rounded-lg">
                          <Check className="w-3.5 h-3.5 mr-1" /> Mark Paid
                        </Button>
                      )}
                      {fee.status === 'paid' && (
                        <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/10" title="Print Receipt"
                          onClick={() => {
                            const w = window.open("", "_blank", "width=500,height=700");
                            if (!w) return;
                            w.document.write(`<!DOCTYPE html><html><head><title>Fee Receipt</title><style>body{font-family:Arial,sans-serif;padding:30px;max-width:400px;margin:0 auto}.header{text-align:center;border-bottom:2px solid #333;padding-bottom:15px;margin-bottom:20px}h2{margin:0;color:#1a1a1a}.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;background:#dcfce7;color:#166534}.row{display:flex;justify-content:space-between;margin:8px 0;font-size:14px}.total{border-top:2px solid #333;padding-top:10px;margin-top:10px;font-size:18px;font-weight:bold}.footer{margin-top:30px;border-top:1px solid #ccc;padding-top:15px;font-size:12px;color:#666;text-align:center}</style></head><body><div class="header"><h2>FEE RECEIPT</h2><p style="font-size:12px;color:#666;margin:5px 0">Official Receipt</p><span class="badge">PAID</span></div><div class="row"><span>Receipt No.</span><span>#REC-${fee.id}</span></div><div class="row"><span>Student</span><span><b>${fee.studentName || "—"}</b></span></div><div class="row"><span>Class</span><span>${fee.className || "—"}</span></div><div class="row"><span>Fee Type</span><span style="text-transform:capitalize">${fee.feeType}</span></div><div class="row"><span>Due Date</span><span>${fee.dueDate}</span></div><div class="row"><span>Description</span><span>${fee.description || "—"}</span></div><div class="row total"><span>Amount Paid</span><span>₹${Number(fee.amount).toLocaleString("en-IN")}</span></div><div class="footer"><p>Thank you for your payment</p><p style="font-size:11px">This is a computer-generated receipt</p></div></body></html>`);
                            w.document.close();
                            w.print();
                          }}>
                          <Printer className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
