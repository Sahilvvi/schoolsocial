import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useJobs } from "@/hooks/useData";
import { useAdminInsert, useAdminUpdate, useAdminDelete } from "@/hooks/useAdminCrud";

const empty = { title: "", school_name: "", location: "", type: "Full-time", salary: "", description: "", posted_date: "" };

export default function AdminJobs() {
  const { data: jobs = [], isLoading } = useJobs();
  const insertMut = useAdminInsert("jobs");
  const updateMut = useAdminUpdate("jobs");
  const deleteMut = useAdminDelete("jobs");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()));
  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (j: any) => { setEditId(j.id); setForm({ title: j.title, school_name: j.school_name, location: j.location, type: j.type, salary: j.salary, description: j.description, posted_date: j.posted_date }); setOpen(true); };
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.school_name) { toast.error("Title and school required"); return; }
    try {
      if (editId) { await updateMut.mutateAsync({ id: editId, ...form } as any); toast.success("Job updated!"); }
      else { await insertMut.mutateAsync(form as any); toast.success("Job added!"); }
      setOpen(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await deleteMut.mutateAsync(id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><Briefcase className="h-6 w-6 text-primary" /> Manage Jobs</h1><p className="text-sm text-muted-foreground mt-1">{jobs.length} job listings</p></div>
        <div className="flex gap-3">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 rounded-xl bg-card/60 border-border/30" />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openNew} className="gradient-primary border-0 rounded-xl"><Plus className="h-4 w-4 mr-2" />Add Job</Button></DialogTrigger>
            <DialogContent className="max-w-lg bg-card border-border/40">
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Job</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>School Name *</Label><Input value={form.school_name} onChange={(e) => set("school_name", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                  <div className="space-y-2"><Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => set("type", v)}>
                      <SelectTrigger className="rounded-xl bg-muted/30 border-border/30"><SelectValue /></SelectTrigger>
                      <SelectContent>{["Full-time", "Part-time", "Contract", "Internship"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                  <div className="space-y-2"><Label>Salary</Label><Input value={form.salary} onChange={(e) => set("salary", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                </div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="rounded-xl bg-muted/30 border-border/30" /></div>
              </div>
              <Button onClick={handleSubmit} className="w-full gradient-primary border-0 rounded-xl h-11 mt-2" disabled={insertMut.isPending || updateMut.isPending}>
                {insertMut.isPending || updateMut.isPending ? "Saving..." : editId ? "Update" : "Add Job"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="border-border/20"><TableHead>Title</TableHead><TableHead>School</TableHead><TableHead>Type</TableHead><TableHead>Location</TableHead><TableHead>Salary</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((j, i) => (
                <motion.tr key={j.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-accent/10">
                  <TableCell className="font-semibold">{j.title}</TableCell>
                  <TableCell className="text-muted-foreground">{j.school_name}</TableCell>
                  <TableCell><Badge variant="outline" className="border-border/40 text-xs">{j.type}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{j.location}</TableCell>
                  <TableCell>{j.salary}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(j)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(j.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No jobs found</div>}
        </Card>
      )}
    </div>
  );
}
