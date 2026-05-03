import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Plus, Trash2, Edit, MapPin, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { DUMMY_JOBS, DUMMY_JOB_APPLICATIONS } from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

export default function SPJobs() {
  const { school } = useOutletContext<any>();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", location: "", salary: "", type: "Full-time" });

  const queryKey = ["sp-jobs", school.id];

  const { data: jobs = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (isDemoUserId(user?.id)) {
        const stored = getDemoData<any[] | null>("sp-jobs", null);
        if (stored) return stored;
        const fallback = DUMMY_JOBS.filter((j) => j.school_id === school.id);
        setDemoData("sp-jobs", fallback);
        return fallback;
      }
      const { data } = await supabase.from("jobs").select("*").eq("school_id", school.id).order("posted_date", { ascending: false });
      if (data && data.length > 0) return data;
      return DUMMY_JOBS.filter((j) => j.school_id === school.id);
    },
  });

  // Fetch applications for each job
  const jobIds = jobs.map(j => j.id);
  const { data: applications = [] } = useQuery({
    queryKey: ["sp-job-apps", jobIds],
    queryFn: async () => {
      if (!jobIds.length) return [];
      const { data } = await supabase.from("job_applications").select("*").in("job_id", jobIds).order("created_at", { ascending: false });
      if (data && data.length > 0) return data;
      return DUMMY_JOB_APPLICATIONS.filter((a) => jobIds.includes(a.job_id));
    },
    enabled: jobIds.length > 0,
  });

  const createJob = useMutation({
    mutationFn: async (job: any) => {
      const payload = { ...job, school_id: school.id, school_name: school.name, posted_date: new Date().toISOString().slice(0, 10) };
      if (isDemoUserId(user?.id)) {
        if (editing) {
          qc.setQueryData<any[]>(queryKey, (old = []) =>
            old.map(item => item.id === editing.id ? { ...item, ...payload } : item),
          );
        } else {
          const fake = { ...payload, id: `demo-${Date.now()}`, created_at: new Date().toISOString() };
          qc.setQueryData<any[]>(queryKey, (old = []) => [fake, ...old]);
        }
        return;
      }
      if (editing) {
        const { error } = await supabase.from("jobs").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("jobs").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>(queryKey);
        if (current) setDemoData("sp-jobs", current);
      } else {
        qc.invalidateQueries({ queryKey });
      }
      toast.success(editing ? "Job updated" : "Job posted");
      resetForm();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteJob = useMutation({
    mutationFn: async (id: string) => {
      if (isDemoUserId(user?.id)) {
        qc.setQueryData<any[]>(queryKey, (old = []) => old.filter(item => item.id !== id));
        return;
      }
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>(queryKey);
        if (current) setDemoData("sp-jobs", current);
      } else {
        qc.invalidateQueries({ queryKey });
      }
      toast.success("Job deleted");
    },
  });

  const resetForm = () => {
    setForm({ title: "", description: "", location: "", salary: "", type: "Full-time" });
    setEditing(null);
    setOpen(false);
  };

  const startEdit = (j: any) => {
    setEditing(j);
    setForm({ title: j.title, description: j.description || "", location: j.location || "", salary: j.salary || "", type: j.type || "Full-time" });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    createJob.mutate(form);
  };

  const getAppCount = (jobId: string) => applications.filter(a => a.job_id === jobId).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Post Job</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Job" : "Post a Job"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Math Teacher" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Salary</Label><Input value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="e.g. ₹25,000/month" /></div>
              </div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Job location" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Job requirements, responsibilities..." rows={4} /></div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={createJob.isPending}>{editing ? "Update" : "Post Job"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : jobs.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No jobs posted yet. Create your first job listing!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(j => (
            <Card key={j.id} className="border-border/30 group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{j.title}</h3>
                      <Badge variant="outline" className="text-xs">{j.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      {j.salary && <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />{j.salary}</span>}
                      {j.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>}
                      <span>Posted {format(new Date(j.posted_date), "dd MMM yyyy")}</span>
                    </div>
                    {j.description && <p className="text-sm text-muted-foreground line-clamp-2">{j.description}</p>}
                    <Badge className="mt-2 text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                      {getAppCount(j.id)} application(s)
                    </Badge>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(j)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteJob.mutate(j.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
