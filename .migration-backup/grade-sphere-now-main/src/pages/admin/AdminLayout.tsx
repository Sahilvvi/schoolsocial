import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import {
  GraduationCap, School, Calendar, Briefcase, BookOpen, Newspaper,
  ClipboardList, Users, MessageSquare, LayoutDashboard, LogOut, Loader2, ChevronLeft, HelpCircle, Star, QrCode, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <GraduationCap className="h-16 w-16 text-destructive/50" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
        <Link to="/"><Button variant="outline"><ChevronLeft className="h-4 w-4 mr-2" />Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card/80 backdrop-blur-xl border-r border-border/30 flex flex-col fixed top-0 left-0 h-full z-50">
        <div className="p-5 border-b border-border/30">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="gradient-primary p-2 rounded-lg shadow-md">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-gradient font-extrabold text-lg">MySchool</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-accent/30"}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/30 space-y-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
              <ChevronLeft className="h-4 w-4 mr-2" />Back to Site
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive/70 hover:text-destructive" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
