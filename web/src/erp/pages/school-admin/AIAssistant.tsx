import { useState, useRef, useEffect, useCallback } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useAuth } from "@/erp/hooks/use-auth";
import { Bot, Send, Loader2, Sparkles, User, Zap, ChevronRight, BarChart3, Users, CreditCard, CalendarCheck, BookOpen, Bell, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminLinks } from "./admin-links";

interface Message { role: "user" | "ai"; content: string; timestamp: Date; }

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

const SUGGESTED = [
  { icon: Users, label: "Student count", q: "How many students are enrolled?", color: "from-blue-500 to-blue-600" },
  { icon: CalendarCheck, label: "Attendance", q: "How many students are absent today?", color: "from-emerald-500 to-green-600" },
  { icon: CreditCard, label: "Fee dues", q: "What is the total pending fee amount?", color: "from-orange-500 to-amber-600" },
  { icon: Users, label: "Teachers", q: "How many teachers do we have?", color: "from-purple-500 to-violet-600" },
  { icon: BookOpen, label: "Classes", q: "Give me an overview of all classes", color: "from-rose-500 to-pink-600" },
  { icon: Bell, label: "Notices", q: "List all recent notices", color: "from-cyan-500 to-teal-600" },
  { icon: BarChart3, label: "Overview", q: "Give me a complete school data summary", color: "from-indigo-500 to-blue-600" },
  { icon: Zap, label: "Quick stats", q: "Show me today's key statistics", color: "from-yellow-500 to-orange-500" },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary/70 inline-block"
          style={{ animation: `aiBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, index }: { msg: Message; index: number }) {
  const isAI = msg.role === "ai";
  return (
    <div
      className={`flex gap-3 items-end ${isAI ? "" : "flex-row-reverse"}`}
      style={{ animation: `aiSlideIn 0.3s ease-out ${index * 0.04}s both` }}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
        isAI
          ? "bg-gradient-to-br from-primary to-primary/80 text-white"
          : "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
      }`}>
        {isAI ? <Sparkles className="w-4 h-4" /> : <User className="w-3.5 h-3.5" />}
      </div>

      <div className={`max-w-[78%] group`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap relative ${
          isAI
            ? "bg-card text-foreground rounded-bl-sm border border-border"
            : "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-sm shadow-lg shadow-primary/20"
        }`}>
          {msg.content}
          {isAI && (
            <div className="absolute -top-1 -left-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>
        <p className={`text-[10px] mt-1 text-muted-foreground ${isAI ? "pl-1" : "text-right pr-1"}`}>
          {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const { user } = useAuth();
  const schoolId = user?.schoolId || 1;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! I'm your School AI Assistant 🎓\n\nI have access to your school's live data — students, attendance, fees, teachers, classes, and notices. Ask me anything and I'll fetch real-time answers for you!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = useCallback(async (query?: string) => {
    const q = (query || input).trim();
    if (!q || isThinking) return;
    setInput("");
    setShowSuggested(false);
    setMessages(prev => [...prev, { role: "user", content: q, timestamp: new Date() }]);
    setIsThinking(true);

    try {
      const res = await fetch(`${BASE}/api/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ schoolId, query: q }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "ai",
        content: data.answer || "I couldn't find information for that query. Try asking about students, fees, attendance, or teachers.",
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "Sorry, I encountered an error while fetching your school data. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isThinking, schoolId]);

  const clearChat = () => {
    setMessages([{
      role: "ai",
      content: "Hello! I'm your School AI Assistant 🎓\n\nI have access to your school's live data — students, attendance, fees, teachers, classes, and notices. Ask me anything!",
      timestamp: new Date(),
    }]);
    setShowSuggested(true);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const queriesAnswered = messages.filter(m => m.role === "ai").length - 1;

  return (
    <AdminLayout title="AI Assistant" links={adminLinks}>
      <style>{`
        @keyframes aiSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes aiBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes aiFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(2deg); }
          66% { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes aiPulseRing {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes aiGrad {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes aiOrb {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(20px,-15px) scale(1.1); }
          66% { transform: translate(-10px,10px) scale(0.95); }
        }
      `}</style>

      <div className="flex flex-col h-[calc(100dvh-6rem)] max-w-4xl mx-auto">

        {/* ─── Hero Header ─────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden mb-4 shrink-0 shadow-xl shadow-primary/20">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 40%, #0ea5e9 80%, #1d4ed8 100%)",
              backgroundSize: "300% 300%",
              animation: "aiGrad 7s ease infinite",
            }}
          />
          {/* Animated orbs */}
          <div className="absolute top-2 right-12 w-28 h-28 rounded-full bg-white/10 blur-2xl"
            style={{ animation: "aiOrb 8s ease-in-out infinite" }} />
          <div className="absolute bottom-0 left-10 w-20 h-20 rounded-full bg-violet-400/20 blur-xl"
            style={{ animation: "aiOrb 10s ease-in-out 2s infinite" }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          {/* Floating particles */}
          <div className="absolute top-3 right-28 w-5 h-5 rounded-full bg-yellow-300/60"
            style={{ animation: "aiFloat 4s ease-in-out infinite" }} />
          <div className="absolute bottom-4 right-14 w-3 h-3 rounded-full bg-pink-300/70"
            style={{ animation: "aiFloat 5.5s ease-in-out 1s infinite" }} />
          <div className="absolute top-6 left-32 w-2.5 h-2.5 rounded-full bg-cyan-300/60"
            style={{ animation: "aiFloat 6s ease-in-out 0.5s infinite" }} />

          <div className="relative px-6 py-5 flex items-center gap-5">
            {/* Bot icon with pulse rings */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-white/30"
                style={{ animation: "aiPulseRing 2s ease-out infinite" }} />
              <div className="absolute inset-0 rounded-2xl bg-white/20"
                style={{ animation: "aiPulseRing 2s ease-out 0.6s infinite" }} />
              <div
                className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl"
                style={{ animation: "aiFloat 3s ease-in-out infinite" }}
              >
                <Bot className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-xl font-black text-white tracking-tight">MySchool AI</h2>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-400/20 border border-emerald-300/40 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-200">LIVE DATA</span>
                </span>
              </div>
              <p className="text-sm text-white/75">Connected to your school's real-time database</p>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {/* Stat pill */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <MessageSquare className="w-4 h-4 text-white/70" />
                <div>
                  <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Answered</p>
                  <p className="text-white font-black text-sm">{queriesAnswered > 0 ? queriesAnswered : "—"}</p>
                </div>
              </div>
              {/* Clear button */}
              {queriesAnswered > 0 && (
                <button
                  onClick={clearChat}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white/80 hover:text-white text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  New Chat
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Chat Area ───────────────────────────────── */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-secondary/10 backdrop-blur-sm p-4 space-y-4 scroll-smooth">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} index={i} />
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex gap-3 items-end" style={{ animation: "aiSlideIn 0.3s ease-out both" }}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <TypingDots />
                  <span className="text-xs text-muted-foreground font-medium">Querying school database...</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggested questions — shown only at start */}
          {showSuggested && messages.length === 1 && !isThinking && (
            <div style={{ animation: "aiSlideIn 0.4s ease-out 0.15s both" }}>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-yellow-500" /> Quick questions to get started
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED.map(({ icon: Icon, label, q, color }) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground">{label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{q}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ─── Input Bar ───────────────────────────────── */}
        <div className="mt-3 shrink-0">
          <form
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            className="flex gap-3 p-3 rounded-2xl bg-card border border-border shadow-lg shadow-black/5"
          >
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about attendance, fees, students, teachers..."
                disabled={isThinking}
                className="w-full h-11 rounded-xl px-4 bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all disabled:opacity-60"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                >✕</button>
              )}
            </div>
            <Button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="h-11 px-5 rounded-xl font-bold shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 shrink-0"
            >
              {isThinking
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Send className="w-5 h-5" />}
            </Button>
          </form>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            AI queries your school's live database · All answers reflect real data
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
