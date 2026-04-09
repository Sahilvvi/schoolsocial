import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolOwner } from "@/hooks/useSchoolOwner";
import {
  School, LayoutDashboard, ClipboardList, Image, BarChart3,
  Star, Calendar, Briefcase, BookOpen, QrCode, LogOut, ChevronLeft, Loader2, GraduationCap, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", path: "/school-panel", icon: LayoutDashboard },
  { label: "School Profile", path: "/school-panel/profile", icon: Settings },
  { label: "Admissions", path: "/school-panel/admissions", icon: ClipboardList },
  { label: "Gallery", path: "/school-panel/gallery", icon: Image },
  { label: "Analytics", path: "/school-panel/analytics", icon: BarChart3 },
  { label: "Reviews", path: "/school-panel/reviews", icon: Star },
  { label: "Events", path: "/school-panel/events", icon: Calendar },
  { label: "Jobs", path: "/school-panel/jobs", icon: Briefcase },
  { label: "ERP", path: "/school-panel/erp", icon: BookOpen },
  { label: "QR Orders", path: "/school-panel/qr-orders", icon: QrCode },
];

export default function SchoolPanelLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: ownership, isLoading: ownerLoading } = useSchoolOwner();
  const location = useLocation();

  if (authLoading || ownerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!ownership) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 max-w-md w-full text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <School className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">No School Linked</h1>
            <p className="text-muted-foreground">Your account isn't associated with a school profile yet. You might need to claim your school or wait for admin approval.</p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link to="/upload-school">
              <Button className="w-full erp-button-gradient h-12 rounded-xl">Register Your School</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full h-12 rounded-xl">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Marketplace
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const school = (ownership as any).schools;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-card/80 backdrop-blur-xl border-r border-border/30 flex flex-col fixed top-0 left-0 h-full z-50">
        <div className="p-5 border-b border-border/30">
          <Link to="/school-panel" className="flex items-center gap-2.5">
            <div className="gradient-primary p-2 rounded-lg shadow-md">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <span className="text-gradient font-extrabold text-sm block truncate">{school?.name || "My School"}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">School Panel</p>
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

      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet context={{ school, ownership }} />
      </main>
    </div>
  );
}
