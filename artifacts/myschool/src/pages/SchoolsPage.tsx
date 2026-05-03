import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, SlidersHorizontal, X, Map, Grid3X3, Loader2, Sparkles, TrendingUp, Users, Award, GraduationCap, Star, Shield, CheckCircle, BarChart3, ChevronDown, Filter } from "lucide-react";
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

const ITEMS_PER_PAGE = 9;

function SectionHeader({ badge, title, highlight, description }: { badge: string; title: string; highlight: string; description: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <div ref={ref} className="text-center mb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 mb-6 text-sm font-bold text-primary">
        <Sparkles className="h-4 w-4" />
        {badge}
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-foreground">
        {title} <span className="text-gradient">{highlight}</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium leading-relaxed">{description}</motion.p>
    </div>
  );
}

export default function SchoolsPage() {
  const { data: schools = [], isLoading } = useSchools();
  const [search, setSearch] = useState("");
  const [board, setBoard] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [maxFee, setMaxFee] = useState(500000);
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
      const aFeatured = (a as any).is_featured ? 1 : 0;
      const bFeatured = (b as any).is_featured ? 1 : 0;
      if (bFeatured !== aFeatured) return bFeatured - aFeatured;
      if (sortBy === "rating") return Number(b.rating) - Number(a.rating);
      if (sortBy === "fees-low") return parseFee(a.fees) - parseFee(b.fees);
      if (sortBy === "fees-high") return parseFee(b.fees) - parseFee(a.fees);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return result;
  }, [schools, search, board, maxFee, minRating, sortBy]);

  const paginated = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const boards = [...new Set(schools.map((s) => s.board))];

  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); }, [search, board, maxFee, minRating, sortBy]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount((c) => c + ITEMS_PER_PAGE); },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  const resetFilters = () => { setSearch(""); setBoard("all"); setMaxFee(500000); setMinRating(0); setSortBy("rating"); setVisibleCount(ITEMS_PER_PAGE); };

  const mapSchool = (s: (typeof schools)[0]) => ({
    id: s.id, slug: s.slug, name: s.name, location: s.location,
    lat: s.lat, lng: s.lng, rating: Number(s.rating), reviewCount: s.review_count ?? 0,
    fees: s.fees, board: s.board, description: s.description, banner: s.banner,
    about: s.about, facilities: s.facilities ?? [], gallery: s.gallery ?? [], achievements: s.achievements ?? [],
    is_verified: (s as any).is_verified ?? false,
  });

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* === HEADER === */}
      <div className="bg-card border-b border-border/50 pt-24 pb-12 lg:pt-32 lg:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-50 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            Explore <span className="text-gradient">Schools</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto mb-10">
            Find the perfect environment for your child's growth. Compare top schools based on verified parent reviews, fees, and facilities.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-background rounded-2xl p-2 border border-border/60 shadow-xl shadow-black/5 flex items-center gap-2 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <Search className="h-5 w-5 text-muted-foreground ml-4 shrink-0" />
            <Input
              placeholder="Search by school name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-0 h-12 text-base shadow-none focus-visible:ring-0 px-2"
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
            <Button className="h-12 px-8 rounded-xl font-bold gradient-primary shadow-md shrink-0">Search</Button>
          </div>
        </div>
      </div>

      {/* === FILTERS & CONTENT === */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters (Desktop) / Sliding Filter (Mobile) */}
          <div className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-3xl border border-border/60 p-6 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-lg flex items-center gap-2"><Filter className="h-5 w-5 text-primary" /> Filters</h3>
                <button onClick={resetFilters} className="text-xs font-bold text-primary hover:underline">Reset</button>
              </div>

              <div className="space-y-8">
                {/* Board */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Board</Label>
                  <Select value={board} onValueChange={setBoard}>
                    <SelectTrigger className="w-full h-12 rounded-xl bg-background border-border/60"><SelectValue placeholder="All Boards" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Boards</SelectItem>
                      {boards.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fees */}
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between">
                    <span>Max Annual Fees</span>
                    <span className="text-foreground">₹{(maxFee/100000).toFixed(1)}L</span>
                  </Label>
                  <Slider value={[maxFee]} onValueChange={([v]) => setMaxFee(v)} max={500000} min={50000} step={25000} className="py-2" />
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Minimum Rating</Label>
                  <div className="bg-background rounded-xl p-3 border border-border/60 flex justify-center">
                    <StarRating rating={minRating} interactive onChange={(r) => setMinRating(r === minRating ? 0 : r)} size={24} />
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full h-12 rounded-xl bg-background border-border/60"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="fees-low">Lowest Fees</SelectItem>
                      <SelectItem value="fees-high">Highest Fees</SelectItem>
                      <SelectItem value="name">A-Z Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4 bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
              <p className="font-bold text-foreground">
                Showing <span className="text-primary">{filtered.length}</span> schools
              </p>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" className="lg:hidden rounded-xl font-bold gap-2" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" /> Filters
                </Button>
                
                <div className="flex bg-muted/30 p-1 rounded-xl border border-border/50">
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button onClick={() => setViewMode("map")} className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Map className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-card rounded-3xl border border-border/50">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="font-bold text-muted-foreground">Loading schools...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-card rounded-3xl border border-border/50 text-center px-4">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground mb-2">No schools found</h3>
                <p className="text-muted-foreground font-medium mb-6">Try adjusting your filters or search term to find what you're looking for.</p>
                <Button onClick={resetFilters} className="rounded-xl gradient-primary font-bold">Reset Filters</Button>
              </div>
            ) : (
              <>
                {viewMode === "map" ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[70vh] rounded-3xl overflow-hidden border border-border/60 shadow-lg">
                    <SchoolMap schools={filtered.map(mapSchool)} />
                  </motion.div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {paginated.map((school, i) => (
                        <SchoolCard key={school.id} school={mapSchool(school)} index={i} />
                      ))}
                    </div>
                    {hasMore && (
                      <div ref={loadMoreRef} className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}