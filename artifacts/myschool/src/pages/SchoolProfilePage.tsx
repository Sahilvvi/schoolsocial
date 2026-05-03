import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Star, Award, BookOpen, Briefcase, CheckCircle, Loader2,
  Image, MessageSquare, GraduationCap, Sparkles, Heart, DollarSign, Users,
  Phone, Mail, Globe, Shield, Target, Lightbulb, Trophy, IndianRupee,
  CalendarDays, Play, Instagram, Facebook, ExternalLink, Video, Search
} from "lucide-react";
import AskAIChat from "@/components/AskAIChat";
import QrOrderDialog from "@/components/QrOrderDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolBySlug, useReviews, useJobs, useEvents } from "@/hooks/useData";
import { useSavedSchoolIds, useToggleSaveSchool } from "@/hooks/useSaveSchool";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export default function SchoolProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: school, isLoading } = useSchoolBySlug(slug);
  const { data: reviews = [] } = useReviews(school?.id);
  const { data: allJobs = [] } = useJobs();
  const { data: allEvents = [] } = useEvents();
  const { user } = useAuth();
  
  const { data: savedIds } = useSavedSchoolIds();
  const toggleSave = useToggleSaveSchool();
  const isSaved = school ? savedIds?.has(school.id) ?? false : false;

  const schoolJobs = allJobs.filter((j) => j.school_id === school?.id);
  const schoolEvents = allEvents.filter((e: any) => e.school_id === school?.id || (e.school_name && school?.name && e.school_name === school.name));

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!school) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground font-bold text-xl">School not found.</p></div>;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : Number(school.rating).toFixed(1);

  const classFees = (school as any).class_fees || [];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* ═══ HERO BANNER ═══ */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-card">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={school.banner}
          alt={school.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Actions Top Right */}
        <div className="absolute top-6 right-6 flex gap-3 z-20">
          {user && (
            <Button
              size="icon"
              className={`h-12 w-12 rounded-full backdrop-blur-md shadow-xl transition-all hover:scale-110 ${isSaved ? "bg-rose-500 text-white border-0" : "bg-black/20 text-white border border-white/20 hover:bg-rose-500"}`}
              onClick={() => toggleSave.mutate({ schoolId: school.id, saved: isSaved })}
            >
              <Heart className={`h-6 w-6 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>

        {/* Content Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="gradient-primary text-white border-0 shadow-lg px-4 py-1.5 text-sm font-bold uppercase tracking-widest">{school.board}</Badge>
              <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-border/50 text-foreground px-3 py-1.5 font-bold shadow-md">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1.5" /> {avgRating} ({school.review_count})
              </Badge>
              {school.is_verified && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1.5 font-bold shadow-md">
                  <CheckCircle className="h-4 w-4 mr-1.5" /> Verified
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-4 drop-shadow-md">{school.name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-foreground/90">
              <span className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50 shadow-sm"><MapPin className="h-5 w-5 text-primary" />{school.location}</span>
              <span className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50 shadow-sm"><DollarSign className="h-5 w-5 text-primary" />{school.fees} / yr</span>
              <AskAIChat schoolName={school.name} schoolAbout={school.about} schoolFees={school.fees} schoolBoard={school.board} schoolFacilities={school.facilities ?? []} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="about" className="space-y-12">
          {/* Custom Tabs List */}
          <div className="sticky top-[60px] lg:top-[64px] z-30 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-xl border-b border-border/50">
            <TabsList className="flex gap-2 h-auto bg-transparent p-0 w-full justify-start overflow-x-auto no-scrollbar">
              {[
                { value: "about", icon: BookOpen, label: "Overview" },
                { value: "fees", icon: IndianRupee, label: "Fees & Structure" },
                { value: "gallery", icon: Image, label: "Gallery" },
                { value: "reviews", icon: MessageSquare, label: "Reviews" },
                { value: "admission", icon: GraduationCap, label: "Apply Now" }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl gap-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-bold text-sm px-6 py-3.5 shrink-0 bg-card border border-border/50 hover:bg-muted/50 text-muted-foreground"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* === OVERVIEW TAB === */}
          <TabsContent value="about" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-8">
                <motion.section {...fadeUp}>
                  <Card className="bg-card rounded-3xl border-border/50 shadow-sm overflow-hidden">
                    <div className="p-8 pb-6 border-b border-border/50">
                      <h2 className="text-2xl font-extrabold flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        About School
                      </h2>
                    </div>
                    <CardContent className="p-8">
                      <p className="text-muted-foreground leading-relaxed text-lg font-medium">{school.about || school.description}</p>
                    </CardContent>
                  </Card>
                </motion.section>

                <motion.section {...fadeUp} transition={{ delay: 0.1 }}>
                  <Card className="bg-card rounded-3xl border-border/50 shadow-sm overflow-hidden">
                    <div className="p-8 pb-6 border-b border-border/50">
                      <h2 className="text-2xl font-extrabold flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-secondary" />
                        </div>
                        Facilities
                      </h2>
                    </div>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(school.facilities ?? []).map((f, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-colors font-semibold text-foreground text-sm">
                            <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                              <CheckCircle className="h-4 w-4 text-primary" />
                            </div>
                            {f}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                <motion.section {...fadeUp} transition={{ delay: 0.2 }}>
                  <Card className="bg-card rounded-3xl border-border/50 shadow-sm overflow-hidden">
                    <div className="p-6 pb-4 border-b border-border/50">
                      <h3 className="font-extrabold text-lg">Contact Info</h3>
                    </div>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-start gap-4 text-sm font-medium text-foreground">
                        <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0"><MapPin className="h-5 w-5 text-primary" /></div>
                        <div className="pt-2">{school.location}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-foreground">
                        <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0"><Phone className="h-5 w-5 text-primary" /></div>
                        <div>+91 98765 43210</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-foreground">
                        <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0"><Mail className="h-5 w-5 text-primary" /></div>
                        <div>admissions@{school.slug}.edu</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-foreground">
                        <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0"><Globe className="h-5 w-5 text-primary" /></div>
                        <a href="#" className="hover:text-primary transition-colors hover:underline">www.{school.slug}.edu</a>
                      </div>

                      <div className="pt-6 border-t border-border/50 flex justify-center gap-4">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/50 text-foreground hover:bg-primary/5 hover:text-primary"><Facebook className="h-5 w-5" /></Button>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/50 text-foreground hover:bg-primary/5 hover:text-primary"><Instagram className="h-5 w-5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                <motion.section {...fadeUp} transition={{ delay: 0.3 }}>
                  <Card className="gradient-primary rounded-3xl border-0 shadow-xl shadow-primary/20 text-white overflow-hidden text-center">
                    <CardContent className="p-8">
                      <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-80" />
                      <h3 className="font-extrabold text-2xl mb-2">Ready to Apply?</h3>
                      <p className="text-white/80 font-medium mb-6">Start your admission journey today.</p>
                      <Button className="w-full bg-white text-primary hover:bg-gray-100 font-extrabold h-14 rounded-2xl shadow-lg">
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.section>
              </div>
            </div>
          </TabsContent>

          {/* === FEES TAB === */}
          <TabsContent value="fees">
            <Card className="bg-card rounded-3xl border-border/50 shadow-sm max-w-4xl mx-auto">
              <div className="p-8 border-b border-border/50">
                <h2 className="text-2xl font-extrabold flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <IndianRupee className="h-5 w-5 text-green-500" />
                  </div>
                  Fee Structure
                </h2>
              </div>
              <CardContent className="p-8">
                {classFees.length > 0 ? (
                  <div className="space-y-4">
                    {classFees.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                        <span className="font-extrabold text-lg text-foreground">{item.class}</span>
                        <div className="text-right">
                          <span className="font-extrabold text-xl text-primary">{item.fee}</span>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Per Year</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <IndianRupee className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-bold text-lg">Fee structure not publicly available.</p>
                    <Button variant="outline" className="mt-4 rounded-xl font-bold border-border/50">Request Fee Details</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === GALLERY TAB === */}
          <TabsContent value="gallery">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(school.gallery ?? []).map((img, i) => (
                <div key={i} className="aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-sm group relative">
                  <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Placeholder for other tabs (Reviews/Admission) - keeping it simple for the scope */}
          <TabsContent value="reviews">
            <Card className="bg-card rounded-3xl border-border/50 p-12 text-center shadow-sm">
              <MessageSquare className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="text-2xl font-extrabold mb-2">Verified Parent Reviews</h2>
              <p className="text-muted-foreground font-medium mb-6">See what other parents are saying about {school.name}.</p>
              <Button className="rounded-xl gradient-primary font-bold px-8 h-12 shadow-md">Write a Review</Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="admission">
             <Card className="bg-card rounded-3xl border-border/50 p-12 text-center shadow-sm">
              <GraduationCap className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-extrabold mb-4">Start Your Application</h2>
              <p className="text-muted-foreground font-medium max-w-lg mx-auto mb-8">Submit your details to initiate the admission process for the upcoming academic year.</p>
              <form className="max-w-md mx-auto space-y-4 text-left">
                <div className="space-y-2"><label className="font-bold text-sm">Student Name</label><input type="text" className="w-full h-12 rounded-xl bg-background border border-border/60 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none" /></div>
                <div className="space-y-2"><label className="font-bold text-sm">Parent Email</label><input type="email" className="w-full h-12 rounded-xl bg-background border border-border/60 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none" /></div>
                <Button className="w-full h-14 rounded-xl gradient-primary font-extrabold text-lg shadow-xl shadow-primary/20 mt-4">Submit Application</Button>
              </form>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}