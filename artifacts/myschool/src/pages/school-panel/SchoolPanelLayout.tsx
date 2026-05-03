import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolOwner } from "@/hooks/useSchoolOwner";
import {
  School, LayoutDashboard, ClipboardList, Image, BarChart3,
  Star, Calendar, Briefcase, BookOpen, QrCode, LogOut, ChevronLeft, Loader2, GraduationCap, Settings, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (authLoading || ownerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!ownership) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <School className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">No School Linked</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Your account isn't associated with a school profile yet. Claim your school or wait for admin approval.</p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link to="/upload-school">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-lg">Register Your School</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full h-11 rounded-lg text-slate-500">
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
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 truncate">
          <GraduationCap className="h-6 w-6 text-primary shrink-0" />
          <span className="font-bold text-white text-lg truncate">{school?.name || "School Panel"}</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 p-2 shrink-0">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <aside className={`w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed top-0 left-0 h-full z-40 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-slate-800 hidden md:block">
          <Link to="/school-panel" className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-sm block truncate leading-tight">{school?.name || "My School"}</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">School Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hidden-scrollbar">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/school-panel' && location.pathname.startsWith(item.path));
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

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Outlet context={{ school, ownership }} />
        </div>
      </main>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
