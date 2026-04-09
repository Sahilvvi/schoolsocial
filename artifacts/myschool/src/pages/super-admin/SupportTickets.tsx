import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/layouts";
import { superAdminLinks } from "./super-admin-links";
import { Ticket, CheckCircle, AlertCircle, Loader2, MessageSquare, ChevronLeft, Send, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";
const STATUS_COLOR: Record<string, string> = { open: "bg-red-100 text-red-700", in_progress: "bg-yellow-100 text-yellow-700", resolved: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600" };
const PRIORITY_COLOR: Record<string, string> = { low: "bg-gray-100 text-gray-600", medium: "bg-blue-100 text-blue-700", high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700" };

function parseThread(resolution: string | null): Array<{ role: "admin"; text: string; time: string }> {
  if (!resolution) return [];
  return resolution.split("|||").map(chunk => {
    const [meta, ...rest] = chunk.split("::");
    const text = rest.join("::").trim();
    const time = meta?.replace("ADMIN@", "").trim();
    return { role: "admin" as const, text: text || chunk, time: time || "" };
  }).filter(m => m.text);
}

function serializeThread(msgs: Array<{ role: string; text: string; time: string }>): string {
  return msgs.map(m => `ADMIN@${m.time}::${m.text}`).join("|||");
}

export default function SupportTickets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [threadView, setThreadView] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const res = await fetch(`${BASE}/api/support/tickets`, { headers: { Authorization: `Bearer ${getToken()}` } });
    setTickets((await res.json()).tickets || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const update = async (id: number, data: any) => {
    await fetch(`${BASE}/api/support/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    });
    toast({ title: "Ticket updated!" });
    fetchAll();
  };

  const sendReply = async () => {
    if (!replyText.trim() || !threadView) return;
    setSending(true);
    const existing = parseThread(threadView.resolution);
    const now = new Date().toLocaleString("en-IN");
    const newMsg = { role: "admin" as const, text: replyText.trim(), time: now };
    const allMsgs = [...existing, newMsg];
    const newResolution = serializeThread(allMsgs);
    await fetch(`${BASE}/api/support/tickets/${threadView.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status: "in_progress", resolution: newResolution }),
    });
    toast({ title: "Reply sent!" });
    setReplyText("");
    await fetchAll();
    const updated = (await fetch(`${BASE}/api/support/tickets`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json())).tickets?.find((t: any) => t.id === threadView.id);
    if (updated) setThreadView(updated);
    setSending(false);
  };

  const resolveTicket = async (ticket: any) => {
    const existing = parseThread(ticket.resolution);
    const now = new Date().toLocaleString("en-IN");
    const systemMsg = { role: "admin" as const, text: "This ticket has been resolved. Thank you for reaching out!", time: now };
    const newResolution = serializeThread([...existing, systemMsg]);
    await update(ticket.id, { status: "resolved", resolution: newResolution });
    if (threadView?.id === ticket.id) setThreadView(null);
  };

  const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);

  if (threadView) {
    const thread = parseThread(threadView.resolution);
    return (
      <AdminLayout title="Support Tickets" links={superAdminLinks}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setThreadView(null)} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 dark:bg-gray-700"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold dark:text-white text-lg">{threadView.subject}</h2>
                <Badge className={`text-xs rounded-full ${STATUS_COLOR[threadView.status]}`}>{threadView.status.replace("_", " ")}</Badge>
                <Badge className={`text-xs rounded-full ${PRIORITY_COLOR[threadView.priority]}`}>{threadView.priority}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Ticket #{threadView.id} · {threadView.category} · {new Date(threadView.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
            {threadView.status !== "resolved" && threadView.status !== "closed" && (
              <Button size="sm" className="rounded-xl bg-green-600 hover:bg-green-700 text-white shrink-0" onClick={() => resolveTicket(threadView)}>
                <CheckCircle className="w-4 h-4 mr-1.5" />Mark Resolved
              </Button>
            )}
          </div>

          {/* Conversation thread */}
          <div className="space-y-4 mb-6">
            {/* Original ticket */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-sm font-bold">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl rounded-tl-none p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm dark:text-white">User (Ticket #{threadView.id})</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(threadView.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{threadView.description}</p>
                </div>
              </div>
            </div>

            {/* Reply thread */}
            {thread.map((msg, i) => (
              <div key={i} className="flex gap-3 justify-end">
                <div className="flex-1 max-w-lg">
                  <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-2xl rounded-tr-none p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-sm text-primary">Support Admin</p>
                      {msg.time && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{msg.time}</span>}
                    </div>
                    <p className="text-sm text-foreground dark:text-gray-200">{msg.text}</p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
            ))}

            {thread.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No replies yet. Send your first response below.</p>
              </div>
            )}
          </div>

          {/* Reply box */}
          {threadView.status !== "closed" && (
            <Card className="p-4 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm font-bold dark:text-white mb-3">Add Reply</p>
              <Textarea
                rows={3}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write your response to the user..."
                className="dark:bg-gray-700 dark:border-gray-600 mb-3 resize-none"
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply(); }}
              />
              <div className="flex gap-2">
                <Button onClick={sendReply} disabled={!replyText.trim() || sending} className="rounded-xl flex-1">
                  {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {sending ? "Sending..." : "Send Reply"}
                </Button>
                <Button variant="outline" onClick={() => resolveTicket(threadView)} className="rounded-xl dark:border-gray-600 dark:text-gray-300" disabled={threadView.status === "resolved"}>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />Resolve
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Tip: Press Ctrl+Enter to send quickly</p>
            </Card>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Support Tickets" links={superAdminLinks}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="grid grid-cols-4 gap-4">
          {["open", "in_progress", "resolved", "closed"].map(s => (
            <div key={s} className="text-center cursor-pointer" onClick={() => setFilter(s)}>
              <p className={`text-2xl font-bold ${s === "open" ? "text-red-600" : s === "in_progress" ? "text-yellow-600" : s === "resolved" ? "text-green-600" : "dark:text-white"}`}>{tickets.filter(t => t.status === s).length}</p>
              <p className="text-xs text-muted-foreground capitalize">{s.replace("_", " ")}</p>
            </div>
          ))}
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 dark:bg-gray-800 dark:border-gray-700 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({tickets.length})</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Ticket className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-bold">No {filter !== "all" ? filter.replace("_", " ") : ""} tickets</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => {
            const replies = parseThread(t.resolution);
            return (
              <Card key={t.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 cursor-pointer" onClick={() => setThreadView(t)}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold dark:text-white">{t.subject}</p>
                      <Badge className={`text-xs rounded-full ${STATUS_COLOR[t.status]}`}>{t.status.replace("_", " ")}</Badge>
                      <Badge className={`text-xs rounded-full ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</Badge>
                      <Badge variant="outline" className="text-xs rounded-full capitalize dark:border-gray-600 dark:text-gray-400">{t.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString("en-IN")}</span>
                      {replies.length > 0 && (
                        <span className="text-xs flex items-center gap-1 text-primary font-medium">
                          <MessageSquare className="w-3 h-3" />{replies.length} {replies.length === 1 ? "reply" : "replies"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => setThreadView(t)} className="rounded-lg h-8 text-xs dark:border-gray-600 dark:text-gray-300">
                      <MessageSquare className="w-3 h-3 mr-1" />{replies.length > 0 ? "Thread" : "Reply"}
                    </Button>
                    {t.status !== "closed" && t.status !== "resolved" && (
                      <Button size="sm" className="rounded-lg h-8 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => resolveTicket(t)}>
                        <CheckCircle className="w-3 h-3 mr-1" />Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
