import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Calendar, MapPin, Search, Loader2, School, ChevronRight, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  cultural: { color: "bg-purple-100 text-purple-700", label: "Cultural" },
  sports: { color: "bg-green-100 text-green-700", label: "Sports" },
  academic: { color: "bg-blue-100 text-blue-700", label: "Academic" },
  holiday: { color: "bg-orange-100 text-orange-700", label: "Holiday" },
  exam: { color: "bg-red-100 text-red-700", label: "Exam" },
  general: { color: "bg-gray-100 text-gray-700", label: "General" },
  ptm: { color: "bg-yellow-100 text-yellow-700", label: "PTM" },
};

export default function PublicEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    fetch(`${BASE}/api/events/public?limit=50`)
      .then(r => r.json())
      .then(d => setEvents(d.events || []))
      .finally(() => setLoading(false));
  }, []);

  const types = ["all", ...Array.from(new Set(events.map(e => e.type).filter(Boolean)))];
  const cities = Array.from(new Set(events.map(e => e.city).filter(Boolean)));

  const filtered = events.filter(e => {
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.schoolName?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || e.type === typeFilter;
    const matchCity = !cityFilter || e.city === cityFilter;
    return matchSearch && matchType && matchCity;
  });

  const upcoming = filtered.filter(e => new Date(e.date) >= new Date());
  const past = filtered.filter(e => new Date(e.date) < new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/schools">
            <Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div className="flex items-center gap-2 text-primary font-black text-xl">
            <School className="w-5 h-5" /> MySchool Events
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">What's Happening Near You</h1>
          <p className="text-muted-foreground">Discover events, fests, exams, and sports days from top schools across India</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events or schools..." className="pl-9 rounded-xl" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${typeFilter === t ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {t === "all" ? "All Types" : TYPE_CONFIG[t]?.label || t}
              </button>
            ))}
          </div>
          {cities.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="text-sm bg-transparent border-none outline-none text-muted-foreground cursor-pointer">
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-xl font-bold text-muted-foreground">No events found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-black mb-4 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />Upcoming Events ({upcoming.length})
                </h2>
                <div className="space-y-3">
                  {upcoming.map(event => <EventCard key={event.id} event={event} />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-lg font-black mb-4 text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5" />Past Events ({past.length})
                </h2>
                <div className="space-y-3 opacity-70">
                  {past.slice(0, 10).map(event => <EventCard key={event.id} event={event} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const typeCfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.general;
  const isPast = new Date(event.date) < new Date();
  return (
    <Card className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-all dark:bg-gray-800 dark:border-gray-700">
      <div className="flex gap-4">
        {/* Date block */}
        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 ${isPast ? "bg-gray-100 dark:bg-gray-700" : "bg-primary/10"}`}>
          <p className={`text-xs font-bold uppercase ${isPast ? "text-muted-foreground" : "text-primary"}`}>
            {event.date ? new Date(event.date).toLocaleDateString("en-IN", { month: "short" }) : ""}
          </p>
          <p className={`text-2xl font-black leading-tight ${isPast ? "text-muted-foreground" : "text-primary"}`}>
            {event.date ? new Date(event.date).getDate() : ""}
          </p>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeCfg.color}`}>{typeCfg.label}</span>
                {isPast && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">Past</span>}
              </div>
              <p className="font-black dark:text-white">{event.title}</p>
              {event.schoolName && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <School className="w-3 h-3" />{event.schoolName}
                </p>
              )}
              {event.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {event.date && <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(event.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</p>}
            {event.city && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{event.city}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
}
