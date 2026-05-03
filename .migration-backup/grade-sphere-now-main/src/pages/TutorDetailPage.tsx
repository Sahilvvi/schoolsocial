import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft, Star, MapPin, Clock, BookOpen, Users, Award, CheckCircle,
  Zap, Mail, Phone, Calendar, MessageSquare, Loader2, Share2, Heart,
  GraduationCap, Briefcase, Target, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTutors, useBookTutor } from "@/hooks/useData";
import { useTuitionBatches } from "@/hooks/useErp";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number"),
  subject: z.string().min(1, "Select a subject"),
  message: z.string().optional(),
});

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const teachingApproach = [
  { icon: Target, title: "Personalized Learning", desc: "Customized lesson plans tailored to each student's pace and style" },
  { icon: BookOpen, title: "Concept Clarity", desc: "Focus on building strong fundamentals before advanced topics" },
  { icon: MessageSquare, title: "Interactive Sessions", desc: "Engaging discussions, quizzes, and real-world examples" },
  { icon: Award, title: "Exam Preparation", desc: "Strategic preparation for board exams and competitive tests" },
];

const availability = [
  { day: "Monday - Friday", time: "4:00 PM - 8:00 PM" },
  { day: "Saturday", time: "10:00 AM - 6:00 PM" },
  { day: "Sunday", time: "10:00 AM - 2:00 PM" },
];

export default function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tutors = [], isLoading } = useTutors();
  const bookTutor = useBookTutor();
  const { data: batches = [] } = useTuitionBatches(id);
  const [liked, setLiked] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const tutor = tutors.find((t) => t.id === id);
  const relatedTutors = tutors.filter((t) => t.id !== id && t.subject === tutor?.subject).slice(0, 3);
  const otherTutors = relatedTutors.length > 0 ? relatedTutors : tutors.filter((t) => t.id !== id).slice(0, 3);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", email: "", phone: "", subject: tutor?.subject || "", message: "" },
  });

  const onBook = async (data: z.infer<typeof bookingSchema>) => {
    if (!tutor) return;
    try {
      await bookTutor.mutateAsync({ tutor_id: tutor.id, name: data.name, email: data.email, message: data.message || undefined });
      toast.success(`Booking request sent to ${tutor.name}! 🎉`);
      form.reset();
      setBookOpen(false);
    } catch {
      toast.error("Failed to send booking request");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!tutor) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground text-lg">Tutor not found.</p></div>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(174_62%_47%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-32 left-[20%] w-96 h-96 bg-secondary/6 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-20 right-[15%] w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />

        <div className="container mx-auto px-4 relative z-10">
          <Link to="/tutors">
            <Button variant="outline" size="sm" className="rounded-xl bg-card/60 backdrop-blur-sm border-border/30 hover:bg-card/80 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tutors
            </Button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Tutor Info */}
            <motion.div {...fadeUp} className="lg:col-span-2">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="h-28 w-28 ring-4 ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl">
                    <AvatarImage src={tutor.avatar} />
                    <AvatarFallback className="gradient-primary text-primary-foreground font-bold text-3xl">{tutor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 flex items-center gap-1 gradient-primary rounded-full px-3 py-1 shadow-lg">
                    <Star className="h-3.5 w-3.5 fill-primary-foreground text-primary-foreground" />
                    <span className="text-sm font-bold text-primary-foreground">{Number(tutor.rating)}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider">Verified Tutor</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">{tutor.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg text-sm font-semibold px-4 py-1">{tutor.subject}</Badge>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{tutor.location}</span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Briefcase className="h-4 w-4 text-secondary" />{tutor.experience}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{tutor.bio}</p>
                </div>
              </div>
            </motion.div>

            {/* Price & Actions */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <Card className="rounded-2xl bg-card/60 backdrop-blur-sm border-border/30 overflow-hidden">
                <CardContent className="p-6 space-y-5">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hourly Rate</p>
                    <p className="text-4xl font-extrabold text-gradient">{tutor.hourly_rate}</p>
                  </div>
                  <Dialog open={bookOpen} onOpenChange={setBookOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-semibold shadow-lg shadow-primary/30">
                        <Zap className="h-4 w-4 mr-2" />Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-card border-border/40">
                      <DialogHeader><DialogTitle className="text-xl font-bold">Book {tutor.name}</DialogTitle></DialogHeader>
                      <div className="flex items-center gap-3 mb-4 p-3 bg-accent/20 rounded-xl border border-border/20">
                        <Avatar className="h-12 w-12"><AvatarImage src={tutor.avatar} /><AvatarFallback className="gradient-primary text-primary-foreground">{tutor.name[0]}</AvatarFallback></Avatar>
                        <div><p className="font-semibold">{tutor.name}</p><p className="text-sm text-muted-foreground">{tutor.subject} · {tutor.hourly_rate}</p></div>
                      </div>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onBook)} className="space-y-4">
                          <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your name" className="rounded-xl bg-muted/30 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@email.com" className="rounded-xl bg-muted/30 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+91 XXXXX XXXXX" className="rounded-xl bg-muted/30 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>Subject</FormLabel><FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="rounded-xl bg-muted/30 border-border/30"><SelectValue placeholder="Select subject" /></SelectTrigger>
                                <SelectContent>
                                  {[tutor.subject, "Mathematics", "Physics", "Chemistry", "Biology", "English"].filter((v, i, a) => a.indexOf(v) === i).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem><FormLabel>Message (Optional)</FormLabel><FormControl><Textarea placeholder="What do you need help with?" className="rounded-xl bg-muted/30 border-border/30 resize-none" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-semibold shadow-lg shadow-primary/30" disabled={bookTutor.isPending}>
                            {bookTutor.isPending ? "Sending..." : "Confirm Booking"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <div className="flex gap-2">
                    <Button variant="outline" className={`flex-1 rounded-xl border-border/30 ${liked ? "text-red-400" : ""}`} onClick={() => setLiked(!liked)}>
                      <Heart className={`h-4 w-4 mr-1.5 ${liked ? "fill-red-400" : ""}`} />{liked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl border-border/30" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
                      <Share2 className="h-4 w-4 mr-1.5" />Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <section className="container mx-auto px-4 -mt-2 mb-12">
        <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-2xl overflow-hidden border border-border/30 bg-card/40 backdrop-blur-sm">
          {[
            { icon: Star, value: `${Number(tutor.rating)}/5`, label: "Rating" },
            { icon: Users, value: "150+", label: "Students Taught" },
            { icon: Briefcase, value: tutor.experience, label: "Experience" },
            { icon: Award, value: "100%", label: "Satisfaction" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              className={`py-5 px-4 text-center ${i < 3 ? "border-r border-border/20" : ""}`}>
              <s.icon className="h-5 w-5 mx-auto mb-2 text-primary opacity-60" />
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Teaching Approach */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Teaching Approach
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {teachingApproach.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
                    className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/20 transition-all group">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center mb-3 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Batches */}
            {batches.length > 0 && (
              <motion.div {...fadeUp} transition={{ delay: 0.22 }}>
                <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Available Batches
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {batches.map((b: any, i: number) => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
                      className="p-5 rounded-2xl bg-card/60 border border-border/30 hover:border-primary/20 transition-all">
                      <h4 className="font-bold text-foreground mb-1">{b.batch_name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{b.subject} • {b.schedule || "TBD"}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{b.current_students}/{b.max_students} students</span>
                        <span className="font-bold text-primary">₹{Number(b.fee_per_month).toLocaleString()}/mo</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
              <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Subjects & Expertise
              </h2>
              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30">
                <div className="flex flex-wrap gap-3 mb-6">
                  {[tutor.subject, "Problem Solving", "Exam Preparation", "Doubt Clearing", "Assignment Help", "Concept Building"].map((skill, i) => (
                    <Badge key={i} variant={i === 0 ? "default" : "outline"} className={`rounded-lg px-4 py-2 text-sm font-medium ${i === 0 ? "gradient-primary text-primary-foreground border-0 shadow-md" : "border-border/40 bg-card/40"}`}>
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Board Exams (CBSE/ICSE)", level: 95 },
                    { label: "Competitive Exams", level: 88 },
                    { label: "Foundation Building", level: 92 },
                    { label: "Advanced Topics", level: 85 },
                  ].map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground font-medium">{skill.label}</span>
                        <span className="text-primary font-bold">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full gradient-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Student Reviews
              </h2>
              <div className="space-y-4">
                {[
                  { name: "Rahul S.", rating: 5, comment: "Excellent teacher! Concepts became crystal clear after just a few sessions.", date: "2 weeks ago" },
                  { name: "Priya M.", rating: 5, comment: "Very patient and knowledgeable. My grades improved significantly.", date: "1 month ago" },
                  { name: "Amit K.", rating: 4, comment: "Great teaching methodology. Highly recommended for board exam preparation.", date: "2 months ago" },
                ].map((review, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                    className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary font-bold">{review.name[0]}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <Card className="rounded-2xl bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Availability</h3>
                  <div className="space-y-3">
                    {availability.map((slot, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/20 border border-border/20">
                        <span className="text-sm font-medium text-foreground">{slot.day}</span>
                        <span className="text-xs text-muted-foreground">{slot.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact */}
            <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
              <Card className="rounded-2xl bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Contact Info</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Mail, label: "Email", value: "Contact via booking" },
                      { icon: Phone, label: "Phone", value: "Available after booking" },
                      { icon: MapPin, label: "Location", value: tutor.location },
                      { icon: GraduationCap, label: "Mode", value: "Online & Offline" },
                    ].map((d, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <d.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{d.label}</p>
                          <p className="text-sm font-semibold text-foreground">{d.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Related Tutors */}
        {otherTutors.length > 0 && (
          <motion.div {...fadeUp} transition={{ delay: 0.35 }} className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Similar Tutors
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherTutors.map((t, i) => (
                <Link key={t.id} to={`/tutor/${t.id}`}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }} className="group">
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all h-full">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-14 w-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                            <AvatarImage src={t.avatar} />
                            <AvatarFallback className="gradient-primary text-primary-foreground font-bold">{t.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{t.name}</h3>
                            <Badge className="mt-1 rounded-lg gradient-primary text-primary-foreground border-0 text-xs">{t.subject}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{Number(t.rating)}</span>
                          <span className="font-bold text-gradient">{t.hourly_rate}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
