import { useState, useRef } from "react";
import { AdminLayout } from "@/components/layouts";
import { useListTeachers, useCreateTeacher } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Search, Plus, Filter, Mail, Phone, BookOpen, Loader2, Send, User, Upload, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/hooks/use-toast";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "History", "Geography", "Computer Science", "Economics", "Physical Education", "Art", "Music"];

export default function Teachers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subjects: "", qualification: "", experience: "", password: "" });

  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResults, setCsvResults] = useState<{ success: number; errors: string[] } | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useListTeachers({ schoolId });
  const createTeacher = useCreateTeacher();

  const teachers = data?.teachers || [];

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvImporting(true);
    setCsvResults(null);
    const text = await file.text();
    const lines = text.split("\n").filter(l => l.trim());
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
    const rows = lines.slice(1).map(l => { const vals = l.split(","); return Object.fromEntries(headers.map((h, i) => [h, vals[i]?.trim() || ""])); });
    let success = 0;
    const errors: string[] = [];
    for (const row of rows) {
      if (!row.name || !row.password) continue;
      try {
        await createTeacher.mutateAsync({ data: { schoolId, name: row.name, email: row.email || undefined, phone: row.phone || undefined, subjects: row.subjects ? [row.subjects] : undefined, qualification: row.qualification || undefined, experience: row.experience || undefined, password: row.password } });
        success++;
      } catch { errors.push(`Failed: ${row.name}`); }
    }
    setCsvResults({ success, errors });
    setCsvImporting(false);
    if (success > 0) refetch();
    if (csvInputRef.current) csvInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const csv = "name,email,phone,subjects,qualification,experience,password\nPriya Sharma,priya@school.com,9876543210,Mathematics,B.Ed,5,teacher123\nRajesh Gupta,rajesh@school.com,9123456789,Physics,M.Sc,8,teacher456";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "teacher_import_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleAdd = async () => {
    if (!form.name || !form.password) {
      toast({ title: "Missing fields", description: "Name and password are required.", variant: "destructive" });
      return;
    }
    try {
      await createTeacher.mutateAsync({ data: {
        schoolId, name: form.name, email: form.email || undefined,
        phone: form.phone || undefined,
        subjects: form.subjects ? [form.subjects] : undefined,
        qualification: form.qualification || undefined,
        experience: form.experience || undefined,
        password: form.password,
      }});
      toast({ title: "Teacher added", description: `${form.name} has been added successfully.` });
      setAddOpen(false);
      setForm({ name: "", email: "", phone: "", subjects: "", qualification: "", experience: "", password: "" });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to add teacher. The email may already be in use.", variant: "destructive" });
    }
  };

  const filteredTeachers = teachers.filter((t: any) =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.subjects?.join?.("").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Teacher Directory" links={adminLinks}>
      {csvResults && (
        <Card className={`p-4 rounded-xl mb-4 ${csvResults.errors.length > 0 ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}>
          <div className="flex items-start justify-between gap-2">
            <div><p className="font-bold text-sm">{csvResults.success} teachers imported successfully{csvResults.errors.length > 0 ? `, ${csvResults.errors.length} failed` : "!"}</p>{csvResults.errors.length > 0 && <p className="text-xs text-amber-700 mt-0.5">{csvResults.errors.slice(0, 3).join(", ")}</p>}</div>
            <button onClick={() => setCsvResults(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
        </Card>
      )}
      <input ref={csvInputRef} type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
      <Card className="p-6 rounded-2xl border-border shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search teachers..." className="pl-10 h-11 rounded-xl bg-secondary/50 border-none" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" className="h-11 rounded-xl px-3 border-border" onClick={downloadTemplate} title="Download CSV template">
              <Download className="w-4 h-4 mr-1.5" /> Template
            </Button>
            <Button variant="outline" className="h-11 rounded-xl px-3 border-primary/30 text-primary" onClick={() => csvInputRef.current?.click()} disabled={csvImporting}>
              {csvImporting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />} {csvImporting ? "Importing..." : "Import CSV"}
            </Button>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5 mr-2"/> Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display font-bold text-2xl">Add New Teacher</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Full Name *</label>
                  <Input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Teacher's full name" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Email</label>
                    <Input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="teacher@school.in" className="h-11 rounded-xl bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Phone</label>
                    <Input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+91 0000000000" className="h-11 rounded-xl bg-secondary/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Subject</label>
                  <Select value={form.subjects} onValueChange={v => setForm(p => ({...p, subjects: v}))}>
                    <SelectTrigger className="h-11 rounded-xl bg-secondary/50"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Qualification</label>
                    <Input value={form.qualification} onChange={e => setForm(p => ({...p, qualification: e.target.value}))} placeholder="e.g. M.Sc., B.Ed." className="h-11 rounded-xl bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Experience</label>
                    <Input value={form.experience} onChange={e => setForm(p => ({...p, experience: e.target.value}))} placeholder="e.g. 5 years" className="h-11 rounded-xl bg-secondary/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Login Password *</label>
                  <Input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="Set a temporary password" className="h-11 rounded-xl bg-secondary/50" />
                  <p className="text-xs text-muted-foreground">This password will be used for the teacher's login.</p>
                </div>
                <Button onClick={handleAdd} disabled={createTeacher.isPending} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                  {createTeacher.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                  Add Teacher
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-bold">No teachers found</p>
          <p className="text-sm">{search ? "Try a different search term" : "Add a teacher using the button above"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher: any) => (
            <Card key={teacher.id} className="p-6 rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full mb-4 border-4 border-secondary bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                {teacher.name?.charAt(0) || "T"}
              </div>
              <h3 className="text-xl font-bold font-display text-foreground">{teacher.name}</h3>
              {teacher.subjects?.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mt-2">
                  <BookOpen className="w-4 h-4" /> {Array.isArray(teacher.subjects) ? teacher.subjects.join(", ") : teacher.subjects}
                </div>
              )}
              {teacher.experience && <p className="text-sm font-medium text-muted-foreground mt-2">{teacher.experience} Experience</p>}
              {teacher.qualification && <p className="text-xs font-medium text-muted-foreground mt-1">{teacher.qualification}</p>}
              {teacher.assignedClasses?.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Classes: {teacher.assignedClasses.join(", ")}
                </p>
              )}
              <div className="flex gap-3 mt-6 w-full pt-6 border-t border-border">
                {teacher.email && (
                  <a href={`mailto:${teacher.email}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl h-10 border-border text-muted-foreground hover:text-foreground">
                      <Mail className="w-4 h-4 mr-2"/> Email
                    </Button>
                  </a>
                )}
                {teacher.phone && (
                  <a href={`tel:${teacher.phone}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl h-10 border-border text-muted-foreground hover:text-foreground">
                      <Phone className="w-4 h-4 mr-2"/> Call
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
