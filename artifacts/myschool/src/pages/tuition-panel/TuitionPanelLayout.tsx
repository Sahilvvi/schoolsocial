import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, BookOpen, MessageSquare, Users, Bell, LogOut,
  Loader2, Menu, X, User, Image, GraduationCap, Star, IndianRupee,
  Building2, Clock, CheckCircle, Rss, CalendarDays, FileText,
  Briefcase, BarChart2, TrendingUp, Settings, CreditCard,
  HelpCircle, ChevronDown, ExternalLink, Crown, School
} from "lucide-react";
import {
  DUMMY_BATCHES, DUMMY_TUITION_ENQUIRIES, DUMMY_TUTOR_BOOKINGS,
  DUMMY_TUTORS, DUMMY_NOTIFICATIONS
} from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

/* ─── Nav structure ──────────────────────────────────── */
const NAV_SECTIONS = [
  {
    group: "MANAGE CENTER",
    items: [
      { label: "Profile Management",  path: "/tuition-panel/profile",   icon: User },
      { label: "Photos & Videos",     path: "/tuition-panel/gallery",   icon: Image },
      { label: "Courses & Subjects",  path: "/tuition-panel/courses",   icon: BookOpen },
      { label: "Batches",             path: "/tuition-panel/batches",   icon: GraduationCap },
      { label: "Teachers",            path: "/tuition-panel/tutors",    icon: Users },
      { label: "Fees & Payments",     path: "/tuition-panel/fees",      icon: IndianRupee },
      { label: "Facilities",          path: "/tuition-panel/facilities", icon: Building2 },
      { label: "Timings & Holidays",  path: "/tuition-panel/timings",   icon: Clock },
      { label: "Reviews",             path: "/tuition-panel/reviews",   icon: Star },
    ],
  },
  {
    group: "STUDENTS & ENQUIRIES",
    items: [
      { label: "Enquiries",           path: "/tuition-panel/enquiries", icon: MessageSquare, badge: 10, badgeColor: "bg-blue-600" },
      { label: "Student Applications",path: "/tuition-panel/applications", icon: FileText, badge: 18, badgeColor: "bg-blue-600" },
      { label: "Students",            path: "/tuition-panel/students",  icon: Users },
      { label: "Attendance",          path: "/tuition-panel/attendance",icon: CheckCircle },
    ],
  },
  {
    group: "SOCIAL & ENGAGEMENT",
    items: [
      { label: "Social Feed",         path: "/tuition-panel/feed",      icon: Rss, isNew: true },
      { label: "Events",              path: "/tuition-panel/events",    icon: CalendarDays },
      { label: "Blogs",               path: "/tuition-panel/blogs",     icon: FileText },
    ],
  },
  {
    group: "JOBS PORTAL",
    items: [
      { label: "Job Postings",        path: "/tuition-panel/jobs",      icon: Briefcase },
      { label: "Applications",        path: "/tuition-panel/job-apps",  icon: FileText, badge: 9, badgeColor: "bg-blue-600" },
    ],
  },
  {
    group: "ANALYTICS",
    items: [
      { label: "Analytics & Insights",path: "/tuition-panel/analytics", icon: BarChart2 },
      { label: "Leads Report",        path: "/tuition-panel/leads",     icon: TrendingUp },
      { label: "Performance",         path: "/tuition-panel/performance",icon: Star },
    ],
  },
  {
    group: "SETTINGS",
    items: [
      { label: "Account Settings",    path: "/tuition-panel/settings",  icon: Settings },
      { label: "Subscription",        path: "/tuition-panel/subscription", icon: CreditCard, isPremium: true },
      { label: "Help & Support",      path: "/tuition-panel/help",      icon: HelpCircle },
    ],
  },
];

const defaultCenter = {
  name: "Bright Minds Tuition Center",
  location: "Loni, Ghaziabad, Uttar Pradesh",
  phone: "+91 98765 00000",
  email: "info@brightminds.com",
  website: "www.brightminds.com",
  description: "Premium coaching center for Board and competitive exam preparation.",
  established: "2014",
  totalStudents: 156,
  branches: 2,
};

export default function TuitionPanelLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [centerData, setCenterData] = useState(() => getDemoData("tuition-profile", defaultCenter));
  const [batches, setBatches] = useState(() => getDemoData("tuition-batches", DUMMY_BATCHES));
  const [enquiries, setEnquiries] = useState(() => getDemoData("tuition-enquiries", DUMMY_TUITION_ENQUIRIES));
  const [bookings, setBookings] = useState(() => getDemoData("tuition-bookings", DUMMY_TUTOR_BOOKINGS));
  const tutors = DUMMY_TUTORS.slice(0, 4);
  const notifications = DUMMY_NOTIFICATIONS.filter((n: any) => n.user_id === "demo-tuition-001").length > 0
    ? DUMMY_NOTIFICATIONS.filter((n: any) => n.user_id === "demo-tuition-001")
    : [
        { id: "tn-1", user_id: "demo-tuition-001", title: "New Enquiry Received", message: "Rajesh Kumar is looking for Mathematics tuition.", type: "enquiry", link: "#", is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: "tn-2", user_id: "demo-tuition-001", title: "Batch Almost Full", message: "JEE Maths Batch A has 12/15 students.", type: "batch", link: "#", is_read: false, created_at: new Date(Date.now() - 172800000).toISOString() },
      ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;

  const updateCenter    = (u: any) => { setCenterData((p: any) => { const n = { ...p, ...u }; setDemoData("tuition-profile", n); return n; }); };
  const updateBatches   = (b: any[]) => { setBatches(b); setDemoData("tuition-batches", b); };
  const updateEnquiries = (e: any[]) => { setEnquiries(e); setDemoData("tuition-enquiries", e); };
  const updateBookings  = (b: any[]) => { setBookings(b); setDemoData("tuition-bookings", b); };

  const isActive = (path: string) =>
    path === "/tuition-panel"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ─── SIDEBAR ─────────────────────────────────────── */}
      <aside className={`w-[220px] bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-full z-40 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-base">
              <span className="text-blue-600">School</span>Social
            </span>
          </Link>
        </div>

        {/* Dashboard link (always visible, prominent) */}
        <div className="px-3 pt-3 shrink-0">
          <Link
            to="/tuition-panel"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isActive("/tuition-panel") && location.pathname === "/tuition-panel"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </Link>
        </div>

        {/* Nav Sections */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4 mt-2" style={{ scrollbarWidth: "none" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.group}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5">{section.group}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${
                        active ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <item.icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                        {item.label}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        {"badge" in item && item.badge && (
                          <span className={`text-white text-[10px] font-bold rounded-full px-1.5 py-0 leading-4 ${(item as any).badgeColor || "bg-blue-600"}`}>
                            {item.badge}
                          </span>
                        )}
                        {"isNew" in item && item.isNew && (
                          <span className="bg-red-500 text-white text-[9px] font-bold rounded px-1 py-0 leading-4">New</span>
                        )}
                        {"isPremium" in item && item.isPremium && (
                          <span className="bg-orange-500 text-white text-[9px] font-bold rounded px-1 py-0 leading-4">Premium</span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sign out */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" /> Sign Out
            </button>
          </div>
        </nav>

        {/* Go Premium Card */}
        <div className="mx-3 mb-4 rounded-xl overflow-hidden shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
          <div className="p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-yellow-300" />
              <span className="font-bold text-white text-xs">Go Premium</span>
            </div>
            <p className="text-purple-200 text-[11px] leading-snug mb-3">
              Get more visibility, priority listing and more enquiries.
            </p>
            <Link to="/tuition-panel/subscription">
              <button className="w-full bg-white text-purple-700 text-xs font-bold rounded-lg py-1.5 hover:bg-purple-50 transition-colors">
                Upgrade Now
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* ─── MAIN AREA ───────────────────────────────────── */}
      <div className="flex-1 md:ml-[220px] flex flex-col min-h-screen">

        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-4">
          {/* Mobile hamburger */}
          <button className="md:hidden text-gray-600 mr-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Center name */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-gray-900 text-sm truncate">{centerData.name}</span>
            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
          </div>

          <div className="flex-1" />

          {/* View Center Profile */}
          <Link to="/tuition/bright-future" className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap">
            View Center Profile <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          {/* Bell */}
          <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-orange-500 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">NS</span>
            </div>
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-xs font-semibold text-gray-900">Neha Sharma</p>
              <p className="text-[10px] text-gray-400">Center Admin</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ centerData, updateCenter, batches, updateBatches, enquiries, updateEnquiries, bookings, updateBookings, tutors, notifications }} />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
