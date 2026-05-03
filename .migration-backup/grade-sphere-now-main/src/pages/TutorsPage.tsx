import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Search, X, ChevronLeft, ChevronRight, Loader2, BookOpen, Star, Zap, Users, Award, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(174_62%_47%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-32 left-[20%] w-72 h-72 bg-secondary/6 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary mb-6">
            <BookOpen className="h-3.5 w-3.5" /> Expert Tutors
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold mb-5">
            Find Your <span className="text-gradient">Perfect Tutor</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Connect with verified, experienced tutors for personalized learning
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
              <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search by name, subject, or location..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-14 h-14 bg-transparent border-0 shadow-none focus-visible:ring-0" />
            </div>
            {search && <button onClick={() => setSearch("")} className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"><X className="h-3 w-3" />Clear</button>}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-2xl overflow-hidden border border-border/30 bg-card/40 backdrop-blur-sm">
          {[
            { icon: Users, value: `${tutors.length}+`, label: "Expert Tutors" },
            { icon: BookOpen, value: `${subjects.length}+`, label: "Subjects" },
            { icon: Star, value: "4.8", label: "Avg. Rating" },
            { icon: Award, value: "100%", label: "Verified" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
              className={`py-5 px-4 text-center ${i < 2 ? "border-r border-border/20" : ""} ${i === 2 ? "md:border-r md:border-border/20" : ""} ${i < 2 ? "border-b border-border/20 md:border-b-0" : ""}`}>
              <s.icon className="h-5 w-5 mx-auto mb-2 text-secondary opacity-60" />
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground">Browse Tutors</h2>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} tutors available</p>
          </div>
          <Select value={subjectFilter} onValueChange={(v) => { setSubjectFilter(v); setPage(1); }}>
            <SelectTrigger className="w-48 rounded-xl bg-card/60 border-border/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="flex flex-col items-center py-20 gap-3"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((tutor, i) => (
              <Link key={tutor.id} to={`/tutor/${tutor.id}`}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -6, transition: { duration: 0.3 } }} className="group">
                <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all duration-300 h-full">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-md">
                          <AvatarImage src={tutor.avatar} />
                          <AvatarFallback className="gradient-primary text-primary-foreground font-bold text-lg">{tutor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-0.5 gradient-primary rounded-full px-2 py-0.5 shadow-md">
                          <Star className="h-2.5 w-2.5 fill-primary-foreground text-primary-foreground" />
                          <span className="text-[10px] font-bold text-primary-foreground">{Number(tutor.rating)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{tutor.name}</h3>
                        <Badge className="mt-1.5 rounded-lg gradient-primary text-primary-foreground border-0 text-xs">{tutor.subject}</Badge>
                        <div className="flex items-center gap-1 mt-1.5">
                          <CheckCircle className="h-3 w-3 text-secondary" />
                          <span className="text-[11px] text-secondary font-medium">Verified Tutor</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{tutor.bio}</p>
                    <div className="flex items-center gap-2 mb-5 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1.5 bg-accent/20 rounded-lg px-2.5 py-1.5 border border-border/20"><MapPin className="h-3 w-3 text-primary" />{tutor.location}</span>
                      <span className="flex items-center gap-1.5 bg-accent/20 rounded-lg px-2.5 py-1.5 border border-border/20"><Clock className="h-3 w-3 text-secondary" />{tutor.experience}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/20">
                      <span className="font-bold text-gradient text-xl">{tutor.hourly_rate}</span>
                      <Dialog>
                        <DialogTrigger asChild><Button size="sm" className="rounded-xl shadow-lg shadow-primary/20 gradient-primary border-0 h-10 px-5">Book Now <Zap className="h-3.5 w-3.5 ml-1" /></Button></DialogTrigger>
                        <DialogContent className="rounded-2xl bg-card border-border/30">
                          <DialogHeader><DialogTitle>Book {tutor.name}</DialogTitle></DialogHeader>
                          <div className="flex items-center gap-3 mb-4 p-3 bg-accent/20 rounded-xl border border-border/20">
                            <Avatar className="h-12 w-12"><AvatarImage src={tutor.avatar} /><AvatarFallback className="gradient-primary text-primary-foreground">{tutor.name[0]}</AvatarFallback></Avatar>
                            <div><p className="font-semibold">{tutor.name}</p><p className="text-sm text-muted-foreground">{tutor.subject} · {tutor.hourly_rate}</p></div>
                          </div>
                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (!bookingName || !bookingEmail) { toast.error("Fill required fields"); return; }
                            try {
                              await bookTutor.mutateAsync({ tutor_id: tutor.id, name: bookingName, email: bookingEmail, message: bookingMessage || undefined });
                              toast.success(`Booking request sent to ${tutor.name}! 🎉`);
                              setBookingName(""); setBookingEmail(""); setBookingMessage("");
                            } catch { toast.error("Failed to book"); }
                          }} className="space-y-4">
                            <div className="space-y-2"><Label>Your Name *</Label><Input value={bookingName} onChange={(e) => setBookingName(e.target.value)} required className="rounded-xl bg-accent/20 border-border/30" /></div>
                            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} required className="rounded-xl bg-accent/20 border-border/30" /></div>
                            <div className="space-y-2"><Label>Message</Label><Textarea value={bookingMessage} onChange={(e) => setBookingMessage(e.target.value)} placeholder="What do you need help with?" rows={3} className="rounded-xl bg-accent/20 border-border/30" /></div>
                            <Button type="submit" className="w-full rounded-xl gradient-primary border-0 h-12" disabled={bookTutor.isPending}>{bookTutor.isPending ? "Sending..." : "Send Booking Request"}</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              </Link>
            ))}
          </div>
        )}
        {filtered.length === 0 && !isLoading && <div className="text-center py-20"><BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" /><p className="text-muted-foreground">No tutors found.</p></div>}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-xl border-border/30"><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl ${page === i + 1 ? "shadow-lg shadow-primary/30" : "border-border/30"}`}>{i + 1}</Button>)}
            <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border-border/30"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
