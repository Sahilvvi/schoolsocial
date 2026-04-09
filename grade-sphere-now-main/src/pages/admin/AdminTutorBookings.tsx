import { motion } from "framer-motion";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminDelete, useAdminUpdate } from "@/hooks/useAdminCrud";

export default function AdminTutorBookings() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["tutor_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tutor_bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const updateMut = useAdminUpdate("tutor_bookings");
  const deleteMut = useAdminDelete("tutor_bookings");

  const updateStatus = async (id: string, status: string) => {
    try { await updateMut.mutateAsync({ id, status } as any); toast.success(`Status updated to ${status}`); } catch (e: any) { toast.error(e.message); }
  };
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await deleteMut.mutateAsync(id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" /> Tutor Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">{bookings.length} bookings</p>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="border-border/20"><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {bookings.map((b, i) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-accent/10">
                  <TableCell className="font-semibold">{b.name}</TableCell>
                  <TableCell className="text-muted-foreground">{b.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{b.message || "—"}</TableCell>
                  <TableCell>
                    <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                      <SelectTrigger className="h-8 w-28 rounded-lg text-xs border-border/30"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["pending", "confirmed", "cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {bookings.length === 0 && <div className="text-center py-12 text-muted-foreground">No bookings yet</div>}
        </Card>
      )}
    </div>
  );
}
