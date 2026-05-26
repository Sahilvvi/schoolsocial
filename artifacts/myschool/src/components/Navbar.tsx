import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Menu, X, User, LogOut,
  School, CalendarDays, BookOpen, Newspaper,
  ChevronDown, LayoutDashboard, GitCompareArrows,
  Globe, Search, Home, MapPin, Bell, Heart, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryLinks = [
  { to: "/",          label: "Home",      icon: Home },
  { to: "/schools",   label: "Schools",   icon: School },
  { to: "/tutors",    label: "Tuitions",  icon: BookOpen },
  { to: "/compare",   label: "Compare",   icon: GitCompareArrows },
  { to: "/events",    label: "Events",    icon: CalendarDays },
  { to: "/news",      label: "Blogs",     icon: Newspaper },
  { to: "/community", label: "Community", icon: Globe },
];

const mobileDrawerLinks = [
  { to: "/schools",   label: "Schools",   icon: School },
  { to: "/tutors",    label: "Tuitions",  icon: BookOpen },
  { to: "/compare",   label: "Compare",   icon: GitCompareArrows },
  { to: "/events",    label: "Events",    icon: CalendarDays },
  { to: "/news",      label: "Blogs",     icon: Newspaper },
  { to: "/community", label: "Community", icon: Globe },
  { to: "/upload-school", label: "List Your Institution", icon: Plus },
];

const mobileNavLinks = [
  { to: "/",        label: "Home",    icon: Home },
  { to: "/schools", label: "Search",  icon: Search },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/events",  label: "Events",  icon: CalendarDays },
  { to: "/auth",    label: "Profile", icon: User },
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

  const getDashboardLink = () => {
    if (!user) return "/auth";
    const role = user.user_metadata?.role;
    if (role === "school") return "/school-panel";
    if (role === "teacher") return "/teacher-panel";
    if (role === "tuition_center") return "/tuition-panel";
    if (role === "admin") return "/admin";
    return "/parent-panel";
  };

  const isActiveLink = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* ─── DESKTOP NAV ─── */}
      <nav
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md"
            : "bg-white/95 backdrop-blur-md"
        } border-b border-gray-100`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo + Tagline */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-200">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-gray-900 tracking-tight leading-none">
                School<span className="text-indigo-600">Social</span>
              </span>
              <span className="text-[9px] text-gray-400 font-medium tracking-wide leading-none">
                Discover · Compare · Connect
              </span>
            </div>
          </Link>

          {/* Location Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 ml-4 cursor-pointer hover:bg-gray-100 transition-colors">
            <MapPin className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-gray-700">Loni, Ghaziabad</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-0.5 mx-4">
            {primaryLinks.map((l) => {
              const active = isActiveLink(l.to);
              return (
                <Link key={l.to} to={l.to} className="relative">
                  <div
                    className={`px-3.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {l.label}
                  </div>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <Search className="h-4.5 w-4.5 text-gray-600" />
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell className="h-4.5 w-4.5 text-gray-600" />
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-gray-200 mt-2">
                  <div className="px-2 py-1.5 mb-2 border-b border-gray-100">
                    <p className="font-semibold text-sm truncate">{user.user_metadata?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to={getDashboardLink()} className="flex items-center gap-2 w-full py-2">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/parent-panel/saved" className="flex items-center gap-2 w-full py-2">
                      <Heart className="h-4 w-4" /> Saved Schools
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <button onClick={signOut} className="flex items-center gap-2 w-full py-2">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/upload-school">
                <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm h-9 px-5 shadow-md shadow-indigo-200 border-0">
                  <Plus className="h-4 w-4 mr-1" /> List Your Institution
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── MOBILE TOP BAR ─── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
              {open ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-gray-900 leading-none">
                School<span className="text-indigo-600">Social</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mr-1">
              <MapPin className="h-3 w-3 text-indigo-600" />
              <span className="hidden sm:inline">Loni, Ghaziabad</span>
              <ChevronDown className="h-3 w-3" />
            </div>
            <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            {user ? (
              <button className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white ml-1">
                {user.email?.[0]?.toUpperCase()}
              </button>
            ) : (
              <Link to="/auth" className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-1">
                <User className="h-4 w-4 text-gray-500" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── MOBILE DRAWER ─── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-white shadow-2xl"
            >
              <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-extrabold text-lg text-gray-900">
                    School<span className="text-indigo-600">Social</span>
                  </span>
                </Link>
                <button onClick={() => setOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {mobileDrawerLinks.map((l) => {
                  const Icon = l.icon;
                  const active = isActiveLink(l.to);
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {l.label}
                    </Link>
                  );
                })}

                <div className="my-3 h-px bg-gray-100" />

                {user ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 bg-indigo-50"
                    >
                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { signOut(); setOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white mt-2"
                  >
                    <User className="h-4 w-4" /> Sign In / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
        <div className="flex items-center justify-around px-2 py-1.5">
          {mobileNavLinks.map((tab) => {
            const isProfile = tab.label === "Profile";
            const actualTo = isProfile ? getDashboardLink() : tab.to;
            const isActive = isProfile
              ? (["/parent-panel", "/school-panel", "/teacher-panel", "/tuition-panel", "/admin", "/auth"].some(p => location.pathname.startsWith(p)))
              : (tab.to === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.to));

            const Icon = tab.icon;

            return (
              <Link key={tab.label} to={actualTo} className="flex flex-col items-center justify-center w-16 relative">
                <div className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                  <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                  <span className="text-[10px] font-semibold">{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-indigo-600"
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
