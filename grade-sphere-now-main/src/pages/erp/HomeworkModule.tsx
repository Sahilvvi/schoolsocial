import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, FileText, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useHomework, useAddHomework } from "@/hooks/useErp";
import ImageUpload from "@/components/ImageUpload";

interface Props { schoolId: string; }

const typeColors: Record<string, string> = {
  homework: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  notes: "bg-green-500/10 text-green-600 border-green-500/20",
  study_material: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export default function HomeworkModule({ schoolId }: Props) {
  const { data: records = [] } = useHomework(schoolId);
  const addHomework = useAddHomework();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", subject: "", class_name: "", doc_type: "homework", created_by: "", file_url: "" });

  const handleSubmit = async () => {
    if (!form.title || !form.subject) { toast.error("Title and subject required"); return; }
    try {
      await addHomework.mutateAsync({ school_id: schoolId, ...form });
      toast.success("Added successfully");
      setOpen(false);
      setForm({ title: "", description: "", subject: "", class_name: "", doc_type: "homework", created_by: "", file_url: "" });
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />Homework & Notes</h2>
          <p className="text-sm text-muted-foreground">Share study material, homework & notes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-xl gradient-primary border-0"><Plus className="h-4 w-4 mr-1" />Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Homework / Notes</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <Input placeholder="Class" value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} />
              </div>
              <Select value={form.doc_type} onValueChange={(v) => setForm({ ...form, doc_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="homework">Homework</SelectItem><SelectItem value="notes">Notes</SelectItem><SelectItem value="study_material">Study Material</SelectItem></SelectContent></Select>
              <Input placeholder="Created By" value={form.created_by} onChange={(e) => setForm({ ...form, created_by: e.target.value })} />
              <ImageUpload bucket="school-images" folder="homework" onUpload={(url) => setForm({ ...form, file_url: url })} />
              <Button onClick={handleSubmit} disabled={addHomework.isPending} className="w-full rounded-xl gradient-primary border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((r: any) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/60 border-border/30 hover:border-primary/20 transition-all">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-sm">{r.title}</h4>
                    <p className="text-xs text-muted-foreground">{r.subject} • {r.class_name}</p>
                  </div>
                  <Badge variant="outline" className={typeColors[r.doc_type] || ""}>{r.doc_type.replace("_", " ")}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{r.description}</p>
                {r.file_url && <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><FileText className="h-3 w-3" />View Attachment</a>}
                <p className="text-[10px] text-muted-foreground/60 mt-2">By {r.created_by} • {new Date(r.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {records.length === 0 && <p className="text-center text-muted-foreground py-8 col-span-2">No homework or notes uploaded yet</p>}
      </div>
    </div>
  );
}
