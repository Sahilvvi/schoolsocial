import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Calendar, IndianRupee, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useTuitionBatches, useAddBatch } from "@/hooks/useErp";

interface Props { tutorId: string; }

export default function BatchManagement({ tutorId }: Props) {
  const { data: batches = [] } = useTuitionBatches(tutorId);
  const addBatch = useAddBatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ batch_name: "", subject: "", schedule: "", max_students: "20", fee_per_month: "" });

  const handleSubmit = async () => {
    if (!form.batch_name || !form.subject) { toast.error("Batch name and subject required"); return; }
    try {
      await addBatch.mutateAsync({ tutor_id: tutorId, batch_name: form.batch_name, subject: form.subject, schedule: form.schedule, max_students: Number(form.max_students), fee_per_month: Number(form.fee_per_month) || 0 });
      toast.success("Batch created");
      setOpen(false);
      setForm({ batch_name: "", subject: "", schedule: "", max_students: "20", fee_per_month: "" });
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2"><Users className="h-6 w-6 text-primary" />Batch Management</h2>
          <p className="text-sm text-muted-foreground">Manage batches, scheduling & student capacity</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-xl gradient-primary border-0"><Plus className="h-4 w-4 mr-1" />New Batch</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Batch</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Batch Name (e.g. JEE Weekday Batch)" value={form.batch_name} onChange={(e) => setForm({ ...form, batch_name: e.target.value })} />
              <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <Input placeholder="Schedule (e.g. Mon-Fri 4-6 PM)" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" placeholder="Max Students" value={form.max_students} onChange={(e) => setForm({ ...form, max_students: e.target.value })} />
                <Input type="number" placeholder="Fee/Month (₹)" value={form.fee_per_month} onChange={(e) => setForm({ ...form, fee_per_month: e.target.value })} />
              </div>
              <Button onClick={handleSubmit} disabled={addBatch.isPending} className="w-full rounded-xl gradient-primary border-0">Create Batch</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map((b: any) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/60 border-border/30 hover:border-primary/20 transition-all">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{b.batch_name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" />{b.subject}</p>
                  </div>
                  <Badge variant={b.is_active ? "default" : "secondary"}>{b.is_active ? "Active" : "Inactive"}</Badge>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.schedule || "Schedule TBD"}</div>
                  <div className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />₹{Number(b.fee_per_month).toLocaleString()}/month</div>
                  <div className="flex items-center justify-between mt-2">
                    <span>{b.current_students}/{b.max_students} students</span>
                    <span>{Math.round((b.current_students / b.max_students) * 100)}% full</span>
                  </div>
                  <Progress value={(b.current_students / b.max_students) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {batches.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-2">No batches created yet</p>}
      </div>
    </div>
  );
}
