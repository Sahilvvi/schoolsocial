import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  School, BookOpen, CalendarDays, Users, BarChart3, Newspaper,
  Star, MapPin, ArrowRight, Search, CheckCircle, ChevronDown,
  Scale, MessageSquare, Clock, UserCircle, ThumbsUp, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSchools, useEvents, useNews } from "@/hooks/useData";

const HERO_SCHOOL_BG = "https://images.unsplash.com/photo-1562774053-701939374585?w=1000&q=80";

/* ─── Quick filter chips ─────────────────────────────────── */
const QUICK_FILTERS = ["Nearby", "CBSE", "ICSE", "State Board", "Nursery", "Primary", "High School", "Coaching"];

/* ─── Category icons ─────────────────────────────────────── */
const CATEGORIES = [
  { to: "/schools",  label: "Schools",   sub: "Explore Schools",   bg: "bg-blue-100",   icon: School,      iconColor: "text-blue-600"   },
  { to: "/tutors",   label: "Tuitions",  sub: "Find Tuitions",     bg: "bg-red-100",    icon: BookOpen,    iconColor: "text-red-500"    },
  { to: "/compare",  label: "Compare",   sub: "Compare & Decide",  bg: "bg-green-100",  icon: Scale,       iconColor: "text-green-600"  },
  { to: "/events",   label: "Events",    sub: "Upcoming Events",   bg: "bg-purple-100", icon: CalendarDays,iconColor: "text-purple-600" },
  { to: "/news",     label: "Blogs",     sub: "Read & Learn",      bg: "bg-orange-100", icon: Newspaper,   iconColor: "text-orange-500" },
  { to: "/community",label: "Community", sub: "Connect & Share",   bg: "bg-sky-100",    icon: Users,       iconColor: "text-sky-600"    },
];

/* ─── Month name helper ──────────────────────────────────── */
function monthShort(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", { month: "short" }).toUpperCase();
}
function dayNum(dateStr: string) {
  return new Date(dateStr).getDate();
}

/* ─── Community posts (static) ───────────────────────────── */
const COMMUNITY_POSTS = [
  {
    name: "Priya Sharma", role: "Parent", ago: "2h ago", initials: "PS", color: "bg-pink-500",
    text: "Looking for a good CBSE school in Loni area. Please suggest some best options.",
    tags: ["CBSE", "Loni", "Nursery - 5th"],
    likes: 15, comments: 23,
  },
  {
    name: "Rahul Verma", role: "Parent", ago: "4h ago", initials: "RV", color: "bg-blue-500",
    text: "Which tuition center is best for Mathematics for class 10?",
    tags: ["Maths", "Class 10", "Coaching"],
    likes: 12, comments: 18,
  },
  {
    name: "Ankit Gupta", role: "Parent", ago: "1d ago", initials: "AG", color: "bg-green-500",
    text: "Sharing some tips to improve focus and concentration in kids.",
    tags: ["Exam Tips", "Study", "Focus"],
    likes: 20, comments: 31,
  },
];

/* ─── Board filter options ───────────────────────────────── */
const BOARDS = ["All Boards", "CBSE", "ICSE", "State Board", "IB", "IGCSE"];

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

  const handleChip = (chip: string) => {
    if (["CBSE", "ICSE", "State Board"].includes(chip)) {
      navigate(`/schools?board=${chip}`);
    } else {
      navigate(`/schools?q=${chip}`);
    }
  };

  const compareSchools = schools.slice(0, 3);
  const upcomingEvents = events.slice(0, 5);
  const latestBlogs = news.slice(0, 3);

  /* ── Event card colors ── */
  const eventColors = ["bg-orange-500", "bg-blue-600", "bg-green-500", "bg-red-500", "bg-purple-600"];

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">

      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section className="bg-white pt-16">
        <div className="container mx-auto px-4 pt-8 pb-0">
          <div className="grid lg:grid-cols-2 gap-0 items-start">

            {/* Left */}
            <div className="py-8 lg:py-12 pr-0 lg:pr-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
                Find the Right{" "}
                <span className="text-blue-600">School</span>{" "}
                or{" "}
                <span className="text-red-500">Tuition</span>{" "}
                for Your Child
              </h1>
              <p className="text-gray-500 text-base mb-6 leading-relaxed max-w-lg">
                Explore, compare and connect with the best schools and tuition centers near you.
              </p>

              {/* Tabs */}
              <div className="flex gap-0 border-b border-gray-200 mb-5 w-fit">
                {(["schools", "tuitions"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "schools" ? (
                      <School className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex items-center gap-0 rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4 bg-white">
                <div className="flex items-center gap-2 px-3 py-2 flex-1 min-w-0">
                  <Search className="h-4 w-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={activeTab === "tuitions" ? "Search tuition centers..." : "Search schools..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0"
                  />
                </div>
                <div className="h-8 w-px bg-gray-200 shrink-0" />
                <div className="flex items-center gap-1 px-3 py-2 min-w-[150px]">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 outline-none text-sm text-gray-700 bg-transparent min-w-0 flex-1 cursor-pointer"
                  >
                    <option>Loni, Ghaziabad</option>
                    <option>New Delhi</option>
                    <option>Noida</option>
                    <option>Gurgaon</option>
                    <option>Faridabad</option>
                  </select>
                </div>
                <div className="h-8 w-px bg-gray-200 shrink-0" />
                <div className="flex items-center gap-1 px-3 py-2 min-w-[120px]">
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="border-0 outline-none text-sm text-gray-700 bg-transparent cursor-pointer"
                  >
                    {BOARDS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 shrink-0 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2">
                {QUICK_FILTERS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChip(chip)}
                    className="text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 hover:border-blue-400 hover:text-blue-600 transition-colors bg-white"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — hero image with stats */}
            <div className="relative hidden md:block overflow-hidden rounded-tl-3xl min-h-[420px]">
              {/* School background image */}
              <img
                src={HERO_SCHOOL_BG}
                alt="School building"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15" />

              {/* Floating stat cards — stacked on the right */}
              <div className="absolute top-6 right-4 z-20 flex flex-col gap-3">
                {[
                  { icon: School,   label: "Schools Listed",  value: "500+" },
                  { icon: BookOpen, label: "Tuition Centers", value: "300+" },
                  { icon: Users,    label: "Happy Parents",   value: "12K+" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-lg min-w-[170px]">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <s.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm leading-none">{s.value}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY ICONS ════════════════════════════════════════ */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  to={cat.to}
                  className="flex flex-col items-center gap-2 group text-center"
                >
                  <div className={`h-14 w-14 rounded-full ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-7 w-7 ${cat.iconColor}`} />
                  </div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{cat.label}</p>
                  <p className="text-[11px] text-gray-400 leading-tight">{cat.sub}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ COMPARE SCHOOLS ════════════════════════════════════════ */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

            {/* Left panel */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">Compare Schools</h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">Make the right choice by comparing schools side by side.</p>
              <ul className="space-y-2 mb-6">
                {["Compare Fees", "Facilities", "Reviews & Ratings", "And much more"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/compare">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2">
                  Compare Schools <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {/* School cards */}
            <div className="grid sm:grid-cols-3 gap-4 items-stretch">
              {compareSchools.map((school: any, idx: number) => (
                <div key={school.id} className="relative">
                  {idx > 0 && (
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex">
                      <span className="bg-blue-600 text-white text-[10px] font-extrabold rounded-full w-8 h-8 flex items-center justify-center shadow-md">VS</span>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="relative h-36 overflow-hidden">
                      <img src={school.banner} alt={school.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">{school.name}</h3>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{Number(school.rating).toFixed(1)}</span>
                        <span className="text-[10px] text-gray-400">({school.review_count} Reviews)</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-1">{school.board} · {school.location}</p>
                      <p className="text-xs font-semibold text-gray-800 mb-3">₹ {school.fees}</p>
                      <Link to={`/school/${school.slug}`} className="mt-auto">
                        <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold rounded-lg py-2 transition-colors">
                          View Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add to compare card */}
              <Link to="/compare">
                <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center p-6 h-full min-h-[260px] cursor-pointer hover:border-blue-400 transition-colors group">
                  <div className="h-14 w-14 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-3 transition-colors">
                    <Scale className="h-7 w-7 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-blue-600 text-center mb-1">Add up to 3 schools to compare</p>
                  <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg px-4 py-2 transition-colors">
                    Start Comparing
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ UPCOMING EVENTS ═══════════════════════════════════════ */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">Upcoming Events</h2>
            <Link to="/events" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {upcomingEvents.map((event: any, idx: number) => (
              <Link key={event.id} to="/events">
                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  {/* Date box */}
                  <div className={`${eventColors[idx % eventColors.length]} px-3 py-2`}>
                    <p className="text-white text-xl font-extrabold leading-none">{dayNum(event.event_date)}</p>
                    <p className="text-white/80 text-xs font-semibold uppercase">{monthShort(event.event_date)}</p>
                  </div>
                  {/* Event image */}
                  <div className="relative h-24 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-900 line-clamp-2 mb-1.5">{event.title}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>
                        {new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOGS + COMMUNITY ══════════════════════════════════════ */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Latest Blogs */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-gray-900">Latest from Blogs</h2>
                <Link to="/news" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {(latestBlogs.length > 0 ? latestBlogs : [
                  { id: "b1", title: "How to Choose the Right School for Your Child", published_date: "2024-05-18", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80", reading_time: 5 },
                  { id: "b2", title: "Benefits of Co-Curricular Activities in Student Life", published_date: "2024-05-15", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&q=80", reading_time: 4 },
                  { id: "b3", title: "Board Exams Preparation Tips for Parents", published_date: "2024-05-10", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&q=80", reading_time: 6 },
                ] as any[]).slice(0, 3).map((post: any) => (
                  <Link key={post.id} to="/news">
                    <div className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                      <img
                        src={post.image || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80"}
                        alt={post.title}
                        className="h-16 w-20 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          <span>{new Date(post.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                          <span>·</span>
                          <span>{post.reading_time || 5} min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Discussions */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-gray-900">Community Discussions</h2>
                <Link to="/community" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {COMMUNITY_POSTS.map((post) => (
                  <div key={post.name} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-9 w-9 rounded-full ${post.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                        {post.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{post.name}</p>
                        <p className="text-[11px] text-gray-400">{post.role} · {post.ago}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{post.text}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {post.likes} Likes</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {post.comments} Comments</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCHOOL/TUITION OWNER CTA ═══════════════════════════════ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)" }}>
            <div className="px-8 py-10 md:px-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">

                {/* Left */}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                      <School className="h-9 w-9 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold leading-tight">Are you a School or Tuition Owner?</h2>
                      <p className="text-white/80 text-sm mt-1">Get discovered by thousands of parents and grow your admissions with MySchool</p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                  {[
                    { icon: UserCircle, label: "Create Profile" },
                    { icon: Newspaper, label: "Add Details" },
                    { icon: MessageSquare, label: "Get Enquiries" },
                    { icon: BarChart3, label: "Grow Admissions" },
                  ].map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.label} className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <p className="text-[11px] text-white/80 font-medium text-center whitespace-nowrap">{step.label}</p>
                        </div>
                        {idx < 3 && <ArrowRight className="h-4 w-4 text-white/50 shrink-0 mb-4" />}
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <Link to="/upload-school">
                    <button className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl px-6 py-3 transition-colors shadow-lg whitespace-nowrap">
                      List Your Institution
                    </button>
                  </Link>
                  <p className="text-white/70 text-xs">It's Free &amp; Easy!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER STATS ════════════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 text-center">
            {[
              { icon: School,       label: "Schools",           value: "500+" },
              { icon: BookOpen,     label: "Tuitions",          value: "300+" },
              { icon: Users,        label: "Parents Community", value: "25K+" },
              { icon: CalendarDays, label: "Events",            value: "200+" },
              { icon: Star,         label: "Happy Parents",     value: "12K+" },
              { icon: Newspaper,    label: "Blog Articles",     value: "50+"  },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <Icon className="h-6 w-6 text-blue-600 mb-1" />
                  <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
