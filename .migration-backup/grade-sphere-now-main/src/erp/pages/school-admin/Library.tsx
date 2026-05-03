import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useAuth } from "@/erp/hooks/use-auth";
import { BookOpen, Plus, Search, RotateCcw, Loader2, AlertCircle, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

export default function Library() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [books, setBooks] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"books" | "issues">("books");
  const [bookOpen, setBookOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [bookForm, setBookForm] = useState({ title: "", author: "", isbn: "", subject: "", category: "", publisher: "", totalCopies: "1", shelfLocation: "" });
  const [issueForm, setIssueForm] = useState({ bookId: "", studentId: "", dueDate: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [bRes, iRes, sRes] = await Promise.all([
      fetch(`${BASE}/api/library?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/library/issues?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    const [bd, id, sd] = await Promise.all([bRes.json(), iRes.json(), sRes.json()]);
    setBooks(bd.books || []); setIssues(id.issues || []); setStudents(sd.students || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addBook = async () => {
    const res = await fetch(`${BASE}/api/library`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(bookForm) });
    if (res.ok) { toast({ title: "Book added!" }); setBookOpen(false); fetchAll(); }
  };

  const issueBook = async () => {
    const res = await fetch(`${BASE}/api/library/issues`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(issueForm) });
    if (res.ok) { toast({ title: "Book issued!" }); setIssueOpen(false); fetchAll(); }
  };

  const returnBook = async (id: number) => {
    const res = await fetch(`${BASE}/api/library/issues/${id}/return`, { method: "PATCH", headers: { Authorization: `Bearer ${getToken()}` } });
    if (res.ok) { toast({ title: "Book returned!" }); fetchAll(); }
  };

  const deleteBook = async (id: number) => {
    await fetch(`${BASE}/api/library/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchAll();
  };

  const filtered = books.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Library Management" links={adminLinks}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {(["books", "issues"] as const).map(t => (
            <Button key={t} variant={activeTab === t ? "default" : "outline"} onClick={() => setActiveTab(t)} className="rounded-xl capitalize">{t === "books" ? "Book Catalog" : "Issued Books"}</Button>
          ))}
        </div>
        <div className="flex gap-2">
          {activeTab === "books" && (
            <Dialog open={bookOpen} onOpenChange={setBookOpen}>
              <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />Add Book</Button></DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader><DialogTitle>Add Book to Catalog</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  {[["Title *", "title", "Book title"], ["Author", "author", "Author name"], ["ISBN", "isbn", "ISBN number"], ["Subject", "subject", "Subject/Topic"], ["Category", "category", "Fiction / Academic"], ["Publisher", "publisher", "Publisher name"], ["Shelf Location", "shelfLocation", "e.g. A-3"]].map(([label, key, ph]) => (
                    <div key={key}><label className="text-sm font-medium dark:text-gray-300">{label}</label>
                      <Input value={(bookForm as any)[key]} onChange={e => setBookForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  ))}
                  <div><label className="text-sm font-medium dark:text-gray-300">Total Copies</label><Input type="number" value={bookForm.totalCopies} onChange={e => setBookForm(p => ({ ...p, totalCopies: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <Button onClick={addBook} className="w-full">Add Book</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {activeTab === "books" && (
            <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
              <DialogTrigger asChild><Button variant="outline" className="rounded-xl"><BookOpen className="w-4 h-4 mr-2" />Issue Book</Button></DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader><DialogTitle>Issue Book to Student</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium dark:text-gray-300">Book *</label>
                    <Select value={issueForm.bookId} onValueChange={v => setIssueForm(p => ({ ...p, bookId: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select book" /></SelectTrigger>
                      <SelectContent>{books.filter(b => b.availableCopies > 0).map(b => <SelectItem key={b.id} value={String(b.id)}>{b.title} ({b.availableCopies} left)</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Student *</label>
                    <Select value={issueForm.studentId} onValueChange={v => setIssueForm(p => ({ ...p, studentId: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select student" /></SelectTrigger>
                      <SelectContent>{students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Due Date *</label><Input type="date" value={issueForm.dueDate} onChange={e => setIssueForm(p => ({ ...p, dueDate: e.target.value }))} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <Button onClick={issueBook} className="w-full">Issue Book</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {activeTab === "books" && (
        <>
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" /></div>
          {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : filtered.length === 0 ? <div className="text-center py-16 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No books in catalog</p><p className="text-sm">Add books to get started</p></div>
          : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(b => (
              <Card key={b.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5 text-primary" /></div>
                  <div className="flex gap-1">
                    <Badge className={`text-xs rounded-full ${b.availableCopies > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.availableCopies}/{b.totalCopies}</Badge>
                    <button onClick={() => deleteBook(b.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="font-bold text-sm dark:text-white mt-2">{b.title}</p>
                {b.author && <p className="text-xs text-muted-foreground">by {b.author}</p>}
                <div className="flex flex-wrap gap-1 mt-2">
                  {b.subject && <Badge variant="outline" className="text-xs rounded-full">{b.subject}</Badge>}
                  {b.category && <Badge variant="outline" className="text-xs rounded-full">{b.category}</Badge>}
                  {b.shelfLocation && <Badge variant="outline" className="text-xs rounded-full">📍 {b.shelfLocation}</Badge>}
                </div>
              </Card>
            ))}
          </div>}
        </>
      )}
      {activeTab === "issues" && (
        <div className="space-y-3">
          {issues.length === 0 ? <div className="text-center py-16 text-muted-foreground"><AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>No books currently issued</p></div>
          : issues.map(i => (
            <Card key={i.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold dark:text-white">{i.bookTitle}</p>
                  <p className="text-sm text-muted-foreground">{i.studentName} • Due: {i.dueDate}</p>
                  <p className="text-xs text-muted-foreground">Issued: {new Date(i.issuedAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs rounded-full capitalize ${i.status === "returned" ? "bg-green-100 text-green-700" : i.status === "overdue" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{i.status}</Badge>
                  {i.status === "issued" && (
                    <Button size="sm" onClick={() => returnBook(i.id)} className="rounded-lg h-8 text-xs bg-green-600 hover:bg-green-700 text-white">
                      <RotateCcw className="w-3 h-3 mr-1" />Return
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
