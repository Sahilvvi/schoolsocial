import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";
import {
  Eye, MessageSquare, FileText, Star, Edit, Image, Plus,
  Bell, CalendarDays, Users, ChevronRight, TrendingUp,
  Crown, CheckCircle, Circle
} from "lucide-react";
import { DUMMY_ADMISSIONS, DUMMY_SCHOOL_VIEWS, DUMMY_REVIEWS, DUMMY_EVENTS, DUMMY_JOBS } from "@/data/dummyData";

/* ─── Static chart / demo data ────────────────────────────── */
const ENQUIRY_CHART = [
  { date: "1 May",  v: 22 },
  { date: "7 May",  v: 35 },
  { date: "14 May", v: 28 },
  { date: "21 May", v: 52 },
  { date: "26 May", v: 44 },
];
const SP1 = [10, 16, 12, 20, 17, 26, 22, 30, 26, 34];
const SP2 = [8,  14, 10, 18, 14, 22, 17, 26, 22, 30];
const SP3 = [5,  8,  6,  12, 9,  14, 11, 17, 14, 20];

const PROFILE_COMPLETION = [
  { label: "Basic Information", done: true },
  { label: "Photos & Videos",   done: true },
  { label: "Facilities",        done: true },
  { label: "Courses & Fees",    done: true },
  { label: "Social Links",      done: false },
];
const COMPLETION_PCT = 85;
const COMPLETION_PIE = [
  { v: COMPLETION_PCT,       color: "#6d28d9" },
  { v: 100 - COMPLETION_PCT, color: "#e5e7eb" },
];

const DEMO_NOTICES = [
  { title: "Annual Day Celebration 2024",  desc: "Join us for our Annual Day Celebration on 25th May 2024.", date: "Posted on 20 May 2024", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&q=80",   status: "Published" },
  { title: "Admissions Open 2024-25",      desc: "Admissions are open for Nursery to Class 12.",            date: "Posted on 18 May 2024", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&q=80", status: "Published" },
  { title: "Science Exhibition",           desc: "Students showcase their innovative projects.",             date: "Posted on 16 May 2024", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=80&q=80", status: "Published" },
];

const QUICK_ACTIONS = [
  { icon: Edit,        label: "Edit Profile",    to: "/school-panel/profile",   color: "bg-blue-100",   iconColor: "text-blue-600"   },
  { icon: Image,       label: "Add Photos",      to: "/school-panel/gallery",   color: "bg-purple-100", iconColor: "text-purple-600" },
  { icon: FileText,    label: "Create Post",     to: "/school-panel/feed",      color: "bg-green-100",  iconColor: "text-green-600"  },
  { icon: Bell,        label: "Add Notice",      to: "/school-panel/feed",      color: "bg-red-100",    iconColor: "text-red-500"    },
  { icon: CalendarDays,label: "Add Event",       to: "/school-panel/events",    color: "bg-orange-100", iconColor: "text-orange-500" },
  { icon: MessageSquare,label:"View Enquiries",  to: "/school-panel/enquiries", color: "bg-teal-100",   iconColor: "text-teal-600",  badge: 32 },
  { icon: Users,       label: "Applications",    to: "/school-panel/admissions",color: "bg-indigo-100", iconColor: "text-indigo-600" },
  { icon: Plus,        label: "Add Job",         to: "/school-panel/jobs",      color: "bg-yellow-100", iconColor: "text-yellow-600" },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

export default function SPDashboard() {
  const { school } = useOutletContext<any>();
  const [showFullEnquiry] = useState(false);

  const { data: admissions = [] } = useQuery({
    queryKey: ["sp-admissions", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("admissions").select("*").eq("school_id", school.id).order("created_at", { ascending: false });
      return (data && data.length > 0) ? data : DUMMY_ADMISSIONS.filter((a) => a.school_id === school.id);
    },
  });

  const { data: views = [] } = useQuery({
    queryKey: ["sp-views", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("school_views").select("id").eq("school_id", school.id);
      return (data && data.length > 0) ? data : DUMMY_SCHOOL_VIEWS.filter((v) => v.school_id === school.id);
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["sp-reviews", school.id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("id, rating, author, comment, created_at, status").eq("school_id", school.id).order("created_at", { ascending: false });
      return (data && data.length > 0) ? data : DUMMY_REVIEWS.filter((r) => r.school_id === school.id);
    },
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length)
    : 4.6;

  const enquiriesCount = 96;
  const applicationsCount = admissions.length || 34;
  const profileViews = views.length > 0 ? views.length : 2456;

  return (
    <div className="space-y-4 pb-4">

      {/* ── WELCOME BANNER ──────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #6d28d9 0%, #4f46e5 60%, #3b82f6 100%)" }}>
        <div className="px-5 py-5 flex items-center justify-between gap-4 relative z-10">
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm font-medium">Welcome back,</p>
            <h1 className="text-white font-extrabold text-xl leading-tight mt-0.5 flex items-center gap-2">
              {school?.name || "Greenfield Public School"} <span>👋</span>
            </h1>
            <p className="text-white/70 text-xs mt-1">Here's what's happening at your school today.</p>
          </div>
          {/* School building illustration */}
          <div className="shrink-0">
            <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="65" cy="65" rx="32" ry="12" fill="rgba(255,255,255,0.1)" />
              {/* Main building */}
              <rect x="22" y="30" width="56" height="38" rx="3" fill="white" fillOpacity="0.9" />
              <rect x="22" y="26" width="56" height="8" rx="2" fill="white" />
              {/* Roof triangle */}
              <polygon points="12,28 50,8 88,28" fill="white" fillOpacity="0.8" />
              {/* Door */}
              <rect x="41" y="50" width="18" height="18" rx="2" fill="#4f46e5" fillOpacity="0.6" />
              {/* Windows */}
              <rect x="26" y="36" width="10" height="8" rx="1" fill="#93c5fd" fillOpacity="0.8" />
              <rect x="40" y="36" width="10" height="8" rx="1" fill="#93c5fd" fillOpacity="0.8" />
              <rect x="54" y="36" width="10" height="8" rx="1" fill="#93c5fd" fillOpacity="0.8" />
              <rect x="68" y="36" width="10" height="8" rx="1" fill="#93c5fd" fillOpacity="0.8" />
              {/* Flag */}
              <rect x="48" y="4" width="2" height="14" fill="white" fillOpacity="0.8" />
              <rect x="50" y="4" width="8" height="5" fill="#f97316" fillOpacity="0.9" />
              {/* Trees */}
              <ellipse cx="10" cy="52" rx="7" ry="9" fill="#22c55e" fillOpacity="0.8" />
              <rect x="8" y="58" width="4" height="8" rx="1" fill="#16a34a" fillOpacity="0.8" />
              <ellipse cx="90" cy="52" rx="7" ry="9" fill="#22c55e" fillOpacity="0.8" />
              <rect x="88" y="58" width="4" height="8" rx="1" fill="#16a34a" fillOpacity="0.8" />
              {/* Clouds */}
              <ellipse cx="15" cy="15" rx="8" ry="5" fill="white" fillOpacity="0.3" />
              <ellipse cx="22" cy="13" rx="6" ry="4" fill="white" fillOpacity="0.3" />
              <ellipse cx="80" cy="12" rx="7" ry="4" fill="white" fillOpacity="0.25" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Profile Views",  value: profileViews.toLocaleString(), pct: "+18.6%", data: SP1, iconBg: "bg-purple-100", icon: <Eye className="h-4 w-4 text-purple-600" />,        lineColor: "#a855f7" },
          { label: "Enquiries",      value: String(enquiriesCount),         pct: "+22.4%", data: SP2, iconBg: "bg-green-100",  icon: <MessageSquare className="h-4 w-4 text-green-600" />, lineColor: "#22c55e" },
          { label: "Applications",   value: String(applicationsCount),      pct: "+12.5%", data: SP3, iconBg: "bg-blue-100",   icon: <FileText className="h-4 w-4 text-blue-600" />,       lineColor: "#3b82f6" },
          { label: "Avg. Rating",    value: avgRating.toFixed(1), isRating: true, reviews: `${reviews.length || 128} Reviews` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex flex-col gap-1">
            {"icon" in stat && (
              <div className="flex items-center justify-between mb-1">
                <div className={`h-7 w-7 rounded-lg ${stat.iconBg} flex items-center justify-center`}>{stat.icon}</div>
              </div>
            )}
            <p className="text-[11px] text-gray-500 font-medium">{stat.label}</p>
            <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
            {stat.isRating ? (
              <>
                <StarRow rating={parseFloat(stat.value)} />
                <p className="text-[10px] text-gray-400">{stat.reviews}</p>
              </>
            ) : (
              <>
                <p className="text-[11px] text-green-600 font-semibold">{stat.pct} this month</p>
                <Sparkline data={stat.data!} color={stat.lineColor!} />
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-900">Quick Actions</h2>
          <button className="text-xs text-blue-600 font-semibold">View All</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.to} className="flex flex-col items-center gap-1.5 group">
                <div className={`relative h-12 w-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className={`h-5 w-5 ${action.iconColor}`} />
                  {"badge" in action && action.badge && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-600 font-medium text-center leading-tight">{action.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── RECENT NOTICES ──────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <h2 className="text-sm font-extrabold text-gray-900">Recent Notices / Posts</h2>
          <Link to="/school-panel/feed" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">View All <ChevronRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="divide-y divide-gray-50">
          {DEMO_NOTICES.map((notice) => (
            <div key={notice.title} className="flex gap-3 px-4 py-3 items-start hover:bg-gray-50 transition-colors">
              <img src={notice.img} alt="" className="h-12 w-12 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 line-clamp-1">{notice.title}</p>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{notice.desc}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{notice.date}</p>
              </div>
              <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded shrink-0 mt-0.5">{notice.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── ENQUIRIES OVERVIEW + PROFILE COMPLETION ─────── */}
      <div className="grid md:grid-cols-2 gap-3">

        {/* Enquiries Overview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-extrabold text-gray-900">Enquiries Overview</h2>
            <Link to="/school-panel/enquiries" className="text-xs text-blue-600 font-semibold">View All</Link>
          </div>
          <div className="flex items-center gap-1 mb-3">
            <button className="text-[11px] text-gray-500 border border-gray-200 rounded px-2 py-0.5 flex items-center gap-0.5 hover:bg-gray-50">
              Last 30 Days <ChevronRight className="h-3 w-3 rotate-90" />
            </button>
          </div>
          <div className="mb-2">
            <p className="text-2xl font-extrabold text-gray-900">{enquiriesCount}</p>
            <p className="text-[11px] text-gray-500">Total Enquiries</p>
            <p className="text-xs text-green-600 font-semibold mt-0.5">↑ 22.4% vs last 30 days</p>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={ENQUIRY_CHART} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="sp-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6d28d9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6d28d9" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }} />
              <Area type="monotone" dataKey="v" stroke="#6d28d9" strokeWidth={2} fill="url(#sp-grad)" dot={{ r: 3, fill: "#6d28d9", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-extrabold text-gray-900 mb-3">Profile Completion</h2>
          <div className="flex items-center gap-5">
            {/* Donut */}
            <div className="relative shrink-0">
              <PieChart width={100} height={100}>
                <Pie data={COMPLETION_PIE} cx={46} cy={46} innerRadius={32} outerRadius={46} startAngle={90} endAngle={-270} dataKey="v" strokeWidth={0}>
                  {COMPLETION_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-extrabold text-gray-900">{COMPLETION_PCT}%</p>
                <p className="text-[9px] text-gray-400 font-medium">Completed</p>
              </div>
            </div>
            {/* Checklist */}
            <div className="flex-1 space-y-1.5">
              {PROFILE_COMPLETION.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[11px]">
                  {item.done ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                  )}
                  <span className={item.done ? "text-gray-700 font-medium" : "text-gray-400"}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/school-panel/profile">
            <button className="w-full mt-4 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg py-2 hover:bg-gray-50 transition-colors">
              Complete Profile
            </button>
          </Link>
        </div>
      </div>

      {/* ── GO PREMIUM BANNER ───────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)" }}>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Crown className="h-5 w-5 text-yellow-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-extrabold text-sm">Go Premium</p>
            <p className="text-purple-200 text-[11px] leading-snug">Get more visibility, featured listing &amp; priority support.</p>
          </div>
          <Link to="/school-panel/subscription">
            <button className="bg-white text-purple-700 text-xs font-bold rounded-xl px-4 py-2.5 hover:bg-purple-50 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0">
              Upgrade Now <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
