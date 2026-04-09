import { 
  LayoutDashboard, Users, UserSquare2, BookOpen, CalendarCheck, 
  CreditCard, Bell, Calendar, Briefcase 
} from "lucide-react";

export const adminLinks = [
  { href: "/school-admin", label: "Overview", icon: LayoutDashboard },
  { href: "/school-admin/students", label: "Students", icon: Users },
  { href: "/school-admin/teachers", label: "Teachers", icon: UserSquare2 },
  { href: "/school-admin/classes", label: "Classes", icon: BookOpen },
  { href: "/school-admin/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/school-admin/fees", label: "Fees", icon: CreditCard },
  { href: "/school-admin/notices", label: "Notices", icon: Bell },
  { href: "/school-admin/events", label: "Events", icon: Calendar },
  { href: "/school-admin/hiring", label: "Hiring", icon: Briefcase },
];