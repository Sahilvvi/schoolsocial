import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, BookOpen, MessageSquare, Users, Calendar,
  Building2, Bell, LogOut, ChevronLeft, Loader2, Settings, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DUMMY_BATCHES, DUMMY_TUITION_ENQUIRIES, DUMMY_TUTOR_BOOKINGS,
  DUMMY_TUTORS, DUMMY_NOTIFICATIONS
} from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

const navItems = [
  { label: "Dashboard", path: "/tuition-panel", icon: LayoutDashboard },
  { label: "Center Profile", path: "/tuition-panel/profile", icon: Settings },
  { label: "My Batches", path: "/tuition-panel/batches", icon: BookOpen },
  { label: "Enquiries", path: "/tuition-panel/enquiries", icon: MessageSquare },
  { label: "Our Tutors", path: "/tuition-panel/tutors", icon: Users },
  { label: "Bookings", path: "/tuition-panel/bookings", icon: Calendar },
  { label: "Notifications", path: "/tuition-panel/notifications", icon: Bell },
];

const defaultCenter = {
  name: "Excel Learning Center",
  location: "Noida Sector 62, Uttar Pradesh",
  phone: "+91 98765 00000",
  email: "info@excellearning.com",
  website: "www.excellearning.com",
  description: "Premium coaching center for JEE, NEET, and Board exam preparation with 10+ years of excellence.",
  established: "2014",
  totalStudents: 500,
  branches: 3,
};

export default function TuitionPanelLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [centerData, setCenterData] = useState(() => getDemoData("tuition-profile", defaultCenter));
  const [batches, setBatches] = useState(() => getDemoData("tuition-batches", DUMMY_BATCHES));
  const [enquiries, setEnquiries] = useState(() => getDemoData("tuition-enquiries", DUMMY_TUITION_ENQUIRIES));
  const [bookings, setBookings] = useState(() => getDemoData("tuition-bookings", DUMMY_TUTOR_BOOKINGS));
  const tutors = DUMMY_TUTORS.slice(0, 4);
  const notifications = DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-tuition-001").length > 0
    ? DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-tuition-001")
    : [
      { id: "tn-1", user_id: "demo-tuition-001", title: "New Enquiry Received", message: "Rajesh Kumar is looking for Mathematics tuition.", type: "enquiry", link: "#", is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
      { id: "tn-2", user_id: "demo-tuition-001", title: "Batch Almost Full", message: "JEE Maths Batch A has 12/15 students.", type: "batch", link: "#", is_read: false, created_at: new Date(Date.now() - 172800000).toISOString() },
    ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const updateCenter = (updates: Partial<typeof defaultCenter>) => { setCenterData(prev => { const next = { ...prev, ...updates }; setDemoData("tuition-profile", next); return next; }); };
  const updateBatches = (newBatches: any[]) => { setBatches(newBatches); setDemoData("tuition-batches", newBatches); };
  const updateEnquiries = (newEnquiries: any[]) => { setEnquiries(newEnquiries); setDemoData("tuition-enquiries", newEnquiries); };
  const updateBookings = (newBookings: any[]) => { setBookings(newBookings); setDemoData("tuition-bookings", newBookings); };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 truncate">
          <Building2 className="h-6 w-6 text-primary shrink-0" />
          <span className="font-bold text-white text-lg truncate">Tuition Panel</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 p-2 shrink-0">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <aside className={`w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed top-0 left-0 h-full z-40 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-slate-800 hidden md:block">
          <Link to="/tuition-panel" className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-sm block truncate leading-tight">{centerData.name}</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Tuition Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hidden-scrollbar">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/tuition-panel' && location.pathname.startsWith(item.path));
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
          <Outlet context={{ centerData, updateCenter, batches, updateBatches, enquiries, updateEnquiries, bookings, updateBookings, tutors, notifications }} />
        </div>
      </main>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
