import { LayoutDashboard, Users, BookOpen, CalendarCheck, CreditCard, Bell, Calendar, Briefcase, UserPlus, Bot, School, Clock, Award, Megaphone, GraduationCap, Image, CalendarOff, MessageSquare, Send, User, Loader2, QrCode, FileText, BarChart3, Bus, IndianRupee, BookMarked, AlertTriangle, CalendarRange, Newspaper, ClipboardList, Library, FileQuestion, Clipboard, Heart, PieChart, Ticket, CalendarDays } from "lucide-react";
export { LayoutDashboard, Users, BookOpen, CalendarCheck, CreditCard, Bell, Calendar, Briefcase, UserPlus, Bot, Send, User, Loader2 };

export const adminLinks = [
  { href: "/school-admin", label: "Overview", icon: LayoutDashboard, group: "Dashboard" },

  { href: "/school-admin/students", label: "Students", icon: Users, group: "People" },
  { href: "/school-admin/teachers", label: "Teachers", icon: Briefcase, group: "People" },
  { href: "/school-admin/classes", label: "Classes", icon: BookOpen, group: "People" },
  { href: "/school-admin/promote", label: "Promotion", icon: GraduationCap, group: "People" },

  { href: "/school-admin/attendance", label: "Attendance", icon: CalendarCheck, group: "Academics" },
  { href: "/school-admin/attendance-reports", label: "Att. Reports", icon: BarChart3, group: "Academics" },
  { href: "/school-admin/timetable", label: "Timetable", icon: Clock, group: "Academics" },
  { href: "/school-admin/exams", label: "Exams", icon: Award, group: "Academics" },
  { href: "/school-admin/report-cards", label: "Report Cards", icon: FileText, group: "Academics" },
  { href: "/school-admin/homework", label: "Homework", icon: ClipboardList, group: "Academics" },
  { href: "/school-admin/syllabus", label: "Syllabus", icon: Clipboard, group: "Academics" },
  { href: "/school-admin/study-materials", label: "Study Materials", icon: BookMarked, group: "Academics" },
  { href: "/school-admin/qr-scan", label: "QR Scanner", icon: QrCode, group: "Academics" },

  { href: "/school-admin/fees", label: "Fees", icon: CreditCard, group: "Finance" },
  { href: "/school-admin/fee-structure", label: "Fee Structure", icon: IndianRupee, group: "Finance" },
  { href: "/school-admin/payroll", label: "Staff Payroll", icon: IndianRupee, group: "Finance" },
  { href: "/school-admin/financial-reports", label: "Financial Reports", icon: PieChart, group: "Finance" },

  { href: "/school-admin/notices", label: "Notices", icon: Bell, group: "Communication" },
  { href: "/school-admin/announcements", label: "Announcements", icon: Megaphone, group: "Communication" },
  { href: "/school-admin/messages", label: "Messages", icon: MessageSquare, group: "Communication" },
  { href: "/school-admin/events", label: "Events", icon: Calendar, group: "Communication" },
  { href: "/school-admin/blog", label: "Blog / News", icon: Newspaper, group: "Communication" },

  { href: "/school-admin/library", label: "Library", icon: Library, group: "Facilities" },
  { href: "/school-admin/transport", label: "Transport", icon: Bus, group: "Facilities" },
  { href: "/school-admin/gallery", label: "Gallery", icon: Image, group: "Facilities" },
  { href: "/school-admin/health", label: "Student Health", icon: Heart, group: "Facilities" },
  { href: "/school-admin/discipline", label: "Discipline", icon: AlertTriangle, group: "Facilities" },

  { href: "/school-admin/hiring", label: "Hiring", icon: UserPlus, group: "HR & Admin" },
  { href: "/school-admin/leaves", label: "Leave Approvals", icon: CalendarOff, group: "HR & Admin" },
  { href: "/school-admin/ptm", label: "PTM / Meetings", icon: CalendarRange, group: "HR & Admin" },
  { href: "/school-admin/admission-inquiries", label: "Admissions", icon: FileQuestion, group: "HR & Admin" },

  { href: "/school-admin/calendar", label: "Calendar", icon: CalendarDays, group: "Tools" },
  { href: "/school-admin/ai", label: "AI Assistant", icon: Bot, group: "Tools" },
  { href: "/school-admin/support", label: "Support & Help", icon: Ticket, group: "Tools" },
  { href: "/school-admin/profile", label: "School Profile", icon: School, group: "Tools" },
];
