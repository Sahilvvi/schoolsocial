import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import {
  ArrowRight, School, CheckCircle2, XCircle, Brain, QrCode, BarChart3,
  Calendar, Banknote, Bell, Users, BookOpen, Shield, Zap, Star,
  TrendingUp, Clock, FileText, Layers, Award, Building2
} from "lucide-react";

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

const PLANS = [
  {
    name: "Starter",
    price: "₹2,999",
    period: "/month",
    desc: "Perfect for small schools getting started",
    color: "border-white/10",
    highlight: false,
    features: ["Up to 200 students", "5 teachers", "Attendance & Fees", "Notice board", "Basic reports", "Email support"],
  },
  {
    name: "Growth",
    price: "₹7,999",
    period: "/month",
    desc: "For growing schools with full ERP needs",
    color: "border-violet-500/50",
    highlight: true,
    features: ["Up to 1,000 students", "25 teachers", "Full ERP suite", "AI Assistant", "QR ID cards", "Parent app", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large schools and school chains",
    color: "border-white/10",
    highlight: false,
    features: ["Unlimited students", "Unlimited teachers", "Multi-campus", "Custom integrations", "White-label option", "Dedicated manager"],
  },
];

export default function SchoolsPage() {
  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">
      <PublicNavbar />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-black to-black" />
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl" />
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/15 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-8">
            <School className="w-4 h-4" /> For School Administrators
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-none">
            <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">Transform Your</span>
            <br /><span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">School Operations</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            From WhatsApp groups and Excel sheets to a fully digital, AI-powered school management system — in one week.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/schools/register">
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/30 cursor-pointer text-base">
                Register Your School <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button whileHover={{ scale: 1.03 }} className="px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all cursor-pointer text-base">
                Book a Demo
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── PROBLEMS ─────────────────────────────────────── */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Sound Familiar?</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">The daily struggles every school faces without a proper system</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Manual Attendance", desc: "Registers, Excel sheets, and WhatsApp forwarding — error-prone and time-consuming", icon: Clock },
              { title: "Communication Chaos", desc: "WhatsApp groups with 200 parents, important notices getting lost in noise", icon: Bell },
              { title: "No Digital Identity", desc: "No school profile online, parents can't find you, no transparent ratings", icon: Shield },
              { title: "Fee Collection Mess", desc: "Tracking fee payments with cash receipts, no defaulter alerts, no digital records", icon: Banknote },
              { title: "Teacher Hiring Struggle", desc: "Posting on job boards, manual CV screening, no education-specific platform", icon: Users },
              { title: "Data Scattered Everywhere", desc: "Student records in files, exam results on paper, no single source of truth", icon: FileText },
            ].map((problem, i) => (
              <FadeIn key={problem.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }} className="p-6 bg-red-500/5 border border-red-500/15 rounded-2xl group">
                  <div className="flex items-start gap-3 mb-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <h3 className="text-white font-bold">{problem.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{problem.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTION COMPARISON ──────────────────────────── */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/10 to-black pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Before & After MySchool</h2>
            <p className="text-gray-400 text-xl">See the transformation</p>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn direction="left">
              <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl">
                <div className="text-red-400 font-bold text-lg mb-6 flex items-center gap-2"><XCircle className="w-5 h-5" /> Without MySchool</div>
                <div className="space-y-4">
                  {["Attendance on paper registers", "Fee receipts in receipt books", "Notices via WhatsApp groups", "Exams results on printed sheets", "Teacher records in Excel files", "No parent portal or app", "Zero digital school identity"].map(item => (
                    <div key={item} className="flex items-center gap-3 text-gray-500 text-sm">
                      <XCircle className="w-4 h-4 text-red-500/60 flex-shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.1}>
              <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-3xl">
                <div className="text-green-400 font-bold text-lg mb-6 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> With MySchool</div>
                <div className="space-y-4">
                  {["QR-based digital attendance", "Automated fee collection & receipts", "Instant push notifications to all parents", "Digital exam results & report cards", "Complete staff management portal", "Dedicated parent & student apps", "Public school profile with ratings"].map(item => (
                    <div key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD SHOWCASE ───────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Dashboards Built for Every Role</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Each stakeholder gets a purpose-built panel with the right information</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: "School Admin", color: "violet", items: ["Student & teacher management", "Fee collection & reports", "Attendance analytics", "AI assistant access", "Timetable & exams", "Payroll management"], icon: Building2 },
              { role: "Teacher", color: "blue", items: ["Class attendance marking", "Homework management", "Gradebook & exam entry", "Study materials upload", "Leave applications", "Parent communication"], icon: Users },
              { role: "Parent", color: "cyan", items: ["Child's attendance tracking", "Fee payment portal", "Result & report cards", "PTM booking", "School notices", "Homework tracking"], icon: Award },
            ].map((dash, i) => (
              <FadeIn key={dash.role} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} className={`p-7 bg-${dash.color}-500/5 border border-${dash.color}-500/20 rounded-3xl`}>
                  <div className={`w-12 h-12 bg-${dash.color}-500/20 rounded-xl flex items-center justify-center mb-4`}>
                    <dash.icon className={`w-6 h-6 text-${dash.color}-400`} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{dash.role} Panel</h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 mb-4" />
                  <div className="space-y-2.5">
                    {dash.items.map(item => (
                      <div key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                        <CheckCircle2 className={`w-3.5 h-3.5 text-${dash.color}-400 flex-shrink-0`} />{item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI FOR SCHOOLS ───────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-6"><Brain className="w-4 h-4" /> AI for School Admins</div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">Your School Data, Instantly Accessible</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">The AI assistant understands your school data. Ask about attendance, fees, exams, or staff — and get precise answers in seconds.</p>
              <div className="space-y-3">
                {[
                  "\"How many students are absent today?\"",
                  "\"Show me fee defaulters for March\"",
                  "\"Which class has lowest attendance this week?\"",
                  "\"Generate payroll summary for all teachers\"",
                ].map(q => (
                  <div key={q} className="flex items-center gap-3 p-3 bg-violet-500/5 border border-violet-500/15 rounded-xl text-violet-300 text-sm font-medium">
                    <Brain className="w-4 h-4 text-violet-400 flex-shrink-0" />{q}
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BarChart3, title: "Attendance Analytics", desc: "Real-time class-wise reports" },
                  { icon: Banknote, title: "Fee Insights", desc: "Collections and defaulters" },
                  { icon: Users, title: "Teacher Data", desc: "Performance and leaves" },
                  { icon: TrendingUp, title: "Exam Analytics", desc: "Results and grade trends" },
                  { icon: QrCode, title: "QR Attendance", desc: "Biometric-grade tracking" },
                  { icon: Bell, title: "Smart Alerts", desc: "Anomaly detection" },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.04 }}
                    className="p-4 bg-white/3 border border-white/10 rounded-xl">
                    <Icon className="w-5 h-5 text-violet-400 mb-2" />
                    <div className="text-white font-semibold text-sm">{title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────── */}
      <section id="pricing" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-4"><Star className="w-4 h-4" /> Simple Pricing</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Plans That Scale With You</h2>
            <p className="text-gray-400 text-xl">Start free. No credit card required. Upgrade anytime.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`relative p-8 border rounded-3xl h-full flex flex-col ${plan.highlight ? "bg-gradient-to-b from-violet-600/20 to-violet-600/5 border-violet-500/50 shadow-2xl shadow-violet-500/20" : "bg-white/3 border-white/10"}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold rounded-full">MOST POPULAR</div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1 mb-8">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-center gap-2.5 text-gray-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/schools/register"}>
                    <motion.button whileHover={{ scale: 1.03 }} className={`w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${plan.highlight ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-lg hover:shadow-violet-500/30" : "bg-white/5 border border-white/15 text-white hover:bg-white/10"}`}>
                      {plan.name === "Enterprise" ? "Contact Sales" : "Get Started Free"}
                    </motion.button>
                  </Link>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black to-violet-900/30 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Ready to Go Digital?</h2>
            <p className="text-gray-300 text-xl mb-10">Join 10,000+ schools that have already transformed their operations</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/schools/register">
                <motion.button whileHover={{ scale: 1.05, y: -2 }} className="group flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl shadow-2xl cursor-pointer">
                  Register School Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button whileHover={{ scale: 1.03 }} className="px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl cursor-pointer">
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
