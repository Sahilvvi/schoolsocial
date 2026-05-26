import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  School, BookOpen, CalendarDays, Users, Newspaper,
  Star, MapPin, ArrowRight, Search, CheckCircle, Scale,
  MessageSquare, Clock, ThumbsUp,
  ChevronDown, GraduationCap, ChevronRight,
  UserCircle, BarChart3, Share2, Filter
} from "lucide-react";
import { useSchools, useEvents, useNews } from "@/hooks/useData";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const STUDENT_IMG = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=85";
const SCHOOL_BG = "https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=90";

const QUICK_FILTERS = ["Nearby", "CBSE", "ICSE", "State Board", "Nursery", "Primary", "High School", "Coaching"];
const BOARDS = ["All Boards", "CBSE", "ICSE", "State Board", "IB", "IGCSE"];

const CATEGORIES = [
  { to: "/schools",   label: "Schools",   sub: "Explore Schools",    bg: "bg-blue-50",    iconBg: "bg-blue-100",   iconColor: "text-blue-600",   icon: School },
  { to: "/tutors",    label: "Tuitions",  sub: "Find Tuitions",     bg: "bg-orange-50",  iconBg: "bg-orange-100", iconColor: "text-orange-600", icon: BookOpen },
  { to: "/compare",   label: "Compare",   sub: "Compare & Decide",  bg: "bg-emerald-50", iconBg: "bg-emerald-100",iconColor: "text-emerald-600",icon: Scale },
  { to: "/events",    label: "Events",    sub: "Upcoming Events",   bg: "bg-purple-50",  iconBg: "bg-purple-100", iconColor: "text-purple-600", icon: CalendarDays },
  { to: "/news",      label: "Blogs",     sub: "Read & Learn",      bg: "bg-green-50",   iconBg: "bg-green-100",  iconColor: "text-green-600",  icon: Newspaper },
  { to: "/community", label: "Community", sub: "Connect & Share",   bg: "bg-cyan-50",    iconBg: "bg-cyan-100",   iconColor: "text-cyan-600",   icon: Users },
];

const STATS = [
  { icon: School,       label: "Schools",           target: 500,   suffix: "+" },
  { icon: BookOpen,     label: "Tuitions",          target: 300,   suffix: "+" },
  { icon: Users,        label: "Parents Community", target: 25000, suffix: "+" },
  { icon: CalendarDays, label: "Events",            target: 200,   suffix: "+" },
  { icon: Star,         label: "Happy Parents",     target: 12000, suffix: "+" },
  { icon: Newspaper,    label: "Blog Articles",     target: 50,    suffix: "+" },
];

const COMMUNITY_POSTS = [
  { name: "Priya Sharma", role: "Parent", ago: "2h ago", initials: "PS", color: "from-pink-500 to-rose-500",
    text: "Looking for a good CBSE school in Loni area. Please suggest some best options.",
    tags: ["CBSE", "Loni", "Nursery - 5th"], likes: 15, comments: 23 },
  { name: "Rahul Verma", role: "Parent", ago: "4h ago", initials: "RV", color: "from-blue-500 to-indigo-500",
    text: "Which tuition center is best for Mathematics for class 10?",
    tags: ["Maths", "Class 10", "Coaching"], likes: 12, comments: 18 },
  { name: "Ankit Gupta", role: "Parent", ago: "1d ago", initials: "AG", color: "from-emerald-500 to-teal-500",
    text: "Sharing some tips to improve focus and concentration in kids.",
    tags: ["Exam Tips", "Study", "Focus"], likes: 20, comments: 31 },
];

const EVENT_COLORS = ["bg-orange-500", "bg-blue-600", "bg-emerald-500", "bg-purple-500", "bg-rose-500"];

function monthShort(d: string) { return new Date(d).toLocaleString("en-IN", { month: "short" }).toUpperCase(); }
function dayNum(d: string) { return new Date(d).getDate(); }

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
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

  const topSchools = schools.slice(0, 8);
  const compareSchools = schools.slice(0, 3);
  const upcomingEvents = events.slice(0, 5);
  const latestBlogs = news.slice(0, 3);

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">

      {/* ═══════════════════════════════════════════════════════
          MOBILE LAYOUT
      ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        <div className="pt-14">
          {/* Hero */}
          <div className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 pt-6 pb-5">
            <div className="grid grid-cols-[1fr_auto] items-start gap-3">
              <div>
                <h1 className="text-[22px] font-extrabold text-gray-900 leading-tight mb-1.5">
                  Find the Right{" "}
                  <span className="text-indigo-600">School</span>{" "}
                  or <span className="text-orange-500">Tuition</span>{" "}
                  for Your Child
                </h1>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Explore, compare and connect with the best near you.
                </p>
              </div>
              <div className="w-24 h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                <img src={STUDENT_IMG} alt="Student" className="w-full h-full object-cover object-top" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mt-4 mb-3 bg-gray-100 rounded-full p-1">
              {(["schools", "tuitions"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all ${
                    activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"
                  }`}>
                  {tab === "schools" ? <School className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                  {tab === "schools" ? "Schools" : "Tuitions"}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="space-y-2">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2.5 shadow-sm">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input type="text" placeholder="Search schools, tuitions..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm border-0 outline-none text-gray-900 placeholder:text-gray-400 bg-transparent" />
                <button type="button" className="h-7 w-7 flex items-center justify-center rounded-lg bg-gray-100">
                  <Filter className="h-3.5 w-3.5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 bg-white rounded-xl border border-gray-200 px-3 py-2">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className="text-xs text-gray-700 border-0 outline-none bg-transparent flex-1">
                    <option>Loni, Ghaziabad</option><option>New Delhi</option><option>Noida</option><option>Gurgaon</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5 bg-white rounded-xl border border-gray-200 px-3 py-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <select value={board} onChange={(e) => setBoard(e.target.value)} className="text-xs text-gray-700 border-0 outline-none bg-transparent flex-1">
                    {BOARDS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold text-sm rounded-xl py-3 shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                Search
              </button>
            </form>
          </div>

          {/* Filter Chips */}
          <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-100">
            {QUICK_FILTERS.slice(0, 6).map((chip) => (
              <button key={chip} onClick={() => navigate(`/schools?q=${chip}`)}
                className="shrink-0 text-xs font-medium text-gray-600 border border-gray-200 bg-white rounded-full px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                {chip}
              </button>
            ))}
          </div>

          {/* Categories 2x3 */}
          <div className="px-4 py-5">
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link key={cat.label} to={cat.to} className="flex flex-col items-center gap-1.5">
                    <div className={`h-14 w-14 rounded-2xl ${cat.iconBg} flex items-center justify-center shadow-sm`}>
                      <Icon className={`h-6 w-6 ${cat.iconColor}`} />
                    </div>
                    <span className="text-xs font-bold text-gray-800 text-center">{cat.label}</span>
                    <span className="text-[10px] text-gray-400 text-center leading-tight">{cat.sub}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-base font-extrabold text-gray-900">Upcoming Events</h2>
              <Link to="/events" className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-4 no-scrollbar">
              {upcomingEvents.map((event: any, idx: number) => (
                <Link key={event.id} to="/events" className="shrink-0 w-40">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="relative h-24 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=300&q=60"; }} />
                      <div className={`absolute top-2 left-2 ${EVENT_COLORS[idx % EVENT_COLORS.length]} text-white text-[10px] font-extrabold px-2 py-1 rounded-lg text-center leading-tight`}>
                        <div className="text-sm font-extrabold">{dayNum(event.event_date)}</div>
                        <div className="text-[8px]">{monthShort(event.event_date)}</div>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1 mb-0.5">{event.title}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="truncate">{event.location || "Local Venue"}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest from Blogs */}
          <div className="border-t border-gray-100 pt-5 pb-2">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-base font-extrabold text-gray-900">Latest from Blogs</h2>
              <Link to="/news" className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="px-4 space-y-3">
              {latestBlogs.map((blog: any) => (
                <Link key={blog.id} to={`/news/${blog.id}`}>
                  <div className="flex gap-3 items-start p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="shrink-0 h-16 w-20 rounded-xl overflow-hidden">
                      <img src={blog.cover_image || blog.image} alt={blog.title} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=60"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{blog.title}</p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(blog.created_at || blog.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        {" · "}
                        {Math.ceil((blog.content?.length || 500) / 1000)} min read
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Community Discussions */}
          <div className="border-t border-gray-100 pt-5 pb-4 mt-2">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-base font-extrabold text-gray-900">Community Discussions</h2>
              <Link to="/community" className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="px-4 space-y-3">
              {COMMUNITY_POSTS.slice(0, 2).map((post) => (
                <div key={post.name} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-white font-extrabold text-xs shrink-0`}>
                      {post.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{post.name}</p>
                      <p className="text-[10px] text-gray-400">{post.role} · {post.ago}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{post.text}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium border border-indigo-100">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 border-t border-gray-50 pt-2">
                    <button className="flex items-center gap-1.5 font-medium hover:text-indigo-600"><ThumbsUp className="h-3.5 w-3.5" /> {post.likes} Likes</button>
                    <button className="flex items-center gap-1.5 font-medium hover:text-indigo-600"><MessageSquare className="h-3.5 w-3.5" /> {post.comments} Comments</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAB */}
          <Link to="/community" className="fixed bottom-20 right-4 z-40 h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-300 text-white text-2xl font-light">
            +
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP LAYOUT
      ═══════════════════════════════════════════════════════ */}
      <div className="hidden lg:block">

        {/* ─── HERO ─── */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-16">
          <div className="absolute inset-0">
            <img src={SCHOOL_BG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
          </div>

          {/* Floating stat badges */}
          <div className="absolute top-28 right-8 z-10 space-y-3">
            <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-2.5 shadow-lg border border-gray-100">
              <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                <School className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900">500+</p>
                <p className="text-[10px] text-gray-500">Schools Listed</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-2.5 shadow-lg border border-gray-100 ml-8">
              <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900">300+</p>
                <p className="text-[10px] text-gray-500">Tuition Centers</p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="text-5xl xl:text-6xl font-extrabold leading-[1.1] text-gray-900 mb-4">
                Find the Right{" "}
                <span className="text-indigo-600">School</span>{" "}
                or <span className="text-orange-500">Tuition</span>{" "}
                for Your Child
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                className="text-gray-500 text-lg mb-8 max-w-lg">
                Explore, compare and connect with the best schools and tuition centers near you.
              </motion.p>

              {/* Search Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 max-w-xl">

                {/* Tabs */}
                <div className="flex gap-0 mb-4">
                  {(["schools", "tuitions"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold border-b-2 transition-colors ${
                        activeTab === tab
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}>
                      {tab === "schools" ? <School className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                      {tab === "schools" ? "Schools" : "Tuitions"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch} className="space-y-3">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
                    <Search className="h-4 w-4 text-gray-400 shrink-0" />
                    <input type="text" placeholder={activeTab === "tuitions" ? "Search tuitions..." : "Search schools..."}
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 border-0 outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
                      <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
                      <select value={location} onChange={(e) => setLocation(e.target.value)}
                        className="border-0 outline-none text-sm text-gray-700 bg-transparent flex-1 cursor-pointer">
                        <option>Loni, Ghaziabad</option><option>New Delhi</option><option>Noida</option><option>Gurgaon</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
                      <GraduationCap className="h-4 w-4 text-indigo-600 shrink-0" />
                      <select value={board} onChange={(e) => setBoard(e.target.value)}
                        className="border-0 outline-none text-sm text-gray-700 bg-transparent flex-1 cursor-pointer">
                        {BOARDS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl py-3.5 transition-colors shadow-md shadow-indigo-200">
                    Search
                  </button>
                </form>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {QUICK_FILTERS.map((chip) => (
                    <button key={chip} onClick={() => navigate(`/schools?q=${chip}`)}
                      className="text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                      {chip}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Trust badge */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-2 mt-5 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 w-fit border border-gray-100 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">12K+ <span className="font-normal text-gray-500">Happy Parents</span></p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── CATEGORIES ─── */}
        <section className="py-12 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-6 gap-6">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Reveal key={cat.label}>
                    <Link to={cat.to} className="flex flex-col items-center gap-3 group">
                      <div className={`h-16 w-16 rounded-2xl ${cat.iconBg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                        <Icon className={`h-7 w-7 ${cat.iconColor}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{cat.label}</p>
                        <p className="text-[11px] text-gray-400">{cat.sub}</p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── COMPARE SCHOOLS ─── */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Compare Schools</h2>
                  <p className="text-sm text-gray-500 mb-5">Make the right choice by comparing schools side by side.</p>
                  <ul className="space-y-2.5 mb-6">
                    {["Compare Fees", "Facilities", "Reviews & Ratings", "And much more"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/compare">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl py-3 flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-colors">
                      Compare Schools <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </Reveal>

              <div className="flex items-stretch gap-4">
                {compareSchools.map((school: any, idx: number) => (
                  <Reveal key={school.id} delay={idx * 0.1}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-52 flex flex-col">
                      <div className="relative h-32 overflow-hidden">
                        <img src={school.banner} alt={school.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80"; }} />
                      </div>
                      <div className="p-3 flex-1 flex flex-col">
                        <p className="text-sm font-bold text-gray-900 mb-1">{school.name}</p>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 fill-white" /> {Number(school.rating).toFixed(1)}
                          </span>
                          <span className="text-[10px] text-gray-400">({school.review_count} Reviews)</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-1">{school.board} · {school.location}</p>
                        <p className="text-xs font-bold text-gray-900 mb-3">₹ {school.fees}</p>
                        <Link to={`/school/${school.slug}`} className="mt-auto">
                          <button className="w-full text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg py-2 hover:bg-indigo-50 transition-colors">
                            View Profile
                          </button>
                        </Link>
                      </div>
                    </div>
                    {idx < compareSchools.length - 1 && (
                      <div className="flex items-center justify-center px-2">
                        <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">VS</span>
                      </div>
                    )}
                  </Reveal>
                ))}

                {/* Add more slot */}
                <Reveal delay={0.3}>
                  <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 w-44 flex flex-col items-center justify-center gap-3 p-6">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Scale className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-xs text-gray-500 text-center font-medium">Add up to 3 schools to compare</p>
                    <Link to="/compare">
                      <button className="text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg px-4 py-2 hover:bg-indigo-50 transition-colors">
                        Start Comparing
                      </button>
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── UPCOMING EVENTS ─── */}
        <section className="py-14 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <Reveal>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900">Upcoming Events</h2>
                <Link to="/events" className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-5 gap-4">
              {upcomingEvents.map((event: any, idx: number) => (
                <Reveal key={event.id} delay={idx * 0.08}>
                  <Link to="/events">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative h-36 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=60"; }} />
                        <div className={`absolute top-3 left-3 ${EVENT_COLORS[idx % EVENT_COLORS.length]} text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg text-center leading-tight`}>
                          <div className="text-base font-extrabold">{dayNum(event.event_date)}</div>
                          <div className="text-[9px]">{monthShort(event.event_date)}</div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">{event.title}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(event.event_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location || "Local Venue"}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BLOGS + COMMUNITY ─── */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Latest Blogs */}
              <div>
                <Reveal>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900">Latest from Blogs</h2>
                    <Link to="/news" className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                      View All <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
                <div className="space-y-4">
                  {latestBlogs.map((blog: any, i: number) => (
                    <Reveal key={blog.id} delay={i * 0.08}>
                      <Link to={`/news/${blog.id}`}>
                        <div className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="shrink-0 h-20 w-24 rounded-xl overflow-hidden">
                            <img src={blog.cover_image || blog.image} alt={blog.title} className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=60"; }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-1.5">{blog.title}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(blog.created_at || blog.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                              {" · "}
                              {Math.ceil((blog.content?.length || 500) / 1000)} min read
                            </p>
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Community Discussions */}
              <div>
                <Reveal>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900">Community Discussions</h2>
                    <Link to="/community" className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                      View All <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
                <div className="grid grid-cols-3 gap-3">
                  {COMMUNITY_POSTS.map((post, i) => (
                    <Reveal key={post.name} delay={i * 0.08}>
                      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-white font-bold text-[10px] shrink-0`}>
                            {post.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{post.name}</p>
                            <p className="text-[10px] text-gray-400">{post.role} · {post.ago}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-3">{post.text}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium border border-indigo-100">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-2 border-t border-gray-50">
                          <span>{post.likes} Likes</span>
                          <span>·</span>
                          <span>{post.comments} Comments</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── OWNER CTA ─── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
                <div className="relative px-10 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                        <School className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-white">
                        <h2 className="text-2xl font-extrabold mb-1">Are you a School or Tuition Owner?</h2>
                        <p className="text-white/70 text-sm max-w-lg">
                          Get discovered by thousands of parents and grow your admissions with SchoolSocial.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden xl:flex items-center gap-6">
                        {[
                          { icon: UserCircle, label: "Create Profile" },
                          { icon: Newspaper, label: "Add Details" },
                          { icon: MessageSquare, label: "Get Enquiries" },
                          { icon: BarChart3, label: "Grow Admissions" },
                        ].map((step, idx) => (
                          <div key={step.label} className="flex items-center gap-3">
                            <div className="flex flex-col items-center gap-1">
                              <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                                <step.icon className="h-5 w-5 text-white" />
                              </div>
                              <p className="text-[10px] text-white/60 font-medium">{step.label}</p>
                            </div>
                            {idx < 3 && <ArrowRight className="h-3.5 w-3.5 text-white/30 mb-4" />}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <Link to="/upload-school">
                          <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-sm rounded-full px-8 py-3 shadow-lg whitespace-nowrap transition-colors">
                            List Your Institution
                          </button>
                        </Link>
                        <p className="text-white/50 text-[10px] font-medium">It's Free & Easy!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="py-10 bg-gray-50/80 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-6 gap-6">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Reveal key={stat.label}>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <p className="text-xl font-extrabold text-gray-900">
                        <AnimatedCounter target={stat.target} />{stat.suffix}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
