import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList, Heart, BookOpen, Loader2, MapPin, Star, Trash2, ExternalLink,
  Baby, GraduationCap, Calendar, FileText, Bell, School, TrendingUp, Clock,
  CheckCircle, AlertCircle, IndianRupee
} from "lucide-react";
import { toast } from "sonner";
import {
  isDemoEmail, DUMMY_ADMISSIONS, DUMMY_TUTOR_BOOKINGS, DUMMY_SCHOOLS,
  DUMMY_NOTIFICATIONS, DUMMY_HOMEWORK, DUMMY_FEE_RECORDS
} from "@/data/dummyData";

/* ── Dummy data shaped for the parent view ──────────────── */
const PARENT_DUMMY_ADMISSIONS = DUMMY_ADMISSIONS.filter(a =>
  a.parent_name === "Rajesh Kumar" || a.parent_name === "Vikram Patel"
).slice(0, 4).map(a => ({
  ...a,
  schools: DUMMY_SCHOOLS.find(s => s.id === a.school_id) || { name: "Delhi Public School", slug: "delhi-public-school" },
}));

const PARENT_DUMMY_BOOKINGS = DUMMY_TUTOR_BOOKINGS.filter(b =>
  b.name === "Rajesh Kumar" || b.name === "Vikram Patel"
).map(b => ({
  ...b,
  tutors: { name: b.tutor_id === "tutor-001" ? "Priya Sharma" : "Dr. Amit Verma", subject: b.tutor_id === "tutor-001" ? "Mathematics" : "Physics" },
}));

const PARENT_DUMMY_SAVED = DUMMY_SCHOOLS.slice(0, 3).map((s, i) => ({
  id: `saved-${i + 1}`,
  user_id: "demo-parent-001",
  schools: s,
  created_at: new Date().toISOString(),
}));

const PARENT_NOTIFICATIONS = DUMMY_NOTIFICATIONS.filter(n => n.user_id === "demo-parent-001");
const PARENT_HOMEWORK = DUMMY_HOMEWORK.slice(0, 3);
const PARENT_FEES = DUMMY_FEE_RECORDS.filter(f => f.person_name === "Arjun Patel" || f.person_name === "Ishaan Kumar");

function useMyAdmissions(email: string | undefined, isDemo: boolean) {
  return useQuery({
    queryKey: ["my-admissions", email],
    queryFn: async () => {
      if (isDemo) return PARENT_DUMMY_ADMISSIONS;
      const { data, error } = await supabase
        .from("admissions")
        .select("*, schools(name, slug)")
        .eq("email", email!)
        .order("created_at", { ascending: false });
      if (error) return PARENT_DUMMY_ADMISSIONS;
      return data && data.length > 0 ? data : PARENT_DUMMY_ADMISSIONS;
    },
    enabled: !!email,
  });
}

function useMyBookings(email: string | undefined, isDemo: boolean) {
  return useQuery({
    queryKey: ["my-bookings", email],
    queryFn: async () => {
      if (isDemo) return PARENT_DUMMY_BOOKINGS;
      const { data, error } = await supabase
        .from("tutor_bookings")
        .select("*, tutors(name, subject)")
        .eq("email", email!)
        .order("created_at", { ascending: false });
      if (error) return PARENT_DUMMY_BOOKINGS;
      return data && data.length > 0 ? data : PARENT_DUMMY_BOOKINGS;
    },
    enabled: !!email,
  });
}

function useSavedSchools(userId: string | undefined, isDemo: boolean) {
  return useQuery({
    queryKey: ["saved-schools", userId],
    queryFn: async () => {
      if (isDemo) return PARENT_DUMMY_SAVED;
      const { data, error } = await supabase
        .from("saved_schools")
        .select("*, schools(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) return PARENT_DUMMY_SAVED;
      return data && data.length > 0 ? data : PARENT_DUMMY_SAVED;
    },
    enabled: !!userId,
  });
}

function useUnsaveSchool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_schools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-schools"] });
      toast.success("School removed from saved list");
    },
  });
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  overdue: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ParentDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const email = user.email;
  const isDemo = isDemoEmail(email || "");
  const { data: admissions = [], isLoading: aLoading } = useMyAdmissions(email, isDemo);
  const { data: bookings = [], isLoading: bLoading } = useMyBookings(email, isDemo);
  const { data: saved = [], isLoading: sLoading } = useSavedSchools(user.id, isDemo);
  const unsave = useUnsaveSchool();

  const pendingAdmissions = admissions.filter((a: any) => a.status === "pending").length;
  const approvedAdmissions = admissions.filter((a: any) => a.status === "approved").length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-10 md:pt-32 md:pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-blob" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-xl shadow-primary/30">
                {(user.user_metadata?.full_name || "P")[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold">
                  Welcome, <span className="text-gradient">{user.user_metadata?.full_name || email?.split("@")[0]}</span>
                </h1>
                <p className="text-muted-foreground mt-1">Track admissions, saved schools, and tutor bookings — all in one place</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: ClipboardList, label: "Admissions", count: admissions.length, sub: `${pendingAdmissions} pending`, color: "from-blue-500 to-cyan-500" },
            { icon: Heart, label: "Saved Schools", count: saved.length, sub: "schools saved", color: "from-rose-500 to-pink-500" },
            { icon: BookOpen, label: "Tutor Bookings", count: bookings.length, sub: `${bookings.filter((b: any) => b.status === "confirmed").length} confirmed`, color: "from-violet-500 to-purple-500" },
            { icon: Bell, label: "Notifications", count: PARENT_NOTIFICATIONS.filter(n => !n.is_read).length, sub: "unread", color: "from-amber-500 to-orange-500" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shrink-0`}>
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold">{s.count}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground/60">{s.sub}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="admissions">
          <TabsList className="mb-6 flex gap-1 h-auto bg-transparent p-0 flex-wrap">
            {[
              { value: "admissions", icon: ClipboardList, label: "Admissions" },
              { value: "mychild", icon: Baby, label: "My Child" },
              { value: "saved", icon: Heart, label: "Saved Schools" },
              { value: "bookings", icon: BookOpen, label: "Tutor Bookings" },
              { value: "notifications", icon: Bell, label: "Notifications" },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-semibold text-sm px-4 py-2.5">
                <tab.icon className="h-4 w-4" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ADMISSIONS TAB */}
          <TabsContent value="admissions">
            {aLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> : admissions.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No admissions yet. <Link to="/schools" className="text-primary hover:underline">Browse schools</Link></p>
              </div>
            ) : (
              <div className="space-y-4">
                {admissions.map((a: any, i: number) => (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground shadow-md">
                              {a.student_name?.[0]?.toUpperCase() || "S"}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{a.student_name} — Grade {a.grade}</p>
                              <p className="text-sm text-muted-foreground">{a.schools?.name || "School"}</p>
                            </div>
                          </div>
                          <Badge className={statusColor[a.status] || statusColor.pending}>{a.status}</Badge>
                        </div>
                        {/* Timeline */}
                        <div className="flex items-center gap-0 mt-2">
                          {[
                            { label: "Submitted", done: true },
                            { label: "Under Review", done: a.status !== "pending" },
                            { label: a.status === "rejected" ? "Rejected" : "Approved", done: a.status === "approved" || a.status === "rejected" },
                          ].map((step, si) => (
                            <div key={si} className="flex items-center flex-1">
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                step.done ? (a.status === "rejected" && si === 2 ? "bg-destructive/10 text-destructive" : "gradient-primary text-primary-foreground shadow-md shadow-primary/20") : "bg-muted text-muted-foreground"
                              }`}>
                                {step.done ? <CheckCircle className="h-3.5 w-3.5" /> : si + 1}
                              </div>
                              {si < 2 && <div className={`h-0.5 flex-1 mx-1.5 rounded-full ${step.done ? "bg-primary/40" : "bg-border"}`} />}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1.5">
                          {["Submitted", "Reviewing", a.status === "rejected" ? "Rejected" : "Approved"].map((l) => (
                            <span key={l} className="text-[10px] text-muted-foreground">{l}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/20">
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(a.created_at).toLocaleDateString()}</span>
                          {a.schools?.slug && (
                            <Link to={`/school/${a.schools.slug}`}>
                              <Button variant="outline" size="sm" className="rounded-lg text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1 h-7">
                                <ExternalLink className="h-3 w-3" /> View School
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* MY CHILD TAB */}
          <TabsContent value="mychild">
            <div className="space-y-6">
              {/* Child profiles from admissions */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Baby className="h-5 w-5 text-primary" />My Children</CardTitle>
                </CardHeader>
                <CardContent>
                  {admissions.length > 0 ? (
                    <div className="space-y-4">
                      {admissions.map((a: any) => (
                        <div key={a.id} className="p-4 rounded-xl bg-accent/20 border border-border/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                                {a.student_name?.[0]?.toUpperCase() || "S"}
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground text-lg">{a.student_name}</h4>
                                <p className="text-sm text-muted-foreground">Grade {a.grade} • {a.schools?.name || "School"}</p>
                              </div>
                            </div>
                            <Badge className={statusColor[a.status] || statusColor.pending}>{a.status}</Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                              <span className="truncate">Grade {a.grade}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <School className="h-4 w-4 text-primary shrink-0" />
                              <span className="truncate">{a.schools?.name || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 text-secondary shrink-0" />
                              <span>{new Date(a.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <TrendingUp className="h-4 w-4 text-green-500 shrink-0" />
                              <span className="capitalize">{a.status}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                            {a.schools?.slug && (
                              <Link to={`/school/${a.schools.slug}`}>
                                <Button variant="outline" size="sm" className="rounded-lg text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1">
                                  <ExternalLink className="h-3 w-3" /> View School
                                </Button>
                              </Link>
                            )}
                            <Link to="/tutors">
                              <Button variant="outline" size="sm" className="rounded-lg text-xs border-border/30 gap-1">
                                <BookOpen className="h-3 w-3" /> Find Tuition
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Baby className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="mb-2">No child data available yet.</p>
                      <Link to="/schools"><Button className="mt-4 rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20">Browse Schools</Button></Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Education Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Homework */}
                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      Homework & Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {PARENT_HOMEWORK.map(hw => (
                      <div key={hw.id} className="p-3 rounded-lg bg-accent/20 border border-border/20">
                        <p className="font-semibold text-sm text-foreground">{hw.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{hw.subject} • {hw.class_name}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(hw.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Fee Records */}
                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md">
                        <IndianRupee className="h-4 w-4 text-white" />
                      </div>
                      Fee Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {PARENT_FEES.slice(0, 3).map(fee => (
                      <div key={fee.id} className="p-3 rounded-lg bg-accent/20 border border-border/20 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{fee.fee_type}</p>
                          <p className="text-xs text-muted-foreground">{fee.person_name} • ₹{fee.amount.toLocaleString()}</p>
                        </div>
                        <Badge className={statusColor[fee.status] || "bg-muted text-muted-foreground"} >{fee.status}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-md">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                      Recent Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {PARENT_NOTIFICATIONS.slice(0, 3).map(notif => (
                      <div key={notif.id} className={`p-3 rounded-lg border ${!notif.is_read ? "bg-primary/5 border-primary/20" : "bg-accent/20 border-border/20"}`}>
                        <div className="flex items-center gap-2">
                          {!notif.is_read && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                          <p className="font-semibold text-sm text-foreground">{notif.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SAVED SCHOOLS TAB */}
          <TabsContent value="saved">
            {sLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> : saved.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No saved schools. <Link to="/schools" className="text-primary hover:underline">Browse schools</Link></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {saved.map((s: any, i: number) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                      <CardContent className="p-4 flex items-center gap-4">
                        <img src={s.schools?.banner} alt="" className="h-20 w-20 rounded-xl object-cover shadow-md"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80"; }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-foreground">{s.schools?.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3 text-primary" />{s.schools?.location}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-xs font-semibold">{Number(s.schools?.rating).toFixed(1)}</span>
                            <Badge variant="outline" className="text-[10px] border-border/30 ml-1">{s.schools?.board}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Link to={`/school/${s.schools?.slug}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-primary/30 text-primary hover:bg-primary/10"><ExternalLink className="h-3.5 w-3.5" /></Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => unsave.mutate(s.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TUTOR BOOKINGS TAB */}
          <TabsContent value="bookings">
            {bLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> : bookings.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No tutor bookings yet. <Link to="/tutors" className="text-primary hover:underline">Find tutors</Link></p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b: any, i: number) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shrink-0">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{b.tutors?.name || "Tutor"}</p>
                            <p className="text-sm text-muted-foreground">{b.tutors?.subject}</p>
                            <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(b.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge className={statusColor[b.status] || statusColor.pending}>{b.status}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications">
            <div className="space-y-3">
              {PARENT_NOTIFICATIONS.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No notifications yet.</p>
                </div>
              ) : (
                PARENT_NOTIFICATIONS.map((notif, i) => (
                  <motion.div key={notif.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className={`backdrop-blur-sm border-border/30 ${!notif.is_read ? "bg-primary/5 border-primary/20" : "bg-card/60"}`}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-md shrink-0 ${
                          notif.type === "admission" ? "bg-gradient-to-br from-green-500 to-emerald-500" :
                          notif.type === "fee" ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                          notif.type === "homework" ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                          "bg-gradient-to-br from-violet-500 to-purple-500"
                        }`}>
                          {notif.type === "admission" ? <ClipboardList className="h-5 w-5 text-white" /> :
                           notif.type === "fee" ? <IndianRupee className="h-5 w-5 text-white" /> :
                           notif.type === "homework" ? <FileText className="h-5 w-5 text-white" /> :
                           <Bell className="h-5 w-5 text-white" />}
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
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
