import { useState } from "react";
import { AdminLayout } from "@/components/layouts";
import { useListJobs, useCreateJob, useListJobApplications } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Briefcase, MapPin, IndianRupee, Users, Loader2, Send, ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { adminLinks } from "./admin-links";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shortlisted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const formatSalary = (min?: number | null, max?: number | null) => {
  if (!min && !max) return "Negotiable";
  if (min && max) return `₹${Math.round(min/1000)}k - ₹${Math.round(max/1000)}k`;
  if (min) return `₹${Math.round(min/1000)}k+`;
  return "—";
};

function ApplicationsPanel({ jobId }: { jobId: number }) {
  const { toast } = useToast();
  const { data, isLoading, refetch } = useListJobApplications({ jobId });
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const apps = data?.applications || [];

  const updateStatus = async (appId: number, status: string) => {
    setUpdatingId(appId);
    try {
      const res = await fetch(`${BASE}/api/jobs/${jobId}/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast({ title: `Application ${status}`, description: "Status updated successfully." });
      refetch();
    } catch { toast({ title: "Update failed", variant: "destructive" }); }
    finally { setUpdatingId(null); }
  };

  if (isLoading) return <div className="p-4 text-center text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading applications...</div>;
  if (apps.length === 0) return <div className="p-4 text-center text-sm text-muted-foreground">No applications yet for this position.</div>;

  return (
    <div className="mt-4 border-t dark:border-gray-700 pt-4 space-y-3">
      <p className="text-sm font-bold dark:text-white">{apps.length} Application{apps.length !== 1 ? "s" : ""}</p>
      {apps.map((app: any) => (
        <div key={app.id} className="p-4 bg-secondary/50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <p className="font-bold text-sm dark:text-white">{app.applicantName || "Applicant"}</p>
              <p className="text-xs text-muted-foreground">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-IN") : ""}</p>
              {app.coverLetter && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{app.coverLetter}</p>}
            </div>
            <Badge className={`text-xs rounded-full shrink-0 capitalize ${STATUS_COLOR[app.status] || STATUS_COLOR.pending}`}>{app.status || "pending"}</Badge>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {["reviewed", "shortlisted", "rejected"].map(s => (
              <Button key={s} size="sm" variant="outline" disabled={updatingId === app.id || app.status === s}
                className={`text-xs rounded-lg h-7 dark:border-gray-600 ${app.status === s ? "opacity-40" : ""}`}
                onClick={() => updateStatus(app.id, s)}>
                {updatingId === app.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                {s === "shortlisted" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : s === "rejected" ? <XCircle className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Hiring() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", subject: "", description: "", requirements: "", jobType: "full_time", location: "", salaryMin: "", salaryMax: "", experienceRequired: "", deadline: "" });

  const { data, isLoading, refetch } = useListJobs({ schoolId });
  const createJob = useCreateJob();

  const jobs = data?.jobs || [];

  const handleSubmit = async () => {
    if (!form.title || !form.subject || !form.jobType) {
      toast({ title: "Missing fields", description: "Title, subject, and job type are required.", variant: "destructive" });
      return;
    }
    try {
      await createJob.mutateAsync({ data: {
        schoolId, title: form.title, subject: form.subject, description: form.description || undefined,
        requirements: form.requirements || undefined, jobType: form.jobType as any,
        location: form.location || undefined,
        salary: form.salaryMin && form.salaryMax ? `${form.salaryMin}-${form.salaryMax}` : undefined,
        experienceRequired: form.experienceRequired ? Number(form.experienceRequired) : undefined,
        deadline: form.deadline || undefined,
      }});
      toast({ title: "Job posted", description: "Job listing is now live on the teacher job portal." });
      setDialogOpen(false);
      setForm({ title: "", subject: "", description: "", requirements: "", jobType: "full_time", location: "", salaryMin: "", salaryMax: "", experienceRequired: "", deadline: "" });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to post job.", variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="Recruitment & Hiring" links={adminLinks}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Job Postings</h2>
          <p className="text-muted-foreground font-medium">Manage open positions and track applicants</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2"/> Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-2xl">Post a Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Job Title</label>
                <Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="e.g. Senior Maths Teacher" className="h-11 rounded-xl bg-secondary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Subject</label>
                  <Input value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} placeholder="e.g. Mathematics" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Job Type</label>
                  <Select value={form.jobType} onValueChange={v => setForm(p => ({...p, jobType: v}))}>
                    <SelectTrigger className="h-11 rounded-xl bg-secondary/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="substitute">Substitute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Min Salary (₹/month)</label>
                  <Input value={form.salaryMin} onChange={e => setForm(p => ({...p, salaryMin: e.target.value}))} placeholder="e.g. 30000" type="number" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Max Salary (₹/month)</label>
                  <Input value={form.salaryMax} onChange={e => setForm(p => ({...p, salaryMax: e.target.value}))} placeholder="e.g. 50000" type="number" className="h-11 rounded-xl bg-secondary/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Location</label>
                  <Input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} placeholder="e.g. On-site, Delhi" className="h-11 rounded-xl bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Experience (years)</label>
                  <Input value={form.experienceRequired} onChange={e => setForm(p => ({...p, experienceRequired: e.target.value}))} placeholder="e.g. 3" type="number" className="h-11 rounded-xl bg-secondary/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Application Deadline</label>
                <Input type="date" value={form.deadline} onChange={e => setForm(p => ({...p, deadline: e.target.value}))} className="h-11 rounded-xl bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Job Description</label>
                <Textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Describe the role and responsibilities..." className="min-h-[80px] rounded-xl bg-secondary/50 resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Requirements</label>
                <Textarea value={form.requirements} onChange={e => setForm(p => ({...p, requirements: e.target.value}))} placeholder="List qualifications and requirements..." className="min-h-[80px] rounded-xl bg-secondary/50 resize-none" />
              </div>
              <Button onClick={handleSubmit} disabled={createJob.isPending} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                {createJob.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                Post Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold mb-2">No job postings</p>
          <p className="text-sm">Post a job to attract teacher applicants</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job: any) => (
            <Card key={job.id} className="p-6 rounded-2xl border-border shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary rounded-xl text-foreground"><Briefcase className="w-6 h-6" /></div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-foreground">{job.title}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {(job.jobType || "").replace('_', ' ')}
                    </span>
                  </div>
                </div>
                {job.applicationCount > 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">
                    <Users className="w-3 h-3" /> {job.applicationCount}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 py-4 border-y border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="w-4 h-4 text-foreground/40 shrink-0" /> {job.location || "On-site"}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <IndianRupee className="w-4 h-4 text-foreground/40 shrink-0" /> {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
                {job.subject && (
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Briefcase className="w-4 h-4 text-foreground/40 shrink-0" /> {job.subject}
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="w-4 h-4 text-foreground/40 shrink-0" /> {new Date(job.deadline).toLocaleDateString('en-IN')}
                  </div>
                )}
              </div>

              {job.description && (
                <p className="text-sm text-muted-foreground font-medium mb-4 line-clamp-2">{job.description}</p>
              )}

              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">{job.applicationCount || 0} Applicants</span>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-bold border-border hover:bg-secondary" onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}>
                  {expandedJob === job.id ? <><ChevronUp className="w-4 h-4 mr-1.5" />Hide</> : <><ChevronDown className="w-4 h-4 mr-1.5" />View Applications</>}
                </Button>
              </div>

              {expandedJob === job.id && <ApplicationsPanel jobId={job.id} />}
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
