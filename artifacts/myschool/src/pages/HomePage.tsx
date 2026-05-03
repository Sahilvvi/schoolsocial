import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  School, BookOpen, CalendarDays, Briefcase, Star, MapPin, ArrowRight,
  ChevronLeft, ChevronRight, Users, Award, GraduationCap, Sparkles,
  CheckCircle, Search, TrendingUp, Shield, BarChart3, Clock, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSchools, useEvents, useTutors, useNews } from "@/hooks/useData";

// Hero student image import
import heroImg from "@assets/IMG-20250815-WA0136-removebg-preview_1777784049851.png";

/* ── Animated counter ─────────────────────────────────────── */
function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (2000 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{count.toLocaleString("en-IN")}{suffix}</span>;
}

/* ── FadeIn wrapper ───────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Testimonials ─────────────────────────────────────────── */
const testimonials = [
  { name: "Priya Sharma", role: "Parent of 2", text: "MySchool made finding the right school for my kids so easy. The reviews from other parents were incredibly helpful.", avatar: "PS", rating: 5 },
  { name: "Rahul Verma", role: "Parent", text: "I compared 15 schools in one afternoon. The filter system is brilliant. Saved us weeks of research.", avatar: "RV", rating: 5 },
  { name: "Anjali Patel", role: "Parent of 3", text: "The online admission process was seamless. Applied to 3 schools and got confirmation within days.", avatar: "AP", rating: 5 },
];

export default function HomePage() {
  const { data: schools = [] } = useSchools();
  const { data: tutors = [] } = useTutors();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schools?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/schools');
    }
  };

  const topSchools = schools.slice(0, 6);
  const topTutors = tutors.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0"> {/* Padding bottom for mobile nav */}
      {/* ═══ HERO SECTION ═══════════════════════════════ */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 min-h-[85vh] flex items-center bg-card">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-6">
                <Sparkles className="h-4 w-4" /> India's #1 Education Marketplace
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
                Find the Perfect <br className="hidden sm:block" />
                <span className="text-gradient">School</span> for your child.
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Discover, compare, and apply to top-rated schools, tutors, and events across India. Trusted by over 1 million parents.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-xl mx-auto lg:mx-0 bg-background rounded-2xl shadow-xl shadow-black/5 border border-border/60 p-2 flex items-center gap-2 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                <div className="pl-4 text-muted-foreground flex-shrink-0">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search schools by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 h-12 text-base focus:outline-none focus:ring-0 px-2 min-w-0"
                />
                <Button type="submit" size="lg" className="rounded-xl gradient-primary font-bold px-8 h-12 shrink-0 shadow-md">
                  Search
                </Button>
              </form>

              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Verified Reviews</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Easy Apply</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> 500+ Schools</span>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative w-full max-w-[500px] mx-auto aspect-square">
                <div className="absolute inset-0 rounded-full gradient-primary opacity-20 blur-3xl" />
                <div className="absolute inset-4 rounded-[3rem] bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/20 shadow-2xl backdrop-blur-sm overflow-hidden flex items-end justify-center">
                  {/* Student Image overlaying the container */}
                  <img 
                    src={heroImg} 
                    alt="Happy Student" 
                    className="w-[90%] h-auto object-contain object-bottom translate-y-4 drop-shadow-2xl"
                  />
                </div>

                {/* Floating Badges */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -left-6 bg-background rounded-2xl p-4 shadow-xl border border-border/50 flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="font-extrabold text-lg text-foreground">4.8/5</p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average Rating</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [10, -10, 10] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-20 -right-8 bg-background rounded-2xl p-4 shadow-xl border border-border/50 flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-extrabold text-lg text-foreground">10k+</p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admissions</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ════════════════════════════════════════════════ */}
      <section className="relative z-20 -mt-10 mb-16 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-border/50 bg-border/50 shadow-2xl shadow-black/5">
            {[
              { icon: GraduationCap, value: 500, suffix: "+", label: "Schools Listed" },
              { icon: Users, value: 1000000, suffix: "+", label: "Parents Trust Us" },
              { icon: Award, value: 98, suffix: "%", label: "Satisfaction" },
              { icon: TrendingUp, value: 25, suffix: "+", label: "Cities Covered" },
            ].map((stat, i) => (
              <div key={stat.label} className="bg-background p-6 md:p-8 text-center group hover:bg-primary/5 transition-colors duration-300">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TOP SCHOOLS ══════════════════════════════════════════ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
              <div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                  Featured
                </Badge>
                <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Top Rated <span className="text-gradient">Schools</span></h2>
                <p className="text-lg text-muted-foreground mt-3 max-w-2xl">Discover the most highly recommended schools by parents in your city.</p>
              </div>
              <Link to="/schools">
                <Button variant="outline" className="rounded-xl font-bold h-12 px-6 shadow-sm group">
                  View All Schools <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topSchools.map((school: any, i: number) => (
              <FadeIn key={school.id} delay={i * 0.1}>
                <Link to={`/school/${school.slug}`} className="block group">
                  <Card className="marketplace-card h-full flex flex-col bg-card hover:-translate-y-1">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={school.banner} alt={school.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-4 left-4 gradient-primary text-white border-0 shadow-md font-bold px-3 py-1">
                        {school.board}
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div className="flex items-center gap-1.5 bg-background/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-lg border border-border/50">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="text-sm font-extrabold text-foreground">{Number(school.rating).toFixed(1)}</span>
                        </div>
                        {school.is_verified && (
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30" title="Verified">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="font-extrabold text-xl text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">{school.name}</h3>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{school.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/60">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">Annual Fees</span>
                          <span className="font-bold text-foreground">{school.fees}</span>
                        </div>
                        <Button size="sm" className="rounded-lg gradient-primary font-bold shadow-md">
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════════════ */}
      <section className="py-24 bg-card border-y border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary))_0%,transparent_100%)] opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">How <span className="text-gradient">MySchool</span> Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to secure your child's future at the best school.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />
            
            {[
              { step: "01", title: "Discover & Compare", desc: "Search schools by location, fees, and board. Compare them side-by-side.", icon: Search },
              { step: "02", title: "Read Verified Reviews", desc: "Make informed decisions based on authentic feedback from other parents.", icon: Star },
              { step: "03", title: "Apply Seamlessly", desc: "Submit admission forms to multiple schools with a single click.", icon: CheckCircle },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15} className="relative">
                <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-xl shadow-black/5 text-center h-full relative z-10 group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 relative">
                    <item.icon className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full gradient-primary text-white font-extrabold text-sm flex items-center justify-center border-[3px] border-background shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ════════════════════════════════════════ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">Loved by <span className="text-gradient">Parents</span></h2>
            <p className="text-lg text-muted-foreground">Don't just take our word for it.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="bg-card border-border/50 shadow-lg p-8 h-full rounded-3xl">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground font-medium italic mb-8 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4 mt-auto border-t border-border/50 pt-6">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{t.name}</h4>
                      <p className="text-sm text-muted-foreground font-medium">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="rounded-[3rem] gradient-primary p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center" />
            <div className="relative z-10 max-w-3xl mx-auto text-white">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Ready to find the best school?</h2>
              <p className="text-xl md:text-2xl font-medium text-white/80 mb-10">Join MySchool today and simplify your school admission process.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/schools">
                  <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-primary hover:bg-gray-50 font-extrabold text-lg shadow-xl shadow-black/10">
                    Explore Schools
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 font-extrabold text-lg">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}