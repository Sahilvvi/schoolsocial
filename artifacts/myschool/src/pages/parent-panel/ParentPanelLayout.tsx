import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Baby, ClipboardList, Heart, BookOpen,
  IndianRupee, Bell, LogOut, ChevronLeft, Loader2, User, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DUMMY_ADMISSIONS, DUMMY_TUTOR_BOOKINGS, DUMMY_SCHOOLS,
  DUMMY_NOTIFICATIONS, DUMMY_HOMEWORK, DUMMY_FEE_RECORDS
} from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";
import { supabase } from "@/integrations/supabase/client";
import { isDemoUserId } from "@/hooks/useDemoMode";
import type { Tables } from "@/integrations/supabase/types";

// --------------- local row shapes (Supabase table rows + joined relations) ----
type AdmissionRow = Tables<"admissions"> & {
  schools: Pick<Tables<"schools">, "id" | "name" | "slug"> | null;
};
type SavedSchoolRow = Tables<"saved_schools"> & {
  schools: Tables<"schools"> | null;
};
type BookingRow = Tables<"tutor_bookings"> & {
  tutors: Pick<Tables<"tutors">, "name" | "subject"> | null;
};
type FeeRow = Tables<"fee_records">;
type ChildRecord = {
  id: string;
  name: string;
  grade: string;
  school: string;
  schoolSlug: string;
  status: string;
  dob: string;
  bloodGroup: string;
  allergies: string;
};

const navItems = [
  { label: "Dashboard", path: "/parent-panel", icon: LayoutDashboard },
  { label: "My Children", path: "/parent-panel/children", icon: Baby },
  { label: "Admissions", path: "/parent-panel/admissions", icon: ClipboardList },
  { label: "Saved Schools", path: "/parent-panel/saved", icon: Heart },
  { label: "Tutor Bookings", path: "/parent-panel/bookings", icon: BookOpen },
  { label: "Fee Records", path: "/parent-panel/fees", icon: IndianRupee },
  { label: "Notifications", path: "/parent-panel/notifications", icon: Bell },
];

// --------------- demo seed data (used only for demo user IDs) ----------------
const PARENT_DUMMY_ADMISSIONS: AdmissionRow[] = DUMMY_ADMISSIONS.filter(a =>
  a.parent_name === "Rajesh Kumar" || a.parent_name === "Vikram Patel"
).slice(0, 4).map(a => ({
  ...a,
  schools: DUMMY_SCHOOLS.find(s => s.id === a.school_id) as any ?? { id: a.school_id, name: "Delhi Public School", slug: "delhi-public-school" },
}));

const PARENT_DUMMY_BOOKINGS: BookingRow[] = DUMMY_TUTOR_BOOKINGS.filter(b =>
  b.name === "Rajesh Kumar" || b.name === "Vikram Patel"
).map(b => ({
  ...b,
  tutors: { name: b.tutor_id === "tutor-001" ? "Priya Sharma" : "Dr. Amit Verma", subject: b.tutor_id === "tutor-001" ? "Mathematics" : "Physics" },
}));

const PARENT_DUMMY_SAVED: SavedSchoolRow[] = DUMMY_SCHOOLS.slice(0, 3).map((s, i) => ({
  id: `saved-${i + 1}`,
  user_id: "demo-parent-001",
  school_id: s.id,
  schools: s as Tables<"schools">,
  created_at: new Date().toISOString(),
}));

const PARENT_NOTIFICATIONS = DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-parent-001");
const PARENT_HOMEWORK = DUMMY_HOMEWORK.slice(0, 3);
const PARENT_FEES: FeeRow[] = DUMMY_FEE_RECORDS.filter(f =>
  f.person_name === "Arjun Patel" || f.person_name === "Ishaan Kumar"
);

const DEFAULT_CHILDREN: ChildRecord[] = [
  { id: "child-1", name: "Arjun Patel", grade: "Class 7", school: "Delhi Public School", schoolSlug: "delhi-public-school", status: "approved", dob: "", bloodGroup: "", allergies: "" },
  { id: "child-2", name: "Ishaan Kumar", grade: "Class 3", school: "Modern School", schoolSlug: "modern-school", status: "approved", dob: "", bloodGroup: "", allergies: "" },
];

export default function ParentPanelLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize from demo localStorage/defaults; useEffect replaces data for real users
  const [admissions, setAdmissions] = useState<AdmissionRow[]>(() => getDemoData("parent-admissions", PARENT_DUMMY_ADMISSIONS));
  const [savedSchools, setSavedSchools] = useState<SavedSchoolRow[]>(() => getDemoData("parent-saved", PARENT_DUMMY_SAVED));
  const [parentBookings, setParentBookings] = useState<BookingRow[]>(() => getDemoData("parent-bookings", PARENT_DUMMY_BOOKINGS));
  const [fees, setFees] = useState<FeeRow[]>(() => getDemoData("parent-fees", PARENT_FEES));
  const [children, setChildren] = useState<ChildRecord[]>(() => getDemoData("parent-children", DEFAULT_CHILDREN));
  const [notifications, setNotifications] = useState<typeof PARENT_NOTIFICATIONS>(PARENT_NOTIFICATIONS);
  const [homework] = useState<typeof PARENT_HOMEWORK>(PARENT_HOMEWORK);

  // For real (non-demo) users: load fresh data from Supabase after auth resolves
  useEffect(() => {
    if (!user || !supabase) return;
    if (isDemoUserId(user.id)) return;

    const email = user.email ?? "";

    // Clear demo seed data immediately for real users
    setAdmissions([]);
    setSavedSchools([]);
    setParentBookings([]);
    setFees([]);
    setNotifications([]);

    // Admissions by parent email, joining school name/slug
    supabase
      .from("admissions")
      .select("*, schools(id, name, slug)")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) {
          setAdmissions(data.map(a => ({
            ...a,
            schools: (a as AdmissionRow).schools ?? { id: a.school_id, name: a.school_id, slug: a.school_id },
          })));
        }
      });

    // Saved schools by user_id, joining full school record
    supabase
      .from("saved_schools")
      .select("*, schools(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) setSavedSchools(data as SavedSchoolRow[]);
      });

    // Tutor bookings by parent email, joining tutor name/subject
    supabase
      .from("tutor_bookings")
      .select("*, tutors(name, subject)")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) setParentBookings(data as BookingRow[]);
      });

    // Fee records by user's full name (best available link without user_id column)
    const fullName = user.user_metadata?.full_name ?? "";
    if (fullName) {
      supabase
        .from("fee_records")
        .select("*")
        .eq("person_name", fullName)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data?.length) setFees(data as FeeRow[]);
        });
    }

    // Children have no DB table — persist per-user in localStorage
    const storedChildren = getDemoData<ChildRecord[] | null>(`real-parent-children-${user.id}`, null);
    setChildren(storedChildren ?? []);
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const isDemo = isDemoUserId(user.id);
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Parent";

  const updateAdmissions = (next: AdmissionRow[]) => {
    setAdmissions(next);
    if (isDemo) setDemoData("parent-admissions", next);
  };
  const updateSavedSchools = (next: SavedSchoolRow[]) => {
    setSavedSchools(next);
    if (isDemo) setDemoData("parent-saved", next);
  };
  const updateBookings = (next: BookingRow[]) => {
    setParentBookings(next);
    if (isDemo) setDemoData("parent-bookings", next);
  };
  const updateFees = (next: FeeRow[]) => {
    setFees(next);
    if (isDemo) setDemoData("parent-fees", next);
  };
  const updateChildren = (next: ChildRecord[]) => {
    setChildren(next);
    setDemoData(isDemo ? "parent-children" : `real-parent-children-${user.id}`, next);
  };

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
            notifications,
            homework,
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
