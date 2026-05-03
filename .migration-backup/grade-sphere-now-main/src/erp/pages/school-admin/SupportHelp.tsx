import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { useAuth } from "@/erp/hooks/use-auth";
import { useToast } from "@/erp/hooks/use-toast";
import { Ticket, Plus, Loader2, ChevronDown, ChevronUp, Clock, AlertCircle, Send, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

const STATUS_COLOR: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

const PRIORITY_COLOR: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

function TicketThread({ ticket, user, onRefresh }: { ticket: any; user: any; onRefresh: () => void }) {
  const { toast } = useToast();
  const [replies, setReplies] = useState<any[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const res = await fetch(`${BASE}/api/support/tickets/${ticket.id}/replies`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setReplies(data.replies || []);
    } catch { setReplies([]); }
    setLoadingReplies(false);
  };

  useEffect(() => { fetchReplies(); }, [ticket.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [replies]);

  const sendReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/support/tickets/${ticket.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message: replyText.trim(), isStaff: false, authorName: user?.name || "School Admin" }),
      });
      if (res.ok) {
        setReplyText("");
        fetchReplies();
        onRefresh();
      } else {
        toast({ title: "Failed to send reply", variant: "destructive" });
      }
    } catch { toast({ title: "Error sending reply", variant: "destructive" }); }
    setSending(false);
  };

  const formatTime = (d: string) => new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="px-4 pb-4 border-t border-border dark:border-gray-700 pt-3 space-y-3">
      {/* Original message */}
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          {user?.name?.[0] || "A"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-foreground dark:text-white">{user?.name || "You"}</span>
            <span className="text-[10px] text-muted-foreground">{formatTime(ticket.createdAt)}</span>
            <span className="text-[10px] bg-secondary dark:bg-gray-700 text-muted-foreground px-1.5 py-0.5 rounded-full">Original</span>
          </div>
          <div className="bg-secondary/60 dark:bg-gray-700/60 rounded-xl rounded-tl-none p-3 text-sm text-foreground dark:text-gray-200">
            {ticket.description}
          </div>
        </div>
      </div>

      {/* Thread replies */}
      {loadingReplies ? (
        <div className="flex justify-center py-3"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          {replies.map((reply, idx) => {
            const isStaff = reply.isStaff;
            return (
              <div key={reply.id || idx} className={`flex gap-3 ${isStaff ? "" : "flex-row-reverse"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${isStaff ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400" : "bg-primary/15 text-primary"}`}>
                  {isStaff ? "MS" : (reply.authorName?.[0] || "A")}
                </div>
                <div className={`flex-1 ${isStaff ? "" : "text-right"}`}>
                  <div className={`flex items-center gap-2 mb-1 ${isStaff ? "" : "flex-row-reverse"}`}>
                    <span className="text-xs font-bold text-foreground dark:text-white">{reply.authorName || (isStaff ? "MySchool Support" : "You")}</span>
                    {isStaff && <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full">Support</span>}
                    <span className="text-[10px] text-muted-foreground">{formatTime(reply.createdAt)}</span>
                  </div>
                  <div className={`inline-block rounded-xl p-3 text-sm max-w-[90%] text-left ${isStaff
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-800 dark:text-green-300 rounded-tl-none"
                    : "bg-primary/10 text-primary dark:text-blue-300 rounded-tr-none"}`}>
                    {reply.message}
                  </div>
                </div>
              </div>
            );
          })}

          {replies.length === 0 && !ticket.resolution && (
            <div className="flex items-center gap-2.5 ml-10 text-xs text-muted-foreground bg-secondary/30 dark:bg-gray-700/30 rounded-xl p-3">
              <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span>Awaiting response from MySchool support team. Typical response time: 24–48 hours.</span>
            </div>
          )}

          {/* Legacy resolution fallback */}
          {ticket.resolution && replies.length === 0 && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">MS</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-foreground dark:text-white">MySchool Support</span>
                  <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full">Official Response</span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl rounded-tl-none p-3 border border-green-100 dark:border-green-800 text-sm text-green-800 dark:text-green-300">
                  {ticket.resolution}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div ref={bottomRef} />

      {/* Reply input */}
      {ticket.status !== "closed" && (
        <div className="flex gap-2 mt-2 pt-2 border-t border-border/50 dark:border-gray-700/50">
          <Textarea
            rows={2}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
            placeholder="Add a follow-up message... (Enter to send)"
            className="flex-1 text-xs resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-xl"
          />
          <Button size="sm" onClick={sendReply} disabled={sending || !replyText.trim()} className="rounded-xl h-full px-3 self-end">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SupportHelp() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId;
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", category: "technical", priority: "medium" });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/support/tickets?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch { setTickets([]); }
    setLoading(false);
  };

  useEffect(() => { if (schoolId) fetchTickets(); }, [schoolId]);

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.description.trim()) {
      toast({ title: "Missing fields", description: "Subject and description are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/support/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ...form, schoolId }),
      });
      if (!res.ok) throw new Error("Server error");
      toast({ title: "Ticket submitted!", description: "Our team will respond within 24 hours." });
      setOpen(false);
      setForm({ subject: "", description: "", category: "technical", priority: "medium" });
      fetchTickets();
    } catch { toast({ title: "Failed to submit ticket", variant: "destructive" }); }
    setSubmitting(false);
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const stats = [
    { label: "Open", count: tickets.filter(t => t.status === "open").length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "In Progress", count: tickets.filter(t => t.status === "in_progress").length, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Resolved", count: tickets.filter(t => t.status === "resolved").length, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
  ];

  return (
    <AdminLayout title="Support & Help" links={adminLinks}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <Card key={s.label} className={`p-4 rounded-2xl text-center ${s.bg} border-0 dark:border dark:border-gray-700`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">My Tickets</h2>
          <p className="text-sm text-muted-foreground">Click any ticket to see the full thread &amp; add replies</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold"><Plus className="w-4 h-4 mr-2" />New Ticket</Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700 max-w-md">
            <DialogHeader><DialogTitle className="dark:text-white">Raise a Support Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-semibold dark:text-gray-300 mb-1 block">Subject *</label>
                <Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Brief summary of your issue" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold dark:text-gray-300 mb-1 block">Category</label>
                  <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold dark:text-gray-300 mb-1 block">Priority</label>
                  <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent / Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold dark:text-gray-300 mb-1 block">Description *</label>
                <Textarea rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your issue in detail — what happened, what you expected, steps to reproduce..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full rounded-xl font-bold">
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit Ticket"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Ticket className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="font-bold text-lg">No tickets yet</p>
          <p className="text-sm mt-1">Raise a ticket and our team will get back to you</p>
          <Button className="mt-4 rounded-xl" onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />Raise Your First Ticket</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <Card key={ticket.id} className="rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-bold dark:text-white truncate">{ticket.subject}</span>
                      <Badge className={`text-[10px] rounded-full capitalize shrink-0 ${STATUS_COLOR[ticket.status] || STATUS_COLOR.open}`}>{ticket.status?.replace("_", " ")}</Badge>
                      {ticket.priority && <Badge className={`text-[10px] rounded-full capitalize shrink-0 ${PRIORITY_COLOR[ticket.priority] || ""}`}>{ticket.priority}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{ticket.category} • {timeAgo(ticket.createdAt)}</p>
                  </div>
                  {expanded === ticket.id ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
                </div>
              </button>
              {expanded === ticket.id && (
                <TicketThread ticket={ticket} user={user} onRefresh={fetchTickets} />
              )}
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-700 dark:text-blue-300 text-sm">Need immediate help?</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Email us at <strong>support@myschool.in</strong> or call <strong>+91 0000000000</strong> during business hours (Mon–Sat, 9am–6pm)</p>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
}
