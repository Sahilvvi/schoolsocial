import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Search, X, ChevronLeft, ChevronRight, Loader2, CalendarDays, Clock, Users, ArrowUpRight, Ticket, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEvents, useSchools } from "@/hooks/useData";

const PER_PAGE = 6;

const EVENT_COLORS = [
  { bg: "from-orange-500 to-orange-600", light: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400" },
  { bg: "from-blue-600 to-indigo-600",   light: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400"    },
  { bg: "from-emerald-500 to-teal-600",  light: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400" },
  { bg: "from-rose-500 to-pink-600",     light: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400"     },
  { bg: "from-purple-500 to-violet-600", light: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400" },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function EventsPage() {
  const { data: events = [], isLoading } = useEvents();
  const { data: schools = [] } = useSchools();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const schoolMap = useMemo(() => {
    const m: Record<string, string> = {};
    schools.forEach((s) => { m[s.id] = s.name; });
    return m;
  }, [schools]);

  const filtered = useMemo(() => events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    const isPublic = (e as any).is_public !== false;
    return matchSearch && isPublic;
  }), [events, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const featured = paginated[0];
  const rest = paginated.slice(1);

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 mesh-gradient">
        <div className="absolute top-24 right-[15%] w-80 h-80 bg-purple-500/8 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-10 left-[20%] w-64 h-64 bg-primary/6 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/8 px-5 py-2 text-sm font-bold text-purple-600 dark:text-purple-400 mb-6">
            <CalendarDays className="h-4 w-4" /> School Events & Programs
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl xl:text-7xl font-extrabold mb-5 tracking-tight">
            Discover School <span className="text-gradient">Events</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto font-medium">
            Open days, cultural fests, admission events — all in one place
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
              <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search events..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-14 h-14 bg-transparent border-0 shadow-none focus-visible:ring-0 text-base" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 text-muted-foreground hover:text-foreground p-1 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20 pt-10">
        {isLoading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <div className="h-16 w-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
              <CalendarDays className="h-8 w-8 text-white" />
            </div>
            <p className="text-muted-foreground font-medium">Loading events...</p>
          </div>
        ) : (
          <>
            {/* Featured Event */}
            {featured && page === 1 && (
              <Reveal>
                <Link to={`/event/${featured.id}`}>
                  <motion.div whileHover={{ y: -4 }} className="mb-10 group">
                    <div className="grid md:grid-cols-[2fr_3fr] gap-0 rounded-3xl overflow-hidden bg-card border border-border/30 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-500">
                      <div className="relative min-h-[280px] overflow-hidden">
                        <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80"; }} />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                        {/* Date badge */}
                        <div className={`absolute top-5 left-5 bg-gradient-to-br ${EVENT_COLORS[0].bg} rounded-2xl px-4 py-3 text-center shadow-xl`}>
                          <p className="text-white text-3xl font-extrabold leading-none">{new Date(featured.event_date).getDate()}</p>
                          <p className="text-white/80 text-xs font-bold uppercase tracking-wide">{new Date(featured.event_date).toLocaleString("en-IN", { month: "short" })}</p>
                        </div>
                        <Badge className="absolute top-5 right-5 gradient-primary text-white border-0 shadow-lg font-bold">Featured</Badge>
                      </div>
                      <div className="p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Upcoming Highlight</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{featured.title}</h2>
                        <p className="text-muted-foreground leading-relaxed mb-5 line-clamp-2">{featured.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                          <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{new Date(featured.event_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
                          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />{featured.location}</span>
                          {(featured as any).attendees && <span className="flex items-center gap-2"><Users className="h-4 w-4 text-emerald-500" />{(featured as any).attendees}+ Attending</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="gradient-primary text-white font-bold text-sm rounded-xl px-6 py-3 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2">
                            <Ticket className="h-4 w-4" /> Register Now
                          </button>
                          <button className="border border-border/50 text-foreground font-bold text-sm rounded-xl px-6 py-3 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-2">
                            Learn More <ArrowUpRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </Reveal>
            )}

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(page === 1 ? rest : paginated).map((item, i) => {
                const colorSet = EVENT_COLORS[i % EVENT_COLORS.length];
                return (
                  <Reveal key={item.id} delay={i * 0.07}>
                    <Link to={`/event/${item.id}`}>
                      <motion.div whileHover={{ y: -8, scale: 1.01 }} className="group h-full rounded-2xl overflow-hidden bg-card border border-border/30 hover:border-primary/25 hover:shadow-xl transition-all duration-400 flex flex-col shadow-sm">
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-video">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=60"; }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          {/* Date badge floating */}
                          <div className={`absolute top-3 left-3 bg-gradient-to-br ${colorSet.bg} rounded-xl px-3 py-2 text-center shadow-lg`}>
                            <p className="text-white text-xl font-extrabold leading-none">{new Date(item.event_date).getDate()}</p>
                            <p className="text-white/80 text-[10px] font-bold uppercase">{new Date(item.event_date).toLocaleString("en-IN", { month: "short" })}</p>
                          </div>
                          <button onClick={(e) => { e.preventDefault(); }} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white shadow-md">
                            <Ticket className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-extrabold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-3">{item.title}</h3>
                          <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2 flex-1 mb-4">{item.description}</p>
                          <div className="flex items-center justify-between pt-3 border-t border-border/20">
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{new Date(item.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-secondary" /><span className="truncate max-w-[150px]">{item.location}</span></span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              Details <ArrowUpRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-24">
            <div className="h-20 w-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="font-bold text-foreground mb-2">No events found</p>
            <p className="text-muted-foreground text-sm">Try a different search term</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-xl border-border/40 h-11 w-11"><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}
                className={`w-11 h-11 rounded-xl ${page === i + 1 ? "gradient-primary border-0 shadow-lg shadow-primary/30" : "border-border/40"}`}>
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border-border/40 h-11 w-11"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
