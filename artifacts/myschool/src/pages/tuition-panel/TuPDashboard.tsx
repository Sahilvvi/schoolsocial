import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";
import {
  Eye, MessageSquare, UserCheck, Users, Star,
  Edit, Image, FileText, Plus, UserPlus, Bell,
  CalendarDays, ChevronRight, TrendingUp, ArrowUpRight,
  Phone, MapPin, CheckCircle
} from "lucide-react";

/* ─── Demo / static data ─────────────────────────────── */
const ENQUIRY_CHART_DATA = [
  { date: "1 May",  value: 18 },
  { date: "7 May",  value: 28 },
  { date: "14 May", value: 22 },
  { date: "21 May", value: 42 },
  { date: "26 May", value: 35 },
];

const SPARKLINE = [12, 18, 14, 22, 19, 28, 24, 32, 28, 36];
const SPARKLINE2 = [8, 14, 10, 18, 12, 20, 15, 22, 18, 28];
const SPARKLINE3 = [5, 8, 6, 12, 9, 14, 11, 18, 14, 22];
const SPARKLINE4 = [20, 24, 22, 28, 25, 30, 28, 34, 30, 36];

const PIE_DATA = [
  { name: "SchoolSocial", value: 42, color: "#3b82f6" },
  { name: "Direct Search", value: 25, color: "#1e3a5f" },
  { name: "Social Media",  value: 16, color: "#f97316" },
  { name: "Referrals",     value: 10, color: "#22c55e" },
  { name: "Others",        value:  6, color: "#d1d5db" },
];

const DEMO_BATCHES = [
  { name: "Class 10th – Foundation",  class: "Class 10 / Maths, Science",    teacher: "Rahul Verma",  initials: "RV", color: "bg-blue-500",   students: 28, timing: "Mon – Fri, 5:00 PM",   active: true },
  { name: "Class 12th – Board",       class: "Class 12 / Physics, Chemistry", teacher: "Nisha Sharma", initials: "NS", color: "bg-pink-500",   students: 24, timing: "Mon – Sat, 6:30 PM",   active: true },
  { name: "Class 9th – Achievers",    class: "Class 9 / All Subjects",        teacher: "Amit Singh",   initials: "AS", color: "bg-green-500",  students: 32, timing: "Mon – Fri, 4:00 PM",   active: true },
  { name: "JEE Foundation",           class: "JEE / Physics, Maths",          teacher: "Vikram Mehta", initials: "VM", color: "bg-purple-500", students: 20, timing: "Tue – Sun, 7:00 PM",   active: true },
];

const DEMO_ENQUIRIES = [
  { name: "Priya Verma",  info: "Class 10th – Maths",      ago: "2h ago",  status: "New",         statusColor: "bg-blue-100 text-blue-700",   initials: "PV", color: "bg-blue-500"   },
  { name: "Aarav Patel",  info: "Class 11th – Physics",    ago: "5h ago",  status: "New",         statusColor: "bg-blue-100 text-blue-700",   initials: "AP", color: "bg-orange-500" },
  { name: "Risika Kumar", info: "JEE Foundation",           ago: "14h ago", status: "Contacted",   statusColor: "bg-yellow-100 text-yellow-700", initials: "RK", color: "bg-teal-500"   },
  { name: "Deepak Kumar", info: "Class 9 / All Subjects",  ago: "16h ago", status: "In Progress", statusColor: "bg-purple-100 text-purple-700", initials: "DK", color: "bg-indigo-500" },
  { name: "Simran Kaur",  info: "Class 11th – Chemistry",  ago: "3d ago",  status: "In Progress", statusColor: "bg-purple-100 text-purple-700", initials: "SK", color: "bg-red-400"    },
];

const DEMO_REVIEWS = [
  { name: "Ananya Gupta", initials: "AG", color: "bg-green-500",  rating: 5,   ago: "2 days ago",  text: "Best tuition center! Teachers are very supportive and explain concepts really well." },
  { name: "Rohit Sharma", initials: "RS", color: "bg-blue-500",   rating: 4,   ago: "1 week ago",  text: "Great environment and regular tests help a lot." },
  { name: "Meera Joshi",  initials: "MJ", color: "bg-orange-500", rating: 4.5, ago: "2 weeks ago", text: "Very satisfied with the teaching quality and personal attention." },
];

const DEMO_NOTICES = [
  { title: "Summer Crash Course 2024",       desc: "Admissions open for Class 9th & 10th (All Subjects)",    date: "Posted on 25 May 2024", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&q=80", status: "Published" },
  { title: "New Batch for Class 11th (Science)", desc: "Batch starting from 1st June 2024, limited seats!",  date: "Posted on 20 May 2024", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=80&q=80", status: "Published" },
  { title: "Weekly Test Schedule",           desc: "Weekly tests for all batches will start from this Sunday.", date: "Posted on 18 May 2024", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=80&q=80", status: "Published" },
];

const QUICK_ACTIONS = [
  { icon: Edit,        label: "Edit Profile",    to: "/tuition-panel/profile",   color: "bg-blue-100",   iconColor: "text-blue-600"   },
  { icon: Image,       label: "Add Photos",      to: "/tuition-panel/gallery",   color: "bg-purple-100", iconColor: "text-purple-600" },
  { icon: FileText,    label: "Create Post",     to: "/tuition-panel/feed",      color: "bg-green-100",  iconColor: "text-green-600"  },
  { icon: Plus,        label: "Add Batch",       to: "/tuition-panel/batches",   color: "bg-orange-100", iconColor: "text-orange-500" },
  { icon: UserPlus,    label: "Add Student",     to: "/tuition-panel/students",  color: "bg-teal-100",   iconColor: "text-teal-600"   },
  { icon: Bell,        label: "Send Notice",     to: "/tuition-panel/feed",      color: "bg-yellow-100", iconColor: "text-yellow-600" },
  { icon: CalendarDays,label: "Add Event",       to: "/tuition-panel/events",    color: "bg-pink-100",   iconColor: "text-pink-600"   },
  { icon: MessageSquare,label:"View Enquiries",  to: "/tuition-panel/enquiries", color: "bg-indigo-100", iconColor: "text-indigo-600" },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : s - 0.5 <= rating ? "fill-amber-200 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

export default function TuPDashboard() {
  const { centerData, enquiries: liveEnquiries, batches: liveBatches } = useOutletContext<any>();

  const newEnquiries = (liveEnquiries || DEMO_ENQUIRIES).filter((e: any) => e.status === "new").length;
  const totalStudents = (liveBatches || DEMO_BATCHES).reduce((s: number, b: any) => s + (b.current_students ?? b.students ?? 0), 0);

  return (
    <div className="space-y-5 pb-6">

      {/* ── WELCOME BANNER ──────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              Welcome back, {centerData?.name || "Bright Minds Tuition Center"}! <span>👋</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening at your center today.</p>
          </div>
          {/* Illustration */}
          <div className="shrink-0 hidden sm:block">
            <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background blob */}
              <ellipse cx="90" cy="50" rx="48" ry="38" fill="#EEF2FF" />
              {/* Teacher */}
              <circle cx="60" cy="22" r="10" fill="#f97316" />
              <rect x="50" y="32" width="20" height="28" rx="6" fill="#3b82f6" />
              <rect x="44" y="36" width="8" height="18" rx="4" fill="#3b82f6" />
              <rect x="68" y="36" width="8" height="18" rx="4" fill="#3b82f6" />
              <rect x="50" y="60" width="8" height="16" rx="4" fill="#1e3a5f" />
              <rect x="62" y="60" width="8" height="16" rx="4" fill="#1e3a5f" />
              {/* Board */}
              <rect x="80" y="18" width="50" height="36" rx="4" fill="#22c55e" />
              <rect x="84" y="22" width="42" height="28" rx="2" fill="#16a34a" />
              <line x1="88" y1="30" x2="122" y2="30" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="88" y1="36" x2="116" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="88" y1="42" x2="120" y2="42" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              {/* Students */}
              <circle cx="98" cy="68" r="7" fill="#a78bfa" />
              <rect x="91" y="75" width="14" height="14" rx="5" fill="#7c3aed" />
              <circle cx="113" cy="68" r="7" fill="#fbbf24" />
              <rect x="106" y="75" width="14" height="14" rx="5" fill="#d97706" />
              <circle cx="128" cy="68" r="7" fill="#34d399" />
              <rect x="121" y="75" width="14" height="14" rx="5" fill="#059669" />
              {/* Plants */}
              <ellipse cx="18" cy="78" rx="12" ry="8" fill="#86efac" />
              <rect x="15" y="76" width="5" height="12" rx="2" fill="#16a34a" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Profile Views",      value: "1,245", pct: "+18.7%", data: SPARKLINE,  iconBg: "bg-purple-100", icon: <Eye className="h-4 w-4 text-purple-600" />,       lineColor: "#a855f7" },
          { label: "Enquiries",          value: "65",    pct: "+16.3%", data: SPARKLINE2, iconBg: "bg-green-100",  icon: <MessageSquare className="h-4 w-4 text-green-600" />, lineColor: "#22c55e" },
          { label: "Student Admissions", value: "28",    pct: "+21.2%", data: SPARKLINE3, iconBg: "bg-blue-100",   icon: <UserCheck className="h-4 w-4 text-blue-600" />,     lineColor: "#3b82f6" },
          { label: "Total Students",     value: "156",   pct: "+8.4%",  data: SPARKLINE4, iconBg: "bg-orange-100", icon: <Users className="h-4 w-4 text-orange-500" />,       lineColor: "#f97316" },
          { label: "Avg. Rating", value: "4.6", isRating: true, reviews: "86 Reviews" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
            {"icon" in stat && (
              <div className="flex items-center justify-between mb-1">
                <div className={`h-8 w-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>{stat.icon}</div>
                <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{stat.pct}</span>
              </div>
            )}
            <p className="text-[11px] text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            {stat.isRating ? (
              <>
                <StarRating rating={4.6} />
                <p className="text-[11px] text-gray-400">{stat.reviews}</p>
              </>
            ) : (
              <>
                <p className="text-[11px] text-green-600 font-medium">{stat.pct} this month</p>
                <div className="mt-1">
                  <Sparkline data={stat.data!} color={stat.lineColor!} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS + RECENT NOTICES ──────────────── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-extrabold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.to} className="flex flex-col items-center gap-2 group">
                  <div className={`h-12 w-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className={`h-5 w-5 ${action.iconColor}`} />
                  </div>
                  <p className="text-[10px] text-gray-600 font-medium text-center leading-tight">{action.label}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Notices / Posts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-extrabold text-gray-900">Recent Notices / Posts</h2>
            <Link to="/tuition-panel/feed" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">View All <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DEMO_NOTICES.map((notice) => (
              <div key={notice.title} className="flex gap-3 px-5 py-3 items-start hover:bg-gray-50 transition-colors">
                <img src={notice.img} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-1">{notice.title}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{notice.desc}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{notice.date}</p>
                </div>
                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded shrink-0">{notice.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ENQUIRIES CHART + SOURCES PIE ───────────────── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Enquiries Overview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-extrabold text-gray-900">Enquiries Overview</h2>
            <button className="text-[11px] text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-gray-50">
              Last 30 Days <ChevronRight className="h-3 w-3 rotate-90" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={ENQUIRY_CHART_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="eq-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#eq-grad)" dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Enquiry Sources */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-extrabold text-gray-900 mb-4">Top Enquiry Sources</h2>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <PieChart width={130} height={130}>
                <Pie data={PIE_DATA} cx={60} cy={60} innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={2}>
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-extrabold text-gray-900">65</p>
                <p className="text-[10px] text-gray-400 text-center leading-tight">Total<br/>Enquiries</p>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── YOUR BATCHES TABLE ───────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-extrabold text-gray-900">Your Batches</h2>
          <Link to="/tuition-panel/batches" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">View All <ChevronRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold">
                <th className="text-left px-5 py-2.5">Batch Name</th>
                <th className="text-left px-4 py-2.5">Class / Subject</th>
                <th className="text-left px-4 py-2.5">Teacher</th>
                <th className="text-left px-4 py-2.5">Students</th>
                <th className="text-left px-4 py-2.5">Timings</th>
                <th className="text-left px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEMO_BATCHES.map((batch) => (
                <tr key={batch.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-gray-900">{batch.name}</td>
                  <td className="px-4 py-3 text-gray-500">{batch.class}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-6 w-6 rounded-full ${batch.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{batch.initials}</span>
                      <span className="text-gray-700 font-medium">{batch.teacher}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-semibold">{batch.students}</td>
                  <td className="px-4 py-3 text-gray-500">{batch.timing}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-50">
          <Link to="/tuition-panel/batches">
            <button className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700">
              <Plus className="h-3.5 w-3.5" /> Add New Batch
            </button>
          </Link>
        </div>
      </div>

      {/* ── RECENT ENQUIRIES + RECENT REVIEWS ───────────── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Recent Enquiries */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-extrabold text-gray-900">Recent Enquiries</h2>
            <Link to="/tuition-panel/enquiries" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">View All <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DEMO_ENQUIRIES.map((enq) => (
              <div key={enq.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <span className={`h-8 w-8 rounded-full ${enq.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{enq.initials}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{enq.name}</p>
                  <p className="text-[11px] text-gray-400">{enq.info}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-gray-400">{enq.ago}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${enq.statusColor}`}>{enq.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-extrabold text-gray-900">Recent Reviews</h2>
            <Link to="/tuition-panel/reviews" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">View All <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DEMO_REVIEWS.map((rev) => (
              <div key={rev.name} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <span className={`h-8 w-8 rounded-full ${rev.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5`}>{rev.initials}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-gray-900">{rev.name}</p>
                    <span className="text-[10px] text-gray-400 shrink-0">{rev.ago}</span>
                  </div>
                  <StarRating rating={rev.rating} />
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug line-clamp-2">{rev.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM UPGRADE BANNER ───────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <TrendingUp className="h-5 w-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-gray-900">Increase Admissions &amp; Grow Your Center</p>
          <p className="text-[11px] text-gray-500">Get premium features to reach more students and parents.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Star className="h-4 w-4 text-gray-300" />
          <MapPin className="h-4 w-4 text-gray-300" />
          <CheckCircle className="h-4 w-4 text-gray-300" />
          <ArrowUpRight className="h-4 w-4 text-gray-300" />
          <Link to="/tuition-panel/subscription">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg px-4 py-2 transition-colors">Upgrade Now</button>
          </Link>
        </div>
      </div>

    </div>
  );
}
