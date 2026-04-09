import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Crown, Zap, Rocket, Star, Shield, QrCode, FileText, Calendar, Users, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { initiatePayment } from "@/hooks/useRazorpay";

const plans = [
  {
    name: "Starter",
    price: "₹1,999",
    period: "/year",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    badge: null,
    features: [
      { text: "Basic Profile (5 Photos)", included: true },
      { text: "1 Admission Form (QR Based) — ₹999/yr", included: true },
      { text: "Monthly Response Tracking", included: true },
      { text: "Digital QR Only", included: true },
      { text: "Standard Template", included: true },
      { text: "Limited Class Info", included: true },
      { text: "Job Posting / Teacher Hiring", included: false },
      { text: "Event Posting", included: false },
      { text: "Priority Lead Alerts", included: false },
    ],
  },
  {
    name: "Growth",
    price: "₹2,999",
    period: "/year",
    icon: Rocket,
    color: "from-violet-500 to-purple-500",
    badge: "Most Popular",
    features: [
      { text: "Profile with up to 15 Photos", included: true },
      { text: "2 Admission Forms (1 Customisable) — ₹1,999/yr", included: true },
      { text: "Day-wise Admission Tracking + Excel Export", included: true },
      { text: "1 Laminated Physical QR", included: true },
      { text: "Limited Customization (Question Change)", included: true },
      { text: "Class-wise Details Mentioned", included: true },
      { text: "Job Posting / Teacher Hiring", included: true },
      { text: "Event Posting (Public / Private)", included: true },
      { text: "Priority Lead Alerts", included: false },
    ],
  },
  {
    name: "Elite",
    price: "₹3,500",
    period: "/year",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    badge: "Best Value",
    features: [
      { text: "Featured Profile (Top of Search)", included: true },
      { text: "3 Admission Forms (2 Customisable) — ₹2,999/yr", included: true },
      { text: "Priority Lead Alerts + Day-wise + Excel Export", included: true },
      { text: "1 Physical QR + School Profile QR", included: true },
      { text: "High Customization (Custom Fields)", included: true },
      { text: "Class-wise Fee Structure + Easy Parent View", included: true },
      { text: "Job Posting / Teacher Hiring", included: true },
      { text: "Event Posting + Promotion Support", included: true },
      { text: "Priority Lead Alerts", included: true },
    ],
  },
];

const erpModules = [
  { name: "Attendance Module", price: "₹2,999/year", desc: "Teacher, Staff & Student daily tracking", icon: Users },
  { name: "Fee Management", price: "₹4,999/year", desc: "Wallet, Auto-pay, Salary & Fee management", icon: FileText },
  { name: "Homework & Notes", price: "₹4,999/year", desc: "Document sharing & teacher-parent communication", icon: BookOpen },
  { name: "Notification Pack", price: "Free (In-App)", desc: "WhatsApp/SMS chargeable separately", icon: Calendar },
];

const erpPlans = [
  { name: "Basic ERP", price: "₹11,999", desc: "With Starter market plan (without ID Card, Report Card)", icon: Zap },
  { name: "Elite ERP", price: "₹14,999", desc: "With Growth market plan + ID Card generation", icon: Rocket },
  { name: "Super ERP", price: "₹19,999", desc: "With Elite market plan + ID Card + Report Card", icon: Crown },
];

const tuitionPlans = [
  {
    name: "Basic",
    price: "₹499",
    gst: "+ GST",
    features: [
      { text: "Search Results / Verified Listing", included: true },
      { text: "0 Batches", included: true },
      { text: "General Enquiries Only", included: true },
      { text: "Manual Payment Tracking", included: true },
      { text: "Study Material Upload", included: false },
      { text: "Job Posting (Teacher Hiring)", included: false },
      { text: "Demo Class Events", included: false },
    ],
  },
  {
    name: "Pro",
    price: "₹999",
    gst: "+ GST + ₹99/month",
    features: [
      { text: "Priority Listing + Verified Tag", included: true },
      { text: "1 Batch Free, 5 Batches ₹1,999/yr", included: true },
      { text: "General + Home Tuition Lead Alerts", included: true },
      { text: "Auto Monthly Fee Alerts (WhatsApp chargeable)", included: true },
      { text: "Upload Notes / Homework", included: true },
      { text: "Job Posting (Teacher Hiring)", included: true },
      { text: "Demo Class Promotions", included: true },
    ],
  },
];

export default function PlansPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (planName: string, priceStr: string) => {
    const amount = parseInt(priceStr.replace(/[^0-9]/g, ""));
    if (!amount) return;
    setLoading(planName);
    await initiatePayment(planName, amount);
    setLoading(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-blob" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Crown className="h-3.5 w-3.5" /> Pricing Plans
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold mb-5">
            Choose Your <span className="text-gradient">Plan</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            List your school, manage admissions, and grow your institution with our flexible pricing plans.
          </motion.p>
        </div>
      </section>

      {/* School Listing Plans */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3">School Listing Plans</h2>
        <p className="text-center text-muted-foreground mb-12">The "Marketplace" entry for your school</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="relative">
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg shadow-primary/30 px-4 py-1">{plan.badge}</Badge>
                </div>
              )}
              <Card className={`h-full bg-card/80 backdrop-blur-sm border-border/40 hover:border-primary/30 transition-all duration-300 ${plan.badge ? "ring-2 ring-primary/20 shadow-xl" : ""}`}>
                <CardHeader className="text-center pb-4 pt-8">
                  <div className={`mx-auto mb-4 p-3 rounded-2xl bg-gradient-to-br ${plan.color} shadow-lg w-fit`}>
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm">
                      {f.included ? (
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                      )}
                      <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>{f.text}</span>
                    </div>
                  ))}
                  <Button onClick={() => handleBuy(plan.name, plan.price)} disabled={loading === plan.name} className="w-full mt-6 rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 h-11">
                    {loading === plan.name ? "Processing..." : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Free listing note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-2xl mx-auto mt-12 p-6 rounded-2xl bg-accent/30 border border-border/40 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h4 className="font-bold">Free Basic Listing</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Principals can upload their school with basic details for free. For premium features, verification, and enhanced visibility — choose a plan above.
          </p>
        </motion.div>
      </section>

      {/* ERP Plans */}
      <section className="bg-accent/20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3">School Management ERP</h2>
          <p className="text-center text-muted-foreground mb-12">Full ERP bundles for complete school management</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {erpPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                <Card className="h-full bg-card/80 border-border/40 hover:border-primary/20 transition-all text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto mb-4 p-3 rounded-2xl gradient-primary w-fit shadow-lg shadow-primary/20">
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                    <p className="text-3xl font-extrabold text-gradient mb-2">{plan.price}</p>
                    <p className="text-xs text-muted-foreground">{plan.desc}</p>
                    <Badge variant="outline" className="mt-4 text-xs">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Individual Modules */}
          <h3 className="text-xl font-bold text-center mb-8">Or Pick Individual Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {erpModules.map((mod, i) => (
              <motion.div key={mod.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                <Card className="h-full bg-card/60 border-border/30 hover:border-primary/20 transition-all">
                  <CardContent className="pt-6">
                    <div className="mb-3 p-2.5 rounded-xl bg-primary/10 w-fit">
                      <mod.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">{mod.name}</h4>
                    <p className="text-primary font-bold text-sm mb-1">{mod.price}</p>
                    <p className="text-xs text-muted-foreground">{mod.desc}</p>
                    <Badge variant="outline" className="mt-3 text-xs">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuition Center Plans */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3">Tuition Center Plans</h2>
        <p className="text-center text-muted-foreground mb-12">Scheduling, batch management & more for coaching centers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tuitionPlans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
              <Card className={`h-full bg-card/80 border-border/40 hover:border-primary/20 transition-all ${i === 1 ? "ring-2 ring-primary/20" : ""}`}>
                <CardHeader className="text-center pb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div>
                    <span className="text-3xl font-extrabold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{plan.gst}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm">
                      {f.included ? <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /> : <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />}
                      <span className={f.included ? "" : "text-muted-foreground/50"}>{f.text}</span>
                    </div>
                  ))}
                  <Button className="w-full mt-6 rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 h-11">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center p-10 rounded-3xl gradient-primary shadow-2xl shadow-primary/20">
          <Star className="h-10 w-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Ready to grow your school?</h2>
          <p className="text-white/80 mb-6">Join hundreds of schools already using our platform</p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-xl shadow-lg font-bold px-8">
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
