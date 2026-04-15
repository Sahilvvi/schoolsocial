import { motion } from "framer-motion";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useTuitionEnquiries } from "@/hooks/useData";
import { useAdminDelete, useAdminUpdate } from "@/hooks/useAdminCrud";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminTuitionEnquiries() {
  const { data: enquiries = [], isLoading } = useTuitionEnquiries();
  const updateMut = useAdminUpdate("tuition_enquiries");
  const deleteMut = useAdminDelete("tuition_enquiries");

  const updateStatus = async (id: string, status: string) => {
    try { await updateMut.mutateAsync({ id, status } as any); toast.success(`Status updated to ${status}`); } catch (e: any) { toast.error(e.message); }
  };
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await deleteMut.mutateAsync(id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" /> Tuition Enquiries</h1>
        <p className="text-sm text-muted-foreground mt-1">{enquiries.length} enquiries</p>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/20">
                  <TableHead>Parent</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((e, i) => (
                  <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-accent/10">
                    <TableCell className="font-semibold">{e.parent_name}</TableCell>
                    <TableCell>{e.phone}</TableCell>
                    <TableCell>{e.student_class}</TableCell>
                    <TableCell>{e.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{e.area || "—"}</TableCell>
                    <TableCell>{e.budget || "—"}</TableCell>
                    <TableCell>
                      <Select value={e.status} onValueChange={(v) => updateStatus(e.id, v)}>
                        <SelectTrigger className="h-8 w-24 rounded-lg text-xs border-border/30"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["open", "assigned", "closed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          {enquiries.length === 0 && <div className="text-center py-12 text-muted-foreground">No tuition enquiries yet</div>}
        </Card>
      )}
    </div>
  );
}
