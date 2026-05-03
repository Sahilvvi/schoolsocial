import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar, MapPin, Clock, Users, ArrowLeft, Share2, Heart, Loader2,
  CheckCircle, GraduationCap, Ticket, Star, Phone, Mail, Globe,
  ChevronRight, Building2, Sparkles, CalendarDays, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEvents, useSchools } from "@/hooks/useData";

const registrationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  attendees: z.string().min(1, "Select number of attendees"),
  message: z.string().optional(),
});

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const schedule = [
  { time: "09:00 AM", title: "Registration & Welcome", desc: "Check-in and welcome kit distribution" },
  { time: "10:00 AM", title: "Opening Ceremony", desc: "Keynote address by the school principal" },
  { time: "11:30 AM", title: "Main Event Begins", desc: "Competitions, exhibitions, and activities" },
  { time: "01:00 PM", title: "Lunch Break", desc: "Refreshments and networking" },
  { time: "02:00 PM", title: "Afternoon Sessions", desc: "Workshops and interactive sessions" },
  { time: "04:00 PM", title: "Awards & Closing", desc: "Prize distribution and closing ceremony" },
];

const highlights = [
  { icon: Users, label: "500+ Expected Attendees" },
  { icon: GraduationCap, label: "20+ Schools Participating" },
  { icon: Star, label: "15+ Competitions" },
  { icon: Ticket, label: "Free Entry" },
];

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: events = [], isLoading } = useEvents();
  const { data: schools = [] } = useSchools();
  const [liked, setLiked] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  const event = events.find((e) => e.id === id);
  const school = schools.find((s) => s.id === event?.school_id);
  const relatedEvents = events.filter((e) => e.id !== id).slice(0, 3);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { name: "", email: "", phone: "", attendees: "", message: "" },
  });

  const onRegister = (data: z.infer<typeof registrationSchema>) => {
    toast.success("Registration successful! You'll receive a confirmation email shortly.");
    form.reset();
    setRegOpen(false);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground text-lg">Event not found.</p></div>;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: "easeOut" }}
          src={event.image} alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-8 z-10">
          <Link to="/events">
            <Button variant="outline" size="sm" className="rounded-xl bg-card/60 backdrop-blur-sm border-border/30 hover:bg-card/80">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
            </Button>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <motion.div {...fadeUp}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg text-xs font-semibold">{event.school_name}</Badge>
                <Badge variant="outline" className="border-border/40 bg-card/40 backdrop-blur-sm text-foreground">
                  <Calendar className="h-3 w-3 mr-1.5" />{event.event_date}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{event.location}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary" />9:00 AM - 5:00 PM</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Open to Public</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky top-16 z-30 bg-card/80 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className={`rounded-xl ${liked ? "text-red-400" : "text-muted-foreground"}`} onClick={() => setLiked(!liked)}>
              <Heart className={`h-4 w-4 mr-1.5 ${liked ? "fill-red-400" : ""}`} />{liked ? "Saved" : "Save"}
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
              <Share2 className="h-4 w-4 mr-1.5" />Share
            </Button>
          </div>
          <Dialog open={regOpen} onOpenChange={setRegOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/30 font-semibold">
                <Ticket className="h-4 w-4 mr-2" />Register Now
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border-border/40">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Register for {event.title}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onRegister)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your name" className="rounded-xl bg-muted/30 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@email.com" className="rounded-xl bg-muted/30 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+91 XXXXX XXXXX" className="rounded-xl bg-muted/30 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="attendees" render={({ field }) => (
                    <FormItem><FormLabel>Number of Attendees</FormLabel><FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="rounded-xl bg-muted/30 border-border/30"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3", "4", "5+"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Message (Optional)</FormLabel><FormControl><Textarea placeholder="Any special requirements..." className="rounded-xl bg-muted/30 border-border/30 resize-none" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-semibold shadow-lg shadow-primary/30">
                    Confirm Registration
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Highlights */}
            <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {highlights.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="text-center p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30"
                >
                  <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
                    <h.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{h.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* About */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> About This Event
              </h2>
              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 space-y-4">
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                <p className="text-muted-foreground leading-relaxed">
                  Join us for an unforgettable experience at {event.school_name}. This event brings together students, teachers, and
                  parents for a day filled with learning, competition, and celebration. Whether you're participating or spectating,
                  there's something for everyone.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  All participants will receive certificates of participation. Winners in each category will be awarded trophies
                  and scholarships. Light refreshments and lunch will be provided for all registered attendees.
                </p>
              </div>
            </motion.div>

            {/* Schedule */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Event Schedule
              </h2>
              <div className="space-y-0">
                {schedule.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex gap-5 group"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`h-4 w-4 rounded-full border-2 ${i === 0 ? "gradient-primary border-transparent" : "border-primary/40 bg-background"} group-hover:scale-125 transition-transform`} />
                      {i < schedule.length - 1 && <div className="w-0.5 flex-1 bg-border/30 my-1" />}
                    </div>
                    <div className="pb-8">
                      <span className="text-xs font-bold text-primary">{s.time}</span>
                      <h3 className="text-base font-bold text-foreground mt-1 group-hover:text-primary transition-colors">{s.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* What to Expect */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" /> What to Expect
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Live competitions & exhibitions",
                  "Interactive workshops & demos",
                  "Networking with educators",
                  "Certificates for all participants",
                  "Exciting prizes & scholarships",
                  "Refreshments & lunch provided",
                  "Photo opportunities",
                  "Exclusive school tour",
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.04 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/20 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <Card className="rounded-2xl bg-card/60 backdrop-blur-sm border-border/30 overflow-hidden">
                <CardContent className="p-6 space-y-5">
                  <h3 className="text-lg font-bold text-foreground">Event Details</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Calendar, label: "Date", value: event.event_date },
                      { icon: Clock, label: "Time", value: "9:00 AM - 5:00 PM" },
                      { icon: MapPin, label: "Venue", value: event.location },
                      { icon: Building2, label: "Organized By", value: event.school_name },
                      { icon: Ticket, label: "Entry", value: "Free Registration" },
                      { icon: Users, label: "Capacity", value: "500 seats" },
                    ].map((d, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <d.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{d.label}</p>
                          <p className="text-sm font-semibold text-foreground">{d.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-semibold shadow-lg shadow-primary/30" onClick={() => setRegOpen(true)}>
                    <Ticket className="h-4 w-4 mr-2" />Register Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* School Info */}
            {school && (
              <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
                <Card className="rounded-2xl bg-card/60 backdrop-blur-sm border-border/30 overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-foreground">About the School</h3>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{school.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{school.location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{school.description}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-border/30 text-xs"><Star className="h-3 w-3 mr-1 fill-primary text-primary" />{school.rating}</Badge>
                      <Badge variant="outline" className="border-border/30 text-xs">{school.board}</Badge>
                    </div>
                    <Link to={`/school/${school.slug}`}>
                      <Button variant="outline" className="w-full rounded-xl border-border/30 hover:bg-primary/5 hover:border-primary/30">
                        Visit School Profile <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Contact */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <Card className="rounded-2xl bg-card/60 backdrop-blur-sm border-border/30 overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Need Help?</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Phone, label: "+91 98765 43210" },
                      { icon: Mail, label: "events@myschool.in" },
                      { icon: Globe, label: "www.myschool.in" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <c.icon className="h-4 w-4 text-primary" />
                        <span>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> More Events
              </h2>
              <Link to="/events">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  View All <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((evt, i) => (
                <motion.div key={evt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }} className="group"
                >
                  <Link to={`/event/${evt.id}`}>
                    <div className="h-full rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/20 transition-all duration-300 flex flex-col">
                      <div className="relative overflow-hidden aspect-video">
                        <img src={evt.image} alt={evt.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-card/60 backdrop-blur-sm text-foreground border-border/30 font-semibold text-xs">{evt.school_name}</Badge>
                      </div>
                      <CardContent className="pt-4 pb-5 space-y-2 flex-1">
                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">{evt.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" />{evt.event_date}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" />{evt.location}</span>
                        </div>
                      </CardContent>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
