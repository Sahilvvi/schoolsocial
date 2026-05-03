import { motion } from "framer-motion";
import { Loader2, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useJobApplications } from "@/hooks/useData";
import { useAdminDelete } from "@/hooks/useAdminCrud";

export default function AdminJobApps() {
  const { data: apps = [], isLoading } = useJobApplications();
  const deleteMut = useAdminDelete("job_applications");
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await deleteMut.mutateAsync(id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Job Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">{apps.length} applications</p>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="border-border/20"><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Experience</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {apps.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-accent/10">
                  <TableCell className="font-semibold">{a.name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.email}</TableCell>
                  <TableCell>{a.phone}</TableCell>
                  <TableCell>{a.experience}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {apps.length === 0 && <div className="text-center py-12 text-muted-foreground">No applications yet</div>}
        </Card>
      )}
    </div>
  );
}
