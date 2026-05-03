import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { MapPin, Clock, Search, X, ChevronLeft, ChevronRight, Loader2, BookOpen, Star, Zap, Users, Award, CheckCircle, Phone, ArrowUpRight, Sparkles, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTutors, useBookTutor } from "@/hooks/useData";

const PER_PAGE = 6;

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "from-blue-500 to-indigo-600",
  Science:     "from-emerald-500 to-teal-600",
  English:     "from-rose-500 to-pink-600",
  Physics:     "from-purple-500 to-violet-600",
  Chemistry:   "from-orange-500 to-amber-600",
  History:     "from-amber-500 to-yellow-600",
  Default:     "from-primary to-secondary",
};

function subjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS.Default;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function TutorsPage() {
  const { data: tutors = [], isLoading } = useTutors();
  const bookTutor = useBookTutor();
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  const subjects = [...new Set(tutors.map((t) => t.subject))];

  const filtered = useMemo(() => tutors.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || t.subject === subjectFilter;
    return matchSearch && matchSubject;
  }), [tutors, search, subjectFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleBook = async (tutorId: string) => {
    if (!bookingName || !bookingEmail) { toast.error("Please fill in your name and email."); return; }
    try {
      await bookTutor.mutateAsync({ tutor_id: tutorId, name: bookingName, email: bookingEmail, message: bookingMessage });
      toast.success("Booking request sent! The tutor will contact you soon.");
      setBookingName(""); setBookingEmail(""); setBookingMessage("");
    } catch { toast.error("Failed to send booking. Please try again."); }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 mesh-gradient">
        <div className="absolute top-32 left-[15%] w-80 h-80 bg-secondary/8 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 right-[20%] w-64 h-64 bg-primary/6 rounded-full blur-[80px] animate-blob" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/8 px-5 py-2 text-sm font-bold text-secondary mb-6">
            <GraduationCap className="h-4 w-4" /> Expert Tutors & Coaches
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl xl:text-7xl font-extrabold mb-5 tracking-tight">
            Find Your <span className="text-gradient">Perfect Tutor</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto font-medium">
            Connect with verified, experienced tutors for personalized home or online learning
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/15 to-primary/15 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
              <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search by name, subject, or location..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-14 h-14 bg-transparent border-0 shadow-none focus-visible:ring-0 text-base" />
              {search && <button onClick={() => setSearch("")} className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors p-1"><X className="h-4 w-4" /></button>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="container mx-auto px-4 -mt-4 mb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-2xl overflow-hidden border border-border/30 bg-card/60 backdrop-blur-sm shadow-lg">
          {[
            { icon: GraduationCap, value: "500+", label: "Expert Tutors" },
            { icon: Users,         value: "10K+", label: "Students Taught" },
            { icon: Star,          value: "4.9★", label: "Avg Rating" },
            { icon: Award,         value: "95%",  label: "Success Rate" },
          ].map((s, i) => (
            <div key={s.label} className={`py-5 px-6 text-center ${i < 3 ? "border-r border-border/20" : ""} ${i < 2 ? "border-b border-border/20 md:border-b-0" : ""}`}>
              <s.icon className="h-5 w-5 mx-auto mb-2 text-primary opacity-70" />
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* Subject Filter */}
        <Reveal>
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="text-sm font-bold text-muted-foreground">Filter by subject:</span>
            <button onClick={() => { setSubjectFilter("all"); setPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${subjectFilter === "all" ? "gradient-primary text-white shadow-md shadow-primary/30" : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
              All Subjects
            </button>
            {subjects.map((s) => (
              <button key={s} onClick={() => { setSubjectFilter(s); setPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${subjectFilter === s ? "gradient-primary text-white shadow-md shadow-primary/30" : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                {s}
              </button>
            ))}
          </div>
        </Reveal>

        {isLoading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <div className="h-16 w-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <p className="text-muted-foreground font-medium">Finding tutors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((tutor, i) => (
              <Reveal key={tutor.id} delay={i * 0.07}>
                <motion.div whileHover={{ y: -8 }} className="group h-full bg-card rounded-2xl border border-border/40 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-400 overflow-hidden flex flex-col">
                  {/* Subject color strip */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${subjectColor(tutor.subject)}`} />
                  <div className="p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative shrink-0">
                        <Avatar className="h-16 w-16 ring-2 ring-border/40 group-hover:ring-primary/30 transition-all shadow-md">
                          <AvatarImage src={(tutor as any).avatar} alt={tutor.name} />
                          <AvatarFallback className={`bg-gradient-to-br ${subjectColor(tutor.subject)} text-white font-extrabold text-lg`}>
                            {tutor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {(tutor as any).verified && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center shadow-md">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-foreground text-base leading-tight group-hover:text-primary transition-colors">{tutor.name}</h3>
                        <div className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r ${subjectColor(tutor.subject)} bg-clip-text`}>
                          <BookOpen className="h-3 w-3 text-primary" />
                          <span className="text-xs font-bold text-primary">{tutor.subject}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < Math.round(Number(tutor.rating)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                          ))}
                          <span className="text-xs font-bold text-foreground ml-1">{Number(tutor.rating).toFixed(1)}</span>
                          <span className="text-[11px] text-muted-foreground">({(tutor as any).reviewCount || Math.floor(Math.random() * 50 + 10)})</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">{tutor.bio}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-full font-medium border border-border/30">
                        <MapPin className="h-3 w-3 text-primary" />{tutor.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-full font-medium border border-border/30">
                        <Clock className="h-3 w-3 text-secondary" />{tutor.experience} yrs exp
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-full font-medium border border-border/30">
                        <Zap className="h-3 w-3 text-amber-500" />Online & Home
                      </span>
                    </div>

                    {/* Price + Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/20">
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Hourly Rate</p>
                        <p className="text-xl font-extrabold text-foreground">₹{tutor.hourlyRate}<span className="text-sm font-medium text-muted-foreground">/hr</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/tutor/${tutor.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl border-border/50 font-bold hover:border-primary/40 hover:text-primary text-xs h-9 px-3">
                            Profile
                          </Button>
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="rounded-xl gradient-primary border-0 font-bold shadow-md shadow-primary/20 text-xs h-9 px-4">
                              Book Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md rounded-3xl border-border/50">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-extrabold">Book {tutor.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-2">
                              <div>
                                <Label className="text-sm font-semibold mb-1.5 block">Your Name *</Label>
                                <Input placeholder="Full name" value={bookingName} onChange={(e) => setBookingName(e.target.value)} className="rounded-xl h-12" />
                              </div>
                              <div>
                                <Label className="text-sm font-semibold mb-1.5 block">Email Address *</Label>
                                <Input type="email" placeholder="you@example.com" value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} className="rounded-xl h-12" />
                              </div>
                              <div>
                                <Label className="text-sm font-semibold mb-1.5 block">Message (optional)</Label>
                                <Textarea placeholder="Tell the tutor about your requirements..." value={bookingMessage} onChange={(e) => setBookingMessage(e.target.value)} className="rounded-xl resize-none h-24" />
                              </div>
                              <Button onClick={() => handleBook(tutor.id)} disabled={bookTutor.isPending}
                                className="w-full gradient-primary border-0 font-extrabold h-12 rounded-xl shadow-lg shadow-primary/20 text-base">
                                {bookTutor.isPending ? "Sending..." : "Send Booking Request"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-24">
            <div className="h-20 w-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="font-bold text-foreground mb-2">No tutors found</p>
            <p className="text-muted-foreground text-sm">Try a different search term or subject</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-xl border-border/40 h-11 w-11"><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}
                className={`w-11 h-11 rounded-xl ${page === i + 1 ? "gradient-primary border-0 shadow-lg shadow-primary/30" : "border-border/40"}`}>
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border-border/40 h-11 w-11"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
