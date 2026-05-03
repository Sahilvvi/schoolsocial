import { ReactNode, useState, useCallback, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/erp/hooks/use-auth";
import { useTheme } from "@/erp/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, LogOut, Sun, Moon, Menu, X, ChevronDown, ChevronRight, ChevronLeft
} from "lucide-react";
import NotificationBell from "@/erp/components/NotificationBell";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

function SidebarLinks({ links, location, onLinkClick }: { links: NavLink[]; location: string; onLinkClick?: () => void }) {
  const hasGroups = links.some(l => l.group);

  if (!hasGroups) {
    return (
      <div className="space-y-0.5 px-3">
        {links.map(link => {
          const isActive = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-sm ${
                isActive
                  ? "bg-primary text-white shadow-sm shadow-primary/30 font-semibold"
                  : "text-muted-foreground dark:text-gray-400 hover:bg-secondary dark:hover:bg-gray-700 hover:text-foreground dark:hover:text-white font-medium"
              }`}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  const grouped: Record<string, NavLink[]> = {};
  links.forEach(link => {
    const g = link.group || "Other";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(link);
  });

  const activeGroup = Object.entries(grouped).find(([, gLinks]) =>
    gLinks.some(l => l.href === location)
  )?.[0];

  return (
    <div className="px-3 space-y-1">
      {Object.entries(grouped).map(([group, gLinks]) => (
        <GroupSection
          key={group}
          group={group}
          links={gLinks}
          location={location}
          defaultOpen={group === "Dashboard" || gLinks.some(l => l.href === location)}
          onLinkClick={onLinkClick}
        />
      ))}
    </div>
  );
}

function GroupSection({ group, links, location, defaultOpen, onLinkClick }: {
  group: string; links: NavLink[]; location: string; defaultOpen: boolean; onLinkClick?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const hasActive = links.some(l => l.href === location);

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg group hover:bg-secondary/60 dark:hover:bg-gray-700/60 transition-colors"
      >
        <span className={`text-[10px] font-bold uppercase tracking-widest ${hasActive ? "text-primary" : "text-muted-foreground/60 dark:text-gray-500 group-hover:text-muted-foreground"}`}>
          {group}
        </span>
        {open
          ? <ChevronDown className="w-3 h-3 text-muted-foreground/50" />
          : <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 mb-1">
              {links.map(link => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onLinkClick}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 text-sm ${
                      isActive
                        ? "bg-primary text-white shadow-sm shadow-primary/30 font-semibold"
                        : "text-muted-foreground dark:text-gray-400 hover:bg-secondary dark:hover:bg-gray-700 hover:text-foreground dark:hover:text-white font-medium"
                    }`}
                  >
                    <link.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminLayout({ children, title, links }: { children: ReactNode; title: string; links: NavLink[] }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location]);

  const UserFooter = ({ compact = false }: { compact?: boolean }) => (
    <div className={`border-t border-border dark:border-gray-700 ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center gap-3 mb-3 px-1">
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
          {user?.name?.[0] || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground dark:text-white truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground dark:text-gray-400 capitalize truncate">{user?.role?.replace(/_/g, " ")}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 dark:text-red-400 dark:hover:text-red-300 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="bg-background flex" style={{ height: "100dvh" }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 bg-card dark:bg-gray-800 border-r border-border dark:border-gray-700 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-gray-700">
                <a href="/" className="flex items-center gap-2 group shrink-0">
                  <div className="gradient-primary p-1.5 rounded-lg shadow-lg shadow-primary/30">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gradient font-extrabold text-lg tracking-tight">MySchool</span>
                </a>
                <button
                  onClick={closeMobile}
                  className="p-1.5 rounded-lg hover:bg-secondary dark:hover:bg-gray-700 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-3">
                <SidebarLinks links={links} location={location} onLinkClick={closeMobile} />
              </div>
              <UserFooter compact />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-card dark:bg-gray-800 border-r border-border dark:border-gray-700 flex-col shrink-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border dark:border-gray-700 shrink-0">
          <a href="/" className="flex items-center gap-2 group shrink-0">
            <div className="gradient-primary p-1.5 rounded-lg shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-gradient font-extrabold text-lg tracking-tight">MySchool</span>
          </a>
        </div>
        <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
          <SidebarLinks links={links} location={location} />
        </div>
        
        <div className="px-3 pb-2">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Browse Public Portal
          </a>
        </div>

        <UserFooter />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-14 bg-card/70 backdrop-blur-md dark:bg-gray-800/70 border-b border-border/80 flex items-center justify-between px-4 shrink-0 relative z-20">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-secondary dark:hover:bg-gray-700 text-muted-foreground transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base md:text-lg font-bold text-foreground dark:text-white truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle dark mode"
            >
              {theme === "dark"
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4 text-gray-500" />
              }
            </button>
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <div ref={scrollRef} className="flex-1 overflow-auto bg-slate-50/50 dark:bg-gray-900/30">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-6 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export function MobileLayout({ children, links }: { children: ReactNode; links: any[] }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {children}
        </motion.div>
      </div>
      <nav className="fixed bottom-0 w-full bg-card border-t border-border flex justify-around p-2 pb-safe z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <div className={`p-1.5 rounded-lg ${isActive ? "bg-primary/10" : ""}`}>
                <link.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium mt-1">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function StatCard({ title, value, icon: Icon, trend, colorClass = "text-primary", bgClass = "bg-primary/10" }: any) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-display font-bold text-foreground">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 font-medium ${trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {trend} this month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
