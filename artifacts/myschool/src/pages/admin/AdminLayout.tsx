import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import {
  GraduationCap, School, Calendar, Briefcase, BookOpen, Newspaper,
  ClipboardList, Users, MessageSquare, LayoutDashboard, LogOut, Loader2, ChevronLeft, HelpCircle, Star, QrCode, UserCheck, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Schools", path: "/admin/schools", icon: School },
  { label: "Events", path: "/admin/events", icon: Calendar },
  { label: "Jobs", path: "/admin/jobs", icon: Briefcase },
  { label: "Tutors", path: "/admin/tutors", icon: BookOpen },
  { label: "News", path: "/admin/news", icon: Newspaper },
  { label: "Admissions", path: "/admin/admissions", icon: ClipboardList },
  { label: "Job Apps", path: "/admin/job-applications", icon: Users },
  { label: "Bookings", path: "/admin/tutor-bookings", icon: MessageSquare },
  { label: "Tuition Leads", path: "/admin/tuition-enquiries", icon: HelpCircle },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "QR Orders", path: "/admin/qr-orders", icon: QrCode },
  { label: "Batches", path: "/admin/batches", icon: UserCheck },
];

export default function AdminLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <GraduationCap className="h-16 w-16 text-destructive/50" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
        <Link to="/"><Button variant="outline"><ChevronLeft className="h-4 w-4 mr-2" />Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-white text-lg">MySchool Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 p-2">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed top-0 left-0 h-full z-40 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-slate-800 hidden md:block">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight">MySchool</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hidden-scrollbar">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"}`}
              >
                <item.icon className={`h-4 w-4 ${active ? "text-primary" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/50">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-900">
              <ChevronLeft className="h-4 w-4 mr-2" />Back to Site
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
