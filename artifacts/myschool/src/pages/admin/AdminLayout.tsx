import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import {
  GraduationCap, School, Calendar, Briefcase, BookOpen, Newspaper,
  ClipboardList, Users, MessageSquare, LayoutDashboard, LogOut,
  Loader2, ChevronLeft, HelpCircle, Star, QrCode, UserCheck, Menu, X, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV_GROUPS = [
  {
    group: "OVERVIEW",
    items: [
      { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    group: "CONTENT",
    items: [
      { label: "Schools",  path: "/admin/schools", icon: School },
      { label: "Events",   path: "/admin/events",  icon: Calendar },
      { label: "Jobs",     path: "/admin/jobs",    icon: Briefcase },
      { label: "Tutors",   path: "/admin/tutors",  icon: BookOpen },
      { label: "News",     path: "/admin/news",    icon: Newspaper },
    ],
  },
  {
    group: "APPLICATIONS",
    items: [
      { label: "Admissions",     path: "/admin/admissions",        icon: ClipboardList },
      { label: "Job Apps",       path: "/admin/job-applications",  icon: Users },
      { label: "Bookings",       path: "/admin/tutor-bookings",    icon: MessageSquare },
      { label: "Tuition Leads",  path: "/admin/tuition-enquiries", icon: HelpCircle },
    ],
  },
  {
    group: "MODERATION",
    items: [
      { label: "Reviews",   path: "/admin/reviews",   icon: Star },
      { label: "QR Orders", path: "/admin/qr-orders", icon: QrCode },
      { label: "Batches",   path: "/admin/batches",   icon: UserCheck },
    ],
  },
];

export default function AdminLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center">
          <Shield className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-500">You don't have admin privileges.</p>
        <Link to="/">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeft className="h-4 w-4 mr-2" />Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50/70">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">MySchool</span>
            <span className="text-[10px] text-slate-400 font-semibold ml-1.5 uppercase tracking-widest">Admin</span>
          </div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-slate-200/80 flex flex-col fixed top-0 left-0 h-full z-40
        transition-transform duration-300 ease-out shadow-sm
        md:translate-x-0
        ${mobileMenuOpen ? "translate-x-0 pt-14 md:pt-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100 hidden md:block">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="h-9 w-9 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight">MySchool</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold -mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar space-y-5">
          {NAV_GROUPS.map((section) => (
            <div key={section.group}>
              <p className="px-3 mb-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location.pathname === item.path ||
                    (item.path !== "/admin" && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150
                        ${active
                          ? "bg-primary/8 text-primary"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}
                      `}
                    >
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${
                        active ? "bg-primary/15" : "bg-slate-100 group-hover:bg-slate-200"
                      }`}>
                        <item.icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-slate-400"}`} />
                      </div>
                      {item.label}
                      {active && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all">
              <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
              </div>
              Back to Site
            </button>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <div className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center">
              <LogOut className="h-3.5 w-3.5 text-red-400" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 min-h-screen">
        <div className="p-5 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
