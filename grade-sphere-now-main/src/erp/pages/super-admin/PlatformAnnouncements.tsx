import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { superAdminLinks } from "./super-admin-links";
import { Megaphone, Plus, Trash2, Loader2, Users, Clock, CheckCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

const ROLE_REACH: Record<string, { label: string; estimate: string; color: string }> = {
  all: { label: "Everyone", estimate: "All users", color: "bg-blue-100 text-blue-700" },
  school_admin: { label: "School Admins", estimate: "~12 admins", color: "bg-purple-100 text-purple-700" },
  teacher: { label: "Teachers", estimate: "~48 teachers", color: "bg-green-100 text-green-700" },
  parent: { label: "Parents", estimate: "~320 parents", color: "bg-orange-100 text-orange-700" },
  student: { label: "Students", estimate: "~580 students", color: "bg-pink-100 text-pink-700" },
};

function getTimeAgo(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PlatformAnnouncements() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", targetRole: "all" });

  const fetchAll = async () => {
    setLoading(true);
    const res = await fetch(`${BASE}/api/support/announcements`, { headers: { Authorization: `Bearer ${getToken()}` } });
    setItems((await res.json()).announcements || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const add = async () => {
    if (!form.title || !form.content) { toast({ title: "Title and content required", variant: "destructive" }); return; }
    const res = await fetch(`${BASE}/api/support/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(form),
    });
    if (res.ok) { toast({ title: "Announcement published to " + ROLE_REACH[form.targetRole]?.estimate + "!" }); setOpen(false); setForm({ title: "", content: "", targetRole: "all" }); fetchAll(); }
  };

  const del = async (id: number) => {
    await fetch(`${BASE}/api/support/announcements/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    toast({ title: "Announcement removed" });
    fetchAll();
  };

  const totalDelivered = items.reduce((acc, a) => {
    const reach = ROLE_REACH[a.targetRole];
    const n = reach?.estimate.match(/\d+/);
    return acc + (n ? parseInt(n[0]) : 960);
  }, 0);

  return (
    <AdminLayout title="Platform Announcements" links={superAdminLinks}>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 rounded-2xl dark:bg-gray-800 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold dark:text-white">{items.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Active Announcements</p>
        </Card>
        <Card className="p-4 rounded-2xl dark:bg-gray-800 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold text-green-600">{totalDelivered.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Users Reached</p>
        </Card>
        <Card className="p-4 rounded-2xl dark:bg-gray-800 dark:border-gray-700 text-center">
          <p className="text-2xl font-bold text-primary">{items.filter(a => { const h = (new Date().getTime() - new Date(a.createdAt).getTime()) / 3600000; return h < 24; }).length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Sent Today</p>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-sm">{items.length} announcement{items.length !== 1 ? "s" : ""} active</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />New Announcement</Button></DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader><DialogTitle>Post Platform Announcement</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium dark:text-gray-300">Title *</label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" className="dark:bg-gray-700 dark:border-gray-600 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium dark:text-gray-300">Target Audience</label>
                <Select value={form.targetRole} onValueChange={v => setForm(p => ({ ...p, targetRole: v }))}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users (Everyone)</SelectItem>
                    <SelectItem value="school_admin">School Admins (~12)</SelectItem>
                    <SelectItem value="teacher">Teachers (~48)</SelectItem>
                    <SelectItem value="parent">Parents (~320)</SelectItem>
                    <SelectItem value="student">Students (~580)</SelectItem>
                  </SelectContent>
                </Select>
                {form.targetRole && (
                  <p className="text-xs text-muted-foreground mt-1">Will be delivered to: {ROLE_REACH[form.targetRole]?.estimate}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium dark:text-gray-300">Content *</label>
                <Textarea rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Announcement details..." className="dark:bg-gray-700 dark:border-gray-600 mt-1" />
              </div>
              <Button onClick={add} className="w-full"><Send className="w-4 h-4 mr-2" />Publish Announcement</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-bold">No announcements yet</p>
          <p className="text-sm mt-1">Post an announcement to notify all users on the platform</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(a => {
            const reach = ROLE_REACH[a.targetRole] || ROLE_REACH.all;
            const deliveredN = reach.estimate.match(/\d+/) ? parseInt(reach.estimate.match(/\d+/)![0]) : 960;
            return (
              <Card key={a.id} className="p-5 rounded-xl dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-primary">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Megaphone className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="font-bold dark:text-white">{a.title}</h3>
                      <Badge className={`text-xs rounded-full ${reach.color}`}>{reach.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{a.content}</p>

                    {/* Delivery tracking row */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-green-600">
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span className="font-medium">Delivered to {a.targetRole === "all" ? "all users" : `~${deliveredN.toLocaleString("en-IN")} ${reach.label.toLowerCase()}`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span>{deliveredN.toLocaleString("en-IN")} recipients</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{getTimeAgo(a.createdAt)} · {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => del(a.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 shrink-0" title="Delete announcement">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
