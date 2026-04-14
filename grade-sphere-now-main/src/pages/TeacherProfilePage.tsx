import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User, Briefcase, MapPin, Star, Mail, Phone, Globe, Award, BookOpen, GraduationCap,
  Home, Video, FileText, Clock, ChevronRight, Edit, Shield, Sparkles, Heart,
  CheckCircle, Target, Zap, IndianRupee, Users, MessageSquare, Send, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useJobs } from "@/hooks/useData";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

/* Sample teacher profile data — in production this would come from Supabase */
const sampleProfile = {
  name: "Priya Sharma",
  title: "Senior Mathematics Teacher",
  location: "New Delhi, India",
  experience: "8+ Years",
  rating: 4.8,
  reviews: 47,
  bio: "Passionate mathematics educator with 8+ years of experience in CBSE and ICSE curriculum. Specialized in making complex concepts simple and engaging for students of all levels. Published author of 'Fun with Numbers' workbook series.",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  website: "priyasharma.edu",
  avatar: "PS",
  skills: ["Mathematics", "Physics", "CBSE", "ICSE", "Competitive Exam Prep", "Vedic Maths", "Online Teaching", "Student Counseling"],
  education: [
    { degree: "M.Sc. Mathematics", institution: "Delhi University", year: "2014" },
    { degree: "B.Ed.", institution: "Jamia Millia Islamia", year: "2016" },
    { degree: "CTET Qualified", institution: "CBSE", year: "2016" },
  ],
  experience_list: [
    { role: "Senior Math Teacher", school: "Delhi Public School, RK Puram", duration: "2020 - Present", desc: "Teaching classes 9-12, leading math olympiad team" },
    { role: "Math Teacher", school: "Modern School, Barakhamba", duration: "2017 - 2020", desc: "Classes 6-10, developed new curriculum modules" },
    { role: "Junior Teacher", school: "Springdales School", duration: "2016 - 2017", desc: "Assistant teacher for classes 4-8" },
  ],
  achievements: [
    "Best Teacher Award — DPS RK Puram (2022)",
    "Published 'Fun with Numbers' workbook series",
    "100% pass rate in Class 12 Board Exams (3 consecutive years)",
    "Trained 15+ students for Math Olympiad nationals",
  ],
  homeTuition: true,
  onlineClasses: true,
  paidNotes: true,
  hourlyRate: "₹800 - ₹1,500",
  subjects: ["Mathematics", "Physics"],
  grades: ["Class 6-8", "Class 9-10", "Class 11-12"],
};

const notePackages = [
  { name: "Basic Notes", price: "₹199/month", features: ["Chapter-wise notes PDF", "Practice worksheets", "Email support"], icon: FileText },
  { name: "Premium Notes", price: "₹499/month", features: ["Video explanations", "Previous year papers (solved)", "Doubt clearing sessions (2/month)", "All Basic features"], icon: Zap },
  { name: "Complete Package", price: "₹999/month", features: ["1-on-1 mentoring (4 sessions)", "Custom study plan", "Weekly tests with analysis", "All Premium features"], icon: Award },
];

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const { data: jobs = [] } = useJobs();
  const [homeTuition, setHomeTuition] = useState(sampleProfile.homeTuition);
  const [onlineClasses, setOnlineClasses] = useState(sampleProfile.onlineClasses);
  const [paidNotes, setPaidNotes] = useState(sampleProfile.paidNotes);

  const isOwnProfile = !!user; // In production, check if user.id matches profile owner

  const tabs = [
    { value: "about", icon: User, label: "About" },
    { value: "experience", icon: Briefcase, label: "Experience" },
    { value: "services", icon: Target, label: "Services" },
    { value: "notes", icon: FileText, label: "Notes & Material" },
    { value: "jobs", icon: Briefcase, label: "Find Jobs" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-blob" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="h-32 w-32 md:h-40 md:w-40 rounded-2xl gradient-primary flex items-center justify-center text-4xl md:text-5xl font-bold text-primary-foreground shadow-2xl shadow-primary/30 shrink-0">
              {sampleProfile.avatar}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg shadow-primary/30 font-semibold px-4 py-1.5 text-sm">
                  <Shield className="h-3.5 w-3.5 mr-1" /> Verified Teacher
                </Badge>
                <Badge variant="outline" className="bg-card/40 backdrop-blur-md text-foreground border-border/40 font-semibold px-3 py-1.5">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1.5" /> {sampleProfile.rating}
                </Badge>
                <Badge variant="outline" className="bg-card/40 backdrop-blur-md text-foreground border-border/40 font-semibold px-3 py-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary mr-1.5" /> {sampleProfile.reviews} reviews
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-2">{sampleProfile.name}</h1>
              <p className="text-lg text-muted-foreground font-medium mb-4">{sampleProfile.title}</p>

              <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{sampleProfile.location}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary" />{sampleProfile.experience}</span>
                <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-primary" />{sampleProfile.hourlyRate}/hr</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {sampleProfile.subjects.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-lg border-primary/20 bg-primary/5 text-primary font-medium">{s}</Badge>
                ))}
                {sampleProfile.grades.map((g) => (
                  <Badge key={g} variant="outline" className="rounded-lg border-border/40 font-medium">{g}</Badge>
                ))}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col gap-3 shrink-0">
              {isOwnProfile ? (
                <Button className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 h-11 px-6 gap-2">
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 h-11 px-6 gap-2">
                    <Send className="h-4 w-4" /> Contact Teacher
                  </Button>
                  <Button variant="outline" className="rounded-xl border-border/40 h-11 px-6 gap-2">
                    <Heart className="h-4 w-4" /> Save Profile
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="border-y border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5">
            {[
              { label: "Experience", value: sampleProfile.experience },
              { label: "Rating", value: `${sampleProfile.rating}/5` },
              { label: "Reviews", value: String(sampleProfile.reviews) },
              { label: "Students Taught", value: "500+" },
              { label: "Subjects", value: String(sampleProfile.subjects.length) },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                className={`py-5 px-4 text-center ${i < 4 ? "border-r border-border/20" : ""}`}>
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
          <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/30">
            <TabsList className="flex gap-1 h-auto bg-transparent p-0 w-full justify-start overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}
                  className="rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-semibold text-sm px-5 py-3 shrink-0">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ABOUT TAB */}
          <TabsContent value="about" className="space-y-8">
            <motion.div {...fadeUp}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><User className="h-5 w-5 text-primary" />About Me</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground leading-[1.8] text-base">{sampleProfile.bio}</p></CardContent>
                  </Card>

                  {/* Skills */}
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-secondary" />Skills & Expertise</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {sampleProfile.skills.map((skill, i) => (
                          <motion.div key={skill} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                            <Badge variant="outline" className="px-3 py-1.5 rounded-lg border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default font-medium">
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-5 w-5 text-primary" />Education</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {sampleProfile.education.map((edu, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-accent/20 border border-border/30">
                          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shrink-0">
                            <GraduationCap className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Award className="h-5 w-5 text-primary" />Achievements</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {sampleProfile.achievements.map((a, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                            className="flex items-start gap-3 p-4 rounded-xl bg-accent/20 border border-border/30 hover:border-primary/20 transition-colors">
                            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-primary/20">
                              <Award className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Sidebar */}
                <div className="space-y-6">
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Phone className="h-5 w-5 text-primary" />Contact</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-primary shrink-0" /><span>{sampleProfile.email}</span></div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-primary shrink-0" /><span>{sampleProfile.phone}</span></div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary shrink-0" /><span>{sampleProfile.location}</span></div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><Globe className="h-4 w-4 text-primary shrink-0" /><span>{sampleProfile.website}</span></div>
                    </CardContent>
                  </Card>

                  {/* Availability */}
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CheckCircle className="h-5 w-5 text-secondary" />Availability</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm"><Home className="h-4 w-4 text-primary" /><span>Home Tuition</span></div>
                        <div className="flex items-center gap-2">
                          {isOwnProfile && <Switch checked={homeTuition} onCheckedChange={setHomeTuition} />}
                          <Badge className={homeTuition ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/30"}>{homeTuition ? "Available" : "Unavailable"}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm"><Video className="h-4 w-4 text-primary" /><span>Online Classes</span></div>
                        <div className="flex items-center gap-2">
                          {isOwnProfile && <Switch checked={onlineClasses} onCheckedChange={setOnlineClasses} />}
                          <Badge className={onlineClasses ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/30"}>{onlineClasses ? "Available" : "Unavailable"}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-primary" /><span>Paid Notes</span></div>
                        <div className="flex items-center gap-2">
                          {isOwnProfile && <Switch checked={paidNotes} onCheckedChange={setPaidNotes} />}
                          <Badge className={paidNotes ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/30"}>{paidNotes ? "Available" : "Unavailable"}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* EXPERIENCE TAB */}
          <TabsContent value="experience" className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />Work Experience</h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border/30" />
              {sampleProfile.experience_list.map((exp, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="relative pl-14 pb-8 last:pb-0">
                  <div className="absolute left-2.5 top-1 h-5 w-5 rounded-full gradient-primary shadow-md shadow-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-foreground text-lg">{exp.role}</h4>
                          <p className="text-sm text-primary font-medium">{exp.school}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 rounded-lg border-border/40 text-xs">{exp.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{exp.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* SERVICES TAB */}
          <TabsContent value="services" className="space-y-8">
            <motion.div {...fadeUp}>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Home Tuition */}
                <Card className={`bg-card/60 backdrop-blur-sm border-border/30 ${homeTuition ? "ring-2 ring-green-500/20" : "opacity-60"}`}>
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-4 p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg w-fit">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Home Tuition</h3>
                    <Badge className={homeTuition ? "bg-green-500/10 text-green-500 border-green-500/20 mb-3" : "bg-muted text-muted-foreground border-border/30 mb-3"}>
                      {homeTuition ? "Available" : "Not Available"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">Personalized 1-on-1 tuition at your home. Flexible timing and customized study plans.</p>
                    <p className="text-xl font-extrabold text-gradient mb-4">{sampleProfile.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                    <Button className="w-full rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20" disabled={!homeTuition}>Book Home Tuition</Button>
                  </CardContent>
                </Card>

                {/* Online Classes */}
                <Card className={`bg-card/60 backdrop-blur-sm border-border/30 ${onlineClasses ? "ring-2 ring-green-500/20" : "opacity-60"}`}>
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-4 p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg w-fit">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Online Classes</h3>
                    <Badge className={onlineClasses ? "bg-green-500/10 text-green-500 border-green-500/20 mb-3" : "bg-muted text-muted-foreground border-border/30 mb-3"}>
                      {onlineClasses ? "Available" : "Not Available"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">Live interactive sessions via Zoom/Google Meet. Screen sharing and recorded sessions available.</p>
                    <p className="text-xl font-extrabold text-gradient mb-4">₹600 - ₹1,000<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                    <Button className="w-full rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20" disabled={!onlineClasses}>Join Online Class</Button>
                  </CardContent>
                </Card>

                {/* Paid Notes */}
                <Card className={`bg-card/60 backdrop-blur-sm border-border/30 ${paidNotes ? "ring-2 ring-green-500/20" : "opacity-60"}`}>
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-4 p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg w-fit">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Paid Notes & Material</h3>
                    <Badge className={paidNotes ? "bg-green-500/10 text-green-500 border-green-500/20 mb-3" : "bg-muted text-muted-foreground border-border/30 mb-3"}>
                      {paidNotes ? "Available" : "Not Available"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">Curated study materials, solved papers, and chapter-wise notes for exam preparation.</p>
                    <p className="text-xl font-extrabold text-gradient mb-4">₹199 - ₹999<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <Button className="w-full rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20" disabled={!paidNotes}>View Packages</Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* NOTES TAB */}
          <TabsContent value="notes" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-extrabold mb-2">Study Material <span className="text-gradient">Packages</span></h3>
              <p className="text-muted-foreground">Subscribe to get access to curated notes, worksheets, and doubt-clearing sessions</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {notePackages.map((pkg, i) => (
                <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                  <Card className={`h-full bg-card/80 backdrop-blur-sm border-border/40 hover:border-primary/30 transition-all duration-300 ${i === 1 ? "ring-2 ring-primary/20 shadow-xl" : ""}`}>
                    <CardContent className="pt-8 pb-6 text-center">
                      <div className={`mx-auto mb-4 p-3 rounded-2xl shadow-lg w-fit ${i === 0 ? "bg-gradient-to-br from-blue-500 to-cyan-500" : i === 1 ? "bg-gradient-to-br from-violet-500 to-purple-500" : "bg-gradient-to-br from-amber-500 to-orange-500"}`}>
                        <pkg.icon className="h-6 w-6 text-white" />
                      </div>
                      {i === 1 && <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg shadow-primary/30 mb-3">Most Popular</Badge>}
                      <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
                      <p className="text-2xl font-extrabold text-gradient mb-4">{pkg.price}</p>
                      <div className="space-y-3 text-left mb-6">
                        {pkg.features.map((f, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{f}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 h-11">Subscribe</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* FIND JOBS TAB */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />Recommended Jobs</h3>
                <p className="text-sm text-muted-foreground mt-1">Based on your skills and experience</p>
              </div>
              <Link to="/jobs"><Button variant="outline" className="rounded-xl border-border/40 font-semibold gap-1">View All <ChevronRight className="h-4 w-4" /></Button></Link>
            </div>
            {jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">No jobs available currently.</p>
                <Link to="/jobs"><Button className="mt-4 rounded-xl gradient-primary border-0">Browse All Jobs</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors group">
                      <CardContent className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                            <Briefcase className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <h4 className="font-bold group-hover:text-primary transition-colors">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.school_name}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="gradient-primary text-primary-foreground border-0 rounded-lg text-xs">{job.type}</Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3 w-3" />{job.salary}</span>
                            </div>
                          </div>
                        </div>
                        <Link to="/jobs">
                          <Button size="sm" className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 shrink-0">Apply</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
