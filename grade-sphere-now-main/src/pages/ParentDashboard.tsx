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
import { ClipboardList, Heart, BookOpen, Loader2, MapPin, Star, Trash2, ExternalLink, Baby, GraduationCap, Calendar, FileText, Bell } from "lucide-react";
import { toast } from "sonner";

function useMyAdmissions(email: string | undefined) {
  return useQuery({
    queryKey: ["my-admissions", email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admissions")
        .select("*, schools(name, slug)")
        .eq("email", email!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!email,
  });
}

function useMyBookings(email: string | undefined) {
  return useQuery({
    queryKey: ["my-bookings", email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutor_bookings")
        .select("*, tutors(name, subject)")
        .eq("email", email!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!email,
  });
}

function useSavedSchools(userId: string | undefined) {
  return useQuery({
    queryKey: ["saved-schools", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_schools")
        .select("*, schools(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
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
};

export default function ParentDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const email = user.email;
  const { data: admissions = [], isLoading: aLoading } = useMyAdmissions(email);
  const { data: bookings = [], isLoading: bLoading } = useMyBookings(email);
  const { data: saved = [], isLoading: sLoading } = useSavedSchools(user.id);
  const unsave = useUnsaveSchool();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome, <span className="text-gradient">{user.user_metadata?.full_name || email?.split("@")[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-2">Track your admissions, saved schools, and tutor bookings</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: ClipboardList, label: "Admissions", count: admissions.length, color: "from-blue-500 to-cyan-500" },
            { icon: Heart, label: "Saved Schools", count: saved.length, color: "from-rose-500 to-pink-500" },
            { icon: BookOpen, label: "Bookings", count: bookings.length, color: "from-violet-500 to-purple-500" },
          ].map((s) => (
            <Card key={s.label} className="bg-card/60 backdrop-blur-sm border-border/30">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold">{s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="admissions">
          <TabsList className="mb-6">
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="mychild">My Child</TabsTrigger>
            <TabsTrigger value="saved">Saved Schools</TabsTrigger>
            <TabsTrigger value="bookings">Tutor Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="admissions">
            {aLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> : admissions.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No admissions yet. <Link to="/schools" className="text-primary hover:underline">Browse schools</Link></p>
              </div>
            ) : (
              <div className="space-y-3">
                {admissions.map((a: any) => (
                  <Card key={a.id} className="bg-card/60 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold">{a.student_name} — Grade {a.grade}</p>
                          <p className="text-sm text-muted-foreground">{a.schools?.name || "School"}</p>
                        </div>
                        <Badge className={statusColor[a.status] || statusColor.pending}>{a.status}</Badge>
                      </div>
                      {/* Timeline */}
                      <div className="flex items-center gap-0 mt-2">
                        {[
                          { label: "Submitted", done: true },
                          { label: "Under Review", done: a.status !== "pending" },
                          { label: a.status === "rejected" ? "Rejected" : "Approved", done: a.status === "approved" || a.status === "rejected" },
                        ].map((step, i) => (
                          <div key={i} className="flex items-center flex-1">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              step.done ? (a.status === "rejected" && i === 2 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary") : "bg-muted text-muted-foreground"
                            }`}>
                              {step.done ? "✓" : i + 1}
                            </div>
                            {i < 2 && <div className={`h-0.5 flex-1 mx-1 ${step.done ? "bg-primary/30" : "bg-border"}`} />}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        {["Submitted", "Reviewing", a.status === "rejected" ? "Rejected" : "Approved"].map((l) => (
                          <span key={l} className="text-[10px] text-muted-foreground">{l}</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mychild">
            <div className="space-y-6">
              {/* My Child Info Card */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Baby className="h-5 w-5 text-primary" />My Child's Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  {admissions.length > 0 ? (
                    <div className="space-y-4">
                      {admissions.map((a: any) => (
                        <div key={a.id} className="p-4 rounded-xl bg-accent/20 border border-border/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground shadow-md">
                                {a.student_name?.[0]?.toUpperCase() || "S"}
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground">{a.student_name}</h4>
                                <p className="text-xs text-muted-foreground">Grade {a.grade}</p>
                              </div>
                            </div>
                            <Badge className={statusColor[a.status] || statusColor.pending}>{a.status}</Badge>
                          </div>

                          {/* School Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                              <span>School: <span className="font-medium text-foreground">{a.schools?.name || "—"}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 text-secondary shrink-0" />
                              <span>Applied: <span className="font-medium text-foreground">{new Date(a.created_at).toLocaleDateString()}</span></span>
                            </div>
                          </div>

                          {/* Quick Actions */}
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
                      <p className="text-sm">Apply to a school to start tracking your child's education journey.</p>
                      <Link to="/schools"><Button className="mt-4 rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20">Browse Schools</Button></Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Education Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Homework & Notes</h4>
                        <p className="text-xs text-muted-foreground">Study materials from school</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground bg-accent/20 rounded-lg p-3 border border-border/20">
                      Homework tracking and study material sharing will be available once your school activates the ERP module.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <ClipboardList className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Exam & Test Details</h4>
                        <p className="text-xs text-muted-foreground">Upcoming exams and results</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground bg-accent/20 rounded-lg p-3 border border-border/20">
                      Exam schedules and test results will appear here once the school enables academic tracking.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Bell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">School Notifications</h4>
                        <p className="text-xs text-muted-foreground">Announcements & updates</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground bg-accent/20 rounded-lg p-3 border border-border/20">
                      Follow your school's page to receive announcements, events, and important updates.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            {sLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> : saved.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No saved schools. <Link to="/schools" className="text-primary hover:underline">Browse schools</Link></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {saved.map((s: any) => (
                  <Card key={s.id} className="bg-card/60 border-border/30">
                    <CardContent className="p-4 flex items-center gap-4">
                      <img src={s.schools?.banner} alt="" className="h-16 w-16 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{s.schools?.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{s.schools?.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-xs font-semibold">{Number(s.schools?.rating).toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Link to={`/school/${s.schools?.slug}`}>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg"><ExternalLink className="h-3.5 w-3.5" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => unsave.mutate(s.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            {bLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> : bookings.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No tutor bookings yet. <Link to="/tutors" className="text-primary hover:underline">Find tutors</Link></p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b: any) => (
                  <Card key={b.id} className="bg-card/60 border-border/30">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold">{b.tutors?.name || "Tutor"}</p>
                        <p className="text-sm text-muted-foreground">{b.tutors?.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(b.created_at).toLocaleDateString()}</p>
                      </div>
                      <Badge className={statusColor[b.status] || statusColor.pending}>{b.status}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
