import { motion } from "framer-motion";
import { Loader2, ClipboardList, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminDelete, useAdminUpdate } from "@/hooks/useAdminCrud";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAdmissions() {
  const { data: admissions = [], isLoading } = useQuery({
    queryKey: ["admissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const updateMut = useAdminUpdate("admissions");
  const deleteMut = useAdminDelete("admissions");

  const updateStatus = async (id: string, status: string) => {
    try { await updateMut.mutateAsync({ id, status } as any); toast.success(`Status updated to ${status}`); } catch (e: any) { toast.error(e.message); }
  };
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await deleteMut.mutateAsync(id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  const exportToExcel = () => {
    if (admissions.length === 0) { toast.error("No data to export"); return; }
    const headers = ["Student Name", "Parent Name", "Email", "Phone", "Grade", "Status", "Date"];
    const rows = admissions.map((a) => [
      a.student_name, a.parent_name, a.email, a.phone, a.grade, a.status, new Date(a.created_at).toLocaleDateString()
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admissions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><ClipboardList className="h-6 w-6 text-primary" /> Admission Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">{admissions.length} submissions</p>
        </div>
        <Button onClick={exportToExcel} variant="outline" className="rounded-xl border-border/30 gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="border-border/20"><TableHead>Student</TableHead><TableHead>Parent</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Grade</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {admissions.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-accent/10">
                  <TableCell className="font-semibold">{a.student_name}</TableCell>
                  <TableCell>{a.parent_name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.email}</TableCell>
                  <TableCell>{a.phone}</TableCell>
                  <TableCell>{a.grade}</TableCell>
                  <TableCell>
                    <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v)}>
                      <SelectTrigger className="h-8 w-28 rounded-lg text-xs border-border/30"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["pending", "approved", "rejected"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {admissions.length === 0 && <div className="text-center py-12 text-muted-foreground">No admissions yet</div>}
        </Card>
      )}
    </div>
  );
}
