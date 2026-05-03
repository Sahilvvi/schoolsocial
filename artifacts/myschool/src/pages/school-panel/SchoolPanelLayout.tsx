import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolOwner } from "@/hooks/useSchoolOwner";
import {
  School, LayoutDashboard, ClipboardList, Image, BarChart3, Star,
  Calendar, Briefcase, LogOut, Loader2, Settings, Menu, X, Bell,
  ChevronDown, ChevronLeft, ExternalLink, Crown, User, GraduationCap,
  Rss, HelpCircle, CreditCard, Building2, Clock, MessageSquare,
  FileText, Users, CheckCircle, TrendingUp, MoreHorizontal
} from "lucide-react";
import { useState } from "react";

/* ─── Sidebar nav sections ────────────────────────────────── */
const NAV_SECTIONS = [
  {
    group: "MANAGE SCHOOL",
    items: [
      { label: "Profile Management",  path: "/school-panel/profile",       icon: User },
      { label: "Photos & Videos",     path: "/school-panel/gallery",       icon: Image },
      { label: "Admissions",          path: "/school-panel/admissions",    icon: ClipboardList },
      { label: "Facilities",          path: "/school-panel/facilities",    icon: Building2 },
      { label: "Fees & Structure",    path: "/school-panel/fees",          icon: GraduationCap },
      { label: "Timings & Holidays",  path: "/school-panel/timings",       icon: Clock },
      { label: "Reviews",             path: "/school-panel/reviews",       icon: Star },
    ],
  },
  {
    group: "STUDENTS & ENQUIRIES",
    items: [
      { label: "Enquiries",           path: "/school-panel/enquiries",     icon: MessageSquare, badge: 12, badgeColor: "bg-blue-600" },
      { label: "Applications",        path: "/school-panel/admissions",    icon: FileText,      badge: 5,  badgeColor: "bg-blue-600" },
      { label: "Students",            path: "/school-panel/students",      icon: Users },
      { label: "Attendance",          path: "/school-panel/attendance",    icon: CheckCircle },
    ],
  },
  {
    group: "SOCIAL & ENGAGEMENT",
    items: [
      { label: "Social Feed",         path: "/school-panel/feed",          icon: Rss, isNew: true },
      { label: "Events",              path: "/school-panel/events",        icon: Calendar },
      { label: "Jobs",                path: "/school-panel/jobs",          icon: Briefcase },
    ],
  },
  {
    group: "ANALYTICS",
    items: [
      { label: "Analytics & Insights",path: "/school-panel/analytics",    icon: BarChart3 },
      { label: "Performance",         path: "/school-panel/performance",   icon: TrendingUp },
    ],
  },
  {
    group: "SETTINGS",
    items: [
      { label: "Account Settings",    path: "/school-panel/settings",      icon: Settings },
      { label: "Subscription",        path: "/school-panel/subscription",  icon: CreditCard, isPremium: true },
      { label: "Help & Support",      path: "/school-panel/help",          icon: HelpCircle },
    ],
  },
];

/* ─── Mobile bottom tabs ──────────────────────────────────── */
const BOTTOM_TABS = [
  { label: "Dashboard",    path: "/school-panel",             icon: LayoutDashboard },
  { label: "Enquiries",    path: "/school-panel/enquiries",   icon: MessageSquare,  badge: 12 },
  { label: "Applications", path: "/school-panel/admissions",  icon: FileText,       badge: 5  },
  { label: "Events",       path: "/school-panel/events",      icon: Calendar },
  { label: "More",         path: "/school-panel/profile",     icon: MoreHorizontal },
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
            <p className="text-gray-500 text-sm">Your account isn't associated with a school profile yet. Register your school to access the panel.</p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link to="/upload-school">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-lg font-semibold transition-colors">Register Your School</button>
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

      {/* ─── DESKTOP SIDEBAR ─────────────────────────────── */}
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

        {/* Dashboard link */}
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

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4 mt-2" style={{ scrollbarWidth: "none" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.group}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5">{section.group}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path + item.label}
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

          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" /> Sign Out
            </button>
          </div>
        </nav>

        {/* Go Premium */}
        <div className="mx-3 mb-4 rounded-xl overflow-hidden shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
          <div className="p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-yellow-300" />
              <span className="font-bold text-white text-xs">Go Premium</span>
            </div>
            <p className="text-purple-200 text-[11px] leading-snug mb-3">
              Get more visibility, priority listing and more enquiries.
            </p>
            <Link to="/school-panel/subscription">
              <button className="w-full bg-white text-purple-700 text-xs font-bold rounded-lg py-1.5 hover:bg-purple-50 transition-colors">
                Upgrade Now
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* ─── MAIN AREA ───────────────────────────────────── */}
      <div className="flex-1 md:ml-[220px] flex flex-col min-h-screen">

        {/* Top Header (desktop) / Mobile header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-4">
          {/* Mobile hamburger */}
          <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Mobile: SchoolSocial logo */}
          <Link to="/" className="md:hidden flex items-center gap-1.5">
            <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-base">
              <span className="text-blue-600">School</span>Social
            </span>
          </Link>

          {/* Desktop: Center name */}
          <div className="hidden md:flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-gray-900 text-sm truncate">{school?.name || "My School"}</span>
            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
          </div>

          <div className="flex-1" />

          {/* View School Profile */}
          <Link to={school ? `/school/${school.slug}` : "/"} className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap">
            View School Profile <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          {/* Bell */}
          <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">2</span>
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden shrink-0">
              {school?.banner ? (
                <img src={school.banner} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">SC</span>
              )}
            </div>
            <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ school, ownership }} />
          </div>
        </main>

        {/* ─── MOBILE BOTTOM TAB BAR ───────────────────── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 flex items-center">
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = tab.path === "/school-panel"
              ? location.pathname === tab.path
              : location.pathname.startsWith(tab.path);
            return (
              <Link key={tab.label} to={tab.path} className="flex-1 flex flex-col items-center gap-1 py-1">
                <div className="relative">
                  <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
                  {"badge" in tab && tab.badge && (
                    <span className="absolute -top-1.5 -right-2 h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${active ? "text-blue-600" : "text-gray-400"}`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
