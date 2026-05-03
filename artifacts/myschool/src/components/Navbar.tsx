import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Menu, X, User, LogOut,
  School, CalendarDays, Briefcase, BookOpen, Newspaper,
  Crown, MessageSquare, ChevronDown, Upload, LayoutDashboard, GitCompareArrows,
  QrCode, Globe, UserCircle, Search, Home
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
  { to: "/schools",   label: "Schools",   icon: School },
  { to: "/tutors",    label: "Tuitions",  icon: BookOpen },
  { to: "/compare",   label: "Compare",   icon: GitCompareArrows },
  { to: "/events",    label: "Events",    icon: CalendarDays },
  { to: "/news",      label: "Blogs",     icon: Newspaper },
  { to: "/community", label: "Community", icon: Globe },
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

// Mobile Bottom Nav Links
const mobileNavLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/schools", label: "Schools", icon: School },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: User },
];

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

  const getDashboardLink = () => {
    if (!user) return "/auth";
    const role = user.user_metadata?.role;
    if (role === "school") return "/school-panel";
    if (role === "teacher") return "/teacher-panel";
    if (role === "tuition_center") return "/tuition-panel";
    if (role === "admin") return "/admin";
    return "/parent-panel";
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-xl shadow-background/50"
            : "bg-background/80 backdrop-blur-md"
        } border-b border-border/40`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="gradient-primary p-2 rounded-xl shadow-lg shadow-primary/30"
            >
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="text-foreground font-extrabold text-xl tracking-tight">MySchool</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((l) => {
              const isActive = location.pathname.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to} className="relative">
                  <div
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
                      className="absolute -bottom-[13px] left-4 right-4 h-0.5 rounded-full gradient-primary"
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
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 outline-none ${
                    isMoreActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  More
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-2 shadow-xl border-border/50">
                {moreLinks.map((l) => {
                  const Icon = l.icon;
                  const isActive = location.pathname.startsWith(l.to);
                  return (
                    <DropdownMenuItem key={l.to} asChild className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary">
                      <Link
                        to={l.to}
                        className={`flex items-center gap-2.5 w-full py-2.5 ${isActive ? "text-primary font-bold bg-primary/5" : "font-medium"}`}
                      >
                        <Icon className="h-4 w-4" />
                        {l.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center pl-2 ml-2 gap-2 border-l border-border/40">
              <GlobalSearch />
              <NotificationBell />
              <ThemeToggle />
            </div>

            {/* Auth */}
            <div className="ml-4 pl-4 border-l border-border/40 flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors">
                      <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-md cursor-pointer">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-border/50 mt-2">
                    <div className="px-2 py-1.5 mb-2 border-b border-border/40">
                      <p className="font-semibold text-sm truncate">{user.user_metadata?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link to={getDashboardLink()} className="flex items-center gap-2 w-full py-2">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                      <button onClick={signOut} className="flex items-center gap-2 w-full py-2">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button className="rounded-xl shadow-lg shadow-primary/20 font-bold gradient-primary border-0 text-white hover:opacity-90 h-10 px-6 transition-transform hover:scale-105 active:scale-95">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Nav Top Toggles */}
          <div className="lg:hidden flex items-center gap-2">
            <GlobalSearch />
            <NotificationBell />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10" onClick={() => setOpen(!open)}>
              <AnimatePresence mode="wait">
                <motion.div key={open ? "close" : "open"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-border/40 overflow-hidden bg-background/95 backdrop-blur-xl"
            >
              <div className="flex flex-col p-4 gap-2 pb-24">
                {allLinks.map((l, i) => {
                  const Icon = l.icon;
                  const isActive = location.pathname.startsWith(l.to);
                  return (
                    <motion.div key={l.to} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <Link
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {l.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="my-2 h-px bg-border/40" />
                {user ? (
                  <>
                    <Link to={getDashboardLink()} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 text-left">
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <button onClick={() => { signOut(); setOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 text-left mt-2">
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold gradient-primary text-white shadow-md">
                    <User className="h-5 w-5" />
                    Sign In / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/40 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavLinks.map((tab) => {
            const isProfile = tab.to === "/profile";
            const actualTo = isProfile ? getDashboardLink() : tab.to;
            const isActive = isProfile
              ? (user && ["/parent-panel", "/school-panel", "/teacher-panel", "/tuition-panel", "/admin", "/auth"].some(p => location.pathname.startsWith(p)))
              : (tab.to === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.to));
              
            const Icon = tab.icon;

            return (
              <Link key={tab.label} to={actualTo} className="flex flex-col items-center justify-center w-16 relative">
                <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`} />
                  <span className="text-[10px] font-semibold">{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full gradient-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}