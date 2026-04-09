import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import PublicNavbar from "@/erp/components/PublicNavbar";
import PublicFooter from "@/erp/components/PublicFooter";
import {
  ArrowRight, Sparkles, School, Users, BookOpen, Bell, Star, MapPin,
  Brain, QrCode, BarChart3, Calendar, Banknote, FileText, Search,
  Briefcase, GraduationCap, Shield, TrendingUp, CheckCircle2, Play,
  ChevronRight, Globe, Award, Building2, Clock, Zap, Heart, Target
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function AnimatedCounter({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-black text-white mb-2">
        {count.toLocaleString("en-IN")}{suffix}
      </div>
      <div className="text-gray-400 text-sm font-medium">{label}</div>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "", direction = "up" }: { children: React.ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right" | "none" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const initialMap = { up: { y: 40, opacity: 0 }, left: { x: -40, opacity: 0 }, right: { x: 40, opacity: 0 }, none: { opacity: 0 } };
  return (
    <motion.div ref={ref} initial={initialMap[direction]} animate={inView ? { y: 0, x: 0, opacity: 1 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

const FEATURES = [
  { icon: Calendar, title: "Smart Attendance", desc: "QR-based biometric attendance with real-time parent notifications", color: "from-violet-500 to-purple-600" },
  { icon: Banknote, title: "Fee Management", desc: "Automated fee collection, receipts, and defaulter tracking", color: "from-blue-500 to-cyan-600" },
  { icon: Bell, title: "Notice System", desc: "Instant circular distribution to all stakeholders", color: "from-orange-500 to-amber-600" },
  { icon: Calendar, title: "Event Management", desc: "School events, PTM scheduling, and calendar sync", color: "from-pink-500 to-rose-600" },
  { icon: Star, title: "School Ratings", desc: "Transparent community-driven school rating system", color: "from-yellow-500 to-orange-600" },
  { icon: Search, title: "Discovery Engine", desc: "Parents find & compare schools by location, board, ratings", color: "from-green-500 to-emerald-600" },
  { icon: Briefcase, title: "Teacher Hiring", desc: "AI-matched teacher recruitment marketplace", color: "from-indigo-500 to-blue-600" },
  { icon: Brain, title: "AI Assistant", desc: "Intelligent ERP assistant for instant data queries", color: "from-violet-500 to-fuchsia-600" },
];

const AI_QUERIES = [
  "Show attendance report for Class 10...",
  "List fee defaulters this month...",
  "Which class has lowest attendance?",
  "Generate payroll summary for March...",
  "Show pending homework submissions...",
  "Top 5 students by performance score...",
];

function AITypingDemo() {
  const [queryIdx, setQueryIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "result" | "clearing">("typing");

  const RESPONSES = [
    { answer: "Class 10A: 94% | 10B: 87% | 10C: 91%", type: "attendance" },
    { answer: "Found 12 fee defaulters — ₹2,45,000 pending", type: "fees" },
    { answer: "Class 9B has lowest attendance at 76%", type: "analytics" },
    { answer: "Payroll: ₹8,45,000 disbursed, ₹1,20,000 pending", type: "payroll" },
    { answer: "23 homework assignments pending review", type: "homework" },
    { answer: "Top performers: Priya (98%), Arjun (97%), Meera (96%)", type: "performance" },
  ];

  useEffect(() => {
    const q = AI_QUERIES[queryIdx];
    if (phase === "typing") {
      if (typed.length < q.length) {
        const t = setTimeout(() => setTyped(q.slice(0, typed.length + 1)), 40);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("result"), 800);
        return () => clearTimeout(t);
      }
    } else if (phase === "result") {
      const t = setTimeout(() => setPhase("clearing"), 3000);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setTyped(""); setPhase("typing");
        setQueryIdx((i) => (i + 1) % AI_QUERIES.length);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [typed, phase, queryIdx]);

  const response = RESPONSES[queryIdx];

  return (
    <div className="bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-gray-500 text-xs">MySchool AI Assistant</span>
      </div>
      <div className="p-5 space-y-4 min-h-[200px]">
        {/* User query */}
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-400 text-xs font-bold">A</span>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm text-blue-200 max-w-xs">
            {typed}<span className={`${phase === "typing" ? "opacity-100" : "opacity-0"} transition-opacity`}>|</span>
          </div>
        </div>
        {/* AI response */}
        <AnimatePresence>
          {phase === "result" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl px-4 py-2.5 max-w-xs">
                <div className="text-xs text-violet-400 font-medium mb-1 uppercase tracking-wider">{response.type}</div>
                <div className="text-sm text-gray-200">{response.answer}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Quick query chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {["Fee report", "Attendance", "Notices", "Payroll"].map(chip => (
            <div key={chip} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 cursor-pointer hover:bg-white/10 hover:text-white transition-colors">{chip}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">
      <PublicNavbar />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/60 via-black to-black" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"
          />
          {/* Grid overlay */}
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/15 border border-violet-500/30 rounded-full text-violet-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            India's #1 School Digital Ecosystem
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6 leading-none"
          >
            <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">India's Digital</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Ecosystem</span>
            <br />
            <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">for Schools</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            One intelligent platform connecting schools, parents, teachers, and learners — with AI-powered ERP, smart QR IDs, and real-time communication.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/schools/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 text-base cursor-pointer"
              >
                <School className="w-5 h-5" />
                Start Your School
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/schools">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-base cursor-pointer"
              >
                <Play className="w-5 h-5" />
                Explore Platform
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
          >
            {[
              { val: "10,000+", label: "Schools" },
              { val: "1M+", label: "Parents" },
              { val: "100K+", label: "Teachers" },
              { val: "99.9%", label: "Uptime" },
            ].map(({ val, label }) => (
              <div key={label} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-white font-semibold">{val}</span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ─── PLATFORM OVERVIEW ────────────────────────────────── */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/10 to-black pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
              <Globe className="w-4 h-4" /> Platform Overview
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">One Platform. Four Layers.</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Built as an integrated ecosystem — every layer amplifies the others</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: School, title: "School Management", desc: "Full ERP — attendance, fees, exams, payroll, library, transport", gradient: "from-violet-500/20 to-violet-600/5", border: "border-violet-500/20", accent: "text-violet-400", badge: "ERP", iconBg: "bg-violet-500/20" },
              { icon: Users, title: "Communication Hub", desc: "Connect schools, parents, teachers with messaging and notifications", gradient: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", accent: "text-blue-400", badge: "Comm", iconBg: "bg-blue-500/20" },
              { icon: Globe, title: "School Visibility", desc: "Public school profiles, ratings, reviews, and discovery engine", gradient: "from-cyan-500/20 to-cyan-600/5", border: "border-cyan-500/20", accent: "text-cyan-400", badge: "Public", iconBg: "bg-cyan-500/20" },
              { icon: Briefcase, title: "Education Marketplace", desc: "Teacher hiring, tutor marketplace, and career portal", gradient: "from-orange-500/20 to-orange-600/5", border: "border-orange-500/20", accent: "text-orange-400", badge: "Market", iconBg: "bg-orange-500/20" },
            ].map((layer, i) => (
              <FadeIn key={layer.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`relative group p-6 rounded-2xl bg-gradient-to-br ${layer.gradient} border ${layer.border} overflow-hidden h-full`}
                >
                  <div className="absolute top-0 right-0 px-2.5 py-1 bg-white/5 text-xs font-bold text-gray-400 rounded-bl-xl">{layer.badge}</div>
                  <div className={`w-12 h-12 ${layer.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <layer.icon className={`w-6 h-6 ${layer.accent}`} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{layer.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{layer.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI ASSISTANT SHOWCASE ────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-6">
                <Brain className="w-4 h-4" /> Agentic AI Assistant
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">Your School's Intelligent Data Partner</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Ask anything about your school in plain English. The AI assistant queries all your data — attendance, fees, exams, payroll — and gives instant, accurate answers.
              </p>
              <div className="space-y-3">
                {["Instant answers from all school data", "Natural language queries", "Smart alerts and anomaly detection", "Works for admins, teachers, and parents"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-violet-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <AITypingDemo />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SMART QR ID ──────────────────────────────────────── */}
      <section className="py-32 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left" delay={0.2}>
              {/* QR Demo Card */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
                  {/* ID Card */}
                  <div className="bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-white/10 rounded-2xl p-6 mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-black text-xl">A</div>
                      <div>
                        <div className="text-white font-bold">Arjun Sharma</div>
                        <div className="text-gray-400 text-sm">Class 10-A | Roll #23</div>
                        <div className="text-violet-400 text-xs font-medium">DPS New Delhi</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Student ID</div>
                        <div className="text-gray-300 text-sm font-mono">DPS-2024-0023</div>
                      </div>
                      {/* Animated QR */}
                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-14 h-14 bg-white rounded-xl p-1.5"
                      >
                        <div className="w-full h-full" style={{ backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`, backgroundSize: "6px 6px" }} />
                      </motion.div>
                    </div>
                  </div>
                  {/* Scan animation */}
                  <div className="flex items-center gap-3 text-sm">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center justify-center"
                    >
                      <QrCode className="w-4 h-4 text-green-400" />
                    </motion.div>
                    <div>
                      <div className="text-green-400 font-medium">Attendance Marked ✓</div>
                      <div className="text-gray-500 text-xs">Today, 8:42 AM</div>
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-orange-500/30"
                >
                  Smart ID
                </motion.div>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
                <QrCode className="w-4 h-4" /> Smart QR ID System
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">Digital Student Identity</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Every student gets a digital ID card with QR code. Scan to mark attendance, verify identity, and access the student profile instantly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: QrCode, title: "QR Attendance", desc: "Instant scan to mark attendance" },
                  { icon: Shield, title: "Verified Identity", desc: "Tamper-proof digital credentials" },
                  { icon: Bell, title: "Parent Alerts", desc: "Auto-notify parents on entry" },
                  { icon: BarChart3, title: "Analytics", desc: "Attendance pattern insights" },
                ].map(({ icon: Icon, title, desc }) => (
                  <motion.div key={title} whileHover={{ scale: 1.02 }} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <Icon className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="text-white font-semibold text-sm">{title}</div>
                    <div className="text-gray-500 text-xs mt-1">{desc}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ────────────────────────────────────── */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" /> Full Feature Suite
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Everything Your School Needs</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">One subscription. Complete digital transformation.</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative p-6 bg-white/3 border border-white/10 rounded-2xl overflow-hidden cursor-default h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className={`w-11 h-11 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCHOOL DISCOVERY ─────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 to-black pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6">
                <Search className="w-4 h-4" /> School Discovery
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">Parents Find the Perfect School</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                A powerful discovery engine helps parents search, compare, and apply to schools by location, curriculum, ratings, and fees — all in one place.
              </p>
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: "Search by location, city, or pincode" },
                  { icon: Star, text: "Compare schools by verified community ratings" },
                  { icon: FileText, text: "Online admission forms and status tracking" },
                  { icon: BookOpen, text: "School blogs, events, and galleries" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/schools">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-2 px-6 py-3 bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 font-semibold rounded-xl hover:bg-cyan-600/30 transition-all cursor-pointer"
                  >
                    Explore Schools <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              {/* School cards preview */}
              <div className="space-y-3">
                {[
                  { name: "DPS New Delhi", board: "CBSE", rating: 4.8, students: "3,200", city: "New Delhi", type: "Private" },
                  { name: "St. Xavier's Mumbai", board: "ICSE", rating: 4.7, students: "2,800", city: "Mumbai", type: "Private" },
                  { name: "Kendriya Vidyalaya", board: "CBSE", rating: 4.5, students: "1,500", city: "Bengaluru", type: "Government" },
                ].map((school, i) => (
                  <motion.div
                    key={school.name}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ x: -4 }}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      {school.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">{school.name}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span>{school.board}</span>
                        <span>·</span>
                        <MapPin className="w-3 h-3" /><span>{school.city}</span>
                        <span>·</span>
                        <span>{school.students} students</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 flex-shrink-0">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-amber-300 text-sm font-bold">{school.rating}</span>
                    </div>
                  </motion.div>
                ))}
                <div className="text-center pt-2">
                  <span className="text-gray-600 text-sm">10,000+ schools listed</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── ECOSYSTEM NETWORK ────────────────────────────────── */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/15 to-black pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm font-medium mb-4">
              <Heart className="w-4 h-4" /> Ecosystem Network
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Everyone Connected. Everything Unified.</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-16">MySchool creates a living network where every stakeholder is connected in real time</p>
          </FadeIn>
          <div className="relative">
            {/* Center hub */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-32 h-32 border border-violet-500/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 border border-blue-500/10 rounded-full"
              />
              <div className="relative w-20 h-20 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-2xl shadow-violet-500/40 z-10">
                <School className="w-8 h-8 text-white" />
                <span className="text-white text-xs font-bold mt-1">MySchool</span>
              </div>
            </div>
            {/* Stakeholders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { icon: Building2, label: "Schools", count: "10,000+", color: "violet" },
                { icon: Users, label: "Parents", count: "1M+", color: "blue" },
                { icon: GraduationCap, label: "Teachers", count: "100K+", color: "cyan" },
                { icon: Briefcase, label: "Job Seekers", count: "50K+", color: "orange" },
              ].map(({ icon: Icon, label, count, color }) => (
                <FadeIn key={label}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.03 }}
                    className={`p-6 bg-${color}-500/5 border border-${color}-500/20 rounded-2xl`}
                  >
                    <Icon className={`w-8 h-8 text-${color}-400 mx-auto mb-3`} />
                    <div className="text-white font-bold text-lg">{count}</div>
                    <div className="text-gray-400 text-sm">{label}</div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARKETPLACE ──────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" /> Teacher Marketplace
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">India's Largest Education Job Platform</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Schools hire qualified teachers. Teachers find their dream school. All in one place.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Mathematics Teacher", school: "DPS New Delhi", salary: "₹40K–₹60K/month", type: "Full Time", board: "CBSE", urgent: true },
              { title: "English Teacher", school: "St. Xavier's Mumbai", salary: "₹35K–₹50K/month", type: "Full Time", board: "ICSE", urgent: false },
              { title: "Physics Faculty", school: "KV Bengaluru", salary: "₹45K–₹65K/month", type: "Contract", board: "CBSE", urgent: true },
            ].map((job, i) => (
              <FadeIn key={job.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="p-6 bg-white/3 border border-white/10 rounded-2xl hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5 text-orange-400" />
                    </div>
                    {job.urgent && (
                      <span className="px-2.5 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full">URGENT</span>
                    )}
                  </div>
                  <h3 className="text-white font-bold mb-1">{job.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{job.school}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-full">{job.board}</span>
                    <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-full">{job.type}</span>
                  </div>
                  <div className="text-orange-400 font-semibold text-sm">{job.salary}</div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="text-center mt-8">
            <Link href="/jobs">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-orange-600/20 border border-orange-500/30 text-orange-300 font-semibold rounded-xl hover:bg-orange-600/30 transition-all cursor-pointer"
              >
                View All Jobs →
              </motion.button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ─── STATISTICS ───────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-black to-blue-950/20 pointer-events-none" />
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.06) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Trusted by India's Best Schools</h2>
            <p className="text-gray-400 text-xl">Growing every day across every state</p>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCounter end={10000} suffix="+" label="Schools Onboarded" />
            <AnimatedCounter end={1000000} suffix="+" label="Parent Accounts" />
            <AnimatedCounter end={100000} suffix="+" label="Teachers Registered" />
            <AnimatedCounter end={50} suffix="M+" label="Attendance Records" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <AnimatedCounter end={500000} suffix="+" label="Fee Transactions" />
            <AnimatedCounter end={10000} suffix="+" label="Jobs Posted" />
            <AnimatedCounter end={999} suffix="%" label="Uptime SLA" />
            <AnimatedCounter end={28} suffix=" States" label="Pan-India Presence" />
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 to-blue-900/30" />
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [5, 0, 5] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-gray-300 text-sm font-medium mb-6">
              <Target className="w-4 h-4" /> Ready to Transform?
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Join 10,000+ Schools Already on MySchool
            </h2>
            <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
              Start your free trial today. No setup fees. No credit card required. Get your school online in under 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/schools/register">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl shadow-2xl hover:shadow-white/20 transition-all text-base cursor-pointer"
                >
                  <School className="w-5 h-5" />
                  Register Your School Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/15 transition-all text-base cursor-pointer"
                >
                  Book a Demo
                </motion.button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
