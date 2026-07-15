import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, BookOpen, MessageSquare, Users, Bell, LogOut,
  Loader2, Menu, X, User, Image, GraduationCap, Star, IndianRupee,
  Building2, Clock, CheckCircle, Rss, CalendarDays, FileText,
  Briefcase, BarChart2, TrendingUp, Settings, CreditCard,
  HelpCircle, ChevronDown, ExternalLink, Crown, School
} from "lucide-react";
import {
  DUMMY_BATCHES, DUMMY_TUITION_ENQUIRIES, DUMMY_TUTOR_BOOKINGS,
  DUMMY_TUTORS, DUMMY_NOTIFICATIONS
} from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

// --------------- Supabase row types -----------------------------------------
type TuitionBatchRow = Tables<"tuition_batches">;
type TuitionEnquiryRow = Tables<"tuition_enquiries">;
type TutorBookingRow = Tables<"tutor_bookings">;

/* ─── Nav structure ──────────────────────────────────── */
const NAV_SECTIONS = [
  {
    group: "MANAGE CENTER",
    items: [
      { label: "Dashboard",           path: "/tuition-panel",           icon: LayoutDashboard },
      { label: "Enquiries",           path: "/tuition-panel/enquiries", icon: MessageSquare, badge: 3, badgeColor: "bg-red-500" },
      { label: "Batches",             path: "/tuition-panel/batches",   icon: Users },
      { label: "Bookings",            path: "/tuition-panel/bookings",  icon: CalendarDays },
      { label: "Fee Management",      path: "/tuition-panel/fees",      icon: IndianRupee },
    ],
  },
  {
    group: "PROFILE & LISTING",
    items: [
      { label: "Center Profile",      path: "/tuition-panel/profile",   icon: Building2 },
      { label: "Photo Gallery",       path: "/tuition-panel/gallery",   icon: Image },
      { label: "Subjects & Courses",  path: "/tuition-panel/subjects",  icon: BookOpen },
      { label: "Reviews",             path: "/tuition-panel/reviews",   icon: Star },
      { label: "Notifications",       path: "/tuition-panel/notifications", icon: Bell },
    ],
  },
  {
    group: "STAFF & TUTORS",
    items: [
      { label: "Tutors",              path: "/tuition-panel/tutors",    icon: GraduationCap },
      { label: "Students",           path: "/tuition-panel/students",  icon: Users },
      { label: "Announcements",      path: "/tuition-panel/announcements", icon: Rss },
    ],
  },
  {
    group: "MARKETING",
    items: [
      { label: "Job Postings",        path: "/tuition-panel/jobs",      icon: Briefcase },
      { label: "Applications",        path: "/tuition-panel/job-apps",  icon: FileText, badge: 9, badgeColor: "bg-blue-600" },
    ],
  },
  {
    group: "ANALYTICS",
    items: [
      { label: "Analytics & Insights",path: "/tuition-panel/analytics", icon: BarChart2 },
      { label: "Leads Report",        path: "/tuition-panel/leads",     icon: TrendingUp },
      { label: "Performance",         path: "/tuition-panel/performance",icon: Star },
    ],
  },
  {
    group: "SETTINGS",
    items: [
      { label: "Account Settings",    path: "/tuition-panel/settings",  icon: Settings },
      { label: "Subscription",        path: "/tuition-panel/subscription", icon: CreditCard, isPremium: true },
      { label: "Help & Support",      path: "/tuition-panel/help",      icon: HelpCircle },
    ],
  },
];

type CenterProfile = {
  name: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  established: string;
  totalStudents: number;
  branches: number;
};

const defaultCenter: CenterProfile = {
  name: "Bright Minds Tuition Center",
  location: "Loni, Ghaziabad, Uttar Pradesh",
  phone: "+91 98765 00000",
  email: "info@brightminds.com",
  website: "www.brightminds.com",
  description: "Premium coaching center for Board and competitive exam preparation.",
  established: "2014",
  totalStudents: 156,
  branches: 2,
};

export default function TuitionPanelLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize from demo localStorage; useEffect corrects for real users after auth resolves
  const [centerData, setCenterData] = useState<CenterProfile>(() =>
    getDemoData("tuition-profile", defaultCenter)
  );
  const [batches, setBatches] = useState<TuitionBatchRow[]>(() =>
    getDemoData("tuition-batches", DUMMY_BATCHES)
  );
  const [enquiries, setEnquiries] = useState<TuitionEnquiryRow[]>(() =>
    getDemoData("tuition-enquiries", DUMMY_TUITION_ENQUIRIES)
  );
  const [bookings, setBookings] = useState<TutorBookingRow[]>(() =>
    getDemoData("tuition-bookings", DUMMY_TUTOR_BOOKINGS)
  );

  // After auth resolves, override with real data for non-demo users
  useEffect(() => {
    if (!user || !supabase) return;
    if (isDemoUserId(user.id)) return;

    const realCenterKey = `real-tuition-profile-${user.id}`;
    const stored = getDemoData<CenterProfile | null>(realCenterKey, null);

    // Initialize profile from persisted data or user_metadata
    setCenterData(stored ?? {
      ...defaultCenter,
      name: user.user_metadata?.full_name
        ? `${user.user_metadata.full_name}'s Tuition Center`
        : defaultCenter.name,
      email: user.email ?? defaultCenter.email,
    });

    // Clear demo data immediately
    setBatches([]);
    setEnquiries([]);
    setBookings([]);

    // tuition_enquiries has no owner/user_id — these are public marketplace enquiries.
    // Tuition center owners see open enquiries as a lead inbox.
    // Row-level security on Supabase is the primary tenant isolation mechanism.
    supabase
      .from("tuition_enquiries")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data?.length) setEnquiries(data as TuitionEnquiryRow[]);
      });

    // tuition_batches.tutor_id is a FK to tutors.id, not to auth users.
    // tutors table has no user_id column, so we match by full_name.
    // This is the only available Supabase link for tuition center accounts.
    const fullName = user.user_metadata?.full_name ?? "";
    if (fullName) {
      supabase
        .from("tutors")
        .select("id")
        .ilike("name", fullName)
        .maybeSingle()
        .then(({ data: tutor }) => {
          if (tutor) {
            // Load batches owned by this tutor
            supabase!
              .from("tuition_batches")
              .select("*")
              .eq("tutor_id", tutor.id)
              .order("created_at", { ascending: false })
              .then(({ data }) => {
                if (data?.length) setBatches(data as TuitionBatchRow[]);
              });

            // Load bookings associated with this tutor
            supabase!
              .from("tutor_bookings")
              .select("*")
              .eq("tutor_id", tutor.id)
              .order("created_at", { ascending: false })
              .then(({ data }) => {
                if (data?.length) setBookings(data as TutorBookingRow[]);
              });
          }
        });
    }
  }, [user?.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;

  const isDemo = isDemoUserId(user.id);
  const centerKey = isDemo ? "tuition-profile" : `real-tuition-profile-${user.id}`;
  const tutors = isDemo ? DUMMY_TUTORS.slice(0, 4) : [];
  const demoNotifications = DUMMY_NOTIFICATIONS.filter((n) => n.user_id === "demo-tuition-001");
  const notifications = isDemo
    ? (demoNotifications.length > 0 ? demoNotifications : [
        { id: "tn-1", user_id: "demo-tuition-001", title: "New Enquiry Received", message: "Rajesh Kumar is looking for Mathematics tuition.", type: "enquiry", link: "#", is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: "tn-2", user_id: "demo-tuition-001", title: "Batch Almost Full", message: "JEE Maths Batch A has 12/15 students.", type: "batch", link: "#", is_read: false, created_at: new Date(Date.now() - 172800000).toISOString() },
      ])
    : [];

  const updateCenter = (u: Partial<CenterProfile>) => {
    setCenterData(p => { const n = { ...p, ...u }; setDemoData(centerKey, n); return n; });
  };
  const updateBatches = (b: TuitionBatchRow[]) => {
    setBatches(b);
    if (isDemo) setDemoData("tuition-batches", b);
  };
  const updateEnquiries = (e: TuitionEnquiryRow[]) => {
    setEnquiries(e);
    if (isDemo) setDemoData("tuition-enquiries", e);
  };
  const updateBookings = (b: TutorBookingRow[]) => {
    setBookings(b);
    if (isDemo) setDemoData("tuition-bookings", b);
  };

  const isActive = (path: string) =>
    path === "/tuition-panel"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ─── SIDEBAR ─────────────────────────────────────── */}
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

        {/* Center name */}
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{centerData.name}</p>
              <p className="text-[10px] text-gray-400">Tuition Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {NAV_SECTIONS.map(section => (
            <div key={section.group}>
              <p className="text-[9px] font-bold text-gray-400 px-2 mb-1 tracking-widest">{section.group}</p>
              {section.items.map(item => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-2 py-2 rounded-lg text-xs font-medium transition-all mb-0.5
                      ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <item.icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {("badge" in item && item.badge) && (
                      <span className={`text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ${(item as any).badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {("isPremium" in item && item.isPremium) && (
                      <Crown className="h-3 w-3 text-yellow-500 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 shrink-0 space-y-1">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-xs h-8">
              <ExternalLink className="h-3.5 w-3.5 mr-2" />Back to Site
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 text-xs h-8" onClick={() => signOut()}>
            <LogOut className="h-3.5 w-3.5 mr-2" />Sign Out
          </Button>
        </div>
      </aside>

      {/* ─── MOBILE HEADER ───────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <span className="font-bold text-gray-900 text-sm">{centerData.name}</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 p-1">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ─── MAIN CONTENT ─────────────────────────────────── */}
      <main className="flex-1 md:ml-[220px] pt-14 md:pt-0 min-h-screen">
        <Outlet context={{
          centerData, updateCenter,
          batches, updateBatches,
          enquiries, updateEnquiries,
          bookings, updateBookings,
          tutors,
          notifications,
          isDemo,
          user,
        }} />
      </main>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
