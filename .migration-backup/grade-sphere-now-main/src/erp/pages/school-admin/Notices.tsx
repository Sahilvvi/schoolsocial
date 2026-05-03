import { useState } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useListNotices, useCreateNotice, useListClasses } from "@/erp/api-client";
import { useAuth } from "@/erp/hooks/use-auth";
import { Plus, Bell, Megaphone, AlertCircle, FileText, Send, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/erp/hooks/use-toast";

const getIcon = (type: string) => {
  switch (type) {
    case 'holiday': return <Megaphone className="w-5 h-5" />;
    case 'exam': return <FileText className="w-5 h-5" />;
    case 'event': return <Bell className="w-5 h-5" />;
    default: return <AlertCircle className="w-5 h-5" />;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'holiday': return "bg-purple-100 text-purple-600";
    case 'exam': return "bg-blue-100 text-blue-600";
    case 'event': return "bg-green-100 text-green-600";
    default: return "bg-orange-100 text-orange-600";
  }
};

const formatDate = (d: string | Date) => {
  try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return String(d); }
};

export default function Notices() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "general", classId: "" });

  const { data, isLoading, refetch } = useListNotices({ schoolId });
  const { data: classesData } = useListClasses({ schoolId });
  const createNotice = useCreateNotice();

  const notices = data?.notices || [];
  const classes = classesData?.classes || [];

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.type) {
      toast({ title: "Missing fields", description: "Title, content, and type are required.", variant: "destructive" });
      return;
    }
    try {
      await createNotice.mutateAsync({ data: { schoolId, title: form.title, content: form.content, type: form.type as any, classId: form.classId ? Number(form.classId) : undefined } });
      toast({ title: "Notice published", description: "Notice has been broadcast successfully." });
      setDialogOpen(false);
      setForm({ title: "", content: "", type: "general", classId: "" });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to publish notice.", variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="Notice Board" links={adminLinks}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">School Notices</h2>
          <p className="text-muted-foreground font-medium">Broadcast information to students, parents and staff</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2"/> Post Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-2xl">Create New Notice</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Notice Title</label>
                <Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Enter title..." className="h-11 rounded-xl bg-secondary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Notice Type</label>
                  <Select value={form.type} onValueChange={v => setForm(p => ({...p, type: v}))}>
                    <SelectTrigger className="h-11 rounded-xl bg-secondary/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="exam">Examination</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Class (optional)</label>
                  <Select value={form.classId || "__none__"} onValueChange={v => setForm(p => ({...p, classId: v === "__none__" ? "" : v}))}>
                    <SelectTrigger className="h-11 rounded-xl bg-secondary/50"><SelectValue placeholder="All classes" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">All Classes</SelectItem>
                      {classes.map((c: any) => (
                        <SelectItem key={c.id} value={String(c.id)}>Class {c.name}{c.section ? "-"+c.section : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Message</label>
                <Textarea value={form.content} onChange={e => setForm(p => ({...p, content: e.target.value}))} placeholder="Type your message here..." className="min-h-[120px] rounded-xl bg-secondary/50 resize-none" />
              </div>
              <Button onClick={handleSubmit} disabled={createNotice.isPending} className="w-full h-12 rounded-xl font-bold text-base mt-2 shadow-lg shadow-primary/20">
                {createNotice.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                Publish Notice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : notices.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold mb-2">No notices yet</p>
          <p className="text-sm">Post a notice to broadcast information to your school</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notices.map((notice: any) => (
            <Card key={notice.id} className="p-6 rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-6">
                <div className={`p-4 rounded-2xl shrink-0 h-fit ${getColor(notice.type)}`}>
                  {getIcon(notice.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-xl font-bold font-display text-foreground">{notice.title}</h3>
                    <span className="text-sm font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full shrink-0">{formatDate(notice.createdAt || "")}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-xs font-bold px-2 py-1 bg-secondary text-foreground rounded-md uppercase tracking-wider capitalize">{notice.type}</span>
                    {notice.postedByName && (
                      <span className="text-xs font-medium text-muted-foreground">by {notice.postedByName}</span>
                    )}
                    {notice.classId && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-md">
                        <BookOpen className="w-3 h-3" /> Class specific
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed">{notice.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
