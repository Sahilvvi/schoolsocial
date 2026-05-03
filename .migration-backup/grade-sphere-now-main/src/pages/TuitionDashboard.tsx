import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, BookOpen, Loader2, TrendingUp, Clock, IndianRupee,
  Calendar, MessageSquare, Star, MapPin, GraduationCap, BarChart3,
  CheckCircle, AlertCircle, Phone, Mail, Building2, Briefcase,
  Target, Zap, Award, ChevronRight, Bell
} from "lucide-react";
import {
  DUMMY_BATCHES, DUMMY_TUITION_ENQUIRIES, DUMMY_TUTOR_BOOKINGS,
  DUMMY_TUTORS, DUMMY_NOTIFICATIONS
} from "@/data/dummyData";

/* ── Tuition center dummy data ────────────────────────── */
const myBatches = DUMMY_BATCHES;
const myEnquiries = DUMMY_TUITION_ENQUIRIES;
const myBookings = DUMMY_TUTOR_BOOKINGS;
const myTutors = DUMMY_TUTORS.slice(0, 4);
const notifications = DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-tuition-001").length > 0
  ? DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-tuition-001")
  : [
    { id: "tn-1", user_id: "demo-tuition-001", title: "New Enquiry Received", message: "Rajesh Kumar is looking for Mathematics tuition in Noida Sector 62.", type: "enquiry", link: "#", is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "tn-2", user_id: "demo-tuition-001", title: "Batch Almost Full", message: "JEE Maths Batch A has 12/15 students. Consider opening a new batch.", type: "batch", link: "#", is_read: false, created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: "tn-3", user_id: "demo-tuition-001", title: "New Review", message: "A parent left a 5-star review for Priya Sharma's Maths Batch.", type: "review", link: "#", is_read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
    { id: "tn-4", user_id: "demo-tuition-001", title: "Payment Received", message: "Fee payment of ₹8,000 received from Meena Singh for NEET Physics batch.", type: "payment", link: "#", is_read: true, created_at: new Date(Date.now() - 345600000).toISOString() },
  ];

const totalStudents = myBatches.reduce((s, b) => s + b.current_students, 0);
const totalRevenue = myBatches.reduce((s, b) => s + b.current_students * b.fee_per_month, 0);
const avgOccupancy = Math.round(myBatches.reduce((s, b) => s + (b.current_students / b.max_students) * 100, 0) / myBatches.length);

const statusColor: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  converted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function TuitionDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-10 md:pt-32 md:pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-secondary/5 rounded-full blur-[100px] animate-blob" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold">
                  <span className="text-gradient">Tuition Center</span> Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">Manage your batches, enquiries, and tutors — all in one place</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Students", value: totalStudents, sub: "across all batches", color: "from-blue-500 to-cyan-500" },
            { icon: BookOpen, label: "Active Batches", value: myBatches.filter(b => b.is_active).length, sub: `${myBatches.length} total`, color: "from-violet-500 to-purple-500" },
            { icon: IndianRupee, label: "Monthly Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: "estimated", color: "from-emerald-500 to-green-500" },
            { icon: TrendingUp, label: "Avg Occupancy", value: `${avgOccupancy}%`, sub: "batch fill rate", color: "from-amber-500 to-orange-500" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shrink-0`}>
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground/60">{s.sub}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="batches">
          <TabsList className="mb-6 flex gap-1 h-auto bg-transparent p-0 flex-wrap">
            {[
              { value: "batches", icon: BookOpen, label: "My Batches" },
              { value: "enquiries", icon: MessageSquare, label: "Enquiries" },
              { value: "tutors", icon: Users, label: "Our Tutors" },
              { value: "bookings", icon: Calendar, label: "Bookings" },
              { value: "notifications", icon: Bell, label: "Notifications" },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-semibold text-sm px-4 py-2.5">
                <tab.icon className="h-4 w-4" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* BATCHES TAB */}
          <TabsContent value="batches">
            <div className="space-y-4">
              {myBatches.map((batch, i) => (
                <motion.div key={batch.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                            <BookOpen className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-foreground">{batch.batch_name}</h3>
                            <p className="text-sm text-muted-foreground">{batch.subject}</p>
                          </div>
                        </div>
                        <Badge className={batch.is_active ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground"}>
                          {batch.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          <span>{batch.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 text-primary shrink-0" />
                          <span>{batch.current_students}/{batch.max_students} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <IndianRupee className="h-4 w-4 text-primary shrink-0" />
                          <span>₹{batch.fee_per_month.toLocaleString()}/month</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{Math.round((batch.current_students / batch.max_students) * 100)}% full</span>
                        </div>
                      </div>

                      {/* Occupancy bar */}
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div
                          className="h-2 rounded-full gradient-primary transition-all"
                          style={{ width: `${Math.round((batch.current_students / batch.max_students) * 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ENQUIRIES TAB */}
          <TabsContent value="enquiries">
            <div className="space-y-4">
              {myEnquiries.map((enq, i) => (
                <motion.div key={enq.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                            <MessageSquare className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{enq.parent_name}</h4>
                            <p className="text-sm text-muted-foreground">{enq.subject} • Class {enq.student_class}</p>
                          </div>
                        </div>
                        <Badge className={statusColor[enq.status] || statusColor.new}>{enq.status}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 bg-accent/20 rounded-lg p-3 border border-border/20">{enq.message}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-primary" />{enq.phone}</span>
                        <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-primary" />{enq.email}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary" />{enq.area}</span>
                        <span className="flex items-center gap-1.5"><IndianRupee className="h-3 w-3 text-primary" />{enq.budget}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
                        <Button size="sm" className="rounded-lg gradient-primary border-0 shadow-md shadow-primary/20 text-xs h-8 gap-1">
                          <Phone className="h-3 w-3" /> Contact
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg border-border/30 text-xs h-8 gap-1">
                          <CheckCircle className="h-3 w-3" /> Mark Contacted
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* TUTORS TAB */}
          <TabsContent value="tutors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTutors.map((tutor, i) => (
                <motion.div key={tutor.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-xl overflow-hidden border border-border/30 shrink-0">
                          <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"; }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground text-lg">{tutor.name}</h4>
                          <p className="text-sm text-muted-foreground">{tutor.subject}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-primary text-primary" /> {Number(tutor.rating).toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" /> {tutor.experience}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {tutor.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">In-Person & Online</Badge>
                            <span className="text-xs font-semibold text-gradient">{tutor.hourly_rate}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {myBookings.map((booking, i) => (
                <motion.div key={booking.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shrink-0">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{booking.name}</p>
                          <p className="text-sm text-muted-foreground">{booking.message}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {booking.email} • <Clock className="h-3 w-3" /> {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={statusColor[booking.status] || statusColor.pending}>{booking.status}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications">
            <div className="space-y-3">
              {notifications.map((notif, i) => (
                <motion.div key={notif.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className={`backdrop-blur-sm border-border/30 ${!notif.is_read ? "bg-primary/5 border-primary/20" : "bg-card/60"}`}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-md shrink-0 ${
                        notif.type === "enquiry" ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                        notif.type === "batch" ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                        notif.type === "review" ? "bg-gradient-to-br from-violet-500 to-purple-500" :
                        "bg-gradient-to-br from-emerald-500 to-green-500"
                      }`}>
                        {notif.type === "enquiry" ? <MessageSquare className="h-5 w-5 text-white" /> :
                         notif.type === "batch" ? <BookOpen className="h-5 w-5 text-white" /> :
                         notif.type === "review" ? <Star className="h-5 w-5 text-white" /> :
                         <IndianRupee className="h-5 w-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!notif.is_read && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                          <p className="font-bold text-sm text-foreground">{notif.title}</p>
                          <span className="text-[10px] text-muted-foreground ml-auto">{new Date(notif.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
