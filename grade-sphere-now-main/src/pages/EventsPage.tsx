import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Search, X, ChevronLeft, ChevronRight, Loader2, CalendarDays, Clock, Users, ArrowUpRight } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvents, useSchools } from "@/hooks/useData";

const PER_PAGE = 6;

export default function EventsPage() {
  const { data: events = [], isLoading } = useEvents();
  const { data: schools = [] } = useSchools();
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => events.filter((e) => {
    const matchSchool = schoolFilter === "all" || e.school_id === schoolFilter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    const isPublic = (e as any).is_public !== false;
    return matchSchool && matchSearch && isPublic;
  }), [events, schoolFilter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const featured = paginated[0];
  const rest = paginated.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-24 right-[25%] w-72 h-72 bg-primary/6 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-10 left-[30%] w-60 h-60 bg-secondary/5 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <CalendarDays className="h-3.5 w-3.5" /> Upcoming Events
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold mb-5">
            School <span className="text-gradient">Events</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Discover exciting events happening across top schools
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
              <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search events..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-14 h-14 bg-transparent border-0 shadow-none focus-visible:ring-0" />
            </div>
            {search && <button onClick={() => setSearch("")} className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"><X className="h-3 w-3" />Clear</button>}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground">All Events</h2>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} upcoming events</p>
          </div>
          <Select value={schoolFilter} onValueChange={(v) => { setSchoolFilter(v); setPage(1); }}>
            <SelectTrigger className="w-52 rounded-xl bg-card/60 border-border/30"><SelectValue placeholder="Filter by school" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="flex flex-col items-center py-20 gap-3"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div> : (
          <>
            {/* Featured Event */}
            {featured && page === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <Link to={`/event/${featured.id}`}>
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer border border-border/30 hover:border-primary/20 transition-all">
                  <div className="relative aspect-[21/9] overflow-hidden">
                    <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg text-xs font-semibold mb-3">{featured.school_name}</Badge>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                    <div className="flex items-center gap-5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{featured.event_date}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" />{featured.location}</span>
                    </div>
                  </div>
                </div>
                </Link>
              </motion.div>
            )}

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(page === 1 ? rest : paginated).map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -6, transition: { duration: 0.3 } }} className="group">
                  <Link to={`/event/${event.id}`}>
                  <div className="h-full rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/20 transition-all duration-300 flex flex-col">
                    <div className="relative overflow-hidden aspect-video">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-card/60 backdrop-blur-sm text-foreground border-border/30 font-semibold text-xs">{event.school_name}</Badge>
                      <div className="absolute bottom-3 left-3">
                        <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-border/20 shadow-md">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-semibold text-foreground">{event.event_date}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4 pb-5 space-y-3 flex-1 flex flex-col">
                      <h3 className="font-bold text-base group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary" />{event.location}</div>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2 flex-1">{event.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border/20">
                        <span className="text-xs text-muted-foreground">Open to public</span>
                        <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
        {filtered.length === 0 && !isLoading && <div className="text-center py-20"><CalendarDays className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" /><p className="text-muted-foreground">No events found.</p></div>}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-xl border-border/30"><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl ${page === i + 1 ? "shadow-lg shadow-primary/30" : "border-border/30"}`}>{i + 1}</Button>)}
            <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border-border/30"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
