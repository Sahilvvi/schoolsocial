import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNews } from "@/hooks/useData";
import { useAdminInsert, useAdminUpdate, useAdminDelete } from "@/hooks/useAdminCrud";

const empty = { title: "", author: "", category: "", excerpt: "", image: "", published_date: "" };

export default function AdminNews() {
  const { data: news = [], isLoading } = useNews();
  const insertMut = useAdminInsert("news");
  const updateMut = useAdminUpdate("news");
  const deleteMut = useAdminDelete("news");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  const filtered = news.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));
  const openNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const openEdit = (n: any) => { setEditId(n.id); setForm({ title: n.title, author: n.author, category: n.category, excerpt: n.excerpt, image: n.image, published_date: n.published_date }); setOpen(true); };
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    try {
      if (editId) { await updateMut.mutateAsync({ id: editId, ...form } as any); toast.success("Article updated!"); }
      else { await insertMut.mutateAsync(form as any); toast.success("Article added!"); }
      setOpen(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await deleteMut.mutateAsync(id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2"><Newspaper className="h-6 w-6 text-primary" /> Manage News</h1><p className="text-sm text-muted-foreground mt-1">{news.length} articles</p></div>
        <div className="flex gap-3">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 rounded-xl bg-card/60 border-border/30" />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openNew} className="gradient-primary border-0 rounded-xl"><Plus className="h-4 w-4 mr-2" />Add Article</Button></DialogTrigger>
            <DialogContent className="max-w-lg bg-card border-border/40">
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Article</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Author</Label><Input value={form.author} onChange={(e) => set("author", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                  <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Education" className="rounded-xl bg-muted/30 border-border/30" /></div>
                </div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.published_date} onChange={(e) => set("published_date", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={(e) => set("image", e.target.value)} className="rounded-xl bg-muted/30 border-border/30" /></div>
                <div className="space-y-2"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} className="rounded-xl bg-muted/30 border-border/30" /></div>
              </div>
              <Button onClick={handleSubmit} className="w-full gradient-primary border-0 rounded-xl h-11 mt-2" disabled={insertMut.isPending || updateMut.isPending}>
                {insertMut.isPending || updateMut.isPending ? "Saving..." : editId ? "Update" : "Add Article"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
        <Card className="bg-card/60 backdrop-blur-sm border-border/30 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="border-border/20"><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((n, i) => (
                <motion.tr key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-border/20 hover:bg-accent/10">
                  <TableCell className="font-semibold max-w-[200px] truncate">{n.title}</TableCell>
                  <TableCell className="text-muted-foreground">{n.author}</TableCell>
                  <TableCell><Badge variant="outline" className="border-border/40 text-xs">{n.category}</Badge></TableCell>
                  <TableCell>{n.published_date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(n)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No articles found</div>}
        </Card>
      )}
    </div>
  );
}
