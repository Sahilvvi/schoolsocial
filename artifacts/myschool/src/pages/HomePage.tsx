import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  School, BookOpen, CalendarDays, Briefcase, Star, MapPin, ArrowRight,
  ChevronLeft, ChevronRight, Users, Award, GraduationCap, Sparkles,
  Play, CheckCircle, Search, TrendingUp, Heart, Globe, Target,
  Clock, Zap, MessageSquare, Newspaper, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSchools, useEvents, useTutors, useNews } from "@/hooks/useData";

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

/* ── Hero Banner Slides ───────────────────────────────────── */
const bannerSlides = [
  { title: "Find the Perfect School", subtitle: "Discover, compare and apply to top-rated schools across India", cta: "/schools", ctaLabel: "Explore Schools", icon: School, gradient: "from-violet-600/20 via-blue-600/10 to-transparent", accent: "from-violet-500 to-blue-500" },
  { title: "Best Tuition Centers", subtitle: "Connect with verified tutors and coaching centers near you", cta: "/tutors", ctaLabel: "Find Tutors", icon: BookOpen, gradient: "from-emerald-600/20 via-teal-600/10 to-transparent", accent: "from-emerald-500 to-teal-500" },
  { title: "Exciting School Events", subtitle: "Workshops, competitions, and events happening across schools", cta: "/events", ctaLabel: "View Events", icon: CalendarDays, gradient: "from-orange-600/20 via-amber-600/10 to-transparent", accent: "from-orange-500 to-amber-500" },
  { title: "Skill Development Workshops", subtitle: "Empower students with hands-on learning and career-ready skills", cta: "/events", ctaLabel: "Browse Workshops", icon: Zap, gradient: "from-pink-600/20 via-rose-600/10 to-transparent", accent: "from-pink-500 to-rose-500" },
];

/* ── Testimonials ─────────────────────────────────────────── */
const testimonials = [
  { name: "Priya Sharma", role: "Parent of 2", text: "MySchool made finding the right school for my kids so easy. The reviews from other parents were incredibly helpful.", avatar: "PS", rating: 5 },
  { name: "Rahul Verma", role: "Parent", text: "I compared 15 schools in one afternoon. The filter system is brilliant. Saved us weeks of research.", avatar: "RV", rating: 5 },
  { name: "Anjali Patel", role: "Parent of 3", text: "The online admission process was seamless. Applied to 3 schools and got confirmation within days.", avatar: "AP", rating: 5 },
  { name: "Deepak Gupta", role: "School Principal", text: "Our school visibility increased 10x after listing on MySchool. We get quality admission leads every day.", avatar: "DG", rating: 5 },
];

/* ── Haversine distance (km) ───────────────────────────────── */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Delhi-area mock coords for demo schools without real lat/lng */
const CITY_COORDS: Record<string, [number, number]> = {
  "new delhi": [28.6139, 77.209],
  delhi: [28.6139, 77.209],
  noida: [28.5355, 77.391],
  gurugram: [28.4595, 77.0266],
  gurgaon: [28.4595, 77.0266],
  mumbai: [19.076, 72.8777],
  bangalore: [12.9716, 77.5946],
  hyderabad: [17.385, 78.4867],
  pune: [18.5204, 73.8567],
  chennai: [13.0827, 80.2707],
};

function guessCoords(location: string | undefined): [number, number] | null {
  if (!location) return null;
  const loc = location.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (loc.includes(city)) return coords;
  }
  return null;
}

export default function HomePage() {
  const { data: schools = [] } = useSchools();
  const { data: events = [] } = useEvents();
  const { data: tutors = [] } = useTutors();
  const { data: news = [] } = useNews();
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ── Location-based filtering state ────────────────────── */
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationRadius, setLocationRadius] = useState(10); // km
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");

  const requestLocation = () => {
    if (!navigator.geolocation) { setLocationStatus("denied"); return; }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationEnabled(true);
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  /* Filter by distance when location is enabled */
  const nearbySchools = locationEnabled && userLocation
    ? schools.filter((s: any) => {
        const coords = guessCoords(s.location);
        if (!coords) return true; // include schools without coords
        return haversineKm(userLocation.lat, userLocation.lng, coords[0], coords[1]) <= locationRadius;
      })
    : schools;

  const nearbyTutors = locationEnabled && userLocation
    ? tutors.filter((t: any) => {
        const coords = guessCoords(t.location);
        if (!coords) return true;
        return haversineKm(userLocation.lat, userLocation.lng, coords[0], coords[1]) <= locationRadius;
      })
    : tutors;

  const nearbyEvents = locationEnabled && userLocation
    ? events.filter((e: any) => {
        const coords = guessCoords(e.location);
        if (!coords) return true;
        return haversineKm(userLocation.lat, userLocation.lng, coords[0], coords[1]) <= locationRadius;
      })
    : events;

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((i) => (i + 1) % bannerSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const topSchools = nearbySchools.slice(0, 6);
  const topTutors = nearbyTutors.slice(0, 6);
  const publicEvents = nearbyEvents.filter((e: any) => e.is_public !== false).slice(0, 6);
  const latestNews = news.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ═══ HERO BANNER CAROUSEL ═══════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 min-h-[70vh] flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_${bannerSlides[currentSlide].gradient.split(" ")[0].replace("from-", "hsl(217_91%_60%/")}0.12)_0%,_transparent_60%)]`}
            />
          </AnimatePresence>
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/8 rounded-full blur-[100px] animate-blob" />
          <div className="absolute top-40 right-[15%] w-96 h-96 bg-secondary/6 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute inset-0 bg-[linear-gradient(hsl(222_20%_16%/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(222_20%_16%/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Slide indicator pills */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {bannerSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-500 ${i === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm mb-6">
                <Sparkles className="h-3.5 w-3.5" /> India's #1 School Discovery Platform
              </motion.span>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.05] tracking-tight">
                <span className="text-gradient">{bannerSlides[currentSlide].title}</span>
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                {bannerSlides[currentSlide].subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link to={bannerSlides[currentSlide].cta}>
                  <Button size="lg" className="rounded-xl gradient-primary border-0 shadow-xl shadow-primary/25 font-bold h-14 px-8 text-base gap-2">
                    {bannerSlides[currentSlide].ctaLabel} <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/compare">
                  <Button size="lg" variant="outline" className="rounded-xl border-border/40 h-14 px-8 font-semibold gap-2">
                    <Search className="h-5 w-5" /> Compare Schools
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full border-border/30 h-10 w-10" onClick={() => setCurrentSlide((i) => (i - 1 + bannerSlides.length) % bannerSlides.length)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-border/30 h-10 w-10" onClick={() => setCurrentSlide((i) => (i + 1) % bannerSlides.length)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ STATS ════════════════════════════════════════════════ */}
      <section className="relative z-20 -mt-6 mb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-2xl overflow-hidden border border-border/40 bg-card/50 backdrop-blur-xl">
            {[
              { icon: GraduationCap, value: 500, suffix: "+", label: "Schools Listed" },
              { icon: Users, value: 1000000, suffix: "+", label: "Parents Trust Us" },
              { icon: Award, value: 98, suffix: "%", label: "Satisfaction" },
              { icon: TrendingUp, value: 25, suffix: "+", label: "Cities Covered" },
            ].map((stat, i) => (
              <div key={stat.label} className={`relative p-6 md:p-8 text-center group hover:bg-primary/5 transition-colors duration-300 ${i < 2 ? "border-r border-border/30" : ""} ${i === 2 ? "md:border-r md:border-border/30" : ""} ${i < 2 ? "border-b border-border/30 md:border-b-0" : ""}`}>
                <stat.icon className="h-5 w-5 mx-auto mb-3 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ LOCATION FILTER BAR ═══════════════════════════════ */}
      <section className="container mx-auto px-4 mb-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Location Filter</span>
            </div>
            {!locationEnabled ? (
              <Button onClick={requestLocation} variant="outline" size="sm"
                className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
                disabled={locationStatus === "loading"}>
                {locationStatus === "loading" ? (
                  <><span className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Detecting...</>
                ) : locationStatus === "denied" ? (
                  <><MapPin className="h-3.5 w-3.5" /> Location Denied — Show All</>
                ) : (
                  <><MapPin className="h-3.5 w-3.5" /> Enable Nearby Filter</>
                )}
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                  <CheckCircle className="h-3 w-3" /> Location Active
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Radius:</span>
                  {[5, 10, 25, 50].map((r) => (
                    <button key={r} onClick={() => setLocationRadius(r)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${locationRadius === r ? "gradient-primary text-primary-foreground shadow-md" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}>
                      {r}km
                    </button>
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setLocationEnabled(false); setLocationStatus("idle"); }}
                  className="text-xs text-muted-foreground hover:text-foreground h-7">
                  Clear
                </Button>
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* ═══ TOP SCHOOLS ══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-16">
        <FadeIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                <School className="h-3.5 w-3.5" /> Top Schools
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold">Discover Top <span className="text-gradient">Schools</span></h2>
              <p className="text-muted-foreground mt-2">Highest rated schools across India, trusted by parents</p>
            </div>
            <Link to="/schools">
              <Button variant="outline" className="rounded-xl border-border/40 font-semibold gap-2 hidden md:flex">
                View All Schools <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSchools.map((school: any, i: number) => (
            <FadeIn key={school.id} delay={i * 0.08}>
              <Link to={`/school/${school.slug}`}>
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="group">
                  <div className="bg-card rounded-2xl border border-border/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img src={school.banner} alt={school.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                      <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-md border-0 shadow-md text-xs font-semibold px-2.5 py-1">{school.board}</Badge>
                      {school.is_featured && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md gap-1 text-[10px] px-2 py-0.5">
                          <Crown className="h-3 w-3" /> Featured
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-md rounded-lg px-2.5 py-1.5 shadow-md border border-border/20">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-sm font-bold text-foreground">{Number(school.rating).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-foreground text-[15px] group-hover:text-primary transition-colors truncate">{school.name}</h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{school.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{school.description}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/schools"><Button className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 font-semibold gap-2">View All Schools <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* ═══ TUITION CENTERS ══════════════════════════════════════ */}
      <section className="py-16 bg-accent/20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary mb-4">
                  <BookOpen className="h-3.5 w-3.5" /> Tuition Centers
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold">Find Better <span className="text-gradient">Tuition</span></h2>
                <p className="text-muted-foreground mt-2">Connect with verified tutors and coaching centers near you</p>
              </div>
              <Link to="/tutors">
                <Button variant="outline" className="rounded-xl border-border/40 font-semibold gap-2 hidden md:flex">
                  View All Tutors <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTutors.map((tutor: any, i: number) => (
              <FadeIn key={tutor.id} delay={i * 0.08}>
                <Link to={`/tutor/${tutor.id}`}>
                  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="group">
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all duration-300 h-full">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground shadow-md">
                              {tutor.name?.[0] || "T"}
                            </div>
                            <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 bg-card rounded-full px-1.5 py-0.5 shadow-md border border-border/20">
                              <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                              <span className="text-[10px] font-bold">{Number(tutor.rating).toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">{tutor.name}</h3>
                            <Badge className="mt-1 rounded-lg gradient-primary text-primary-foreground border-0 text-xs">{tutor.subject}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{tutor.bio}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1.5 bg-accent/20 rounded-lg px-2.5 py-1.5 border border-border/20"><MapPin className="h-3 w-3 text-primary" />{tutor.location}</span>
                          <span className="flex items-center gap-1.5 bg-accent/20 rounded-lg px-2.5 py-1.5 border border-border/20"><Clock className="h-3 w-3 text-secondary" />{tutor.experience}</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/20">
                          <span className="font-bold text-gradient text-lg">{tutor.hourly_rate}</span>
                          <span className="text-xs text-primary font-semibold flex items-center gap-1">View Profile <ArrowRight className="h-3 w-3" /></span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/tutors"><Button className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 font-semibold gap-2">View All Tutors <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ═══ EVENTS & WORKSHOPS ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-16">
        <FadeIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-4">
                <CalendarDays className="h-3.5 w-3.5" /> Events & Workshops
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold">Upcoming <span className="text-gradient">Events</span></h2>
              <p className="text-muted-foreground mt-2">School events, workshops, and skill development programs</p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="rounded-xl border-border/40 font-semibold gap-2 hidden md:flex">
                View All Events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        {publicEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicEvents.map((event: any, i: number) => (
              <FadeIn key={event.id} delay={i * 0.08}>
                <Link to={`/event/${event.id}`}>
                  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="group">
                    <div className="h-full rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/20 transition-all duration-300 flex flex-col">
                      <div className="relative overflow-hidden aspect-video">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-card/60 backdrop-blur-sm text-foreground border-border/30 font-semibold text-xs">{event.school_name}</Badge>
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-center gap-1.5 bg-card/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-border/20 shadow-md">
                            <CalendarDays className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-semibold text-foreground">{event.event_date}</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="pt-4 pb-5 space-y-3 flex-1 flex flex-col">
                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary" />{event.location}</div>
                        <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2 flex-1">{event.description}</p>
                      </CardContent>
                    </div>
                  </motion.div>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No events available right now. Check back soon!</p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link to="/events"><Button className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 font-semibold gap-2">View All Events <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* ═══ BLOG / NEWS SECTION ══════════════════════════════════ */}
      <section className="py-16 bg-accent/20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                  <Newspaper className="h-3.5 w-3.5" /> Latest News
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold">Education <span className="text-gradient">Blog</span></h2>
                <p className="text-muted-foreground mt-2">Stay informed with the latest trends and stories in education</p>
              </div>
              <Link to="/news">
                <Button variant="outline" className="rounded-xl border-border/40 font-semibold gap-2 hidden md:flex">
                  Read More <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item: any, i: number) => (
                <FadeIn key={item.id} delay={i * 0.1}>
                  <Link to={`/news/${item.id}`}>
                    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="group">
                      <div className="h-full rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col">
                        <div className="relative overflow-hidden aspect-video">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                          <Badge className="absolute top-3 left-3 gradient-primary text-primary-foreground border-0 shadow-lg text-xs font-semibold">{item.category}</Badge>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-3">{item.title}</h3>
                          <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2 flex-1 mb-3">{item.excerpt}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border/20">
                            <span>{item.author}</span>
                            <span>{item.published_date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No blog posts available yet.</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/news"><Button className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 font-semibold gap-2">Read More <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS / TESTIMONIALS ═══════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <FadeIn className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
            <MessageSquare className="h-3.5 w-3.5" /> Reviews
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">What Parents <span className="text-gradient">Say</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">Real stories from real parents who found their perfect school through MySchool</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/30">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-md">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ VIDEO PROMOTION SECTION ══════════════════════════════ */}
      <section className="py-20 bg-accent/20">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              <Play className="h-3.5 w-3.5" /> Watch & Learn
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">See MySchool <span className="text-gradient">In Action</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Discover how we're transforming education discovery across India</p>
          </FadeIn>

          <FadeIn>
            <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm shadow-2xl">
              <div className="aspect-video relative group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80" alt="MySchool Platform" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent flex items-center justify-center">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                    <Play className="h-8 w-8 text-primary-foreground ml-1" />
                  </motion.div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">How MySchool Works</h3>
                  <p className="text-sm text-muted-foreground">Discover, compare and apply to the best schools — all in one place</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA ══════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl p-12 md:p-20">
            <div className="absolute inset-0 gradient-primary" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-6 leading-tight">Ready to Find the<br />Perfect School?</h2>
              <p className="text-primary-foreground/80 text-lg mb-10 leading-relaxed">Join thousands of parents who trust MySchool to make the best education choice for their children.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="rounded-xl bg-white text-primary hover:bg-white/90 shadow-xl font-semibold h-14 px-8 text-base">
                    Get Started Free <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/plans">
                  <Button size="lg" variant="outline" className="rounded-xl border-white/30 text-primary-foreground hover:bg-white/10 h-14 px-8">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
