import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, BookOpen, IndianRupee, Clock, User, Mail, Phone, Send, Loader2, X, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

function useTuitionEnquiries() {
  return useQuery({
    queryKey: ["tuition_enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tuition_enquiries").select("*").eq("status", "open").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

function useSubmitEnquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (enquiry: { parent_name: string; phone: string; email: string; student_class: string; subject: string; area: string; budget: string; message: string }) => {
      const { data, error } = await supabase.from("tuition_enquiries").insert(enquiry).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tuition_enquiries"] }),
  });
}

const classes = ["Nursery", "LKG", "UKG", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];

export default function TuitionEnquiryPage() {
  const { user } = useAuth();
  const { data: enquiries = [], isLoading } = useTuitionEnquiries();
  const submitEnquiry = useSubmitEnquiry();
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [subject, setSubject] = useState("");
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  const subjects = [...new Set(enquiries.map(e => e.subject).filter(Boolean))];

  const filtered = useMemo(() => enquiries.filter(e => {
    const matchSearch = e.parent_name.toLowerCase().includes(search.toLowerCase()) || e.area.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || e.subject === subjectFilter;
    return matchSearch && matchSubject;
  }), [enquiries, search, subjectFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !phone || !studentClass || !subject) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await submitEnquiry.mutateAsync({ parent_name: parentName, phone, email, student_class: studentClass, subject, area, budget, message });
      toast.success("Tuition requirement posted successfully! 🎉");
      setFormOpen(false);
      setParentName(""); setPhone(""); setEmail(""); setStudentClass(""); setSubject(""); setArea(""); setBudget(""); setMessage("");
    } catch {
      toast.error("Failed to post requirement");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(174_62%_47%/0.1)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary mb-6">
            <MessageSquare className="h-3.5 w-3.5" /> Home Tuition
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold mb-5">
            Find <span className="text-gradient">Home Tutors</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Post your tuition requirement and get matched with qualified tutors in your area
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 font-bold px-8 h-12">
                  <Send className="h-4 w-4 mr-2" /> Post Tuition Requirement
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl bg-card border-border/30 max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post Tuition Requirement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Parent Name *</Label>
                      <Input value={parentName} onChange={e => setParentName(e.target.value)} required className="rounded-xl bg-accent/20 border-border/30" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Phone *</Label>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} required className="rounded-xl bg-accent/20 border-border/30" placeholder="Phone number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Email</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl bg-accent/20 border-border/30" placeholder="Optional" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Class *</Label>
                      <Select value={studentClass} onValueChange={setStudentClass}>
                        <SelectTrigger className="rounded-xl bg-accent/20 border-border/30"><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>
                          {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Subject *</Label>
                      <Input value={subject} onChange={e => setSubject(e.target.value)} required className="rounded-xl bg-accent/20 border-border/30" placeholder="e.g. All Subjects" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Area / Location</Label>
                      <Input value={area} onChange={e => setArea(e.target.value)} className="rounded-xl bg-accent/20 border-border/30" placeholder="e.g. New Delhi" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Budget (per month)</Label>
                      <Input value={budget} onChange={e => setBudget(e.target.value)} className="rounded-xl bg-accent/20 border-border/30" placeholder="e.g. ₹5,000 - ₹8,000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Message</Label>
                    <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="rounded-xl bg-accent/20 border-border/30" placeholder="Any specific requirements..." />
                  </div>
                  <Button type="submit" className="w-full rounded-xl gradient-primary border-0 h-12 font-semibold" disabled={submitEnquiry.isPending}>
                    {submitEnquiry.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Posting...</> : "Post Requirement"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by area, subject, or name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-11 h-12 rounded-xl bg-card/80 border-border/40" />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-48 rounded-xl bg-card/80 border-border/40 h-12"><SelectValue placeholder="All Subjects" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Open Requirements</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} enquiries</p>
        </div>

        {!user && (
          <div className="mb-8 p-4 rounded-2xl bg-accent/30 border border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              <a href="/auth" className="text-primary font-semibold hover:underline">Sign in</a> to view contact details and apply for tuition leads.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-3"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">No tuition requirements posted yet.</p>
            <Button className="mt-4 rounded-xl gradient-primary border-0" onClick={() => setFormOpen(true)}>Post First Requirement</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((enq, i) => (
              <motion.div key={enq.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full bg-card/80 border-border/40 hover:border-primary/20 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="rounded-lg gradient-primary text-primary-foreground border-0 text-xs">{enq.subject}</Badge>
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">{enq.status}</Badge>
                    </div>
                    <h3 className="font-bold text-base mb-3">
                      Tutor Required for {enq.subject} — {enq.student_class}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-primary" /> Posted by: {enq.parent_name}</div>
                      {enq.area && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> {enq.area}</div>}
                      {enq.budget && <div className="flex items-center gap-2"><IndianRupee className="h-3.5 w-3.5 text-primary" /> Budget: {enq.budget}</div>}
                      <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-primary" /> Class: {enq.student_class}</div>
                      <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" /> {new Date(enq.created_at).toLocaleDateString()}</div>
                    </div>
                    {enq.message && <p className="text-xs text-muted-foreground/70 line-clamp-2 mb-4">{enq.message}</p>}
                    {user ? (
                      <div className="space-y-2 pt-3 border-t border-border/30">
                        <div className="flex items-center gap-2 text-sm"><Phone className="h-3.5 w-3.5 text-secondary" /> {enq.phone}</div>
                        {enq.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-3.5 w-3.5 text-secondary" /> {enq.email}</div>}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center pt-3 border-t border-border/30">Sign in to view contact details</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
