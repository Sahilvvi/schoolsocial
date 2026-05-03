import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Baby, ClipboardList, Heart, BookOpen,
  IndianRupee, Bell, LogOut, ChevronLeft, Loader2, GraduationCap, User
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

/* Shape dummy data for parent view */
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

  // Persistent state for parent panel data
  const [admissions, setAdmissions] = useState(() =>
    getDemoData("parent-admissions", PARENT_DUMMY_ADMISSIONS)
  );
  const [savedSchools, setSavedSchools] = useState(() =>
    getDemoData("parent-saved", PARENT_DUMMY_SAVED)
  );
  const [parentBookings, setParentBookings] = useState(() =>
    getDemoData("parent-bookings", PARENT_DUMMY_BOOKINGS)
  );
  const [fees, setFees] = useState(() =>
    getDemoData("parent-fees", PARENT_FEES)
  );
  const [children, setChildren] = useState(() =>
    getDemoData("parent-children", [
      { id: "child-1", name: "Arjun Patel", grade: "Class 7", school: "Delhi Public School", schoolSlug: "delhi-public-school", status: "approved", dob: "", bloodGroup: "", allergies: "" },
      { id: "child-2", name: "Ishaan Kumar", grade: "Class 3", school: "Modern School", schoolSlug: "modern-school", status: "approved", dob: "", bloodGroup: "", allergies: "" },
    ])
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const email = user.email;
  const isDemo = isDemoEmail(email || "");
  const displayName = user.user_metadata?.full_name || email?.split("@")[0] || "Parent";

  const updateAdmissions = (newAdmissions: any[]) => {
    setAdmissions(newAdmissions);
    setDemoData("parent-admissions", newAdmissions);
  };
  const updateSavedSchools = (newSaved: any[]) => {
    setSavedSchools(newSaved);
    setDemoData("parent-saved", newSaved);
  };
  const updateBookings = (newBookings: any[]) => {
    setParentBookings(newBookings);
    setDemoData("parent-bookings", newBookings);
  };
  const updateFees = (newFees: any[]) => {
    setFees(newFees);
    setDemoData("parent-fees", newFees);
  };
  const updateChildren = (newChildren: any[]) => {
    setChildren(newChildren);
    setDemoData("parent-children", newChildren);
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-card/80 backdrop-blur-xl border-r border-border/30 flex flex-col fixed top-0 left-0 h-full z-50">
        <div className="p-5 border-b border-border/30">
          <Link to="/parent-panel" className="flex items-center gap-2.5">
            <div className="gradient-primary p-2 rounded-lg shadow-md">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <span className="text-gradient font-extrabold text-sm block truncate">{displayName}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Parent Panel</p>
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
      </main>
    </div>
  );
}
