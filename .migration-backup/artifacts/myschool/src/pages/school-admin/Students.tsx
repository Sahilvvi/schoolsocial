import { useState, useRef } from "react";
import { AdminLayout } from "@/components/layouts";
import { useListStudents, useCreateStudent, useListClasses } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import QRCode from "react-qr-code";
import { Users, Search, Plus, QrCode, Filter, Loader2, Send, Upload, Download, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/hooks/use-toast";

export default function StudentsList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [form, setForm] = useState({ name: "", classId: "", gender: "male", dateOfBirth: "", parentName: "", parentPhone: "", parentEmail: "", bloodGroup: "", address: "" });

  const [alumniFilter, setAlumniFilter] = useState<"all" | "active" | "alumni">("all");
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResults, setCsvResults] = useState<{ success: number; errors: string[] } | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useListStudents({ schoolId, search });
  const { data: classesData } = useListClasses({ schoolId });
  const createStudent = useCreateStudent();

  const allStudents = data?.students || [];
  const classes = classesData?.classes || [];
  const students = allStudents.filter((s: any) => {
    if (alumniFilter === "alumni") return s.isAlumni || s.status === "alumni";
    if (alumniFilter === "active") return !s.isAlumni && s.status !== "alumni";
    return true;
  });

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
      if (!row.name) continue;
      try {
        await createStudent.mutateAsync({ data: { schoolId, name: row.name, classId: row.class_id ? Number(row.class_id) : undefined, gender: (row.gender as any) || "male", parentName: row.parent_name || row.parentname || undefined, parentPhone: row.parent_phone || row.parentphone || undefined, parentEmail: row.parent_email || row.parentemail || undefined, bloodGroup: row.blood_group || row.bloodgroup || undefined } });
        success++;
      } catch { errors.push(`Failed: ${row.name}`); }
    }
    setCsvResults({ success, errors });
    setCsvImporting(false);
    if (success > 0) refetch();
    if (csvInputRef.current) csvInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const csv = "name,class_id,gender,parent_name,parent_phone,parent_email,blood_group\nRahul Sharma,1,male,Ramesh Sharma,9876543210,ramesh@email.com,O+\nPriya Singh,2,female,Mohan Singh,9123456789,mohan@email.com,A+";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "student_import_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleAdd = async () => {
    if (!form.name) {
      toast({ title: "Name required", description: "Please enter the student's name.", variant: "destructive" });
      return;
    }
    try {
      await createStudent.mutateAsync({ data: {
        schoolId, name: form.name,
        classId: form.classId ? Number(form.classId) : undefined,
        gender: form.gender as any,
        dateOfBirth: form.dateOfBirth || undefined,
        parentName: form.parentName || undefined,
        parentPhone: form.parentPhone || undefined,
        parentEmail: form.parentEmail || undefined,
        bloodGroup: form.bloodGroup || undefined,
        address: form.address || undefined,
      }});
      toast({ title: "Student added", description: `${form.name} has been enrolled successfully.` });
      setAddOpen(false);
      setForm({ name: "", classId: "", gender: "male", dateOfBirth: "", parentName: "", parentPhone: "", parentEmail: "", bloodGroup: "", address: "" });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to add student.", variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="Student Directory" links={adminLinks}>
      {/* CSV Import Results */}
      {csvResults && (
        <Card className={`p-4 rounded-xl mb-4 ${csvResults.errors.length > 0 ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}>
          <div className="flex items-start justify-between gap-2">
            <div><p className="font-bold text-sm">{csvResults.success} students imported successfully{csvResults.errors.length > 0 ? `, ${csvResults.errors.length} failed` : "!"}</p>{csvResults.errors.length > 0 && <p className="text-xs text-amber-700 mt-0.5">{csvResults.errors.slice(0, 3).join(", ")}</p>}</div>
            <button onClick={() => setCsvResults(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
        </Card>
      )}
      <input ref={csvInputRef} type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
      <Card className="p-6 rounded-2xl border-border shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-10 h-11 rounded-xl bg-secondary/50 border-none" value={search} onChange={e => setSearch(e.target.value)} />
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
                <Plus className="w-5 h-5 mr-2" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display font-bold text-2xl">Enroll New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Full Name *</label>
                  <Input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Student's full name" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Class</label>
                    <Select value={form.classId} onValueChange={v => setForm(p => ({...p, classId: v}))}>
                      <SelectTrigger className="h-11 rounded-xl bg-secondary/50"><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {classes.map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>Class {c.name}{c.section ? "-"+c.section : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Gender</label>
                    <Select value={form.gender} onValueChange={v => setForm(p => ({...p, gender: v}))}>
                      <SelectTrigger className="h-11 rounded-xl bg-secondary/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Date of Birth</label>
                    <Input type="date" value={form.dateOfBirth} onChange={e => setForm(p => ({...p, dateOfBirth: e.target.value}))} className="h-11 rounded-xl bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Blood Group</label>
                    <Select value={form.bloodGroup} onValueChange={v => setForm(p => ({...p, bloodGroup: v}))}>
                      <SelectTrigger className="h-11 rounded-xl bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Parent/Guardian Name</label>
                  <Input value={form.parentName} onChange={e => setForm(p => ({...p, parentName: e.target.value}))} placeholder="Parent's full name" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Parent Phone</label>
                    <Input value={form.parentPhone} onChange={e => setForm(p => ({...p, parentPhone: e.target.value}))} placeholder="+91 0000000000" className="h-11 rounded-xl bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Parent Email</label>
                    <Input type="email" value={form.parentEmail} onChange={e => setForm(p => ({...p, parentEmail: e.target.value}))} placeholder="parent@email.com" className="h-11 rounded-xl bg-secondary/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Address</label>
                  <Input value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} placeholder="Student's home address" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <Button onClick={handleAdd} disabled={createStudent.isPending} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                  {createStudent.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                  Enroll Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alumni filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {(["all", "active", "alumni"] as const).map(f => (
            <button key={f} onClick={() => setAlumniFilter(f)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${alumniFilter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
              {f === "alumni" ? <GraduationCap className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              {f === "all" ? `All Students (${allStudents.length})` : f === "alumni" ? `Alumni (${allStudents.filter((s: any) => s.isAlumni || s.status === "alumni").length})` : `Active (${allStudents.filter((s: any) => !s.isAlumni && s.status !== "alumni").length})`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : students.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-bold">No students found</p>
            <p className="text-sm">{search ? "Try a different search term" : "Add a student using the button above"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 font-bold rounded-tl-xl">Student</th>
                  <th className="px-6 py-4 font-bold">Class</th>
                  <th className="px-6 py-4 font-bold">Parent</th>
                  <th className="px-6 py-4 font-bold">Attendance</th>
                  <th className="px-6 py-4 font-bold rounded-tr-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any) => (
                  <tr key={student.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {student.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{student.name}</div>
                          <div className="text-xs text-muted-foreground font-medium">{student.admissionNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {student.className ? `Class ${student.className}${student.section ? "-"+student.section : ""}` : "—"}
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{student.parentName || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${student.attendancePercent >= 90 ? 'bg-green-500' : student.attendancePercent >= 75 ? 'bg-orange-500' : 'bg-destructive'}`}
                            style={{ width: `${student.attendancePercent || 0}%` }}
                          />
                        </div>
                        <span className="font-bold text-sm">{student.attendancePercent || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost" size="sm"
                        className="rounded-lg text-primary hover:bg-primary/10 font-bold"
                        onClick={() => { setSelectedStudent(student); setQrOpen(true); }}
                      >
                        <QrCode className="w-4 h-4 mr-2" /> View ID
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedStudent && (
            <div className="bg-white">
              <div className="bg-primary p-6 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                <h2 className="font-display font-bold text-2xl relative z-10">Smart ID Card</h2>
                <p className="text-primary-foreground/80 font-medium relative z-10">MySchool Platform</p>
              </div>
              <div className="p-8 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg -mt-16 z-10 mb-4 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                  {selectedStudent.name?.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold font-display text-foreground">{selectedStudent.name}</h3>
                <p className="text-muted-foreground font-medium mb-6">
                  {selectedStudent.className ? `Class ${selectedStudent.className}${selectedStudent.section ? "-"+selectedStudent.section : ""}` : ""} • {selectedStudent.admissionNo}
                </p>
                <div className="p-4 bg-white border-2 border-border rounded-2xl shadow-sm mb-6">
                  <QRCode value={selectedStudent.qrCode || `student:${selectedStudent.id}:${selectedStudent.admissionNo}`} size={160} />
                </div>
                <p className="text-xs text-muted-foreground font-mono">{selectedStudent.qrCode || selectedStudent.admissionNo}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
