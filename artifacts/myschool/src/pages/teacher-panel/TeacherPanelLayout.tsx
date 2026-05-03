import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, User, Briefcase, Target, FileText, Users,
  Calendar, LogOut, ChevronLeft, Loader2, BookOpen, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isDemoEmail } from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

const navItems = [
  { label: "Dashboard", path: "/teacher-panel", icon: LayoutDashboard },
  { label: "My Profile", path: "/teacher-panel/profile", icon: User },
  { label: "Experience", path: "/teacher-panel/experience", icon: Briefcase },
  { label: "Services", path: "/teacher-panel/services", icon: Target },
  { label: "Notes & Material", path: "/teacher-panel/notes", icon: FileText },
  { label: "My Students", path: "/teacher-panel/students", icon: Users },
  { label: "Schedule", path: "/teacher-panel/schedule", icon: Calendar },
  { label: "Find Jobs", path: "/teacher-panel/jobs", icon: BookOpen },
];

const defaultTeacher = {
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
    { degree: "M.Sc. Mathematics", institution: "Delhi University", year: "2014" },
    { degree: "B.Ed.", institution: "Jamia Millia Islamia", year: "2016" },
  ],
  experience_list: [
    { role: "Senior Math Teacher", school: "Delhi Public School, RK Puram", duration: "2020 - Present", desc: "Teaching classes 9-12, leading math olympiad team" },
    { role: "Math Teacher", school: "Modern School, Barakhamba", duration: "2017 - 2020", desc: "Classes 6-10, developed new curriculum modules" },
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
  const [teacherData, setTeacherData] = useState(() => getDemoData("teacher-profile", defaultTeacher));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const updateTeacher = (updates: Partial<typeof defaultTeacher>) => {
    setTeacherData(prev => {
      const next = { ...prev, ...updates };
      setDemoData("teacher-profile", next);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 truncate">
          <BookOpen className="h-6 w-6 text-primary shrink-0" />
          <span className="font-bold text-white text-lg truncate">Teacher Panel</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 p-2 shrink-0">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <aside className={`w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed top-0 left-0 h-full z-40 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-slate-800 hidden md:block">
          <Link to="/teacher-panel" className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-sm block truncate leading-tight">{teacherData.name}</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Teacher Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hidden-scrollbar">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/teacher-panel' && location.pathname.startsWith(item.path));
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
          <Outlet context={{ teacherData, updateTeacher }} />
        </div>
      </main>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
