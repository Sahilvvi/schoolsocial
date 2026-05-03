import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Briefcase, MapPin, Search, X, ChevronLeft, ChevronRight, Loader2, DollarSign, ArrowUpRight, Building2, Clock, Users, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useJobs, useSubmitJobApplication } from "@/hooks/useData";

const PER_PAGE = 5;
const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(10), experience: z.string().min(1) });

const jobStats = [
  { icon: Briefcase, value: "100+", label: "Open Positions" },
  { icon: Building2, value: "50+", label: "Schools Hiring" },
  { icon: Users, value: "500+", label: "Hired Teachers" },
  { icon: TrendingUp, value: "95%", label: "Satisfaction Rate" },
];

export default function JobsPage() {
  const { data: jobs = [], isLoading } = useJobs();
  const submitApp = useSubmitJobApplication();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", phone: "", experience: "" } });

  const filtered = useMemo(() => jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.school_name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || j.type === typeFilter;
    return matchSearch && matchType;
  }), [jobs, search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const types = [...new Set(jobs.map((j) => j.type))];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.12)_0%,_transparent_60%)]" />
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-primary/6 rounded-full blur-[100px] animate-blob" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Briefcase className="h-3.5 w-3.5" /> Career Opportunities
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold mb-5">
            Teaching <span className="text-gradient">Careers</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join leading schools and shape the future of education
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
              <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search jobs or schools..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-14 h-14 bg-transparent border-0 shadow-none focus-visible:ring-0" />
            </div>
            {search && <button onClick={() => setSearch("")} className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"><X className="h-3 w-3" />Clear</button>}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-2xl overflow-hidden border border-border/30 bg-card/40 backdrop-blur-sm">
          {jobStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
              className={`py-5 px-4 text-center ${i < 2 ? "border-r border-border/20" : ""} ${i === 2 ? "md:border-r md:border-border/20" : ""} ${i < 2 ? "border-b border-border/20 md:border-b-0" : ""}`}>
              <s.icon className="h-5 w-5 mx-auto mb-2 text-primary opacity-60" />
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground">Open Positions</h2>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} vacancies available</p>
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-44 rounded-xl bg-card/60 border-border/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="flex flex-col items-center py-20 gap-3"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="text-sm text-muted-foreground">Loading jobs...</p></div> : (
          <div className="space-y-4">
            {paginated.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all duration-300 group">
                  <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                          <Building2 className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                          <p className="text-sm text-muted-foreground font-medium mt-0.5">{job.school_name}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            <Badge className="gradient-primary text-primary-foreground border-0 rounded-lg text-xs">{job.type}</Badge>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3 text-primary" />{job.location}</span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground"><DollarSign className="h-3 w-3 text-secondary" />{job.salary}</span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{job.posted_date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed sm:pl-[4.5rem]">{job.description}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild><Button className="shrink-0 rounded-xl shadow-lg shadow-primary/20 gradient-primary border-0 h-12 px-6">Apply <ArrowUpRight className="h-4 w-4 ml-1" /></Button></DialogTrigger>
                      <DialogContent className="rounded-2xl bg-card border-border/30">
                        <DialogHeader><DialogTitle>Apply for {job.title}</DialogTitle></DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(async (data) => {
                            try { await submitApp.mutateAsync({ job_id: job.id, name: data.name, email: data.email, phone: data.phone, experience: data.experience }); toast.success("Application submitted! 🎉"); form.reset(); } catch { toast.error("Failed to submit"); }
                          })} className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabel>Experience</FormLabel><FormControl><Input className="rounded-xl bg-accent/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <Button type="submit" className="w-full rounded-xl gradient-primary border-0 h-12" disabled={submitApp.isPending}>{submitApp.isPending ? "Submitting..." : "Submit Application"}</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        {filtered.length === 0 && !isLoading && <div className="text-center py-20"><Briefcase className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" /><p className="text-muted-foreground">No vacancies found.</p></div>}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-xl border-border/30"><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl ${page === i + 1 ? "shadow-lg shadow-primary/30" : "border-border/30"}`}>{i + 1}</Button>)}
            <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border-border/30"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
