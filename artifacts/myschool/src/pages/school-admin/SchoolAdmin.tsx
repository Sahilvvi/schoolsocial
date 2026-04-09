import { useState, useRef, useEffect } from "react";
import { AdminLayout, StatCard } from "@/components/layouts";
import { useGetSchoolStats, useAiQuery } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { adminLinks, Users, CalendarCheck, CreditCard, Bell, UserPlus, Send, User, Bot, Loader2 } from "./admin-links";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SchoolAdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const schoolId = user?.schoolId || 1;
  const { data: stats, isLoading: statsLoading } = useGetSchoolStats(schoolId);
  const aiMutation = useAiQuery();

  const [query, setQuery] = useState("");
  const [chat, setChat] = useState<{ role: 'ai' | 'user'; content: string }[]>([
    { role: 'ai', content: "Hello Admin! I'm your AI data assistant. Ask me anything about attendance, fees, students, or teachers." }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const handleAskAI = async (e?: React.FormEvent, presetQuery?: string) => {
    e?.preventDefault();
    const text = presetQuery || query;
    if (!text.trim()) return;
    setChat(prev => [...prev, { role: 'user', content: text }]);
    setQuery("");
    try {
      const res = await aiMutation.mutateAsync({ data: { schoolId, query: text } });
      setChat(prev => [...prev, { role: 'ai', content: res.answer }]);
    } catch {
      setChat(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't process that query. Please try again or check your connection." }]);
    }
  };

  const loadingVal = (v: any, suffix = "") => statsLoading ? "..." : v != null ? `${v}${suffix}` : "—";

  return (
    <AdminLayout title="School Overview" links={adminLinks}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">

        <div className="xl:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard title="Total Students" value={loadingVal(stats?.totalStudents)} icon={Users} />
            <StatCard title="Today's Attendance" value={loadingVal(stats?.attendanceToday, "%")} icon={CalendarCheck} colorClass="text-green-500" bgClass="bg-green-500/10" />
            <StatCard title="Pending Fees" value={stats ? `₹${Number(stats.feePending || 0).toLocaleString("en-IN")}` : statsLoading ? "..." : "₹0"} icon={CreditCard} colorClass="text-accent" bgClass="bg-accent/10" />
            <StatCard title="Active Notices" value={loadingVal(stats?.noticesSent)} icon={Bell} colorClass="text-purple-500" bgClass="bg-purple-500/10" />
          </div>

          <Card className="p-6 rounded-2xl shadow-sm border-border">
            <h3 className="text-lg font-bold font-display mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Mark Attendance', icon: CalendarCheck, href: '/school-admin/attendance' },
                { label: 'Add Student', icon: Users, href: '/school-admin/students' },
                { label: 'Post Notice', icon: Bell, href: '/school-admin/notices' },
                { label: 'Post Job', icon: UserPlus, href: '/school-admin/hiring' },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => setLocation(action.href)}
                  className="p-4 border border-border rounded-xl text-sm font-bold text-foreground hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-2 group"
                >
                  <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  {action.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Assistant */}
        <Card className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl border-border shadow-lg shadow-primary/5 overflow-hidden bg-white dark:bg-card relative">
          <div className="p-4 border-b border-border bg-primary text-white flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Bot className="w-6 h-6" /></div>
            <div>
              <h3 className="font-display font-bold text-lg">AI Assistant</h3>
              <p className="text-xs text-white/80 font-medium">Connected to school DB</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-transparent">
            {chat.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent text-white'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl max-w-[80%] text-sm font-medium ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-border text-foreground rounded-tl-none shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {aiMutation.isPending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shrink-0"><Bot className="w-4 h-4" /></div>
                <div className="p-3 bg-white border border-border rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-accent" /> Thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white dark:bg-card border-t border-border">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {["Show absent today", "Fee defaulters list", "Lowest attendance class"].map(preset => (
                <button key={preset} onClick={() => handleAskAI(undefined, preset)}
                  className="whitespace-nowrap px-3 py-1.5 bg-secondary hover:bg-primary/10 text-xs font-bold text-foreground hover:text-primary rounded-full border border-border transition-colors">
                  {preset}
                </button>
              ))}
            </div>
            <form onSubmit={handleAskAI} className="relative">
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask about your school data..."
                className="pr-12 bg-secondary/50 border-border rounded-xl h-12" disabled={aiMutation.isPending} />
              <button type="submit" disabled={aiMutation.isPending || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-all">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </Card>

      </div>
    </AdminLayout>
  );
}
