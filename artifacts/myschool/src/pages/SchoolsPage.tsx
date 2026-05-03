import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, SlidersHorizontal, X, Map, Grid3X3, ChevronLeft, ChevronRight, Loader2, Sparkles, TrendingUp, Users, Award, GraduationCap, ArrowRight, Star, Shield, BookOpen, CheckCircle, Zap, Heart, Globe, Target, BarChart3, MessageSquare, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import SchoolCard from "@/components/SchoolCard";
import SchoolMap from "@/components/SchoolMap";
import StarRating from "@/components/StarRating";
import { useSchools } from "@/hooks/useData";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

const stats = [
  { icon: GraduationCap, value: "500+", label: "Schools Listed", suffix: "" },
  { icon: Users, value: "1M+", label: "Students Enrolled", suffix: "" },
  { icon: Award, value: "98%", label: "Parent Satisfaction", suffix: "" },
  { icon: TrendingUp, value: "4.8", label: "Average Rating", suffix: "/5" },
];

const features = [
  { icon: Search, title: "Smart Discovery", desc: "AI-powered recommendations that match your child's unique needs and learning style.", color: "from-blue-500 to-cyan-500" },
  { icon: Star, title: "Verified Reviews", desc: "Authentic reviews from real parents. No fake ratings, no sponsored placements.", color: "from-amber-500 to-orange-500" },
  { icon: Shield, title: "Trusted & Verified", desc: "Every school undergoes our rigorous verification process for quality assurance.", color: "from-emerald-500 to-teal-500" },
  { icon: GraduationCap, title: "One-Click Apply", desc: "Apply to multiple schools with a single form. Track status in real-time.", color: "from-violet-500 to-purple-500" },
];

const howItWorks = [
  { step: "01", title: "Search & Filter", desc: "Browse schools by location, board, fees, and ratings. Our smart filters narrow down the best options.", icon: Search },
  { step: "02", title: "Compare Schools", desc: "View detailed profiles, read reviews, explore facilities, and compare schools side by side.", icon: BarChart3 },
  { step: "03", title: "Apply Online", desc: "Submit your admission application directly. No paperwork, no queues, no hassle.", icon: CheckCircle },
];

const testimonials = [
  { name: "Priya Sharma", role: "Parent of 2", text: "MySchool made finding the right school for my kids so easy. The reviews from other parents were incredibly helpful.", avatar: "PS", rating: 5 },
  { name: "Rahul Verma", role: "Parent", text: "I compared 15 schools in one afternoon. The filter system is brilliant. Saved us weeks of research.", avatar: "RV", rating: 5 },
  { name: "Anjali Patel", role: "Parent of 3", text: "The online admission process was seamless. Applied to 3 schools and got confirmation within days.", avatar: "AP", rating: 5 },
];

const partners = ["CBSE", "ICSE", "IB", "Cambridge", "State Board", "IGCSE"];

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return <span className="tabular-nums">{value}{suffix}</span>;
}

function SectionHeader({ badge, title, highlight, description }: { badge: string; title: string; highlight: string; description: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <div ref={ref} className="text-center mb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{badge}</span>
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
        {title} <span className="text-gradient">{highlight}</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">{description}</motion.p>
    </div>
  );
}

export default function SchoolsPage() {
  const { data: schools = [], isLoading } = useSchools();
  const [search, setSearch] = useState("");
  const [board, setBoard] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [maxFee, setMaxFee] = useState(300000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const parseFee = (fee: string) => parseInt(fee.replace(/[^0-9]/g, "")) || 0;

  const filtered = useMemo(() => {
    let result = schools.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase());
      const matchBoard = board === "all" || s.board === board;
      const matchFee = parseFee(s.fees) <= maxFee;
      const matchRating = Number(s.rating) >= minRating;
      return matchSearch && matchBoard && matchFee && matchRating;
    });
    result.sort((a, b) => {
      // Featured schools always first
      const aFeatured = (a as any).is_featured ? 1 : 0;
      const bFeatured = (b as any).is_featured ? 1 : 0;
      if (bFeatured !== aFeatured) return bFeatured - aFeatured;
      if (sortBy === "rating") return Number(b.rating) - Number(a.rating);
      if (sortBy === "fees-low") return parseFee(a.fees) - parseFee(b.fees);
      if (sortBy === "fees-high") return parseFee(b.fees) - parseFee(a.fees);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "reviews") return (b.review_count ?? 0) - (a.review_count ?? 0);
      return 0;
    });
    return result;
  }, [schools, search, board, maxFee, minRating, sortBy]);

  const paginated = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const boards = [...new Set(schools.map((s) => s.board))];

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [search, board, maxFee, minRating, sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount((c) => c + ITEMS_PER_PAGE); },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  const resetFilters = () => { setSearch(""); setBoard("all"); setMaxFee(300000); setMinRating(0); setSortBy("rating"); setVisibleCount(ITEMS_PER_PAGE); };

  const mapSchool = (s: (typeof schools)[0]) => ({
    id: s.id, slug: s.slug, name: s.name, location: s.location,
    lat: s.lat, lng: s.lng, rating: Number(s.rating), reviewCount: s.review_count ?? 0,
    fees: s.fees, board: s.board, description: s.description, banner: s.banner,
    about: s.about, facilities: s.facilities ?? [], gallery: s.gallery ?? [], achievements: s.achievements ?? [],
    is_verified: (s as any).is_verified ?? false,
  });

  return (
    <div className="min-h-screen">
      {/* === HERO === */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.15)_0%,_transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/8 rounded-full blur-[100px] animate-blob" />
          <div className="absolute top-40 right-[15%] w-96 h-96 bg-secondary/6 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-10 left-[40%] w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(hsl(222_20%_16%/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(222_20%_16%/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
              {schools.length > 0 ? `${schools.length} schools available` : "Discover schools near you"}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[1.05] tracking-tight">
            Find the <br className="hidden md:block" />
            <span className="text-gradient">Perfect School</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Compare ratings, read verified reviews, and apply to top-rated schools — all in one place. Trusted by over <span className="text-foreground font-semibold">1 million</span> parents.
          </motion.p>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by school name or location..."
                  value={search}
                 onChange={(e) => { setSearch(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                  className="pl-14 pr-28 h-16 text-base bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button className="absolute right-2 h-12 px-6 rounded-xl gradient-primary border-0 shadow-lg shadow-primary/25 font-semibold">
                  Search
                </Button>
              </div>
            </div>
            {search && (
              <button onClick={() => setSearch("")} className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto">
                <X className="h-3 w-3" /> Clear search
              </button>
            )}
          </motion.div>

          {/* Board Tags */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <span className="text-xs text-muted-foreground/60 mr-2">Popular:</span>
            {boards.slice(0, 5).map((b) => (
              <button
                key={b}
                onClick={() => { setBoard(board === b ? "all" : b); setVisibleCount(ITEMS_PER_PAGE); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${board === b ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105" : "bg-card/60 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}
              >
                {b}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === STATS TICKER === */}
      <section className="relative z-20 -mt-6 mb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-2xl overflow-hidden border border-border/40 bg-card/50 backdrop-blur-xl">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`relative p-6 md:p-8 text-center group hover:bg-primary/5 transition-colors duration-300 ${i < 2 ? "border-r border-border/30" : ""} ${i === 2 ? "md:border-r md:border-border/30" : ""} ${i < 2 ? "border-b border-border/30 md:border-b-0" : ""}`}>
                <stat.icon className="h-5 w-5 mx-auto mb-3 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === SCHOOL LISTINGS === */}
      <div className="container mx-auto px-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Explore Schools</h2>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} schools match your criteria</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={showFilters ? "default" : "outline"} size="sm" onClick={() => setShowFilters(!showFilters)} className="rounded-xl border-border/60 gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters {showFilters && <X className="h-3 w-3" />}
            </Button>
            <div className="flex border border-border/60 rounded-xl overflow-hidden">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" className="rounded-none px-3" onClick={() => setViewMode("grid")}><Grid3X3 className="h-4 w-4" /></Button>
              <Button variant={viewMode === "map" ? "default" : "ghost"} size="sm" className="rounded-none px-3" onClick={() => setViewMode("map")}><Map className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mb-8">
              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Board</Label>
                    <Select value={board} onValueChange={(v) => { setBoard(v); setVisibleCount(ITEMS_PER_PAGE); }}>
                      <SelectTrigger className="rounded-xl bg-accent/30 border-border/40"><SelectValue placeholder="All Boards" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Boards</SelectItem>
                        {boards.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="rounded-xl bg-accent/30 border-border/40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rating</SelectItem>
                        <SelectItem value="reviews">Most Reviews</SelectItem>
                        <SelectItem value="fees-low">Fees: Low → High</SelectItem>
                        <SelectItem value="fees-high">Fees: High → Low</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Fees: ₹{maxFee.toLocaleString()}/yr</Label>
                    <Slider value={[maxFee]} onValueChange={([v]) => { setMaxFee(v); setVisibleCount(ITEMS_PER_PAGE); }} max={300000} min={50000} step={5000} className="mt-3" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Rating: {minRating > 0 ? minRating : "Any"}</Label>
                    <div className="pt-1"><StarRating rating={minRating} interactive onChange={(r) => { setMinRating(r === minRating ? 0 : r); setVisibleCount(ITEMS_PER_PAGE); }} size={22} /></div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="rounded-xl text-xs text-muted-foreground hover:text-foreground">Reset All Filters</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading schools...</p>
          </div>
        ) : (
          <>
            {viewMode === "map" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8"><SchoolMap schools={filtered.map(mapSchool)} /></motion.div>}
            {viewMode === "grid" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {paginated.map((school, i) => <SchoolCard key={school.id} school={mapSchool(school)} index={i} />)}
                </div>
                {filtered.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <div className="text-6xl mb-4">🏫</div>
                    <p className="text-muted-foreground text-lg mb-2">No schools match your criteria.</p>
                    <Button variant="link" onClick={resetFilters} className="text-primary">Reset filters</Button>
                  </motion.div>
                )}
                {hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
                {!hasMore && filtered.length > ITEMS_PER_PAGE && (
                  <p className="text-center text-sm text-muted-foreground py-6">All {filtered.length} schools loaded</p>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* === WHY MYSCHOOL === */}
      <section className="container mx-auto px-4 py-28">
        <SectionHeader badge="Why Us" title="Why Parents Choose" highlight="MySchool" description="We're not just a directory — we're a complete ecosystem built to simplify the most important decision you'll make for your child." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <div className="h-full p-7 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all duration-500">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-3 text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(217_91%_60%/0.08)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader badge="Process" title="How It" highlight="Works" description="Three simple steps to finding the perfect school for your child." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center group"
              >
                {i < 2 && <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />}
                <div className="relative mx-auto mb-6">
                  <div className="h-24 w-24 rounded-2xl bg-card border border-border/40 flex items-center justify-center mx-auto group-hover:border-primary/30 transition-colors duration-300">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30">{item.step}</span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="container mx-auto px-4 py-28">
        <SectionHeader badge="Testimonials" title="What Parents" highlight="Say" description="Real stories from real parents who found their perfect school through MySchool." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-7 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-md">{t.avatar}</div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === SUPPORTED BOARDS === */}
      <section className="py-20 border-y border-border/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">Schools from all major boards</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {partners.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="px-8 py-4 rounded-xl bg-card/40 border border-border/30 text-muted-foreground font-bold text-lg hover:text-primary hover:border-primary/30 transition-all duration-300 cursor-default"
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === NUMBERS === */}
      <section className="container mx-auto px-4 py-28">
        <SectionHeader badge="Impact" title="Our" highlight="Numbers" description="We're growing every day, helping parents across India make better education choices." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Schools", icon: GraduationCap },
            { value: "50K+", label: "Applications", icon: Target },
            { value: "1M+", label: "Parents Reached", icon: Globe },
            { value: "25+", label: "Cities", icon: MapPin },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl bg-card/40 border border-border/30 hover:border-primary/20 transition-colors duration-300"
            >
              <item.icon className="h-6 w-6 mx-auto mb-3 text-primary" />
              <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === CTA === */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-12 md:p-20"
        >
          <div className="absolute inset-0 gradient-primary" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-6 leading-tight">Ready to Find the<br />Perfect School?</h2>
            <p className="text-primary-foreground/80 text-lg mb-10 leading-relaxed">Join thousands of parents who trust MySchool to make the best education choice for their children.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="rounded-xl bg-white text-primary hover:bg-white/90 shadow-xl font-semibold h-14 px-8 text-base">
                  Get Started Free <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-xl border-white/30 text-primary-foreground hover:bg-white/10 h-14 px-8" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Browse Schools
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
