import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import PublicNavbar from "@/erp/components/PublicNavbar";
import PublicFooter from "@/erp/components/PublicFooter";
import { ArrowRight, Brain, Heart, Globe, Layers, Rocket, Target, Users, School, TrendingUp, Zap, Shield, Star, CheckCircle2 } from "lucide-react";

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

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">
      <PublicNavbar />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-black to-black" />
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/15 border border-violet-500/30 rounded-full text-violet-300 text-sm font-medium mb-8">
            <Heart className="w-4 h-4" /> Our Story
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Building India's School<br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Digital Infrastructure</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto">
            We believe every school in India — from a small town to a metro city — deserves world-class digital tools to deliver world-class education.
          </motion.p>
        </div>
      </section>

      {/* ─── MISSION ──────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-6"><Target className="w-4 h-4" /> Our Mission</div>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">Democratize Quality School Management</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                India has 1.5 million schools. Only a tiny fraction have access to modern management tools. Most schools still run on paper, Excel sheets, and WhatsApp groups.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                MySchool was built to change that — to give every school, regardless of size or location, access to enterprise-grade tools at an affordable price.
              </p>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "1.5M", label: "Schools in India", icon: School },
                  { num: "320M", label: "School Students", icon: Users },
                  { num: "8M", label: "Teachers", icon: TrendingUp },
                  { num: "90%", label: "Still Use Manual Systems", icon: Target },
                ].map(({ num, label, icon: Icon }) => (
                  <motion.div key={label} whileHover={{ scale: 1.03 }} className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <Icon className="w-6 h-6 text-violet-400 mx-auto mb-3" />
                    <div className="text-2xl font-black text-white mb-1">{num}</div>
                    <div className="text-gray-500 text-xs">{label}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM IN EDUCATION ─────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-4"><Globe className="w-4 h-4" /> The Problem</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Fragmented Systems. Frustrated Schools.</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Schools have been forced to stitch together dozens of apps to solve individual problems — each creating more chaos</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "No Single Platform", desc: "Schools use 5–10 different tools for attendance, fees, communication, exams — none of them connected" },
              { title: "Expensive Enterprise Tools", desc: "The few good solutions exist cost ₹20–50L/year — completely out of reach for 99% of schools" },
              { title: "Zero Parent Connection", desc: "Parents have no real-time visibility into their child's education — they rely on WhatsApp forwards" },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div className="p-7 bg-white/3 border border-white/10 rounded-2xl h-full">
                  <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full mb-4" />
                  <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VISION ───────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6"><Rocket className="w-4 h-4" /> Our Vision</div>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">Create India's School Network Ecosystem</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                We're not building just another school ERP. We're building a living, interconnected network — where every school is connected to parents, teachers, students, and the broader education marketplace.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Imagine a world where switching schools is as easy as a Google search, where every teacher's qualifications are verified, and where parents have complete transparency into their child's growth.
              </p>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <div className="space-y-4">
                {[
                  { icon: Globe, title: "Universal School Discovery", desc: "Every school visible and discoverable on the internet" },
                  { icon: Brain, title: "AI-Powered Operations", desc: "AI that predicts dropout risks, flags anomalies, automates admin work" },
                  { icon: Users, title: "Connected Stakeholders", desc: "Schools, parents, teachers, and students in one seamless network" },
                  { icon: Shield, title: "Trusted Data Layer", desc: "Verified credentials, transparent ratings, audit-ready records" },
                ].map(({ icon: Icon, title, desc }) => (
                  <motion.div key={title} whileHover={{ x: 6 }} className="flex gap-4 p-4 bg-white/3 border border-white/10 rounded-xl">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── PLATFORM PHILOSOPHY ──────────────────────────── */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-4"><Layers className="w-4 h-4" /> Platform Philosophy</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Management + Communication + Marketplace</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Three pillars that work together to create something greater than the sum of their parts</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: School, title: "Management", desc: "Complete school ERP — from student admission to alumni records, everything managed on one platform with AI assistance", color: "violet" },
              { icon: Users, title: "Communication", desc: "Real-time connections between schools, parents, teachers, and students. Instant notifications, messaging, and collaboration", color: "blue" },
              { icon: TrendingUp, title: "Marketplace", desc: "Teacher hiring, tutor matching, career development — an education-native marketplace that understands the sector", color: "orange" },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} className={`p-8 bg-${p.color}-500/5 border border-${p.color}-500/20 rounded-3xl text-center`}>
                  <div className={`w-14 h-14 bg-${p.color}-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <p.icon className={`w-7 h-7 text-${p.color}-400`} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{p.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FUTURE VISION ────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-black pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-6"><Brain className="w-4 h-4" /> The Future</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">AI-Driven School Operations</h2>
            <p className="text-gray-400 text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
              Tomorrow's MySchool will predict which students need support before they fall behind, suggest optimal timetables, automate payroll, flag fee defaulters, and give principals real-time command over every aspect of their school — all from a conversational AI interface.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Brain, label: "Predictive AI" },
                { icon: Zap, label: "Auto-Automation" },
                { icon: Shield, label: "Smart Security" },
                { icon: Globe, label: "Pan-India Network" },
              ].map(({ icon: Icon, label }) => (
                <motion.div key={label} whileHover={{ scale: 1.05 }} className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                  <Icon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                  <div className="text-white text-sm font-medium">{label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-black to-blue-900/20 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Join the Ecosystem</h2>
            <p className="text-gray-300 text-xl mb-10">Be part of India's largest school digital transformation movement</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/schools/register">
                <motion.button whileHover={{ scale: 1.05 }} className="group flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl shadow-2xl cursor-pointer">
                  Register Your School <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button whileHover={{ scale: 1.03 }} className="px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl cursor-pointer">
                  Talk to Us
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
