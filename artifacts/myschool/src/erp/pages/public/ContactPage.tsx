import { useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import PublicNavbar from "@/erp/components/PublicNavbar";
import PublicFooter from "@/erp/components/PublicFooter";
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageSquare, School, CheckCircle2, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useToast } from "@/erp/hooks/use-toast";

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

const FAQS = [
  { q: "How quickly can my school get started?", a: "Registration takes under 5 minutes. We provide a guided onboarding wizard that helps you set up your school profile, add students, teachers, and classes — you can be fully operational within one day." },
  { q: "Is there a free trial?", a: "Yes! All new schools get a 30-day free trial with full access to all features. No credit card required. You only pay when you're ready to continue." },
  { q: "Can parents access the platform on mobile?", a: "Absolutely. MySchool is fully mobile-responsive and works perfectly on all smartphones. Parents can view attendance, fees, results, and communicate with teachers from their phone." },
  { q: "Is student data secure?", a: "Security is our top priority. All data is encrypted at rest and in transit. We are fully DPDP (India's data protection) compliant and store data on servers within India." },
  { q: "Do you offer training for teachers and staff?", a: "Yes! Every school gets a free onboarding session, video tutorials, and 24/7 support documentation. We also offer paid on-site training for large schools." },
  { q: "What happens after my trial ends?", a: "Your data is safely preserved. You can upgrade to a paid plan at any time to continue. If you choose not to upgrade, you can export all your data in standard formats." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
      >
        <span className="text-white font-medium pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-4">{a}</div>
      </motion.div>
    </motion.div>
  );
}

export default function ContactPage() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", school: "", message: "" });
  const [demoForm, setDemoForm] = useState({ name: "", email: "", school: "", phone: "", students: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    setContactForm({ name: "", email: "", school: "", message: "" });
  };

  const handleDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setDemoSubmitting(false);
    toast({ title: "Demo requested!", description: "Our team will contact you within 4 hours to schedule your demo." });
    setDemoForm({ name: "", email: "", school: "", phone: "", students: "", message: "" });
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all";

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">
      <PublicNavbar />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-black to-black" />
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-8">
            <MessageSquare className="w-4 h-4" /> Get in Touch
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            We'd Love to<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Hear From You</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-gray-400 text-xl">
            Have questions? Need a demo? Just want to say hi? We respond within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* ─── CONTACT INFO ─────────────────────────────────── */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Mail, title: "Email Us", info: "hello@myschool.in", sub: "We respond within 24 hours", color: "violet" },
              { icon: Phone, title: "Call Us", info: "+91 0000000000", sub: "Mon–Sat, 9 AM–7 PM IST", color: "blue" },
              { icon: MapPin, title: "Visit Us", info: "New Delhi, India", sub: "Connaught Place, 110001", color: "cyan" },
            ].map(({ icon: Icon, title, info, sub, color }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} className={`p-6 bg-${color}-500/5 border border-${color}-500/20 rounded-2xl`}>
                  <div className={`w-11 h-11 bg-${color}-500/20 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                  </div>
                  <h3 className="text-white font-bold mb-1">{title}</h3>
                  <p className={`text-${color}-300 font-medium text-sm mb-1`}>{info}</p>
                  <p className="text-gray-500 text-xs">{sub}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FORMS ────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* General Contact Form */}
            <FadeIn direction="left">
              <div className="p-8 bg-white/3 border border-white/10 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center"><MessageSquare className="w-5 h-5 text-violet-400" /></div>
                  <div><h2 className="text-white font-bold text-xl">Send a Message</h2><p className="text-gray-500 text-sm">For general questions and inquiries</p></div>
                </div>
                <form onSubmit={handleContact} className="space-y-4">
                  <input required value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Your Name *" />
                  <input required type="email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} className={inputClass} placeholder="Email Address *" />
                  <input value={contactForm.school} onChange={e => setContactForm(p => ({ ...p, school: e.target.value }))} className={inputClass} placeholder="School Name (if applicable)" />
                  <textarea required rows={5} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} className={inputClass + " resize-none"} placeholder="Your Message *" />
                  <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl disabled:opacity-60 transition-all cursor-pointer">
                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                  </motion.button>
                </form>
              </div>
            </FadeIn>

            {/* Demo Request Form */}
            <FadeIn direction="right" delay={0.1}>
              <div className="p-8 bg-gradient-to-b from-violet-600/10 to-blue-600/5 border border-violet-500/30 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center"><School className="w-5 h-5 text-blue-400" /></div>
                  <div><h2 className="text-white font-bold text-xl">Request a Demo</h2><p className="text-gray-500 text-sm">See MySchool in action for your school</p></div>
                </div>
                <form onSubmit={handleDemo} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input required value={demoForm.name} onChange={e => setDemoForm(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Your Name *" />
                    <input required type="email" value={demoForm.email} onChange={e => setDemoForm(p => ({ ...p, email: e.target.value }))} className={inputClass} placeholder="Email *" />
                  </div>
                  <input required value={demoForm.school} onChange={e => setDemoForm(p => ({ ...p, school: e.target.value }))} className={inputClass} placeholder="School Name *" />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={demoForm.phone} onChange={e => setDemoForm(p => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder="Phone Number" />
                    <select value={demoForm.students} onChange={e => setDemoForm(p => ({ ...p, students: e.target.value }))} className={inputClass + " cursor-pointer"}>
                      <option value="" className="bg-gray-900">No. of Students</option>
                      {["Under 200", "200–500", "500–1,000", "1,000–3,000", "3,000+"].map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
                    </select>
                  </div>
                  <textarea rows={4} value={demoForm.message} onChange={e => setDemoForm(p => ({ ...p, message: e.target.value }))} className={inputClass + " resize-none"} placeholder="Tell us about your school and what you're looking for..." />
                  <motion.button type="submit" disabled={demoSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-bold rounded-xl disabled:opacity-60 transition-all cursor-pointer">
                    {demoSubmitting ? <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" /> : <>Request Live Demo <ArrowRight className="w-4 h-4" /></>}
                  </motion.button>
                  <p className="text-center text-gray-600 text-xs">Our team will contact you within 4 hours to schedule your demo</p>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SUPPORT INFO ─────────────────────────────────── */}
      <section className="py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Multiple Ways to Get Help</h2>
            <p className="text-gray-500">Fast support across all channels</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Mail, title: "Email Support", info: "hello@myschool.in", resp: "< 24 hours" },
              { icon: MessageSquare, title: "Live Chat", info: "Via dashboard", resp: "< 2 minutes" },
              { icon: Phone, title: "Phone Support", info: "+91 0000000000", resp: "Mon–Sat 9–7 PM" },
              { icon: Clock, title: "Help Center", info: "docs.myschool.in", resp: "Always available" },
            ].map(({ icon: Icon, title, info, resp }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }} className="p-5 bg-white/3 border border-white/10 rounded-2xl text-center">
                  <Icon className="w-6 h-6 text-violet-400 mx-auto mb-3" />
                  <div className="text-white font-semibold text-sm mb-1">{title}</div>
                  <div className="text-gray-400 text-xs mb-2">{info}</div>
                  <div className="px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full inline-block">{resp}</div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know about MySchool</p>
          </FadeIn>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 0.06}>
                <FAQItem q={faq.q} a={faq.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-black to-violet-900/20 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Ready to Join MySchool?</h2>
            <p className="text-gray-300 text-xl mb-10">Start your free trial today — no credit card required</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/schools/register">
                <motion.button whileHover={{ scale: 1.05 }} className="group flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl shadow-2xl cursor-pointer">
                  Register Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/schools">
                <motion.button whileHover={{ scale: 1.03 }} className="px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl cursor-pointer">
                  Explore Schools
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
