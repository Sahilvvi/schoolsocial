import { useOutletContext, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend
} from "recharts";
import {
  Edit, Image, FileText, Bell, CalendarDays, Briefcase,
  MessageSquare, ChevronRight, Star, CheckCircle, Circle, Crown
} from "lucide-react";
import { DUMMY_ADMISSIONS, DUMMY_SCHOOL_VIEWS, DUMMY_REVIEWS } from "@/data/dummyData";

/* ─── Static demo data ──────────────────────────────────────── */
const PERF_CHART = [
  { date: "1 May",  views: 800,  enquiries: 20 },
  { date: "7 May",  views: 1100, enquiries: 35 },
  { date: "14 May", views: 950,  enquiries: 28 },
  { date: "21 May", views: 1600, enquiries: 52 },
  { date: "28 May", views: 1300, enquiries: 44 },
];

const SP_VIEWS   = [10,16,12,20,17,26,22,30,26,34];
const SP_ENQ     = [8, 14,10,18,14,22,17,26,22,30];
const SP_APPS    = [5, 8, 6, 12, 9,14,11,17,14,20];
const SP_REVIEWS = [3, 4, 4, 5,  4, 5, 4, 5, 5, 5 ];

const PROFILE_COMPLETION = [
  { label: "Basic Information", done: true  },
  { label: "Photos & Videos",   done: true  },
  { label: "Facilities",        done: true  },
  { label: "Courses & Fees",    done: true  },
  { label: "Social Links",      done: false },
];
const COMPLETION_PCT = 85;
const DONUT_DATA = [
  { v: COMPLETION_PCT,       fill: "#7c3aed" },
  { v: 100 - COMPLETION_PCT, fill: "#e5e7eb" },
];

const DEMO_NOTICES = [
  { title: "Annual Day Celebration 2024",  desc: "Join us for our Annual Day Celebration on 25th May 2024.",     date: "Posted on 10 May 2024", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&q=80" },
  { title: "Admissions Open 2024-25",      desc: "Admissions are open for Nursery to Class 12.",                 date: "Posted on 5 May 2024",  img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&q=80" },
  { title: "Science Exhibition",           desc: "Students showcase their innovative projects.",                  date: "Posted on 28 Apr 2024", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=80&q=80" },
];

const DEMO_ENQUIRIES = [
  { initials:"PV", color:"bg-purple-500", name:"Priya Verma",    sub:"Class 5 Admission",   time:"2h ago",  badge:"New",        badgeColor:"bg-blue-100 text-blue-700"    },
  { initials:"AS", color:"bg-green-500",  name:"Amit Singh",     sub:"Fee Structure",        time:"5h ago",  badge:"New",        badgeColor:"bg-blue-100 text-blue-700"    },
  { initials:"NG", color:"bg-orange-500", name:"Neha Gupta",     sub:"Transport Facility",   time:"1d ago",  badge:"In Progress",badgeColor:"bg-amber-100 text-amber-700"  },
  { initials:"RM", color:"bg-red-500",    name:"Rahul Mehta",    sub:"Sports Activities",    time:"2d ago",  badge:"In Progress",badgeColor:"bg-amber-100 text-amber-700"  },
];

const DEMO_REVIEWS = [
  { initials:"AS", color:"bg-purple-500", name:"Parent of Aarav Sharma",  rating:5, time:"2 days ago",   comment:"Excellent school with great infrastructure and supportive teachers."  },
  { initials:"AP", color:"bg-blue-500",   name:"Parent of Ananya Patel",  rating:4, time:"1 week ago",   comment:"Good academic environment and co-curricular activities."             },
  { initials:"VK", color:"bg-green-500",  name:"Parent of Vihan Kapoor",  rating:5, time:"2 weeks ago",  comment:"One of the best schools in the city. Highly recommended!"            },
];

const QUICK_ACTIONS = [
  { icon: Edit,         label: "Edit Profile",  to: "/school-panel/profile",   color: "bg-blue-50",    iconColor: "text-blue-600"   },
  { icon: Image,        label: "Add Photos",    to: "/school-panel/gallery",   color: "bg-purple-50",  iconColor: "text-purple-600" },
  { icon: FileText,     label: "Create Post",   to: "/school-panel/feed",      color: "bg-green-50",   iconColor: "text-green-600"  },
  { icon: CalendarDays, label: "Add Event",     to: "/school-panel/events",    color: "bg-orange-50",  iconColor: "text-orange-500" },
  { icon: Briefcase,    label: "Post Job",      to: "/school-panel/jobs",      color: "bg-yellow-50",  iconColor: "text-yellow-600" },
  { icon: MessageSquare,label: "View Enquiries",to: "/school-panel/enquiries", color: "bg-teal-50",    iconColor: "text-teal-600"   },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : s - 0.5 <= rating ? "fill-amber-400/50 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function SPDashboard() {
  const { school } = useOutletContext<any>();

  const { data: admissions = [] } = useQuery({
    queryKey: ["sp-admissions", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("admissions").select("*").eq("school_id", school.id).order("created_at", { ascending: false });
      return (data && data.length > 0) ? data : DUMMY_ADMISSIONS.filter(a => a.school_id === school.id);
    },
  });

  const { data: views = [] } = useQuery({
    queryKey: ["sp-views", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("school_views").select("id").eq("school_id", school.id);
      return (data && data.length > 0) ? data : DUMMY_SCHOOL_VIEWS.filter(v => v.school_id === school.id);
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["sp-reviews", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("id, rating, author, comment, created_at, status").eq("school_id", school.id).order("created_at", { ascending: false });
      return (data && data.length > 0) ? data : DUMMY_REVIEWS.filter(r => r.school_id === school.id);
    },
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length)
    : 4.6;
  const profileViews   = views.length > 0 ? views.length : 2456;
  const enquiriesCount = 96;
  const applicationsCount = admissions.length || 34;

  return (
    <div className="space-y-5 pb-4">

      {/* ── WELCOME BANNER ────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg,#6d28d9 0%,#4f46e5 60%,#3b82f6 100%)" }}
      >
        <div className="px-6 py-5 flex items-center justify-between gap-4 relative z-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-extrabold text-xl leading-tight flex flex-wrap items-center gap-2">
              Welcome back, {school?.name || "Greenfield Public School"}!
              <span>👋</span>
            </h1>
            <p className="text-white/70 text-sm mt-1">Here's what's happening with your school today.</p>
          </div>
          <div className="shrink-0 hidden sm:block">
            <svg width="130" height="90" viewBox="0 0 130 90" fill="none">
              {/* Sky */}
              <ellipse cx="85" cy="75" rx="40" ry="12" fill="rgba(255,255,255,0.08)" />
              {/* Main building */}
              <rect x="30" y="38" width="70" height="46" rx="3" fill="white" fillOpacity="0.92" />
              <rect x="30" y="32" width="70" height="9"  rx="2" fill="white" />
              {/* Roof */}
              <polygon points="18,33 65,10 112,33" fill="white" fillOpacity="0.78" />
              {/* Door */}
              <rect x="52" y="60" width="26" height="24" rx="2" fill="#4f46e5" fillOpacity="0.55" />
              {/* Windows row 1 */}
              <rect x="34" y="44" width="13" height="10" rx="1" fill="#93c5fd" fillOpacity="0.85" />
              <rect x="51" y="44" width="13" height="10" rx="1" fill="#93c5fd" fillOpacity="0.85" />
              <rect x="68" y="44" width="13" height="10" rx="1" fill="#93c5fd" fillOpacity="0.85" />
              <rect x="83" y="44" width="13" height="10" rx="1" fill="#93c5fd" fillOpacity="0.85" />
              {/* Flag pole & flag */}
              <rect x="63" y="6"  width="2"  height="16" fill="white" fillOpacity="0.8" />
              <rect x="65" y="6"  width="10" height="6"  fill="#f97316" fillOpacity="0.9" />
              {/* Left tree */}
              <ellipse cx="14" cy="62" rx="9"  ry="11" fill="#22c55e" fillOpacity="0.85" />
              <rect    cx="12" y="70"  width="4" height="10" rx="1" fill="#16a34a" fillOpacity="0.8" />
              {/* Right tree */}
              <ellipse cx="116" cy="62" rx="9" ry="11" fill="#22c55e" fillOpacity="0.85" />
              <rect    x="114" y="70"  width="4" height="10" rx="1" fill="#16a34a" fillOpacity="0.8" />
              {/* Clouds */}
              <ellipse cx="20" cy="18" rx="10" ry="6"  fill="white" fillOpacity="0.25" />
              <ellipse cx="28" cy="15" rx="8"  ry="5"  fill="white" fillOpacity="0.25" />
              <ellipse cx="108" cy="14" rx="9" ry="5"  fill="white" fillOpacity="0.2" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Profile Views",  value: profileViews.toLocaleString(),   pct:"+18.6%", data: SP_VIEWS,   lineColor:"#a855f7", iconBg:"bg-purple-50", iconColor:"text-purple-500", iconPath:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" },
          { label:"Enquiries",      value: String(enquiriesCount),           pct:"+22.4%", data: SP_ENQ,     lineColor:"#22c55e", iconBg:"bg-green-50",  iconColor:"text-green-500",  iconPath:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
          { label:"Applications",   value: String(applicationsCount),        pct:"+12.5%", data: SP_APPS,    lineColor:"#3b82f6", iconBg:"bg-blue-50",   iconColor:"text-blue-500",   iconPath:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
          { label:"Reviews",        value: avgRating.toFixed(1),            isRating: true, data: SP_REVIEWS, lineColor:"#f59e0b", iconBg:"bg-yellow-50", iconColor:"text-yellow-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={`h-8 w-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                {stat.label === "Reviews" ? (
                  <Star className={`h-4 w-4 ${stat.iconColor}`} />
                ) : stat.label === "Enquiries" ? (
                  <MessageSquare className={`h-4 w-4 ${stat.iconColor}`} />
                ) : stat.label === "Applications" ? (
                  <FileText className={`h-4 w-4 ${stat.iconColor}`} />
                ) : (
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${stat.iconColor}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{stat.value}</p>
            {stat.isRating ? (
              <>
                <Stars rating={parseFloat(stat.value)} />
                <p className="text-[11px] text-gray-400 mt-0.5">(128 Reviews)</p>
              </>
            ) : (
              <p className="text-[11px] text-green-600 font-semibold">{stat.pct} this month</p>
            )}
            <div className="mt-2">
              <Sparkline data={stat.data} color={stat.lineColor} />
            </div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS + RECENT NOTICES ──────────────── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-extrabold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.to} className="group">
                  <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className={`h-10 w-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className={`h-5 w-5 ${action.iconColor}`} />
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium text-center leading-tight">{action.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-extrabold text-gray-900">Recent Notices / Posts</h2>
            <Link to="/school-panel/feed" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DEMO_NOTICES.map((n) => (
              <div key={n.title} className="flex gap-3 px-4 py-3 items-start hover:bg-gray-50 transition-colors">
                <img src={n.img} alt="" className="h-12 w-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">{n.title}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{n.desc}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{n.date}</p>
                </div>
                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded shrink-0 mt-0.5">
                  Published
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROFILE PERFORMANCE + PROFILE COMPLETION ──── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Profile Performance dual-line chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-gray-900">Profile Performance</h2>
            <button className="text-[11px] text-gray-500 border border-gray-200 rounded px-2 py-0.5 flex items-center gap-0.5 hover:bg-gray-50">
              Last 30 Days <ChevronRight className="h-3 w-3 rotate-90" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={PERF_CHART} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6d28d9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6d28d9" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gEnq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }} />
              <Legend
                iconType="line"
                iconSize={12}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
              />
              <Area type="monotone" dataKey="views"     name="Views"     stroke="#6d28d9" strokeWidth={2} fill="url(#gViews)" dot={false} />
              <Area type="monotone" dataKey="enquiries" name="Enquiries"  stroke="#3b82f6" strokeWidth={2} fill="url(#gEnq)"   dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-extrabold text-gray-900 mb-3">Profile Completion</h2>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative shrink-0">
              <PieChart width={110} height={110}>
                <Pie
                  data={DONUT_DATA}
                  cx={51} cy={51}
                  innerRadius={34} outerRadius={50}
                  startAngle={90} endAngle={-270}
                  dataKey="v" strokeWidth={0}
                >
                  {DONUT_DATA.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-extrabold text-gray-900">{COMPLETION_PCT}%</p>
                <p className="text-[9px] text-gray-400 font-medium">Completed</p>
              </div>
            </div>
            {/* Checklist */}
            <div className="flex-1 space-y-2">
              {PROFILE_COMPLETION.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  {item.done
                    ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    : <Circle     className="h-4 w-4 text-gray-300 shrink-0" />
                  }
                  <span className={item.done ? "text-gray-700 font-medium" : "text-gray-400"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/school-panel/profile">
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg py-2.5 transition-colors">
              Complete Profile
            </button>
          </Link>
        </div>
      </div>

      {/* ── TOP ENQUIRIES + RECENT REVIEWS ───────────── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Top Enquiries */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-extrabold text-gray-900">Top Enquiries</h2>
            <Link to="/school-panel/enquiries" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DEMO_ENQUIRIES.map((e) => (
              <div key={e.name} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className={`h-9 w-9 rounded-full ${e.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs font-bold">{e.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{e.name}</p>
                  <p className="text-[11px] text-gray-500">{e.sub}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{e.time}</span>
                <span className={`text-[10px] font-semibold rounded-full px-2.5 py-0.5 shrink-0 ${e.badgeColor}`}>
                  {e.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-extrabold text-gray-900">Recent Reviews</h2>
            <Link to="/school-panel/reviews" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DEMO_REVIEWS.map((r) => (
              <div key={r.name} className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className={`h-9 w-9 rounded-full ${r.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs font-bold">{r.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-900 truncate">{r.name}</p>
                    <span className="text-[10px] text-gray-400 shrink-0">{r.time}</span>
                  </div>
                  <Stars rating={r.rating} />
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{r.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM UPGRADE BANNER ───────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-gray-900">Increase Your School's Visibility</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Upgrade to Premium to get more profile views, featured listings, and better reach to parents and students.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 lg:gap-8 shrink-0">
            {[
              { icon: "⭐", label: "Featured Listing" },
              { icon: "🎧", label: "Priority Support" },
              { icon: "💬", label: "More Enquiries"  },
              { icon: "📊", label: "Analytics Access" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-xl">{f.icon}</span>
                <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{f.label}</p>
              </div>
            ))}
          </div>
          <Link to="/school-panel/subscription" className="shrink-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl px-6 py-2.5 transition-colors whitespace-nowrap">
              Upgrade Now
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
