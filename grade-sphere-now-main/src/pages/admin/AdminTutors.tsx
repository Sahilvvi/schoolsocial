import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useTutors } from "@/hooks/useData";
import { useAdminInsert, useAdminUpdate, useAdminDelete } from "@/hooks/useAdminCrud";

const empty = { name: "", subject: "", location: "", experience: "", hourly_rate: "", bio: "", avatar: "", rating: 0 };

export default function AdminTutors() {
  const { data: tutors = [], isLoading } = useTutors();
  const insertMut = useAdminInsert("tutors");
  const updateMut = useAdminUpdate("tutors");
  const deleteMut = useAdminDelete("tutors");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  const filtered = tutors.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (t: any) => { setEditId(t.id); setForm({ name: t.name, subject: t.subject, location: t.location, experience: t.experience, hourly_rate: t.hourly_rate, bio: t.bio, avatar: t.avatar, rating: Number(t.rating) }); setOpen(true); };
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.subject) { toast.error("Name and subject required"); return; }
    try {
      const payload = { ...form, rating: Number(form.rating) };
      if (editId) { await updateMut.mutateAsync({ id: editId, ...payload } as any); toast.success("Tutor updated!"); }
      else { await insertMut.mutateAsync(payload as any); toast.success("Tutor added!"); }
      setOpen(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await deleteMut.mutateAsync(id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> Manage Tutors</h1><p className="text-sm text-muted-foreground mt-1">{tutors.length} tutors</p></div>
        <div className="flex gap-3">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 rounded-xl bg-card/60 border-border/30" />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openNew} className="gradient-primary border-0 rounded-xl"><Plus className="h-4 w-4 mr-2" />Add Tutor</Button></DialogTrigger>
            <DialogContent className="max-w-lg bg-card border-border/40">
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Tutor</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                  <div className="space-y-2"><Label>Subject *</Label><Input value={form.subject} onChange={(e) => set("subject", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                  <div className="space-y-2"><Label>Experience</Label><Input value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="5+ years" className="rounded-xl bg-muted/30 border-border/30" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Hourly Rate</Label><Input value={form.hourly_rate} onChange={(e) => set("hourly_rate", e.target.value)} placeholder="₹500/hr" className="rounded-xl bg-muted/30 border-border/30" /></div>
                  <div className="space-y-2"><Label>Rating</Label><Input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => set("rating", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                </div>
                <div className="space-y-2"><Label>Avatar URL</Label><Input value={form.avatar} onChange={(e) => set("avatar", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} className="rounded-xl bg-muted/30 border-border/30" /></div>
              </div>
              <Button onClick={handleSubmit} className="w-full gradient-primary border-0 rounded-xl h-11 mt-2" disabled={insertMut.isPending || updateMut.isPending}>
                {insertMut.isPending || updateMut.isPending ? "Saving..." : editId ? "Update" : "Add Tutor"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="border-border/20"><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Location</TableHead><TableHead>Rate</TableHead><TableHead>Rating</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-accent/10">
                  <TableCell className="font-semibold">{t.name}</TableCell>
                  <TableCell>{t.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{t.location}</TableCell>
                  <TableCell>{t.hourly_rate}</TableCell>
                  <TableCell>{Number(t.rating)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No tutors found</div>}
        </Card>
      )}
    </div>
  );
}
