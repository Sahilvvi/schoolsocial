import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Baby, ClipboardList, Heart, BookOpen,
  IndianRupee, Bell, LogOut, ChevronLeft, Loader2, User, Menu, X, GraduationCap
} from "lucide-react";
import {
  DUMMY_ADMISSIONS, DUMMY_TUTOR_BOOKINGS, DUMMY_SCHOOLS,
  DUMMY_NOTIFICATIONS, DUMMY_HOMEWORK, DUMMY_FEE_RECORDS
} from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";
import { supabase } from "@/integrations/supabase/client";
import { isDemoUserId } from "@/hooks/useDemoMode";
import type { Tables } from "@/integrations/supabase/types";

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

const NAV_GROUPS = [
  {
    group: "OVERVIEW",
    items: [
      { label: "Dashboard",      path: "/parent-panel",               icon: LayoutDashboard },
    ],
  },
  {
    group: "MY FAMILY",
    items: [
      { label: "My Children",    path: "/parent-panel/children",      icon: Baby },
      { label: "Admissions",     path: "/parent-panel/admissions",    icon: ClipboardList },
      { label: "Saved Schools",  path: "/parent-panel/saved",         icon: Heart },
    ],
  },
  {
    group: "EDUCATION",
    items: [
      { label: "Tutor Bookings", path: "/parent-panel/bookings",      icon: BookOpen },
      { label: "Fee Records",    path: "/parent-panel/fees",          icon: IndianRupee },
      { label: "Notifications",  path: "/parent-panel/notifications", icon: Bell },
    ],
  },
];

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
  { id: "child-1", name: "Arjun Patel",  grade: "Class 7", school: "Delhi Public School", schoolSlug: "delhi-public-school", status: "approved", dob: "", bloodGroup: "", allergies: "" },
  { id: "child-2", name: "Ishaan Kumar", grade: "Class 3", school: "Modern School",       schoolSlug: "modern-school",       status: "approved", dob: "", bloodGroup: "", allergies: "" },
];

export default function ParentPanelLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [admissions,    setAdmissions]    = useState<AdmissionRow[]>(() => getDemoData("parent-admissions", PARENT_DUMMY_ADMISSIONS));
  const [savedSchools,  setSavedSchools]  = useState<SavedSchoolRow[]>(() => getDemoData("parent-saved", PARENT_DUMMY_SAVED));
  const [parentBookings,setParentBookings]= useState<BookingRow[]>(() => getDemoData("parent-bookings", PARENT_DUMMY_BOOKINGS));
  const [fees,          setFees]          = useState<FeeRow[]>(() => getDemoData("parent-fees", PARENT_FEES));
  const [children,      setChildren]      = useState<ChildRecord[]>(() => getDemoData("parent-children", DEFAULT_CHILDREN));
  const [notifications, setNotifications] = useState<typeof PARENT_NOTIFICATIONS>(PARENT_NOTIFICATIONS);
  const [homework]                        = useState<typeof PARENT_HOMEWORK>(PARENT_HOMEWORK);

  useEffect(() => {
    if (!user || !supabase) return;
    if (isDemoUserId(user.id)) return;
    const email = user.email ?? "";
    setAdmissions([]); setSavedSchools([]); setParentBookings([]); setFees([]); setNotifications([]);

    supabase.from("admissions").select("*, schools(id, name, slug)").eq("email", email).order("created_at", { ascending: false })
      .then(({ data }) => { if (data?.length) setAdmissions(data.map(a => ({ ...a, schools: (a as AdmissionRow).schools ?? { id: a.school_id, name: a.school_id, slug: a.school_id } }))); });
    supabase.from("saved_schools").select("*, schools(*)").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data?.length) setSavedSchools(data as SavedSchoolRow[]); });
    supabase.from("tutor_bookings").select("*, tutors(name, subject)").eq("email", email).order("created_at", { ascending: false })
      .then(({ data }) => { if (data?.length) setParentBookings(data as BookingRow[]); });
    const fullName = user.user_metadata?.full_name ?? "";
    if (fullName) {
      supabase.from("fee_records").select("*").eq("person_name", fullName).order("created_at", { ascending: false })
        .then(({ data }) => { if (data?.length) setFees(data as FeeRow[]); });
    }
    const storedChildren = getDemoData<ChildRecord[] | null>(`real-parent-children-${user.id}`, null);
    setChildren(storedChildren ?? []);
  }, [user?.id]);

  if (loading) {
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

  const isDemo = isDemoUserId(user.id);
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Parent";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const updateAdmissions   = (next: AdmissionRow[])    => { setAdmissions(next);    if (isDemo) setDemoData("parent-admissions", next); };
  const updateSavedSchools = (next: SavedSchoolRow[])  => { setSavedSchools(next);  if (isDemo) setDemoData("parent-saved", next); };
  const updateBookings     = (next: BookingRow[])      => { setParentBookings(next);if (isDemo) setDemoData("parent-bookings", next); };
  const updateFees         = (next: FeeRow[])          => { setFees(next);          if (isDemo) setDemoData("parent-fees", next); };
  const updateChildren     = (next: ChildRecord[])     => {
    setChildren(next);
    setDemoData(isDemo ? "parent-children" : `real-parent-children-${user.id}`, next);
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight truncate max-w-[140px]">{displayName}</span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest -mt-0.5">Parent Panel</p>
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
        {/* User Header */}
        <div className="px-5 py-5 border-b border-slate-100 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl gradient-primary flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-primary/25 shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-slate-900 text-sm truncate leading-tight">{displayName}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Parent Panel</p>
            </div>
          </div>
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
                    (item.path !== "/parent-panel" && location.pathname.startsWith(item.path));
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
                        active ? "bg-primary/15" : "bg-slate-100"
                      }`}>
                        <item.icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-slate-400"}`} />
                      </div>
                      {item.label}
                      {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
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

      <main className="flex-1 md:ml-64 pt-14 md:pt-0 min-h-screen">
        <div className="p-5 md:p-8 max-w-5xl mx-auto">
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
        <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
