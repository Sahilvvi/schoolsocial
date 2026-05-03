import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { School, Menu, X, ArrowRight, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Schools", href: "/schools-info" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/">
              <motion.div className="flex items-center gap-2.5 group cursor-pointer" whileHover={{ scale: 1.02 }}>
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <School className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">MySchool<span className="text-violet-400">.</span></span>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 relative group
                      ${location === link.href ? "text-white" : "text-gray-400 hover:text-white"}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {link.label}
                    {location === link.href && (
                      <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/10 rounded-lg -z-10" />
                    )}
                    <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <motion.button
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/schools/register">
                <motion.button
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer ${location === link.href ? "bg-violet-600/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"} transition-colors`}>
                    <span className="font-medium">{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </div>
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link href="/login">
                  <div className="px-4 py-3 text-center text-gray-300 rounded-xl border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">Sign In</div>
                </Link>
                <Link href="/schools/register">
                  <div className="px-4 py-3 text-center text-white font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 cursor-pointer">Get Started</div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
