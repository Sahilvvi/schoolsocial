import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, BookOpen, MessageSquare, Users, Calendar,
  Building2, Bell, LogOut, ChevronLeft, Loader2, GraduationCap, Settings
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
  const [centerData, setCenterData] = useState(() =>
    getDemoData("tuition-profile", defaultCenter)
  );

  const [batches, setBatches] = useState(() =>
    getDemoData("tuition-batches", DUMMY_BATCHES)
  );
  const [enquiries, setEnquiries] = useState(() =>
    getDemoData("tuition-enquiries", DUMMY_TUITION_ENQUIRIES)
  );
  const [bookings, setBookings] = useState(() =>
    getDemoData("tuition-bookings", DUMMY_TUTOR_BOOKINGS)
  );
  const tutors = DUMMY_TUTORS.slice(0, 4);
  const notifications = DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-tuition-001").length > 0
    ? DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-tuition-001")
    : [
      { id: "tn-1", user_id: "demo-tuition-001", title: "New Enquiry Received", message: "Rajesh Kumar is looking for Mathematics tuition.", type: "enquiry", link: "#", is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
      { id: "tn-2", user_id: "demo-tuition-001", title: "Batch Almost Full", message: "JEE Maths Batch A has 12/15 students.", type: "batch", link: "#", is_read: false, created_at: new Date(Date.now() - 172800000).toISOString() },
      { id: "tn-3", user_id: "demo-tuition-001", title: "New Review", message: "A parent left a 5-star review.", type: "review", link: "#", is_read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
      { id: "tn-4", user_id: "demo-tuition-001", title: "Payment Received", message: "Fee payment of ₹8,000 received.", type: "payment", link: "#", is_read: true, created_at: new Date(Date.now() - 345600000).toISOString() },
    ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const updateCenter = (updates: Partial<typeof defaultCenter>) => {
    setCenterData(prev => {
      const next = { ...prev, ...updates };
      setDemoData("tuition-profile", next);
      return next;
    });
  };

  const updateBatches = (newBatches: any[]) => {
    setBatches(newBatches);
    setDemoData("tuition-batches", newBatches);
  };

  const updateEnquiries = (newEnquiries: any[]) => {
    setEnquiries(newEnquiries);
    setDemoData("tuition-enquiries", newEnquiries);
  };

  const updateBookings = (newBookings: any[]) => {
    setBookings(newBookings);
    setDemoData("tuition-bookings", newBookings);
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-card/80 backdrop-blur-xl border-r border-border/30 flex flex-col fixed top-0 left-0 h-full z-50">
        <div className="p-5 border-b border-border/30">
          <Link to="/tuition-panel" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-lg shadow-md">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-gradient font-extrabold text-sm block truncate">{centerData.name}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Tuition Panel</p>
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
        <Outlet context={{ centerData, updateCenter, batches, updateBatches, enquiries, updateEnquiries, bookings, updateBookings, tutors, notifications }} />
      </main>
    </div>
  );
}
