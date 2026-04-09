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
import { ClipboardList, Heart, BookOpen, Loader2, MapPin, Star, Trash2, ExternalLink } from "lucide-react";
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
