import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { adminLinks } from "./admin-links";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Megaphone, Users, Clock, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

interface Announcement { id: number; title: string; body: string; targetRoles: string; channel: string; createdAt: string; recipientCount?: number; }

const TARGET_LABELS: Record<string, string> = { all: "Everyone", parent: "Parents", teacher: "Teachers", student: "Students" };
const CHANNEL_LABELS: Record<string, string> = { in_app: "In-App", sms: "SMS", email: "Email" };

export default function Announcements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", targetRoles: "all", channel: "in_app" });

  useEffect(() => {
    fetch(`${BASE}/api/announcements?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setAnnouncements(d.announcements || []));
  }, [schoolId]);

  const handleSend = async () => {
    if (!form.title || !form.body) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ schoolId, ...form }),
      });
      const data = await res.json();
      setAnnouncements(prev => [data, ...prev]);
      setOpen(false);
      setForm({ title: "", body: "", targetRoles: "all", channel: "in_app" });
      toast({ title: `Announcement sent to ${data.recipientCount || 0} people!` });
    } catch { toast({ title: "Error", description: "Failed to send announcement", variant: "destructive" }); }
    finally { setSending(false); }
  };

  return (
    <AdminLayout title="Announcements" links={adminLinks}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Send bulk messages to parents, teachers, and students</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Megaphone className="w-4 h-4 mr-2"/>New Announcement</Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader><DialogTitle className="dark:text-white">Send Announcement</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">Title *</Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="School closed tomorrow..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">Message *</Label>
                <Textarea rows={4} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Dear parents/students..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Send To</Label>
                  <Select value={form.targetRoles} onValueChange={v => setForm(p => ({ ...p, targetRoles: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="parent">Parents Only</SelectItem>
                      <SelectItem value="teacher">Teachers Only</SelectItem>
                      <SelectItem value="student">Students Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="dark:text-gray-300">Channel</Label>
                  <Select value={form.channel} onValueChange={v => setForm(p => ({ ...p, channel: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_app">In-App</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSend} disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Megaphone className="w-4 h-4 mr-2"/>{sending ? "Sending..." : "Send Announcement"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Megaphone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"/>
            <p className="text-gray-500 dark:text-gray-400">No announcements sent yet</p>
          </div>
        ) : announcements.map(a => (
          <div key={a.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5 text-orange-500"/>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{a.body}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                      <Users className="w-3 h-3 mr-1"/>{TARGET_LABELS[a.targetRoles] || a.targetRoles}
                    </Badge>
                    <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">{CHANNEL_LABELS[a.channel] || a.channel}</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 space-y-1">
                {a.recipientCount !== undefined && a.recipientCount > 0 && (
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center justify-end gap-1">
                    <Send className="w-3 h-3" />{a.recipientCount} reached
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />Delivered
                </span>
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-end gap-1 mt-1">
                  <Clock className="w-3 h-3"/>
                  {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}
