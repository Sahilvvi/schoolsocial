import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, User, Briefcase, Target, FileText, Users,
  Calendar, LogOut, ChevronLeft, Loader2, BookOpen, Menu, X, GraduationCap
} from "lucide-react";
import { getDemoData, setDemoData } from "@/lib/demoStorage";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type TutorRow = Tables<"tutors">;
type TutorBookingRow = Tables<"tutor_bookings">;

const NAV_GROUPS = [
  {
    group: "OVERVIEW",
    items: [
      { label: "Dashboard", path: "/teacher-panel", icon: LayoutDashboard },
    ],
  },
  {
    group: "MY PROFILE",
    items: [
      { label: "My Profile",       path: "/teacher-panel/profile",     icon: User },
      { label: "Experience",       path: "/teacher-panel/experience",  icon: Briefcase },
      { label: "Services",         path: "/teacher-panel/services",    icon: Target },
      { label: "Notes & Material", path: "/teacher-panel/notes",       icon: FileText },
    ],
  },
  {
    group: "STUDENTS & WORK",
    items: [
      { label: "My Students", path: "/teacher-panel/students", icon: Users },
      { label: "Schedule",    path: "/teacher-panel/schedule", icon: Calendar },
      { label: "Find Jobs",   path: "/teacher-panel/jobs",     icon: BookOpen },
    ],
  },
];

type TeacherProfile = {
  name: string;
  title: string;
  location: string;
  experience: string;
  rating: number;
  reviews: number;
  bio: string;
  email: string;
  phone: string;
  website: string;
  avatar: string;
  skills: string[];
  education: { degree: string; institution: string; year: string }[];
  experience_list: { role: string; school: string; duration: string; desc: string }[];
  achievements: string[];
  homeTuition: boolean;
  onlineClasses: boolean;
  paidNotes: boolean;
  hourlyRate: string;
  subjects: string[];
  grades: string[];
  bookings?: TutorBookingRow[];
};

const defaultTeacher: TeacherProfile = {
  name: "Priya Sharma",
  title: "Senior Mathematics Teacher",
  location: "New Delhi, India",
  experience: "8+ Years",
  rating: 4.8,
  reviews: 47,
  bio: "Passionate mathematics educator with 8+ years of experience in CBSE and ICSE curriculum. Specialized in making complex concepts simple and engaging for students of all levels.",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  website: "priyasharma.edu",
  avatar: "PS",
  skills: ["Mathematics", "Physics", "CBSE", "ICSE", "Online Teaching"],
  education: [
    { degree: "M.Sc. Mathematics", institution: "Delhi University",     year: "2014" },
    { degree: "B.Ed.",             institution: "Jamia Millia Islamia", year: "2016" },
  ],
  experience_list: [
    { role: "Senior Math Teacher", school: "Delhi Public School, RK Puram", duration: "2020 - Present", desc: "Teaching classes 9-12, leading math olympiad team" },
    { role: "Math Teacher",        school: "Modern School, Barakhamba",      duration: "2017 - 2020",   desc: "Classes 6-10, developed new curriculum modules" },
  ],
  achievements: [
    "Best Teacher Award — DPS RK Puram (2022)",
    "100% pass rate in Class 12 Board Exams (3 consecutive years)",
  ],
  homeTuition: true,
  onlineClasses: true,
  paidNotes: true,
  hourlyRate: "₹800 - ₹1,500",
  subjects: ["Mathematics", "Physics"],
  grades: ["Class 6-8", "Class 9-10", "Class 11-12"],
};

export default function TeacherPanelLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [teacherData, setTeacherData] = useState<TeacherProfile>(() =>
    getDemoData("teacher-profile", defaultTeacher)
  );

  useEffect(() => {
    if (!user || !supabase) return;
    if (isDemoUserId(user.id)) return;

    const realKey = `real-teacher-profile-${user.id}`;
    const stored = getDemoData<TeacherProfile | null>(realKey, null);

    const metaProfile: TeacherProfile = stored ?? {
      ...defaultTeacher,
      name: user.user_metadata?.full_name ?? defaultTeacher.name,
      email: user.email ?? defaultTeacher.email,
      avatar: (user.user_metadata?.full_name ?? defaultTeacher.name).slice(0, 2).toUpperCase(),
    };
    setTeacherData(metaProfile);

    const fullName = user.user_metadata?.full_name ?? "";
    if (fullName && supabase) {
      supabase
        .from("tutors")
        .select("*")
        .ilike("name", fullName)
        .maybeSingle()
        .then(({ data: tutor }) => {
          if (tutor) {
            setTeacherData(prev => ({
              ...prev,
              name: tutor.name,
              bio: tutor.bio || prev.bio,
              location: tutor.location || prev.location,
              experience: tutor.experience || prev.experience,
              hourlyRate: tutor.hourly_rate || prev.hourlyRate,
              rating: tutor.rating ?? prev.rating,
              subjects: [tutor.subject, ...prev.subjects.filter(s => s !== tutor.subject)],
            }));
            supabase!
              .from("tutor_bookings")
              .select("*")
              .eq("tutor_id", tutor.id)
              .order("created_at", { ascending: false })
              .then(({ data: bookings }) => {
                if (bookings?.length) setTeacherData(prev => ({ ...prev, bookings }));
              });
          }
        });
    }
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
  const storageKey = isDemo ? "teacher-profile" : `real-teacher-profile-${user.id}`;
  const initials = teacherData.avatar || teacherData.name.slice(0, 2).toUpperCase();

  const updateTeacher = (updates: Partial<TeacherProfile>) => {
    setTeacherData(prev => {
      const next = { ...prev, ...updates };
      setDemoData(storageKey, next);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-slate-900 text-sm tracking-tight truncate block max-w-[140px]">{teacherData.name}</span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest -mt-0.5">Teacher Panel</p>
          </div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shrink-0">
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
              <p className="font-extrabold text-slate-900 text-sm truncate leading-tight">{teacherData.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Teacher Panel</p>
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
                    (item.path !== "/teacher-panel" && location.pathname.startsWith(item.path));
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

      <main className="flex-1 md:ml-64 pt-14 md:pt-0 min-h-screen pb-20 md:pb-0">
        <div className="p-5 md:p-8 max-w-5xl mx-auto">
          <Outlet context={{ teacherData, updateTeacher, isDemo }} />
        </div>
      </main>

      {/* Mobile Bottom Tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 flex items-center">
        {[
          { label: "Dashboard", path: "/teacher-panel",            icon: LayoutDashboard },
          { label: "Profile",   path: "/teacher-panel/profile",    icon: User },
          { label: "Students",  path: "/teacher-panel/students",   icon: Users },
          { label: "Schedule",  path: "/teacher-panel/schedule",   icon: Calendar },
          { label: "More",      path: "/teacher-panel/notes",      icon: Menu },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = tab.path === "/teacher-panel"
            ? location.pathname === tab.path
            : location.pathname.startsWith(tab.path);
          return (
            <Link key={tab.label} to={tab.path} className="flex-1 flex flex-col items-center gap-0.5 py-1">
              <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
              <span className={`text-[10px] font-semibold ${active ? "text-blue-600" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
