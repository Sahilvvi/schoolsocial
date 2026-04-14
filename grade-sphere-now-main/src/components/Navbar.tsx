import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Menu, X, User, LogOut,
  School, CalendarDays, Briefcase, BookOpen, Newspaper,
  Crown, MessageSquare, ChevronDown, Upload, Settings, LayoutDashboard, GitCompareArrows,
  QrCode, Globe, UserCircle
} from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryLinks = [
  { to: "/schools", label: "Schools", icon: School },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/jobs", label: "Vacancies", icon: Briefcase },
  { to: "/tutors", label: "Tutors", icon: BookOpen },
  { to: "/news", label: "News", icon: Newspaper },
];

const moreLinks = [
  { to: "/compare", label: "Compare Schools", icon: GitCompareArrows },
  { to: "/tuition-enquiry", label: "Home Tuition", icon: MessageSquare },
  { to: "/community", label: "Community", icon: Globe },
  { to: "/scanner", label: "QR Scanner", icon: QrCode },
  { to: "/teacher-profile", label: "Teacher Profile", icon: UserCircle },
  { to: "/plans", label: "Plans", icon: Crown },
  { to: "/upload-school", label: "List School", icon: Upload },
];

const allLinks = [...primaryLinks, ...moreLinks];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMoreActive = moreLinks.some((l) => location.pathname.startsWith(l.to));

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-xl shadow-background/50"
          : "bg-background/80 backdrop-blur-md"
      } border-b border-border/40`}
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="gradient-primary p-1.5 rounded-lg shadow-lg shadow-primary/30"
          >
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="text-gradient font-extrabold text-lg tracking-tight">MySchool</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {primaryLinks.map((l) => {
            const isActive = location.pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to} className="relative">
                <div
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {l.label}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-[9px] left-3 right-3 h-0.5 rounded-full gradient-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* More dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none ${
                  isMoreActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                More
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {moreLinks.map((l) => {
                const Icon = l.icon;
                const isActive = location.pathname.startsWith(l.to);
                return (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link
                      to={l.to}
                      className={`flex items-center gap-2 w-full ${isActive ? "text-primary font-medium" : ""}`}
                    >
                      <Icon className="h-4 w-4" />
                      {l.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <GlobalSearch />
          <NotificationBell />
          <ThemeToggle />

          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/school-panel">
                <Button size="sm" className="h-8 rounded-lg gradient-primary border-0 text-white shadow-md hover:shadow-lg transition-all font-semibold px-4 cursor-pointer gap-1.5 ml-2">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">School Panel</span>
                </Button>
              </Link>
            ) : (
              <Link to="/erp">
                <Button size="sm" className="h-8 rounded-lg bg-muted border-0 text-foreground shadow-sm hover:bg-muted/80 transition-all font-semibold px-4 cursor-pointer gap-1.5 ml-2">
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ERP Login</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="ml-2 pl-2 border-l border-border/40">
            {user ? (
              <div className="flex items-center gap-1.5">
              <Link to="/dashboard">
                <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md cursor-pointer">
                  {user.email?.[0]?.toUpperCase()}
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={signOut} className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="rounded-lg shadow-md font-semibold gradient-primary border-0 text-primary-foreground hover:opacity-90 h-8 text-xs px-3">
                  <User className="h-3.5 w-3.5 mr-1" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden rounded-lg h-8 w-8" onClick={() => setOpen(!open)}>
          <AnimatePresence mode="wait">
            <motion.div key={open ? "close" : "open"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-border/40 overflow-hidden glass"
          >
            <div className="flex flex-col p-3 gap-0.5">
              {/* Mobile Quick Toggle: Schools / Tuitions */}
              <div className="flex items-center gap-1 mb-2 p-1 bg-muted/20 rounded-xl">
                <Link to="/schools" onClick={() => setOpen(false)}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${location.pathname === "/schools" ? "gradient-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted/30"}`}>
                  Schools
                </Link>
                <Link to="/tutors" onClick={() => setOpen(false)}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${location.pathname === "/tutors" ? "gradient-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted/30"}`}>
                  Tuitions
                </Link>
              </div>
              {allLinks.map((l, i) => {
                const Icon = l.icon;
                return (
                  <motion.div key={l.to} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        location.pathname.startsWith(l.to)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="my-1.5 h-px bg-border/40" />
              {user ? (
                <button onClick={() => { signOut(); setOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 text-left">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-primary/10">
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
