import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Plus, Calendar, Users, UserCheck, UserX, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAttendance, useMarkAttendance } from "@/hooks/useErp";

interface Props { schoolId: string; }

const statusColors: Record<string, string> = {
  present: "bg-green-500/10 text-green-600 border-green-500/20",
  absent: "bg-red-500/10 text-red-600 border-red-500/20",
  late: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  leave: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export default function AttendanceModule({ schoolId }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [filter, setFilter] = useState<string>("all");
  const { data: records = [], isLoading } = useAttendance(schoolId, date);
  const markAttendance = useMarkAttendance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ person_name: "", person_type: "student", class_name: "", status: "present" });

  const filtered = filter === "all" ? records : records.filter((r: any) => r.person_type === filter);
  const stats = {
    present: records.filter((r: any) => r.status === "present").length,
    absent: records.filter((r: any) => r.status === "absent").length,
    late: records.filter((r: any) => r.status === "late").length,
    total: records.length,
  };

  const handleSubmit = async () => {
    if (!form.person_name) { toast.error("Name is required"); return; }
    try {
      await markAttendance.mutateAsync({ school_id: schoolId, ...form, attendance_date: date });
      toast.success("Attendance marked");
      setOpen(false);
      setForm({ person_name: "", person_type: "student", class_name: "", status: "present" });
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2"><ClipboardCheck className="h-6 w-6 text-primary" />Attendance</h2>
          <p className="text-sm text-muted-foreground">Track daily attendance for students, teachers & staff</p>
        </div>
        <div className="flex gap-2 items-center">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40 rounded-xl" />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-xl gradient-primary border-0"><Plus className="h-4 w-4 mr-1" />Mark</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Mark Attendance</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <Input placeholder="Person Name" value={form.person_name} onChange={(e) => setForm({ ...form, person_name: e.target.value })} />
                <Select value={form.person_type} onValueChange={(v) => setForm({ ...form, person_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Class (optional)" value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} />
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSubmit} disabled={markAttendance.isPending} className="w-full rounded-xl gradient-primary border-0">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Users, color: "text-primary" },
          { label: "Present", value: stats.present, icon: UserCheck, color: "text-green-500" },
          { label: "Absent", value: stats.absent, icon: UserX, color: "text-red-500" },
          { label: "Late", value: stats.late, icon: Clock, color: "text-amber-500" },
        ].map((s) => (
          <Card key={s.label} className="bg-card/60 border-border/30">
            <CardContent className="pt-4 pb-3 text-center">
              <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "student", "teacher", "staff"].map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} className="rounded-lg capitalize" onClick={() => setFilter(f)}>{f}</Button>
        ))}
      </div>

      {/* Records */}
      <div className="space-y-2">
        {filtered.map((r: any) => (
          <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/30">
            <div>
              <p className="font-medium text-sm">{r.person_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{r.person_type}{r.class_name ? ` • ${r.class_name}` : ""}</p>
            </div>
            <Badge variant="outline" className={statusColors[r.status] || ""}>{r.status}</Badge>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No attendance records for this date</p>}
      </div>
    </div>
  );
}
