import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  School, BookOpen, CalendarDays, Users, BarChart3, Newspaper,
  Star, MapPin, ArrowRight, Search, CheckCircle, Scale,
  MessageSquare, Clock, UserCircle, ThumbsUp, Bell,
  ChevronDown, Sparkles, GraduationCap, Zap, Shield,
  TrendingUp, BadgeCheck, ChevronRight
} from "lucide-react";
import { useSchools, useEvents, useNews } from "@/hooks/useData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SchoolFinderQuiz from "@/components/SchoolFinderQuiz";

const HERO_SCHOOL_BG = "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=90";
const MOBILE_STUDENT_URL = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80";

const QUICK_FILTERS = ["Nearby", "CBSE", "ICSE", "State Board", "Nursery", "Primary", "High School"];
const BOARDS = ["All Boards", "CBSE", "ICSE", "State Board", "IB", "IGCSE"];

const CHIP_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
  "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
];

const MARQUEE_ITEMS = [
  { label: "500+ Schools Listed",        icon: School,       color: "from-blue-500 to-blue-600"      },
  { label: "Govt. Verified Schools",     icon: BadgeCheck,   color: "from-emerald-500 to-teal-500"   },
  { label: "25,000+ Parents Trust Us",   icon: Users,        color: "from-purple-500 to-indigo-600"  },
  { label: "4.8★ Avg Rating",            icon: Star,         color: "from-amber-500 to-orange-500"   },
  { label: "300+ Tuition Centers",       icon: BookOpen,     color: "from-orange-500 to-rose-500"    },
  { label: "Free School Comparison",     icon: Scale,        color: "from-sky-500 to-cyan-600"       },
  { label: "200+ Events",                icon: CalendarDays, color: "from-violet-500 to-purple-600"  },
  { label: "Instant Apply",              icon: Zap,          color: "from-green-500 to-emerald-600"  },
];

const CATEGORIES = [
  { to: "/schools",   label: "Schools",   bg: "from-blue-500 to-blue-600",    icon: School,       glow: "shadow-blue-500/30"   },
  { to: "/tutors",    label: "Tuitions",  bg: "from-orange-500 to-orange-600", icon: BookOpen,    glow: "shadow-orange-500/30" },
  { to: "/compare",   label: "Compare",   bg: "from-emerald-500 to-teal-600",  icon: Scale,       glow: "shadow-emerald-500/30"},
  { to: "/events",    label: "Events",    bg: "from-purple-500 to-purple-600", icon: CalendarDays, glow: "shadow-purple-500/30" },
  { to: "/community", label: "Community", bg: "from-sky-500 to-cyan-600",      icon: Users,       glow: "shadow-sky-500/30"    },
  { to: "/news",      label: "Blogs",     bg: "from-rose-500 to-pink-600",     icon: Newspaper,   glow: "shadow-rose-500/30"   },
];

const STATS = [
  { icon: School,       label: "Schools Listed",    target: 500,  suffix: "+" },
  { icon: BookOpen,     label: "Tuition Centers",   target: 300,  suffix: "+" },
  { icon: Users,        label: "Parents Community", target: 25000,suffix: "+" },
  { icon: CalendarDays, label: "Events",            target: 200,  suffix: "+" },
  { icon: Star,         label: "Happy Parents",     target: 12000,suffix: "+" },
  { icon: Newspaper,    label: "Blog Articles",     target: 50,   suffix: "+" },
];

const COMMUNITY_POSTS = [
  { name: "Priya Sharma", role: "Parent", ago: "2h ago", initials: "PS", color: "from-pink-500 to-rose-500",
    text: "Looking for a good CBSE school in Loni area. Please suggest some best options.",
    tags: ["CBSE", "Loni", "Nursery - 5th"], likes: 15, comments: 23 },
  { name: "Rahul Verma", role: "Parent", ago: "4h ago", initials: "RV", color: "from-blue-500 to-indigo-500",
    text: "Which tuition center is best for Mathematics for class 10?",
    tags: ["Maths", "Class 10", "Coaching"], likes: 12, comments: 18 },
];

const EVENT_COLORS = [
  "from-orange-500 to-orange-600",
  "from-blue-600 to-blue-700",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-purple-500 to-violet-600",
];

function monthShort(d: string) { return new Date(d).toLocaleString("en-IN", { month: "short" }).toUpperCase(); }
function dayNum(d: string) { return new Date(d).getDate(); }

/* ─── Reveal wrapper ─────────────────────────────────── */
function Reveal({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { data: schools = [] } = useSchools();
  const { data: events = [] } = useEvents();
  const { data: news = [] } = useNews();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"schools" | "tuitions">("schools");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Loni, Ghaziabad");
  const [board, setBoard] = useState("All Boards");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const base = activeTab === "tuitions" ? "/tutors" : "/schools";
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery);
    if (board !== "All Boards") params.set("board", board);
    navigate(`${base}?${params.toString()}`);
  };

  const topSchools    = schools.slice(0, 8);
  const compareSchools = schools.slice(0, 3);
  const upcomingEvents = events.slice(0, 5);
  const latestBlogs    = news.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">

      {/* ════════════════════════════════════════════════════
          MOBILE LAYOUT
      ════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40 px-4 h-14 flex items-center justify-between shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-foreground text-lg tracking-tight">
              My<span className="text-gradient">School</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-muted/50 relative transition-colors">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-background" />
            </button>
            <Link to="/auth" className="gradient-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md shadow-primary/20 btn-shine">
              Sign In
            </Link>
          </div>
        </div>

        {/* Location Bar */}
        <div className="pt-14">
          <div className="px-4 py-2.5 border-b border-border/30 bg-muted/20">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{location}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60" />
            </button>
          </div>

          {/* Mobile Hero */}
          <div className="mesh-gradient px-4 pt-5 pb-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px]" />
            <div className="grid grid-cols-[1fr_auto] items-start gap-3 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary mb-3">
                  <Sparkles className="h-3 w-3" /> India's #1 School Discovery App
                </div>
                <h1 className="text-2xl font-extrabold text-foreground leading-tight mb-2">
                  Discover, <span className="text-gradient">Compare</span> &amp; Connect with the Best{" "}
                  <span className="text-gradient">Schools</span>
                </h1>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your child's bright future begins with the right choice.
                </p>
              </div>
              <div className="relative shrink-0 w-28 h-32">
                <div className="absolute inset-0 gradient-primary rounded-2xl opacity-20" />
                <img src={MOBILE_STUDENT_URL} alt="Student" className="absolute inset-0 w-full h-full object-cover object-top rounded-2xl" />
              </div>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 space-y-2.5 relative z-10">
              <div className="flex items-center gap-2 rounded-2xl border border-border/50 px-4 py-3 bg-card/90 backdrop-blur-sm shadow-lg">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input type="text" placeholder="Search schools, tuitions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm border-0 outline-none text-foreground placeholder:text-muted-foreground/60 bg-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-border/40 px-3 py-2.5 bg-card/70">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className="text-xs text-foreground border-0 outline-none bg-transparent flex-1">
                    <option>Loni, Ghaziabad</option><option>New Delhi</option><option>Noida</option><option>Gurgaon</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-border/40 px-3 py-2.5 bg-card/70">
                  <select value={board} onChange={(e) => setBoard(e.target.value)} className="text-xs text-foreground border-0 outline-none bg-transparent flex-1">
                    {BOARDS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full gradient-primary text-white font-bold text-sm rounded-full py-3.5 shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity btn-shine">
                Search Schools
              </button>
            </form>
          </div>

          {/* Mobile Category Icons */}
          <div className="px-4 py-5 border-t border-border/20">
            <div className="flex items-center justify-between gap-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link key={cat.label} to={cat.to} className="flex flex-col items-center gap-1.5 flex-1">
                    <motion.div whileTap={{ scale: 0.9 }} className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${cat.bg} shadow-lg ${cat.glow} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </motion.div>
                    <span className="text-[10px] font-bold text-foreground/80 text-center leading-tight">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_FILTERS.map((chip) => (
              <button key={chip} onClick={() => navigate(`/schools?q=${chip}`)}
                className="shrink-0 text-xs font-semibold text-primary border border-primary/30 bg-primary/5 rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors">
                {chip}
              </button>
            ))}
          </div>

          {/* Top Rated Schools */}
          <div className="border-t border-border/20 pt-5">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-base font-extrabold text-foreground">Top Rated Schools</h2>
              <Link to="/schools" className="text-xs font-bold text-primary flex items-center gap-0.5">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-4 no-scrollbar">
              {topSchools.map((school: any) => (
                <Link key={school.id} to={`/school/${school.slug}`} className="shrink-0 w-44">
                  <motion.div whileHover={{ y: -4 }} className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden">
                    <div className="relative h-24 overflow-hidden">
                      <img src={school.banner} alt={school.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80"; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-2 left-2 bg-white/95 text-primary text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm">{school.board}</span>
                    </div>
                    <div className="p-2.5">
                      <p className="font-extrabold text-xs text-foreground line-clamp-1 mb-0.5">{school.name}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1">
                        <MapPin className="h-2.5 w-2.5 shrink-0 text-primary" />
                        <span className="truncate">{school.location}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-foreground">{Number(school.rating).toFixed(1)}</span>
                        </div>
                        <span className="text-[10px] font-bold text-foreground">{school.fees}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Owner CTA Mobile */}
          <div className="mx-4 mb-5 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)" }}>
            <div className="p-5 flex items-center gap-4">
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <School className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-white text-sm leading-tight mb-0.5">School or Tuition Owner?</p>
                <p className="text-white/70 text-[11px] leading-snug mb-2">Get discovered by thousands of parents.</p>
                <Link to="/upload-school">
                  <button className="bg-white text-blue-700 text-[11px] font-extrabold rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm">
                    List Your Institution <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Events Mobile */}
          <div className="border-t border-border/20 pt-5 pb-2">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-base font-extrabold text-foreground">Upcoming Events</h2>
              <Link to="/events" className="text-xs font-bold text-primary flex items-center gap-0.5">View All <ChevronRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="px-4 space-y-3">
              {events.slice(0, 4).map((event: any, idx: number) => (
                <Link key={event.id} to="/events">
                  <motion.div whileHover={{ x: 4 }} className="flex gap-3 items-start p-3 rounded-2xl bg-card border border-border/30 shadow-sm">
                    <div className={`bg-gradient-to-br ${EVENT_COLORS[idx % EVENT_COLORS.length]} rounded-xl p-2 text-center min-w-[44px] shrink-0 shadow-sm`}>
                      <p className="text-white text-lg font-extrabold leading-none">{dayNum(event.event_date)}</p>
                      <p className="text-white/80 text-[9px] font-bold">{monthShort(event.event_date)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground line-clamp-1">{event.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-[11px] text-muted-foreground">{new Date(event.event_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-[11px] text-muted-foreground truncate">{event.location}</span>
                      </div>
                    </div>
                    <div className="shrink-0 h-14 w-16 rounded-xl overflow-hidden">
                      <img src={event.image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=200&q=60"; }} />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Community Mobile */}
          <div className="border-t border-border/20 pt-5 pb-4 mt-2">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-base font-extrabold text-foreground">Community</h2>
              <Link to="/community" className="text-xs font-bold text-primary flex items-center gap-0.5">View All <ChevronRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="px-4 space-y-3">
              {COMMUNITY_POSTS.map((post) => (
                <div key={post.name} className="bg-card rounded-2xl p-4 border border-border/30 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-sm`}>
                      {post.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{post.name}</p>
                      <p className="text-[10px] text-muted-foreground">{post.role} · {post.ago}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{post.text}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/15">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground border-t border-border/20 pt-2">
                    <button className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors"><ThumbsUp className="h-3.5 w-3.5" /> {post.likes}</button>
                    <button className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors"><MessageSquare className="h-3.5 w-3.5" /> {post.comments}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          DESKTOP LAYOUT
      ════════════════════════════════════════════════════ */}
      <div className="hidden lg:block">

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <section className="relative min-h-[88vh] flex items-center overflow-hidden pt-16">
          {/* Background */}
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-24 left-[10%] w-96 h-96 bg-primary/8 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-20 right-[5%] w-80 h-80 bg-secondary/6 rounded-full blur-[100px] animate-blob animation-delay-4000" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div className="py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-5 py-2 text-sm font-bold text-primary mb-8">
                  <Sparkles className="h-4 w-4" /> India's #1 School Discovery Platform
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl xl:text-7xl font-extrabold leading-[1.08] text-foreground mb-6 tracking-tight">
                  Find the Right{" "}
                  <span className="text-gradient">School</span>{" "}
                  or{" "}
                  <span className="text-gradient" style={{ background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Tuition
                  </span>{" "}
                  for Your Child
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-muted-foreground text-xl mb-8 leading-relaxed max-w-lg font-medium">
                  Explore, compare and connect with the best schools and tuition centers near you. Trusted by 25,000+ parents.
                </motion.p>

                {/* Tab Toggle */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                  className="flex gap-1 bg-muted/50 rounded-2xl p-1.5 w-fit mb-5 border border-border/40">
                  {(["schools", "tuitions"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl capitalize transition-all duration-300 ${
                        activeTab === tab
                          ? "gradient-primary text-white shadow-lg shadow-primary/30"
                          : "text-muted-foreground hover:text-foreground"
                      }`}>
                      {tab === "schools" ? <School className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </motion.div>

                {/* Search */}
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                  onSubmit={handleSearch} className="glass-card rounded-2xl flex items-center overflow-hidden shadow-xl mb-5 border border-border/30">
                  <div className="flex items-center gap-2 px-5 py-4 flex-1 min-w-0">
                    <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                    <input type="text" placeholder={activeTab === "tuitions" ? "Search tuition centers..." : "Search schools by name or area..."}
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 border-0 outline-none text-base text-foreground placeholder:text-muted-foreground/50 bg-transparent min-w-0" />
                  </div>
                  <div className="h-8 w-px bg-border/40 shrink-0" />
                  <div className="flex items-center gap-2 px-5 py-4 min-w-[160px]">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="border-0 outline-none text-sm text-foreground bg-transparent flex-1 cursor-pointer">
                      <option>Loni, Ghaziabad</option><option>New Delhi</option><option>Noida</option><option>Gurgaon</option>
                    </select>
                  </div>
                  <div className="h-8 w-px bg-border/40 shrink-0" />
                  <div className="flex items-center px-5 py-4 min-w-[130px]">
                    <select value={board} onChange={(e) => setBoard(e.target.value)} className="border-0 outline-none text-sm text-foreground bg-transparent cursor-pointer">
                      {BOARDS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="gradient-primary text-white font-extrabold text-sm px-8 py-4 shrink-0 transition-all shadow-lg shadow-primary/30 m-1.5 rounded-full btn-shine">
                    Search
                  </motion.button>
                </motion.form>

                {/* Quick Chips */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-2">
                  {QUICK_FILTERS.map((chip, idx) => (
                    <motion.button key={chip} whileHover={{ scale: 1.06, y: -1 }} whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/schools?q=${chip}`)}
                      className={`text-xs font-bold border rounded-full px-4 py-1.5 transition-all ${CHIP_COLORS[idx % CHIP_COLORS.length]}`}>
                      {chip}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Trust Badges + Quiz CTA */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-4 mt-8 flex-wrap">
                  <div className="flex items-center gap-5">
                    {[
                      { icon: BadgeCheck, label: "Verified Schools" },
                      { icon: Shield, label: "100% Safe" },
                      { icon: Zap, label: "Instant Apply" },
                    ].map((b) => (
                      <div key={b.label} className="flex items-center gap-2">
                        <b.icon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold text-muted-foreground">{b.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-4 w-px bg-border/50" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2 text-xs font-bold text-white gradient-primary px-4 py-2 rounded-full shadow-md shadow-primary/30 hover:opacity-90 btn-shine transition-all">
                        <Sparkles className="h-3.5 w-3.5" /> Find My Perfect School
                      </motion.button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md rounded-3xl border-border/50 p-8">
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary mb-3">
                          <Sparkles className="h-3.5 w-3.5" /> AI-Powered School Finder
                        </div>
                        <h2 className="text-2xl font-extrabold text-foreground leading-tight">Find Your Child's Perfect School</h2>
                        <p className="text-muted-foreground text-sm mt-1">Answer 4 quick questions and we'll match you with the best schools</p>
                      </div>
                      <SchoolFinderQuiz />
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </div>

              {/* Right — Hero Image with floating cards */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="relative hidden lg:block h-[560px]">
                {/* Main image */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
                  <img src={HERO_SCHOOL_BG} alt="School" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
                </div>

                {/* Floating stat cards */}
                {[
                  { icon: School,   label: "Schools Listed",  value: "500+", color: "text-blue-600",   bg: "bg-blue-50",   top: "top-6",    right: "right-4",  cls: "floating-badge"       },
                  { icon: BookOpen, label: "Tuition Centers", value: "300+", color: "text-orange-600", bg: "bg-orange-50", top: "top-28",   right: "right-4",  cls: "floating-badge-delay" },
                  { icon: Users,    label: "Happy Parents",   value: "12K+", color: "text-green-600",  bg: "bg-green-50",  top: "top-52",   right: "right-4",  cls: "floating-badge-slow"  },
                  { icon: Star,     label: "Avg Rating",      value: "4.8★", color: "text-amber-600",  bg: "bg-amber-50",  bottom: "bottom-8", left: "left-4", cls: "floating-badge-delay" },
                ].map((s) => (
                  <div key={s.label} className={`absolute ${s.top || ""} ${s.bottom || ""} ${s.right || ""} ${s.left || ""} ${s.cls} glass-card rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 min-w-[170px] z-10`}>
                    <div className={`h-10 w-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <s.icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                    <div>
                      <p className="font-extrabold text-foreground text-sm leading-none">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}

                {/* Verified badge */}
                <div className="absolute bottom-6 right-4 floating-badge glass-card rounded-2xl px-4 py-2 shadow-xl z-10 flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs font-extrabold text-foreground">Govt. Verified</p>
                    <p className="text-[10px] text-muted-foreground">All schools checked</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── MARQUEE TRUST STRIP ──────────────────────────────────── */}
        <div className="overflow-hidden border-y border-border/30 bg-muted/30 py-4">
          <div className="flex animate-marquee gap-10">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => {
              const Icon = item.icon;
              return (
                <span key={i} className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-600 whitespace-nowrap shrink-0">
                  <span className={`h-7 w-7 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm shrink-0`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </span>
                  {item.label}
                  <span className="text-slate-300 ml-2">·</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* ─── CATEGORY PILLS ───────────────────────────────────────── */}
        <section className="py-8 border-b border-border/30 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <Reveal key={cat.label} delay={i * 0.06}>
                    <Link to={cat.to}>
                      <motion.div whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.96 }}
                        className={`flex items-center gap-2.5 bg-gradient-to-r ${cat.bg} text-white px-7 py-3.5 rounded-full shadow-lg ${cat.glow} cursor-pointer btn-shine`}>
                        <Icon className="h-4 w-4 text-white shrink-0" />
                        <span className="font-extrabold text-sm whitespace-nowrap">{cat.label}</span>
                      </motion.div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── ANIMATED STATS ───────────────────────────────────────── */}
        <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1445 100%)" }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_hsl(221_83%_53%_/_0.18)_0%,_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,_hsl(262_83%_58%_/_0.12)_0%,_transparent_55%)]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal key={s.label} delay={i * 0.08}>
                    <div className="group flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-3xl font-extrabold text-white tabular-nums">
                        <AnimatedCounter target={s.target} suffix={s.suffix} />
                      </p>
                      <p className="text-xs text-white/55 font-medium mt-1">{s.label}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── TOP SCHOOLS ──────────────────────────────────────────── */}
        <section className="py-14 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <Reveal>
                <div>
                  <div className="section-tag border-primary/20 bg-primary/5 text-primary mb-3">
                    <TrendingUp className="h-3.5 w-3.5" /> Top Rated
                  </div>
                  <h2 className="text-3xl font-extrabold text-foreground">Featured <span className="text-gradient">Schools</span></h2>
                  <p className="text-muted-foreground mt-1">Handpicked schools with highest parent satisfaction</p>
                </div>
              </Reveal>
              <Link to="/schools">
                <motion.button whileHover={{ x: 4 }} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                  View All Schools <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {topSchools.slice(0, 4).map((school: any, i: number) => (
                <Reveal key={school.id} delay={i * 0.08}>
                  <Link to={`/school/${school.slug}`}>
                    <motion.div whileHover={{ y: -8, scale: 1.01 }} className="group bg-card rounded-2xl border border-border/40 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-400">
                      <div className="relative h-40 overflow-hidden">
                        <img src={school.banner} alt={school.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80"; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <Badge className="absolute top-3 left-3 gradient-primary text-white border-0 text-[10px] font-extrabold">{school.board}</Badge>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-lg px-2 py-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-extrabold text-foreground">{Number(school.rating).toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-extrabold text-sm text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">{school.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                          <MapPin className="h-3 w-3 text-primary shrink-0" />
                          <span className="truncate">{school.location}</span>
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-foreground">{school.fees}</span>
                          <span className="text-[10px] text-muted-foreground border border-border/40 rounded-full px-2 py-0.5">View →</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COMPARE SCHOOLS ──────────────────────────────────────── */}
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
              <Reveal>
                <div className="glass-card rounded-3xl p-7 border border-border/40 shadow-lg">
                  <div className="h-14 w-14 gradient-primary rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
                    <Scale className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground mb-2">Compare Schools</h2>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">Make the right choice by comparing schools side by side on all key metrics.</p>
                  <ul className="space-y-2.5 mb-6">
                    {["Compare Annual Fees", "Facilities & Amenities", "Reviews & Ratings", "Board & Curriculum", "Location & Commute"].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-foreground font-medium">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/compare">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full gradient-primary text-white font-extrabold text-sm rounded-full px-4 py-3.5 shadow-lg shadow-primary/30 flex items-center justify-center gap-2 btn-shine">
                      Compare Schools <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                </div>
              </Reveal>

              <div className="grid sm:grid-cols-4 gap-4 items-stretch">
                {compareSchools.map((school: any, idx: number) => (
                  <Reveal key={school.id} delay={idx * 0.1}>
                    <div className="relative h-full">
                      {idx > 0 && (
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex">
                          <span className="gradient-primary text-white text-[10px] font-extrabold rounded-full w-8 h-8 flex items-center justify-center shadow-md">VS</span>
                        </div>
                      )}
                      <div className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden flex flex-col h-full hover:border-primary/20 hover:shadow-md transition-all duration-300">
                        <div className="relative h-36 overflow-hidden">
                          <img src={school.banner} alt={school.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80"; }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-extrabold text-sm text-foreground mb-1 line-clamp-1">{school.name}</h3>
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-foreground">{Number(school.rating).toFixed(1)}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mb-1">{school.board} · {school.location}</p>
                          <p className="text-xs font-extrabold text-foreground mb-3">{school.fees}</p>
                          <Link to={`/school/${school.slug}`} className="mt-auto">
                            <button className="w-full border-2 border-primary text-primary hover:gradient-primary hover:text-white text-xs font-bold rounded-full py-2 transition-all">View Profile</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
                <Reveal delay={0.3}>
                  <Link to="/compare" className="block h-full">
                    <div className="border-2 border-dashed border-primary/30 bg-primary/3 rounded-2xl flex flex-col items-center justify-center p-6 h-full min-h-[280px] hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 group-hover:gradient-primary flex items-center justify-center mb-3 transition-all duration-300">
                        <Scale className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-sm font-bold text-primary text-center mb-1">Add School to Compare</p>
                      <p className="text-[11px] text-muted-foreground text-center mb-4">Up to 3 schools at once</p>
                      <button className="gradient-primary text-white text-xs font-extrabold rounded-full px-5 py-2.5 shadow-md shadow-primary/30 btn-shine">
                        Start Comparing
                      </button>
                    </div>
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── EVENTS ───────────────────────────────────────────────── */}
        <section className="py-14 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <Reveal>
                <div>
                  <div className="section-tag border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-400 mb-3">
                    <CalendarDays className="h-3.5 w-3.5" /> Don't Miss Out
                  </div>
                  <h2 className="text-3xl font-extrabold text-foreground">Upcoming <span className="text-gradient">Events</span></h2>
                </div>
              </Reveal>
              <Link to="/events"><motion.button whileHover={{ x: 4 }} className="flex items-center gap-2 text-sm font-bold text-primary">View All <ArrowRight className="h-4 w-4" /></motion.button></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {upcomingEvents.map((event: any, idx: number) => (
                <Reveal key={event.id} delay={idx * 0.07}>
                  <Link to="/events">
                    <motion.div whileHover={{ y: -6, scale: 1.02 }} className="group rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-400 bg-card">
                      <div className={`bg-gradient-to-br ${EVENT_COLORS[idx % EVENT_COLORS.length]} px-4 py-3`}>
                        <p className="text-white text-2xl font-extrabold leading-none">{dayNum(event.event_date)}</p>
                        <p className="text-white/80 text-[11px] font-bold uppercase tracking-wide">{monthShort(event.event_date)}</p>
                      </div>
                      <div className="relative h-24 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=300&q=60"; }} />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold text-foreground line-clamp-2 mb-2">{event.title}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />{event.location}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BLOGS + COMMUNITY ────────────────────────────────────── */}
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Blogs */}
              <div>
                <Reveal>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="section-tag border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400 mb-2">
                        <Newspaper className="h-3.5 w-3.5" /> Latest Updates
                      </div>
                      <h2 className="text-2xl font-extrabold text-foreground">Education <span className="text-gradient">Blogs</span></h2>
                    </div>
                    <Link to="/news"><motion.button whileHover={{ x: 4 }} className="text-sm font-bold text-primary flex items-center gap-1">View All <ArrowRight className="h-4 w-4" /></motion.button></Link>
                  </div>
                </Reveal>
                <div className="space-y-4">
                  {(latestBlogs.length > 0 ? latestBlogs : [
                    { id: "b1", title: "How to Choose the Right School for Your Child", published_date: "2024-05-18", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80", reading_time: 5 },
                    { id: "b2", title: "Benefits of Co-Curricular Activities in Student Life", published_date: "2024-05-15", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&q=80", reading_time: 4 },
                    { id: "b3", title: "Board Exams Preparation Tips for Parents", published_date: "2024-05-10", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&q=80", reading_time: 6 },
                  ] as any[]).slice(0, 3).map((post: any, i: number) => (
                    <Reveal key={post.id} delay={i * 0.08}>
                      <Link to={`/news/${post.id}`}>
                        <motion.div whileHover={{ x: 6 }} className="group flex gap-4 bg-card rounded-2xl p-4 border border-border/40 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                          <img src={post.image || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80"} alt={post.title} className="h-18 w-24 object-cover rounded-xl shrink-0" style={{ height: 72 }} onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80"; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-snug">{post.title}</p>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(post.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.reading_time || 5} min read</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-1 transition-colors" />
                        </motion.div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Community */}
              <div>
                <Reveal>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="section-tag border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-800/50 dark:bg-sky-900/20 dark:text-sky-400 mb-2">
                        <Users className="h-3.5 w-3.5" /> Join the Conversation
                      </div>
                      <h2 className="text-2xl font-extrabold text-foreground">Community <span className="text-gradient">Discussions</span></h2>
                    </div>
                    <Link to="/community"><motion.button whileHover={{ x: 4 }} className="text-sm font-bold text-primary flex items-center gap-1">View All <ArrowRight className="h-4 w-4" /></motion.button></Link>
                  </div>
                </Reveal>
                <div className="space-y-4">
                  {COMMUNITY_POSTS.map((post, i) => (
                    <Reveal key={post.name} delay={i * 0.1}>
                      <div className="bg-card rounded-2xl p-5 border border-border/40 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm`}>{post.initials}</div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{post.name}</p>
                            <p className="text-[11px] text-muted-foreground">{post.role} · {post.ago}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{post.text}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-[11px] bg-primary/8 text-primary px-2.5 py-0.5 rounded-full font-semibold border border-primary/15">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-5 text-[12px] text-muted-foreground pt-3 border-t border-border/20">
                          <button className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"><ThumbsUp className="h-3.5 w-3.5" />{post.likes} Likes</button>
                          <button className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"><MessageSquare className="h-3.5 w-3.5" />{post.comments} Comments</button>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                  <Reveal delay={0.2}>
                    <Link to="/community">
                      <motion.button whileHover={{ scale: 1.01 }} className="w-full border-2 border-dashed border-primary/30 rounded-full py-4 text-sm font-bold text-primary hover:bg-primary/5 hover:border-primary/50 transition-all">
                        + Join the Community
                      </motion.button>
                    </Link>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PREMIUM CTA ──────────────────────────────────────────── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)" }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
                <div className="relative px-10 py-12">
                  <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="flex-1 text-white">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white/90 mb-5">
                        <Zap className="h-3.5 w-3.5" /> Start For Free
                      </div>
                      <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight mb-3">Are you a School or Tuition Owner?</h2>
                      <p className="text-white/75 text-base leading-relaxed max-w-lg">Get discovered by thousands of parents and grow your admissions with MySchool. It's free and easy to get started.</p>
                      <div className="flex items-center gap-8 mt-5">
                        {[{ icon: UserCircle, label: "Create Profile" }, { icon: Newspaper, label: "Add Details" }, { icon: MessageSquare, label: "Get Enquiries" }, { icon: BarChart3, label: "Grow" }].map((step, idx) => {
                          const Icon = step.icon;
                          return (
                            <div key={step.label} className="flex items-center gap-2">
                              <div className="flex flex-col items-center gap-1">
                                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center"><Icon className="h-5 w-5 text-white" /></div>
                                <p className="text-[10px] text-white/70 font-medium">{step.label}</p>
                              </div>
                              {idx < 3 && <ArrowRight className="h-4 w-4 text-white/40 shrink-0 mb-4" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <Link to="/upload-school">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                          className="bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-base rounded-full px-10 py-4 shadow-xl whitespace-nowrap transition-colors btn-shine">
                          List Your Institution →
                        </motion.button>
                      </Link>
                      <p className="text-white/60 text-xs font-medium">Free forever · No credit card</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}

