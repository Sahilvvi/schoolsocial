import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Baby, ClipboardList, Heart, BookOpen,
  IndianRupee, Bell, LogOut, ChevronLeft, Loader2, User, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isDemoEmail, DUMMY_ADMISSIONS, DUMMY_TUTOR_BOOKINGS, DUMMY_SCHOOLS,
  DUMMY_NOTIFICATIONS, DUMMY_HOMEWORK, DUMMY_FEE_RECORDS
} from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

const navItems = [
  { label: "Dashboard", path: "/parent-panel", icon: LayoutDashboard },
  { label: "My Children", path: "/parent-panel/children", icon: Baby },
  { label: "Admissions", path: "/parent-panel/admissions", icon: ClipboardList },
  { label: "Saved Schools", path: "/parent-panel/saved", icon: Heart },
  { label: "Tutor Bookings", path: "/parent-panel/bookings", icon: BookOpen },
  { label: "Fee Records", path: "/parent-panel/fees", icon: IndianRupee },
  { label: "Notifications", path: "/parent-panel/notifications", icon: Bell },
];

const PARENT_DUMMY_ADMISSIONS = DUMMY_ADMISSIONS.filter(a =>
  a.parent_name === "Rajesh Kumar" || a.parent_name === "Vikram Patel"
).slice(0, 4).map(a => ({
  ...a,
  schools: DUMMY_SCHOOLS.find(s => s.id === a.school_id) || { name: "Delhi Public School", slug: "delhi-public-school" },
}));

const PARENT_DUMMY_BOOKINGS = DUMMY_TUTOR_BOOKINGS.filter(b =>
  b.name === "Rajesh Kumar" || b.name === "Vikram Patel"
).map(b => ({
  ...b,
  tutors: { name: b.tutor_id === "tutor-001" ? "Priya Sharma" : "Dr. Amit Verma", subject: b.tutor_id === "tutor-001" ? "Mathematics" : "Physics" },
}));

const PARENT_DUMMY_SAVED = DUMMY_SCHOOLS.slice(0, 3).map((s, i) => ({
  id: `saved-${i + 1}`,
  user_id: "demo-parent-001",
  schools: s,
  created_at: new Date().toISOString(),
}));

const PARENT_NOTIFICATIONS = DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-parent-001");
const PARENT_HOMEWORK = DUMMY_HOMEWORK.slice(0, 3);
const PARENT_FEES = DUMMY_FEE_RECORDS.filter(f => f.person_name === "Arjun Patel" || f.person_name === "Ishaan Kumar");

export default function ParentPanelLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [admissions, setAdmissions] = useState(() => getDemoData("parent-admissions", PARENT_DUMMY_ADMISSIONS));
  const [savedSchools, setSavedSchools] = useState(() => getDemoData("parent-saved", PARENT_DUMMY_SAVED));
  const [parentBookings, setParentBookings] = useState(() => getDemoData("parent-bookings", PARENT_DUMMY_BOOKINGS));
  const [fees, setFees] = useState(() => getDemoData("parent-fees", PARENT_FEES));
  const [children, setChildren] = useState(() => getDemoData("parent-children", [
    { id: "child-1", name: "Arjun Patel", grade: "Class 7", school: "Delhi Public School", schoolSlug: "delhi-public-school", status: "approved", dob: "", bloodGroup: "", allergies: "" },
    { id: "child-2", name: "Ishaan Kumar", grade: "Class 3", school: "Modern School", schoolSlug: "modern-school", status: "approved", dob: "", bloodGroup: "", allergies: "" },
  ]));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const email = user.email;
  const isDemo = isDemoEmail(email || "");
  const displayName = user.user_metadata?.full_name || email?.split("@")[0] || "Parent";

  const updateAdmissions = (newAdmissions: any[]) => { setAdmissions(newAdmissions); setDemoData("parent-admissions", newAdmissions); };
  const updateSavedSchools = (newSaved: any[]) => { setSavedSchools(newSaved); setDemoData("parent-saved", newSaved); };
  const updateBookings = (newBookings: any[]) => { setParentBookings(newBookings); setDemoData("parent-bookings", newBookings); };
  const updateFees = (newFees: any[]) => { setFees(newFees); setDemoData("parent-fees", newFees); };
  const updateChildren = (newChildren: any[]) => { setChildren(newChildren); setDemoData("parent-children", newChildren); };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 truncate">
          <User className="h-6 w-6 text-primary shrink-0" />
          <span className="font-bold text-white text-lg truncate">Parent Panel</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 p-2 shrink-0">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <aside className={`w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed top-0 left-0 h-full z-40 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-slate-800 hidden md:block">
          <Link to="/parent-panel" className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-sm block truncate leading-tight">{displayName}</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Parent Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hidden-scrollbar">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/parent-panel' && location.pathname.startsWith(item.path));
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
          <Outlet context={{
            user, isDemo, displayName,
            admissions, updateAdmissions,
            bookings: parentBookings, updateBookings,
            saved: savedSchools, updateSavedSchools,
            notifications: PARENT_NOTIFICATIONS,
            homework: PARENT_HOMEWORK,
            fees, updateFees,
            children, updateChildren,
          }} />
        </div>
      </main>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
