import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useSchools } from "@/hooks/useData";
import { useAdminInsert, useAdminUpdate, useAdminDelete } from "@/hooks/useAdminCrud";

const emptySchool = {
  name: "", slug: "", location: "", board: "", fees: "", description: "", about: "",
  banner: "", lat: 0, lng: 0, rating: 0, review_count: 0,
  facilities: [] as string[], gallery: [] as string[], achievements: [] as string[],
};

export default function AdminSchools() {
  const { data: schools = [], isLoading } = useSchools();
  const insertMut = useAdminInsert("schools");
  const updateMut = useAdminUpdate("schools");
  const deleteMut = useAdminDelete("schools");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySchool);
  const [search, setSearch] = useState("");

  const filtered = schools.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditId(null); setForm(emptySchool); setOpen(true); };
  const openEdit = (s: any) => {
    setEditId(s.id);
    setForm({
      name: s.name, slug: s.slug, location: s.location, board: s.board, fees: s.fees,
      description: s.description, about: s.about, banner: s.banner,
      lat: s.lat, lng: s.lng, rating: Number(s.rating), review_count: s.review_count,
      facilities: s.facilities || [], gallery: s.gallery || [], achievements: s.achievements || [],
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.location) { toast.error("Name, slug, and location are required"); return; }
    try {
      const payload = { ...form, lat: Number(form.lat), lng: Number(form.lng), rating: Number(form.rating), review_count: Number(form.review_count) };
      if (editId) {
        await updateMut.mutateAsync({ id: editId, ...payload } as any);
        toast.success("School updated!");
      } else {
        await insertMut.mutateAsync(payload as any);
        toast.success("School added!");
      }
      setOpen(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this school?")) return;
    try { await deleteMut.mutateAsync(id); toast.success("School deleted"); } catch (e: any) { toast.error(e.message); }
  };

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><School className="h-6 w-6 text-primary" /> Manage Schools</h1>
          <p className="text-sm text-muted-foreground mt-1">{schools.length} schools listed</p>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 rounded-xl bg-card/60 border-border/30" />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openNew} className="gradient-primary border-0 rounded-xl"><Plus className="h-4 w-4 mr-2" />Add School</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border/40">
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} School</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="school-name" className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Location *</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Board</Label><Input value={form.board} onChange={(e) => set("board", e.target.value)} placeholder="CBSE / ICSE" className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Fees</Label><Input value={form.fees} onChange={(e) => set("fees", e.target.value)} placeholder="₹50,000/year" className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Banner URL</Label><Input value={form.banner} onChange={(e) => set("banner", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Latitude</Label><Input type="number" value={form.lat} onChange={(e) => set("lat", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Longitude</Label><Input type="number" value={form.lng} onChange={(e) => set("lng", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="col-span-2 space-y-2"><Label>About</Label><Textarea value={form.about} onChange={(e) => set("about", e.target.value)} rows={3} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="col-span-2 space-y-2"><Label>Facilities (comma-separated)</Label><Input value={form.facilities.join(", ")} onChange={(e) => set("facilities", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="col-span-2 space-y-2"><Label>Achievements (comma-separated)</Label><Input value={form.achievements.join(", ")} onChange={(e) => set("achievements", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="col-span-2 space-y-2"><Label>Gallery URLs (comma-separated)</Label><Textarea value={form.gallery.join(", ")} onChange={(e) => set("gallery", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} rows={2} className="rounded-xl bg-muted/30 border-border/30" /></div>
              </div>
              <Button onClick={handleSubmit} className="w-full gradient-primary border-0 rounded-xl h-11 mt-4" disabled={insertMut.isPending || updateMut.isPending}>
                {insertMut.isPending || updateMut.isPending ? "Saving..." : editId ? "Update School" : "Add School"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/20">
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Board</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-border/20 hover:bg-accent/10 transition-colors">
                  <TableCell className="font-semibold">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.location}</TableCell>
                  <TableCell>{s.board}</TableCell>
                  <TableCell>{Number(s.rating)}</TableCell>
                  <TableCell>{s.fees}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No schools found</div>}
        </Card>
      )}
    </div>
  );
}
