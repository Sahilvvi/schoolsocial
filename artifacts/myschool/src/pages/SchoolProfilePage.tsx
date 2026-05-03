import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import QRCode from "react-qr-code";
import {
  MapPin, Star, Award, BookOpen, Briefcase, CheckCircle, ChevronRight, Loader2,
  Image, MessageSquare, GraduationCap, Send, Sparkles, Heart, Calendar, DollarSign, Users, Clock,
  Phone, Mail, Globe, Shield, Target, Building2, Lightbulb, Trophy, IndianRupee,
  CalendarDays, Play, Instagram, Facebook, ExternalLink, Video
} from "lucide-react";
import AskAIChat from "@/components/AskAIChat";
import QrOrderDialog from "@/components/QrOrderDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolBySlug, useReviews, useAddReview, useSubmitAdmission, useJobs, useSubmitJobApplication, useEvents } from "@/hooks/useData";
import { useSavedSchoolIds, useToggleSaveSchool } from "@/hooks/useSaveSchool";

const reviewSchema = z.object({ author: z.string().min(2), rating: z.number().min(1).max(5), comment: z.string().min(10) });
const admissionSchema = z.object({ studentName: z.string().min(2), parentName: z.string().min(2), email: z.string().email(), phone: z.string().min(10), grade: z.string().min(1, "Select a grade") });
const applicationSchema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(10), experience: z.string().min(1) });

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export default function SchoolProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: school, isLoading } = useSchoolBySlug(slug);
  const { data: reviews = [] } = useReviews(school?.id);
  const { data: allJobs = [] } = useJobs();
  const { data: allEvents = [] } = useEvents();
  const { user } = useAuth();
  const addReview = useAddReview();
  const submitAdmission = useSubmitAdmission();
  const submitApp = useSubmitJobApplication();
  const { data: savedIds } = useSavedSchoolIds();
  const toggleSave = useToggleSaveSchool();
  const isSaved = school ? savedIds?.has(school.id) ?? false : false;

  const schoolJobs = allJobs.filter((j) => j.school_id === school?.id);
  const schoolEvents = allEvents.filter((e: any) => e.school_id === school?.id || (e.school_name && school?.name && e.school_name === school.name));

  const reviewForm = useForm<z.infer<typeof reviewSchema>>({ resolver: zodResolver(reviewSchema), defaultValues: { author: "", rating: 5, comment: "" } });
  const admissionForm = useForm<z.infer<typeof admissionSchema>>({ resolver: zodResolver(admissionSchema), defaultValues: { studentName: "", parentName: "", email: "", phone: "", grade: "" } });
  const appForm = useForm<z.infer<typeof applicationSchema>>({ resolver: zodResolver(applicationSchema), defaultValues: { name: "", email: "", phone: "", experience: "" } });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!school) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground text-lg">School not found.</p></div>;

  const admissionUrl = `${window.location.origin}/school/${school.slug}?tab=admission`;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : Number(school.rating).toFixed(1);

  const quickInfo = [
    { icon: Star, label: "Rating", value: `${avgRating}/5` },
    { icon: Users, label: "Reviews", value: String(school.review_count) },
    { icon: DollarSign, label: "Annual Fees", value: school.fees },
    { icon: GraduationCap, label: "Board", value: school.board },
    { icon: Briefcase, label: "Openings", value: String(schoolJobs.length) },
    { icon: CheckCircle, label: "Facilities", value: String((school.facilities ?? []).length) },
  ];

  const classFees = (school as any).class_fees || [];

  const tabs = [
    { value: "about", icon: BookOpen, label: "About" },
    { value: "fees", icon: IndianRupee, label: "Fees" },
    { value: "gallery", icon: Image, label: "Gallery" },
    { value: "events", icon: CalendarDays, label: "Events" },
    { value: "reviews", icon: MessageSquare, label: "Reviews" },
    { value: "vacancies", icon: Briefcase, label: "Vacancies" },
    { value: "admission", icon: GraduationCap, label: "Admission" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          src={school.banner}
          alt={school.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        
        {/* School Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 md:pb-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg shadow-primary/30 font-semibold px-4 py-1.5 text-sm">{school.board}</Badge>
                <Badge variant="outline" className="bg-card/40 backdrop-blur-md text-foreground border-border/40 font-semibold px-3 py-1.5">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1.5" /> {avgRating}
                </Badge>
                <Badge variant="outline" className="bg-card/40 backdrop-blur-md text-foreground border-border/40 font-semibold px-3 py-1.5">
                  <Users className="h-3.5 w-3.5 text-primary mr-1.5" /> {school.review_count} reviews
                </Badge>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight">{school.name}</h1>
                {user && (
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-10 w-10 rounded-full shrink-0 backdrop-blur-md border-border/40 ${isSaved ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "bg-card/40 text-muted-foreground hover:text-rose-500"}`}
                    onClick={() => toggleSave.mutate({ schoolId: school.id, saved: isSaved })}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{school.location}</span>
                <span className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-secondary" />{school.fees}</span>
                <AskAIChat schoolName={school.name} schoolAbout={school.about} schoolFees={school.fees} schoolBoard={school.board} schoolFacilities={school.facilities ?? []} />
                {user && <QrOrderDialog schoolId={school.id} schoolName={school.name} />}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="border-y border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-6">
            {quickInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className={`py-5 px-4 text-center ${i < quickInfo.length - 1 ? "border-r border-border/20" : ""}`}
              >
                <p className="text-lg font-extrabold text-foreground">{item.value}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="about" className="space-y-10">
          {/* Tab Navigation */}
          <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/30">
            <TabsList className="flex gap-1 h-auto bg-transparent p-0 w-full justify-start overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-semibold text-sm px-5 py-3 shrink-0"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ABOUT TAB */}
          <TabsContent value="about" className="space-y-8">
            {/* About */}
            <motion.div {...fadeUp}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><BookOpen className="h-5 w-5 text-primary" />About the School</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground leading-[1.8] text-base">{school.about}</p></CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Phone className="h-5 w-5 text-primary" />Contact</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-primary shrink-0" /><span>admissions@{school.slug}.edu</span></div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-primary shrink-0" /><span>+91 98765 43210</span></div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary shrink-0" /><span>{school.location}</span></div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><Globe className="h-4 w-4 text-primary shrink-0" /><span>www.{school.slug}.edu</span></div>
                      {/* Social Media Links */}
                      <div className="pt-4 border-t border-border/30">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Follow Us</p>
                        <div className="flex items-center gap-2">
                          <a href={`https://instagram.com/${school.slug}`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                            <Instagram className="h-4 w-4" />
                          </a>
                          <a href={`https://facebook.com/${school.slug}`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                            <Facebook className="h-4 w-4" />
                          </a>
                          <a href={`https://${school.slug}.edu`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-accent/30 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-sm">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>

            {/* Facilities */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><CheckCircle className="h-5 w-5 text-secondary" />Facilities & Infrastructure</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(school.facilities ?? []).map((f, i) => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ scale: 1.04, y: -2 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-accent/20 border border-border/30 text-sm font-medium hover:border-primary/30 transition-all duration-300 group cursor-default"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        {f}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Trophy className="h-5 w-5 text-primary" />Achievements & Awards</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {(school.achievements ?? []).map((a, i) => (
                      <motion.div
                        key={a}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-accent/20 border border-border/30 hover:border-primary/20 transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-primary/20">
                          <Award className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Video Showcase */}
            <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Video className="h-5 w-5 text-primary" />School Video Tour</CardTitle></CardHeader>
                <CardContent>
                  <div className="rounded-2xl overflow-hidden border border-border/30 relative group cursor-pointer aspect-video">
                    <img src={school.banner} alt={`${school.name} video tour`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent flex items-center justify-center">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                        <Play className="h-7 w-7 text-primary-foreground ml-1" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-sm font-bold text-foreground">Take a virtual tour of {school.name}</h4>
                      <p className="text-xs text-muted-foreground">Explore our campus, classrooms, and facilities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Why Choose */}
            <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Lightbulb className="h-5 w-5 text-secondary" />Why Choose {school.name}?</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { icon: Target, title: "Academic Excellence", desc: `${school.board} curriculum with proven results and experienced faculty.` },
                      { icon: Shield, title: "Safe Environment", desc: "CCTV-monitored campus with trained security and child safety protocols." },
                      { icon: Heart, title: "Holistic Development", desc: "Equal emphasis on academics, sports, arts, and personality development." },
                    ].map((item, i) => (
                      <div key={i} className="p-5 rounded-xl bg-accent/10 border border-border/20 space-y-3">
                        <item.icon className="h-6 w-6 text-primary" />
                        <h4 className="font-bold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* FEES TAB */}
          <TabsContent value="fees" className="space-y-8">
            <motion.div {...fadeUp}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><IndianRupee className="h-5 w-5 text-primary" />Class-wise Fee Structure</CardTitle></CardHeader>
                <CardContent>
                  {classFees.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {classFees.map((item: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-accent/20 border border-border/30 hover:border-primary/20 transition-colors"
                        >
                          <span className="font-medium text-sm text-foreground">{item.class}</span>
                          <span className="font-bold text-primary text-sm">{item.fee}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Fee structure not available. Contact the school for details.</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">* Fees are approximate and may vary. Contact school for exact fee details.</p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-4">
            {schoolEvents.length === 0 ? (
              <div className="text-center py-16">
                <CalendarDays className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">No events listed for this school currently.</p>
                <a href="/events"><Button variant="outline" className="mt-4 rounded-xl border-border/40 font-semibold">Browse All Events</Button></a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schoolEvents.map((event: any, i: number) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors overflow-hidden group">
                      {event.image && (
                        <div className="relative overflow-hidden aspect-video">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg text-xs">{event.event_date}</Badge>
                          </div>
                        </div>
                      )}
                      <CardContent className="pt-4">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2"><MapPin className="h-3.5 w-3.5 text-primary" />{event.location}</div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2">{event.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* GALLERY TAB */}
          <TabsContent value="gallery">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(school.gallery ?? []).map((img, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }} className="overflow-hidden rounded-2xl border border-border/30 group cursor-pointer relative aspect-video"
                >
                  <img src={img} alt={`${school.name} gallery ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <span className="text-sm font-semibold text-foreground">Photo {i + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            {(school.gallery ?? []).length === 0 && <p className="text-center text-muted-foreground py-16">No gallery images available.</p>}
          </TabsContent>

          {/* REVIEWS TAB */}
          <TabsContent value="reviews" className="space-y-8">
            <Card className="bg-card/60 backdrop-blur-sm border-border/30">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="text-center px-8">
                    <p className="text-6xl font-extrabold text-gradient">{avgRating}</p>
                    <StarRating rating={Math.round(Number(avgRating))} size={20} />
                    <p className="text-sm text-muted-foreground mt-2">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2.5 w-full">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <span className="w-3 text-muted-foreground font-medium">{star}</span>
                          <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                          <div className="flex-1 h-2.5 bg-accent/30 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }} className="h-full gradient-primary rounded-full" />
                          </div>
                          <span className="w-8 text-xs text-muted-foreground text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {reviews.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-md">{r.author[0]}</div>
                          <div>
                            <span className="font-semibold text-sm text-foreground">{r.author}</span>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <StarRating rating={r.rating} size={14} />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {reviews.length === 0 && <p className="text-muted-foreground text-center py-16">No reviews yet. Be the first to review! ✍️</p>}
            </div>
            
            {user ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" />Write a Review</CardTitle></CardHeader>
                <CardContent>
                  <Form {...reviewForm}>
                    <form onSubmit={reviewForm.handleSubmit(async (data) => {
                      try { await addReview.mutateAsync({ school_id: school.id, author: data.author, rating: data.rating, comment: data.comment, user_id: user.id }); reviewForm.reset(); toast.success("Review submitted! 🎉"); } catch { toast.error("Failed to submit review"); }
                    })} className="space-y-5">
                      <FormField control={reviewForm.control} name="author" render={({ field }) => (<FormItem><FormLabel>Your Name</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={reviewForm.control} name="rating" render={({ field }) => (<FormItem><FormLabel>Rating</FormLabel><FormControl><StarRating rating={field.value} interactive onChange={field.onChange} size={28} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={reviewForm.control} name="comment" render={({ field }) => (<FormItem><FormLabel>Your Review</FormLabel><FormControl><Textarea rows={4} className="rounded-xl bg-accent/20 border-border/30" placeholder="Share your experience..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button type="submit" disabled={addReview.isPending} className="rounded-xl shadow-lg shadow-primary/20 gradient-primary border-0 h-12 px-8"><Send className="h-4 w-4 mr-2" />{addReview.isPending ? "Submitting..." : "Submit Review"}</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="py-10 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-5">Sign in to share your experience</p>
                  <a href="/auth"><Button className="rounded-xl shadow-lg shadow-primary/20 gradient-primary border-0 h-12 px-8">Sign In to Review</Button></a>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* VACANCIES TAB */}
          <TabsContent value="vacancies" className="space-y-4">
            {schoolJobs.length === 0 && (
              <div className="text-center py-16">
                <Briefcase className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">No current openings at this school.</p>
              </div>
            )}
            {schoolJobs.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors group">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                            <Building2 className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="gradient-primary text-primary-foreground border-0 rounded-lg text-xs">{job.type}</Badge>
                              <Badge variant="outline" className="rounded-lg border-border/30 text-muted-foreground text-xs">{job.salary}</Badge>
                              <Badge variant="outline" className="rounded-lg border-border/30 text-muted-foreground text-xs"><MapPin className="h-3 w-3 mr-1" />{job.location}</Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild><Button className="rounded-xl shadow-lg shadow-primary/20 gradient-primary border-0 shrink-0 h-11">Apply Now</Button></DialogTrigger>
                        <DialogContent className="rounded-2xl bg-card border-border/30">
                          <DialogHeader><DialogTitle>Apply for {job.title}</DialogTitle></DialogHeader>
                          <Form {...appForm}>
                            <form onSubmit={appForm.handleSubmit(async (data) => {
                              try { await submitApp.mutateAsync({ job_id: job.id, name: data.name, email: data.email, phone: data.phone, experience: data.experience }); toast.success("Application submitted! 🎉"); appForm.reset(); } catch { toast.error("Failed to submit"); }
                            })} className="space-y-4">
                              <FormField control={appForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={appForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={appForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={appForm.control} name="experience" render={({ field }) => (<FormItem><FormLabel>Experience</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <Button type="submit" className="w-full rounded-xl gradient-primary border-0 h-12" disabled={submitApp.isPending}>{submitApp.isPending ? "Submitting..." : "Submit Application"}</Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* ADMISSION TAB */}
          <TabsContent value="admission" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div {...fadeUp}>
                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-5 w-5 text-primary" />Apply for Admission</CardTitle></CardHeader>
                  <CardContent>
                    <Form {...admissionForm}>
                      <form onSubmit={admissionForm.handleSubmit(async (data) => {
                        try { await submitAdmission.mutateAsync({ school_id: school.id, student_name: data.studentName, parent_name: data.parentName, email: data.email, phone: data.phone, grade: data.grade }); toast.success("Admission application submitted! 🎓"); admissionForm.reset(); } catch { toast.error("Failed to submit"); }
                      })} className="space-y-5">
                        <FormField control={admissionForm.control} name="studentName" render={({ field }) => (<FormItem><FormLabel>Student Name</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={admissionForm.control} name="parentName" render={({ field }) => (<FormItem><FormLabel>Parent/Guardian Name</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={admissionForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={admissionForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={admissionForm.control} name="grade" render={({ field }) => (
                          <FormItem><FormLabel>Grade</FormLabel><FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="rounded-xl bg-accent/20 border-border/30"><SelectValue placeholder="Select grade" /></SelectTrigger>
                              <SelectContent>{["Nursery", "LKG", "UKG", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                            </Select>
                          </FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full rounded-xl shadow-lg shadow-primary/20 gradient-primary border-0 h-12 text-base" disabled={submitAdmission.isPending}>
                          <Send className="h-4 w-4 mr-2" />{submitAdmission.isPending ? "Submitting..." : "Submit Application"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="space-y-6">
                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Scan to Apply</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center gap-5">
                    <p className="text-sm text-muted-foreground text-center">Apply directly from your phone</p>
                    <div className="p-5 bg-white rounded-2xl shadow-lg"><QRCode value={admissionUrl} size={160} /></div>
                  </CardContent>
                </Card>
                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardContent className="pt-6 space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Admission Process</h4>
                    {["Fill out the application form", "Submit required documents", "Attend entrance test/interview", "Receive confirmation"].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm shrink-0">{i + 1}</span>
                        <p className="text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
