import { useState, useEffect, useRef } from "react";
import { Search, X, School, CalendarDays, Briefcase, BookOpen, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

interface Result {
  type: "school" | "event" | "job" | "tutor" | "news";
  id: string;
  title: string;
  subtitle: string;
  link: string;
}

const icons = { school: School, event: CalendarDays, job: Briefcase, tutor: BookOpen, news: Newspaper };

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      const q = `%${query}%`;
      const [schools, events, jobs, tutors, news] = await Promise.all([
        supabase.from("schools").select("id,slug,name,location").ilike("name", q).limit(3),
        supabase.from("events").select("id,title,location").ilike("title", q).limit(3),
        supabase.from("jobs").select("id,title,school_name").ilike("title", q).limit(3),
        supabase.from("tutors").select("id,name,subject").ilike("name", q).limit(3),
        supabase.from("news").select("id,title,category").ilike("title", q).limit(3),
      ]);
      const r: Result[] = [
        ...(schools.data || []).map((s) => ({ type: "school" as const, id: s.id, title: s.name, subtitle: s.location, link: `/school/${s.slug}` })),
        ...(events.data || []).map((e) => ({ type: "event" as const, id: e.id, title: e.title, subtitle: e.location, link: `/event/${e.id}` })),
        ...(jobs.data || []).map((j) => ({ type: "job" as const, id: j.id, title: j.title, subtitle: j.school_name, link: `/jobs` })),
        ...(tutors.data || []).map((t) => ({ type: "tutor" as const, id: t.id, title: t.name, subtitle: t.subject, link: `/tutor/${t.id}` })),
        ...(news.data || []).map((n) => ({ type: "news" as const, id: n.id, title: n.title, subtitle: n.category, link: `/news/${n.id}` })),
      ];
      setResults(r);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const go = (link: string) => { navigate(link); setOpen(false); setQuery(""); };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline">Search</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-[360px] bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50"
          >
            <div className="relative p-3 border-b border-border/30">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search schools, events, jobs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-8 h-10 rounded-xl bg-muted/30 border-0 focus-visible:ring-1"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>
              )}
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {results.length === 0 && query.length >= 2 && !loading && (
                <p className="text-center text-sm text-muted-foreground py-8">No results found</p>
              )}
              {results.map((r) => {
                const Icon = icons[r.type];
                return (
                  <button key={`${r.type}-${r.id}`} onClick={() => go(r.link)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">{r.type}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
