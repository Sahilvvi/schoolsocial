import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolOwner } from "@/hooks/useSchoolOwner";
import {
  School, LayoutDashboard, Image, BarChart3, Star, Calendar,
  Briefcase, LogOut, Loader2, Settings, Menu, X, Bell, ChevronDown,
  ChevronLeft, ExternalLink, Crown, User, Rss, HelpCircle, CreditCard,
  Building2, Users, MessageSquare, FileText, TrendingUp, Eye,
  BookOpen, MoreHorizontal, IndianRupee
} from "lucide-react";
import { useState } from "react";

/* ─── Nav sections — matches reference screenshot ─────────── */
const NAV_SECTIONS = [
  {
    group: "MANAGE",
    items: [
      { label: "Profile Management", path: "/school-panel/profile",    icon: User },
      { label: "Photos & Videos",    path: "/school-panel/gallery",    icon: Image },
      { label: "Courses & Batches",  path: "/school-panel/courses",    icon: BookOpen },
      { label: "Fees & Admission",   path: "/school-panel/fees",       icon: IndianRupee },
      { label: "Facilities",         path: "/school-panel/facilities", icon: Building2 },
      { label: "Teachers",           path: "/school-panel/teachers",   icon: Users },
      { label: "Reviews",            path: "/school-panel/reviews",    icon: Star },
    ],
  },
  {
    group: "SOCIAL & ENGAGEMENT",
    items: [
      { label: "Social Feed",        path: "/school-panel/feed",       icon: Rss,       isNew: true },
      { label: "Events",             path: "/school-panel/events",     icon: Calendar },
      { label: "Blogs",              path: "/school-panel/blogs",      icon: FileText },
    ],
  },
  {
    group: "INQUIRIES & LEADS",
    items: [
      { label: "Enquiries",          path: "/school-panel/enquiries",  icon: MessageSquare, badge: 12, badgeColor: "bg-blue-600" },
      { label: "Student Applications",path:"/school-panel/admissions", icon: FileText,      badge: 5,  badgeColor: "bg-blue-600" },
    ],
  },
  {
    group: "JOB PORTAL",
    items: [
      { label: "Job Postings",       path: "/school-panel/jobs",       icon: Briefcase },
      { label: "Applications",       path: "/school-panel/job-apps",   icon: FileText, badge: 18, badgeColor: "bg-blue-600" },
    ],
  },
  {
    group: "ANALYTICS",
    items: [
      { label: "Analytics & Insights", path: "/school-panel/analytics", icon: BarChart3 },
      { label: "Profile Views",        path: "/school-panel/views",     icon: Eye },
      { label: "Leads Report",         path: "/school-panel/leads",     icon: TrendingUp },
    ],
  },
  {
    group: "SETTINGS",
    items: [
      { label: "Account Settings",   path: "/school-panel/settings",      icon: Settings },
      { label: "Subscription",       path: "/school-panel/subscription",  icon: CreditCard, isPremium: true },
      { label: "Help & Support",     path: "/school-panel/help",          icon: HelpCircle },
    ],
  },
];

/* ─── Mobile bottom tabs ────────────────────────────────────── */
const BOTTOM_TABS = [
  { label: "Dashboard",    path: "/school-panel",            icon: LayoutDashboard },
  { label: "Enquiries",    path: "/school-panel/enquiries",  icon: MessageSquare, badge: 12 },
  { label: "Applications", path: "/school-panel/admissions", icon: FileText,      badge: 5  },
  { label: "Events",       path: "/school-panel/events",     icon: Calendar },
  { label: "More",         path: "/school-panel/profile",    icon: MoreHorizontal },
];

export default function SchoolPanelLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: ownership, isLoading: ownerLoading } = useSchoolOwner();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (authLoading || ownerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!ownership) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-xl max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center">
            <School className="h-10 w-10 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">No School Linked</h1>
            <p className="text-gray-500 text-sm">Your account isn't associated with a school profile yet.</p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link to="/upload-school">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-lg font-semibold transition-colors">
                Register Your School
              </button>
            </Link>
            <Link to="/">
              <button className="w-full h-11 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                <ChevronLeft className="h-4 w-4" /> Back to Marketplace
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const school = (ownership as any).schools;

  const isActive = (path: string) =>
    path === "/school-panel"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ─── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className={`
          w-[220px] bg-white border-r border-gray-200 flex flex-col
          fixed top-0 left-0 h-full z-40 transition-transform duration-300
          md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-[15px] tracking-tight">
              <span className="text-blue-600">School</span>Social
            </span>
          </Link>
        </div>

        {/* Blue Dashboard button */}
        <div className="px-3 pt-3 shrink-0">
          <Link
            to="/school-panel"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === "/school-panel"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </Link>
        </div>

        {/* Scrollable nav */}
        <nav
          className="flex-1 overflow-y-auto px-3 pb-3 mt-2 space-y-3"
          style={{ scrollbarWidth: "none" }}
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.group}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path + item.label}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-[7px] rounded-lg text-[13px] transition-all group ${
                        active
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <item.icon
                          className={`h-[14px] w-[14px] shrink-0 ${
                            active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0 ml-1">
                        {"badge" in item && item.badge != null && (
                          <span
                            className={`text-white text-[10px] font-bold rounded-full px-1.5 leading-4 ${
                              (item as any).badgeColor || "bg-blue-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {"isNew" in item && (item as any).isNew && (
                          <span className="bg-red-500 text-white text-[9px] font-bold rounded px-1 leading-4">New</span>
                        )}
                        {"isPremium" in item && (item as any).isPremium && (
                          <span className="bg-orange-500 text-white text-[9px] font-bold rounded px-1 leading-4">Premium</span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-[13px] text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-[14px] w-[14px] shrink-0" /> Sign Out
            </button>
          </div>
        </nav>

        {/* Go Premium card */}
        <div
          className="mx-3 mb-4 rounded-xl overflow-hidden shrink-0"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
        >
          <div className="p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="h-4 w-4 text-yellow-300" />
              <span className="font-bold text-white text-xs">Go Premium</span>
            </div>
            <p className="text-purple-200 text-[11px] leading-snug mb-3">
              Unlock more visibility and attract more students.
            </p>
            <Link to="/school-panel/subscription">
              <button className="w-full bg-white text-purple-700 text-xs font-bold rounded-lg py-1.5 hover:bg-purple-50 transition-colors">
                Upgrade Now
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* ─── MAIN AREA ───────────────────────────────────────── */}
      <div className="flex-1 md:ml-[220px] flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-4">
          {/* Mobile hamburger */}
          <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Mobile logo */}
          <Link to="/" className="md:hidden flex items-center gap-1.5">
            <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-[15px]">
              <span className="text-blue-600">School</span>Social
            </span>
          </Link>

          {/* Desktop: school name */}
          <div className="hidden md:flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-gray-900 text-sm truncate">
              {school?.name || "Greenfield Public School"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
          </div>

          <div className="flex-1" />

          {/* View School Profile */}
          <Link
            to={school ? `/school/${school.slug}` : "/"}
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            View School Profile <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          {/* Bell */}
          <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">1</span>
          </button>

          {/* User info */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden shrink-0">
              {school?.banner ? (
                <img src={school.banner} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">RS</span>
              )}
            </div>
            <div className="hidden lg:block leading-tight">
              <p className="text-xs font-semibold text-gray-900">Ravi Sharma</p>
              <p className="text-[10px] text-gray-500">School Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Mobile avatar only */}
          <div className="md:hidden h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">RS</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ school, ownership }} />
          </div>
        </main>

        {/* Mobile bottom tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 flex items-center">
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const active =
              tab.path === "/school-panel"
                ? location.pathname === tab.path
                : location.pathname.startsWith(tab.path);
            return (
              <Link key={tab.label} to={tab.path} className="flex-1 flex flex-col items-center gap-0.5 py-1">
                <div className="relative">
                  <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
                  {"badge" in tab && tab.badge && (
                    <span className="absolute -top-1.5 -right-2 h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${active ? "text-blue-600" : "text-gray-400"}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
