import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, User, Briefcase, Target, FileText, Users,
  Calendar, LogOut, ChevronLeft, Loader2, GraduationCap, BookOpen
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

/* Default teacher data for demo accounts */
const defaultTeacher = {
  name: "Priya Sharma",
  title: "Senior Mathematics Teacher",
  location: "New Delhi, India",
  experience: "8+ Years",
  rating: 4.8,
  reviews: 47,
  bio: "Passionate mathematics educator with 8+ years of experience in CBSE and ICSE curriculum. Specialized in making complex concepts simple and engaging for students of all levels. Published author of 'Fun with Numbers' workbook series.",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  website: "priyasharma.edu",
  avatar: "PS",
  skills: ["Mathematics", "Physics", "CBSE", "ICSE", "Competitive Exam Prep", "Vedic Maths", "Online Teaching", "Student Counseling"],
  education: [
    { degree: "M.Sc. Mathematics", institution: "Delhi University", year: "2014" },
    { degree: "B.Ed.", institution: "Jamia Millia Islamia", year: "2016" },
    { degree: "CTET Qualified", institution: "CBSE", year: "2016" },
  ],
  experience_list: [
    { role: "Senior Math Teacher", school: "Delhi Public School, RK Puram", duration: "2020 - Present", desc: "Teaching classes 9-12, leading math olympiad team" },
    { role: "Math Teacher", school: "Modern School, Barakhamba", duration: "2017 - 2020", desc: "Classes 6-10, developed new curriculum modules" },
    { role: "Junior Teacher", school: "Springdales School", duration: "2016 - 2017", desc: "Assistant teacher for classes 4-8" },
  ],
  achievements: [
    "Best Teacher Award — DPS RK Puram (2022)",
    "Published 'Fun with Numbers' workbook series",
    "100% pass rate in Class 12 Board Exams (3 consecutive years)",
    "Trained 15+ students for Math Olympiad nationals",
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
  const [teacherData, setTeacherData] = useState(() =>
    getDemoData("teacher-profile", defaultTeacher)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen flex">
      <aside className="w-64 bg-card/80 backdrop-blur-xl border-r border-border/30 flex flex-col fixed top-0 left-0 h-full z-50">
        <div className="p-5 border-b border-border/30">
          <Link to="/teacher-panel" className="flex items-center gap-2.5">
            <div className="gradient-primary p-2 rounded-lg shadow-md">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <span className="text-gradient font-extrabold text-sm block truncate">{teacherData.name}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Teacher Panel</p>
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
        <Outlet context={{ teacherData, updateTeacher }} />
      </main>
    </div>
  );
}
