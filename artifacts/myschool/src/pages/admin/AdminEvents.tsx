import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Calendar, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useEvents } from "@/hooks/useData";
import { useAdminInsert, useAdminUpdate, useAdminDelete } from "@/hooks/useAdminCrud";

const empty = { title: "", school_name: "", location: "", event_date: "", description: "", image: "", is_public: true };

export default function AdminEvents() {
  const { data: events = [], isLoading } = useEvents();
  const insertMut = useAdminInsert("events");
  const updateMut = useAdminUpdate("events");
  const deleteMut = useAdminDelete("events");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  const filtered = events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (e: any) => { setEditId(e.id); setForm({ title: e.title, school_name: e.school_name, location: e.location, event_date: e.event_date, description: e.description, image: e.image, is_public: e.is_public ?? true }); setOpen(true); };
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.school_name) { toast.error("Title and school name required"); return; }
    try {
      if (editId) { await updateMut.mutateAsync({ id: editId, ...form } as any); toast.success("Event updated!"); }
      else { await insertMut.mutateAsync(form as any); toast.success("Event added!"); }
      setOpen(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    try { await updateMut.mutateAsync({ id, is_public: !current } as any); toast.success(!current ? "Event is now public" : "Event is now private"); } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await deleteMut.mutateAsync(id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" /> Manage Events</h1><p className="text-sm text-muted-foreground mt-1">{events.length} events</p></div>
        <div className="flex gap-3">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 rounded-xl bg-card/60 border-border/30" />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openNew} className="gradient-primary border-0 rounded-xl"><Plus className="h-4 w-4 mr-2" />Add Event</Button></DialogTrigger>
            <DialogContent className="max-w-lg bg-card border-border/40">
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Event</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>School Name *</Label><Input value={form.school_name} onChange={(e) => set("school_name", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                  <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.event_date} onChange={(e) => set("event_date", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                </div>
                <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={(e) => set("image", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="flex items-center justify-between py-2 px-1">
                  <div>
                    <Label className="text-sm font-medium">Public Event</Label>
                    <p className="text-xs text-muted-foreground">Visible to all visitors</p>
                  </div>
                  <Switch checked={form.is_public} onCheckedChange={(v) => set("is_public", v)} />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full gradient-primary border-0 rounded-xl h-11 mt-2" disabled={insertMut.isPending || updateMut.isPending}>
                {insertMut.isPending || updateMut.isPending ? "Saving..." : editId ? "Update" : "Add Event"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="border-border/20"><TableHead>Title</TableHead><TableHead>School</TableHead><TableHead>Date</TableHead><TableHead>Location</TableHead><TableHead>Visibility</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((e, i) => (
                <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-accent/10">
                  <TableCell className="font-semibold">{e.title}</TableCell>
                  <TableCell className="text-muted-foreground">{e.school_name}</TableCell>
                  <TableCell>{e.event_date}</TableCell>
                  <TableCell className="text-muted-foreground">{e.location}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleVisibility(e.id, (e as any).is_public !== false)} className="cursor-pointer">
                      {(e as any).is_public !== false ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 gap-1"><Eye className="h-3 w-3" />Public</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground gap-1"><EyeOff className="h-3 w-3" />Private</Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(e)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No events found</div>}
        </Card>
      )}
    </div>
  );
}
