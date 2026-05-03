import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/layouts";
import { useAuth } from "@/hooks/use-auth";
import { adminLinks } from "./admin-links";
import { MessageSquare, Send, Loader2, User, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

export default function AdminMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const userId = user?.userId;

  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchThreads = () => {
    setLoading(true);
    fetch(`${BASE}/api/messages/threads?schoolId=${schoolId}&userId=${userId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => setThreads(d.threads || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (userId) fetchThreads(); }, [userId]);

  useEffect(() => {
    if (!selectedThread) return;
    fetch(`${BASE}/api/messages?schoolId=${schoolId}&userId=${userId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => {
        const allMsgs = d.messages || [];
        const otherUserId = selectedThread.userId;
        const threadMsgs = allMsgs.filter((m: any) =>
          (m.senderId === userId && m.receiverId === otherUserId) ||
          (m.receiverId === userId && m.senderId === otherUserId)
        );
        setMessages(threadMsgs);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
  }, [selectedThread]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedThread) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          schoolId, senderId: userId, receiverId: selectedThread.userId,
          senderName: user?.name, receiverName: selectedThread.name,
          senderRole: "school_admin", message: newMessage,
        }),
      });
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      setNewMessage("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      fetchThreads();
    } catch {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Messages" links={adminLinks}>
      <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-border dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        {/* Sidebar */}
        <div className="w-72 border-r border-border dark:border-gray-700 flex flex-col shrink-0">
          <div className="p-4 border-b border-border dark:border-gray-700">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
                className="pl-9 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : filteredThreads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground px-4">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold">No conversations yet</p>
              </div>
            ) : filteredThreads.map(thread => (
              <button key={thread.userId}
                onClick={() => setSelectedThread(thread)}
                className={`w-full p-4 text-left border-b border-border/50 dark:border-gray-700/50 hover:bg-secondary/40 dark:hover:bg-gray-700/50 transition-colors ${selectedThread?.userId === thread.userId ? "bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {(thread.name || "U")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm dark:text-white truncate">{thread.name}</p>
                      {thread.unread > 0 && (
                        <span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">{thread.unread}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-gray-400 truncate">
                      {thread.messages?.[thread.messages.length - 1]?.message || "No messages yet"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              <div className="p-4 border-b border-border dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-800">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {(selectedThread.name || "U")[0]}
                </div>
                <div>
                  <p className="font-bold dark:text-white">{selectedThread.name}</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">School Admin conversation</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-gray-900">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No messages in this conversation yet</p>
                  </div>
                ) : messages.map((msg: any, i) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-primary text-white rounded-tr-sm" : "bg-white dark:bg-gray-700 border border-border dark:border-gray-600 text-foreground dark:text-white rounded-tl-sm shadow-sm"}`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isMe ? "text-white/60" : "text-muted-foreground"}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 border-t border-border dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex gap-3">
                  <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button onClick={handleSend} disabled={sending || !newMessage.trim()} className="rounded-xl px-4">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-bold dark:text-white">Select a conversation</p>
                <p className="text-sm mt-2">Choose a conversation from the left to read and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
