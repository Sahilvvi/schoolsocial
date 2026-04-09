import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link } from "wouter";
import { useListJobs, useApplyJob, useListJobApplications } from "@/erp/api-client";
import { useAuth } from "@/erp/hooks/use-auth";
import { Search, MapPin, IndianRupee, Briefcase, School, Clock, CheckCircle2, FileText, User, Loader2, ChevronLeft, Bookmark, BookmarkCheck, Filter, Save, Edit2, MessageSquare, Send as SendIcon, Users, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/erp/hooks/use-toast";
import { useTheme } from "@/erp/context/ThemeContext";

type View = "jobs" | "applications" | "profile" | "saved" | "resume" | "chat" | "recruiter";

const SUBJECTS = ["Mathematics", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "Computer Science", "Physical Education", "Arts", "Music", "Other"];
const JOB_TYPES = ["full_time", "part_time", "contract", "temporary"];

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

export default function CareerDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("jobs");
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Saved jobs
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  // Profile
  const emptyProfile = { name: user?.name || "", phone: "", email: user?.email || "", subject: "", experience: "", qualification: "", bio: "", location: "" };
  const [profile, setProfile] = useState(emptyProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(emptyProfile);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setProfileLoading(true);
    fetch(`${BASE}/api/career/profile`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => {
        if (d.profile) {
          const p = { name: user.name || "", phone: d.profile.phone || "", email: user.email || "", subject: d.profile.subject || "", experience: d.profile.experience || "", qualification: d.profile.qualification || "", bio: d.profile.bio || "", location: d.profile.location || "" };
          setProfile(p); setProfileDraft(p);
        }
      }).catch(() => {}).finally(() => setProfileLoading(false));
    fetch(`${BASE}/api/career/saved-jobs`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => {
        if (d.savedIds) setSavedJobs(new Set(d.savedIds));
      }).catch(() => {});
  }, [user?.id]);

  const { data: jobsData, isLoading: jobsLoading } = useListJobs({});
  const applyMutation = useApplyJob();
  const { data: applicationsData, isLoading: applicationsLoading } = useListJobApplications({ applicantId: user?.id }, { enabled: !!user?.id });

  const allJobs = jobsData?.jobs?.length ? jobsData.jobs : [];
  const applications = applicationsData?.applications || [];
  const appliedJobIds = new Set(applications.map((a: any) => a.jobId));

  const filteredJobs = allJobs.filter((j: any) => {
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.schoolName?.toLowerCase().includes(search.toLowerCase()) || j.location?.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSubject === "all" || j.subject?.toLowerCase() === filterSubject.toLowerCase();
    const matchLocation = !filterLocation || j.location?.toLowerCase().includes(filterLocation.toLowerCase());
    const matchType = filterType === "all" || j.jobType === filterType;
    return matchSearch && matchSubject && matchLocation && matchType;
  });

  const savedJobsList = allJobs.filter((j: any) => savedJobs.has(j.id));

  const toggleSave = async (jobId: number) => {
    const isSaved = savedJobs.has(jobId);
    setSavedJobs(prev => { const next = new Set(prev); if (isSaved) next.delete(jobId); else next.add(jobId); return next; });
    try {
      await fetch(`${BASE}/api/career/saved-jobs/${jobId}`, {
        method: isSaved ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch { toast({ title: "Failed to update saved jobs", variant: "destructive" }); }
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(`${BASE}/api/career/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ phone: profileDraft.phone, subject: profileDraft.subject, experience: profileDraft.experience, qualification: profileDraft.qualification, bio: profileDraft.bio, location: profileDraft.location }),
      });
      if (!res.ok) throw new Error("Save failed");
      setProfile(profileDraft);
      setEditingProfile(false);
      toast({ title: "Profile saved!" });
    } catch { toast({ title: "Failed to save profile", variant: "destructive" }); }
  };

  const handleApply = async (jobId: number) => {
    if (!coverLetter.trim()) { toast({ title: "Please write a cover letter", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      await applyMutation.mutateAsync({ jobId, data: { coverLetter } as any });
      toast({ title: "Application submitted!", description: "The school will review your application." });
      setCoverLetter(""); setApplyingJobId(null);
    } catch (err: any) {
      const msg = err?.message || "Failed to submit application. Please try again.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not disclosed";
    const fmt = (n: number) => `₹${Math.round(n / 1000)}K`;
    if (min && max) return `${fmt(min)}–${fmt(max)}/mo`;
    return min ? `${fmt(min)}/mo` : `${fmt(max!)}/mo`;
  };

  const JobCard = ({ job }: { job: any }) => {
    const applied = appliedJobIds.has(job.id);
    const saved = savedJobs.has(job.id);
    return (
      <Card className="p-5 rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">{(job.schoolName || "S")[0]}</div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-foreground leading-tight">{job.title}</h3>
            <p className="text-sm text-primary font-medium">{job.schoolName || job.school || "School"}</p>
          </div>
          <button onClick={() => toggleSave(job.id)} className={`p-1.5 rounded-lg transition-colors ${saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}>
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
        <div className="space-y-2 mb-4">
          {job.location && <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium"><MapPin className="w-4 h-4" /> {job.location}</div>}
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium"><IndianRupee className="w-4 h-4" /> {formatSalary(job.salaryMin, job.salaryMax)}</div>
          {job.jobType && <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium"><Clock className="w-4 h-4" /> {job.jobType.replace("_", " ")}</div>}
        </div>
        {job.subject && <Badge variant="secondary" className="mb-4 font-bold rounded-full">{job.subject}</Badge>}
        {job.applicationDeadline && <p className="text-xs text-muted-foreground mb-3">Deadline: {new Date(job.applicationDeadline || Date.now()).toLocaleDateString("en-IN")}</p>}
        {applied ? (
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 rounded-xl px-4 py-2"><CheckCircle2 className="w-4 h-4" /> Applied</div>
        ) : (
          <Dialog open={applyingJobId === job.id} onOpenChange={o => { setApplyingJobId(o ? job.id : null); if (!o) setCoverLetter(""); }}>
            <DialogTrigger asChild>
              <Button className="w-full rounded-xl font-bold" onClick={() => setApplyingJobId(job.id)}>Apply Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader><DialogTitle className="font-display font-bold text-xl">Apply for {job.title}</DialogTitle></DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-secondary/50 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-xl font-bold font-display text-primary">{(job.schoolName || "S")[0]}</div>
                  <div><p className="font-bold text-foreground">{job.schoolName || job.school}</p><p className="text-sm text-muted-foreground font-medium">{job.location}</p></div>
                </div>
                {profile.name && (
                  <div className="p-3 bg-green-50 rounded-xl text-sm">
                    <p className="font-bold text-green-700">Your Profile</p>
                    <p className="text-green-600">{profile.name} • {profile.subject} • {profile.experience} yrs experience</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Cover Letter *</label>
                  <Textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Explain why you're a great fit for this role..." className="min-h-[120px] rounded-xl" />
                </div>
                <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20" disabled={submitting || !coverLetter.trim()} onClick={() => handleApply(job.id)}>
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null} Submit Application
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Card>
    );
  };

  const NAV_ITEMS: { view: View; label: string; icon: ReactNode; badge?: string }[] = [
    { view: "jobs", label: "Browse Jobs", icon: <Briefcase className="w-4 h-4" /> },
    { view: "saved", label: "Saved", icon: <Bookmark className="w-4 h-4" />, badge: savedJobs.size > 0 ? String(savedJobs.size) : undefined },
    { view: "applications", label: "Applications", icon: <FileText className="w-4 h-4" />, badge: applications.length > 0 ? String(applications.length) : undefined },
    { view: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { view: "resume", label: "Resume", icon: <FileText className="w-4 h-4" /> },
    { view: "chat", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
  ];
  if (user?.role === "school_admin" || user?.role === "super_admin") {
    NAV_ITEMS.push({ view: "recruiter", label: "Recruiter", icon: <School className="w-4 h-4" /> });
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 text-primary font-display font-bold text-xl shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center"><School className="w-4.5 h-4.5" /></div>
            <span className="hidden sm:block">MySchool <span className="text-foreground">Careers</span></span>
          </Link>
          <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1 justify-center">
            {NAV_ITEMS.map(({ view: v, label, icon, badge }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  view === v
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {icon}
                <span className="hidden md:inline">{label}</span>
                {badge && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold leading-none ${view === v ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>{badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* JOBS VIEW */}
      {view === "jobs" && (
        <>
          <div className="bg-primary pt-16 pb-24 px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Find your dream teaching job</h1>
              <p className="text-white/80 text-lg font-medium mb-8 max-w-2xl mx-auto">Discover opportunities at India's top schools. Apply with one click.</p>
              <Card className="p-3 rounded-2xl flex gap-3 shadow-2xl shadow-primary/30 border-none bg-card max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, subject, or school" className="pl-10 h-12 border-none bg-transparent focus-visible:ring-0 text-base" />
                </div>
                <Button size="lg" className="h-12 px-6 rounded-xl font-bold shadow-none" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-2" />Filter
                </Button>
              </Card>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8 -mt-12">
            {showFilters && (
              <Card className="p-5 rounded-2xl mb-6 border-border shadow-sm">
                <h3 className="font-bold mb-4">Filter Jobs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground mb-1.5 block">Subject</Label>
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="All subjects" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">All Subjects</SelectItem>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground mb-1.5 block">Location</Label>
                    <Input value={filterLocation} onChange={e => setFilterLocation(e.target.value)} placeholder="City or state..." className="rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground mb-1.5 block">Job Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="All types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4 rounded-xl" onClick={() => { setFilterSubject("all"); setFilterLocation(""); setFilterType("all"); }}>Clear Filters</Button>
              </Card>
            )}

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                  {search ? `Results for "${search}"` : "Latest Jobs"}
                  <span className="text-sm font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{filteredJobs.length}</span>
                </h2>
                {search && <p className="text-sm text-muted-foreground mt-0.5">Showing filtered results</p>}
              </div>
            </div>
            {jobsLoading ? <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            : filteredJobs.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground"><Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" /><p className="text-xl font-bold">No jobs found</p><p className="mt-2">Try a different search or remove filters</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job: any) => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </>
      )}

      {/* SAVED JOBS VIEW */}
      {view === "saved" && (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Saved Jobs</h2>
          {savedJobsList.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground"><Bookmark className="w-16 h-16 mx-auto mb-4 opacity-20" /><p className="text-xl font-bold">No saved jobs</p><p className="mt-2 mb-6">Browse jobs and bookmark them to save</p><Button className="rounded-xl font-bold" onClick={() => setView("jobs")}>Browse Jobs</Button></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{savedJobsList.map((job: any) => <JobCard key={job.id} job={job} />)}</div>
          )}
        </div>
      )}

      {/* APPLICATIONS VIEW */}
      {view === "applications" && (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">My Applications</h2>
          {applicationsLoading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          : applications.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground"><FileText className="w-16 h-16 mx-auto mb-4 opacity-20" /><p className="text-xl font-bold">No applications yet</p><p className="mt-2 mb-6">Browse jobs and apply to get started</p><Button className="rounded-xl font-bold" onClick={() => setView("jobs")}>Browse Jobs</Button></div>
          ) : (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <Card key={app.id} className="p-5 rounded-2xl border-border shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{app.jobTitle || "Teacher Position"}</h3>
                      <p className="text-primary font-medium">{app.schoolName || "School"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Applied on {new Date(app.appliedAt || app.createdAt || Date.now()).toLocaleDateString("en-IN")}</p>
                      {app.coverLetter && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{app.coverLetter}</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 capitalize ${
                      app.status === "accepted" || app.status === "shortlisted" ? "bg-green-100 text-green-700" :
                      app.status === "rejected" ? "bg-red-100 text-red-700" :
                      app.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                      "bg-orange-100 text-orange-700"}`}>{app.status || "pending"}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE VIEW */}
      {view === "profile" && (
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">My Profile</h2>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => { setProfileDraft(profile); setEditingProfile(!editingProfile); }}>
              <Edit2 className="w-4 h-4 mr-2" /> {editingProfile ? "Cancel" : "Edit"}
            </Button>
          </div>
          {editingProfile ? (
            <Card className="p-6 rounded-2xl border-border shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={profileDraft.name} onChange={e => setProfileDraft((p: any) => ({ ...p, name: e.target.value }))} className="rounded-xl mt-1" /></div>
                <div><Label>Phone</Label><Input value={profileDraft.phone} onChange={e => setProfileDraft((p: any) => ({ ...p, phone: e.target.value }))} className="rounded-xl mt-1" /></div>
                <div><Label>Email</Label><Input value={profileDraft.email} onChange={e => setProfileDraft((p: any) => ({ ...p, email: e.target.value }))} className="rounded-xl mt-1" /></div>
                <div><Label>Location (City)</Label><Input value={profileDraft.location} onChange={e => setProfileDraft((p: any) => ({ ...p, location: e.target.value }))} placeholder="Mumbai, Delhi..." className="rounded-xl mt-1" /></div>
                <div>
                  <Label>Subject Specialization</Label>
                  <Select value={profileDraft.subject} onValueChange={v => setProfileDraft((p: any) => ({ ...p, subject: v }))}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Years of Experience</Label><Input type="number" value={profileDraft.experience} onChange={e => setProfileDraft((p: any) => ({ ...p, experience: e.target.value }))} className="rounded-xl mt-1" /></div>
                <div className="col-span-2"><Label>Qualifications (B.Ed, M.Sc...)</Label><Input value={profileDraft.qualification} onChange={e => setProfileDraft((p: any) => ({ ...p, qualification: e.target.value }))} placeholder="B.Ed, M.Sc Mathematics..." className="rounded-xl mt-1" /></div>
                <div className="col-span-2"><Label>Professional Bio</Label><Textarea value={profileDraft.bio} onChange={e => setProfileDraft((p: any) => ({ ...p, bio: e.target.value }))} placeholder="Brief description of your teaching experience and approach..." rows={4} className="rounded-xl mt-1" /></div>
              </div>
              <Button onClick={saveProfile} className="w-full rounded-xl font-bold"><Save className="w-4 h-4 mr-2" />Save Profile</Button>
            </Card>
          ) : (
            <Card className="p-6 rounded-2xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">{(profile.name || user?.name || "U")[0]}</div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{profile.name || user?.name || "Set your name"}</h3>
                  <p className="text-primary font-medium">{profile.subject || "Add your subject"}</p>
                  {profile.location && <p className="text-sm text-muted-foreground"><MapPin className="w-3.5 h-3.5 inline mr-1" />{profile.location}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Phone", value: profile.phone || "Not set" },
                  { label: "Email", value: profile.email || user?.email || "Not set" },
                  { label: "Experience", value: profile.experience ? `${profile.experience} years` : "Not set" },
                  { label: "Qualification", value: profile.qualification || "Not set" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-secondary/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-muted-foreground mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              {profile.bio && <div className="bg-secondary/20 rounded-xl p-4"><p className="text-xs font-bold text-muted-foreground mb-1">Bio</p><p className="text-sm text-foreground">{profile.bio}</p></div>}
              {!profile.name && <p className="text-center text-muted-foreground text-sm py-4">Click Edit to set up your profile. A complete profile improves your chances of getting hired!</p>}
            </Card>
          )}
        </div>
      )}

      {/* RESUME BUILDER VIEW */}
      {view === "resume" && (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <ResumeBuilder profile={profile} user={user} applications={applications} />
        </div>
      )}

      {/* RECRUITER CHAT VIEW */}
      {view === "chat" && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
          <RecruiterChat user={user} />
        </div>
      )}

      {/* RECRUITER PANEL VIEW */}
      {view === "recruiter" && (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <RecruiterPanel user={user} />
        </div>
      )}
    </div>
  );
}

function ResumeBuilder({ profile, user, applications }: { profile: any; user: any; applications: any[] }) {
  const [resumeData, setResumeData] = useState({
    name: profile.name || user?.name || "",
    email: profile.email || user?.email || "",
    phone: profile.phone || "",
    location: profile.location || "",
    subject: profile.subject || "",
    experience: profile.experience || "",
    qualification: profile.qualification || "",
    bio: profile.bio || "",
    skills: "",
    achievements: "",
    languages: "English, Hindi",
  });

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold font-display text-foreground">Resume Builder</h2><p className="text-muted-foreground text-sm mt-0.5">Create a professional teacher resume</p></div>
        <Button onClick={handlePrint} className="rounded-xl font-bold gap-2"><Save className="w-4 h-4" />Download / Print</Button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        <Card className="p-5 rounded-2xl border-border shadow-sm space-y-3">
          <p className="font-bold text-foreground mb-1">Personal Information</p>
          <div><Label className="text-xs font-bold text-muted-foreground">Full Name</Label><Input value={resumeData.name} onChange={e => setResumeData(d => ({ ...d, name: e.target.value }))} className="rounded-xl mt-1" placeholder="Your full name" /></div>
          <div><Label className="text-xs font-bold text-muted-foreground">Email</Label><Input value={resumeData.email} onChange={e => setResumeData(d => ({ ...d, email: e.target.value }))} className="rounded-xl mt-1" /></div>
          <div><Label className="text-xs font-bold text-muted-foreground">Phone</Label><Input value={resumeData.phone} onChange={e => setResumeData(d => ({ ...d, phone: e.target.value }))} className="rounded-xl mt-1" /></div>
          <div><Label className="text-xs font-bold text-muted-foreground">Location / City</Label><Input value={resumeData.location} onChange={e => setResumeData(d => ({ ...d, location: e.target.value }))} className="rounded-xl mt-1" /></div>
          <div><Label className="text-xs font-bold text-muted-foreground">Subject Specialization</Label><Input value={resumeData.subject} onChange={e => setResumeData(d => ({ ...d, subject: e.target.value }))} className="rounded-xl mt-1" /></div>
        </Card>
        <Card className="p-5 rounded-2xl border-border shadow-sm space-y-3">
          <p className="font-bold text-foreground mb-1">Qualifications & Skills</p>
          <div><Label className="text-xs font-bold text-muted-foreground">Highest Qualification</Label><Input value={resumeData.qualification} onChange={e => setResumeData(d => ({ ...d, qualification: e.target.value }))} className="rounded-xl mt-1" placeholder="B.Ed, M.A, Ph.D..." /></div>
          <div><Label className="text-xs font-bold text-muted-foreground">Years of Experience</Label><Input value={resumeData.experience} onChange={e => setResumeData(d => ({ ...d, experience: e.target.value }))} className="rounded-xl mt-1" placeholder="e.g. 5" /></div>
          <div><Label className="text-xs font-bold text-muted-foreground">Skills (comma separated)</Label><Input value={resumeData.skills} onChange={e => setResumeData(d => ({ ...d, skills: e.target.value }))} className="rounded-xl mt-1" placeholder="Classroom Management, Digital Learning..." /></div>
          <div><Label className="text-xs font-bold text-muted-foreground">Languages Known</Label><Input value={resumeData.languages} onChange={e => setResumeData(d => ({ ...d, languages: e.target.value }))} className="rounded-xl mt-1" /></div>
        </Card>
        <Card className="p-5 rounded-2xl border-border shadow-sm lg:col-span-2 space-y-3">
          <p className="font-bold text-foreground mb-1">Bio & Achievements</p>
          <div><Label className="text-xs font-bold text-muted-foreground">Professional Summary</Label><Textarea value={resumeData.bio} onChange={e => setResumeData(d => ({ ...d, bio: e.target.value }))} className="rounded-xl mt-1 resize-none" rows={3} placeholder="Write a brief professional summary..." /></div>
          <div><Label className="text-xs font-bold text-muted-foreground">Key Achievements</Label><Textarea value={resumeData.achievements} onChange={e => setResumeData(d => ({ ...d, achievements: e.target.value }))} className="rounded-xl mt-1 resize-none" rows={3} placeholder="Awards, certifications, notable accomplishments..." /></div>
        </Card>
      </div>

      {/* Resume Preview */}
      <Card className="p-8 rounded-2xl border-2 border-primary/20 shadow-lg print:shadow-none print:border-0" id="resume-preview">
        <style>{`@media print { .print\\:hidden { display: none !important; } #resume-preview { box-shadow: none; border: none; } }`}</style>
        <div className="border-b-4 border-primary pb-5 mb-5">
          <h1 className="text-3xl font-bold text-foreground">{resumeData.name || "Your Name"}</h1>
          <p className="text-primary font-bold text-lg mt-0.5">{resumeData.subject ? `${resumeData.subject} Teacher` : "Teacher"}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            {resumeData.email && <span>✉ {resumeData.email}</span>}
            {resumeData.phone && <span>📞 {resumeData.phone}</span>}
            {resumeData.location && <span>📍 {resumeData.location}</span>}
          </div>
        </div>

        {resumeData.bio && (<div className="mb-5"><h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-1 mb-2">Professional Summary</h2><p className="text-sm text-muted-foreground leading-relaxed">{resumeData.bio}</p></div>)}

        <div className="grid grid-cols-2 gap-6 mb-5">
          <div>
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-1 mb-2">Qualifications</h2>
            {resumeData.qualification && <p className="text-sm font-bold text-foreground">{resumeData.qualification}</p>}
            {resumeData.experience && <p className="text-sm text-muted-foreground mt-0.5">{resumeData.experience} years of teaching experience</p>}
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-1 mb-2">Languages</h2>
            <p className="text-sm text-muted-foreground">{resumeData.languages}</p>
          </div>
        </div>

        {resumeData.skills && (<div className="mb-5"><h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-1 mb-2">Skills</h2><div className="flex flex-wrap gap-2">{resumeData.skills.split(",").map((s, i) => (<span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium">{s.trim()}</span>))}</div></div>)}

        {resumeData.achievements && (<div className="mb-5"><h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-1 mb-2">Achievements</h2><p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{resumeData.achievements}</p></div>)}

        {applications.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-1 mb-2">Recent Applications</h2>
            <div className="space-y-1">{applications.slice(0, 3).map((a: any) => (<p key={a.id} className="text-sm text-muted-foreground">• Applied at {a.schoolName || "School"} — {new Date(a.appliedAt || a.createdAt).toLocaleDateString("en-IN")}</p>))}</div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">Generated by MySchool Careers • {new Date().toLocaleDateString("en-IN")}</div>
      </Card>
    </div>
  );
}

function RecruiterChat({ user }: { user: any }) {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selContact, setSelContact] = useState<any>(null);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`${BASE}/api/messages/contacts`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.ok ? r.json() : { contacts: [] })
      .then(d => { setContacts(d.contacts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (!selContact) return;
    fetch(`${BASE}/api/messages?withUserId=${selContact.id}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.ok ? r.json() : { messages: [] })
      .then(d => { setMsgs(d.messages || []); setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100); })
      .catch(() => {});
  }, [selContact]);

  const sendMsg = async () => {
    if (!msg.trim() || !selContact) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/messages`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ toUserId: selContact.id, content: msg, subject: "Career inquiry" }) });
      if (res.ok) {
        const d = await res.json();
        setMsgs(m => [...m, d.message || { id: Date.now(), content: msg, fromUserId: user?.id, createdAt: new Date().toISOString() }]);
        setMsg("");
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else { toast({ title: "Failed to send", variant: "destructive" }); }
    } finally { setSending(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-primary" />Recruiter Chat</h2>
      <div className="grid grid-cols-3 gap-4 h-[520px]">
        {/* Contact list */}
        <Card className="col-span-1 rounded-2xl border-border/50 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border bg-secondary/30"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Conversations</p></div>
          <div className="flex-1 overflow-y-auto">
            {loading ? <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            : contacts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-bold text-xs">No conversations yet</p>
                <p className="text-xs mt-1">Recruiters can message you after you apply</p>
              </div>
            ) : contacts.map((c: any) => (
              <button key={c.id} onClick={() => setSelContact(c)} className={`w-full p-3 text-left border-b border-border/30 hover:bg-secondary/50 transition-colors ${selContact?.id === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}>
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">{c.name?.[0] || "?"}</div><div className="min-w-0"><p className="font-bold text-sm text-foreground truncate">{c.name}</p><p className="text-xs text-muted-foreground truncate">{c.schoolName || c.role}</p></div></div>
              </button>
            ))}
          </div>
        </Card>
        {/* Chat area */}
        <Card className="col-span-2 rounded-2xl border-border/50 overflow-hidden flex flex-col">
          {!selContact ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">Select a conversation</p><p className="text-sm mt-1">Choose a recruiter to start chatting</p></div>
            </div>
          ) : (<>
            <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2"><div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">{selContact.name?.[0]}</div><div><p className="font-bold text-sm text-foreground">{selContact.name}</p><p className="text-xs text-muted-foreground">{selContact.schoolName || "Recruiter"}</p></div></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.length === 0 ? <p className="text-center text-muted-foreground text-sm py-8">No messages yet. Say hello!</p>
              : msgs.map((m: any) => {
                const isMine = m.fromUserId === user?.id;
                return (<div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}><div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMine ? "bg-primary text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}><p>{m.content}</p><p className={`text-xs mt-1 ${isMine ? "text-white/70" : "text-muted-foreground"}`}>{new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p></div></div>);
              })}
              <div ref={endRef} />
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMsg()} placeholder="Type a message..." className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary" />
              <button onClick={sendMsg} disabled={sending || !msg.trim()} className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1.5">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}</button>
            </div>
          </>)}
        </Card>
      </div>
    </div>
  );
}

function RecruiterPanel({ user }: { user: any }) {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user?.schoolId) { setLoading(false); return; }
    fetch(`${BASE}/api/jobs?schoolId=${user.schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.ok ? r.json() : { jobs: [] })
      .then(d => setJobs(d.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [user?.schoolId]);

  useEffect(() => {
    if (!selectedJob) return;
    setAppLoading(true);
    fetch(`${BASE}/api/jobs/${selectedJob.id}/applications`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.ok ? r.json() : { applications: [] })
      .then(d => setApplicants(d.applications || []))
      .catch(() => setApplicants([]))
      .finally(() => setAppLoading(false));
  }, [selectedJob]);

  const updateStatus = async (appId: number, status: string) => {
    const res = await fetch(`${BASE}/api/jobs/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast({ title: `Application ${status}` });
      setApplicants(a => a.map(ap => ap.id === appId ? { ...ap, status } : ap));
    }
  };

  const STATUS_COLOR: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    shortlisted: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    hired: "bg-green-100 text-green-700",
  };

  const filteredApplicants = filterStatus === "all" ? applicants : applicants.filter(a => a.status === filterStatus);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Recruiter Panel</h2>
          <p className="text-muted-foreground text-sm">Manage job postings and applicants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Your Job Postings ({jobs.length})</h3>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : jobs.length === 0 ? (
            <Card className="p-6 rounded-2xl text-center text-muted-foreground">
              <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-bold text-sm">No jobs posted yet</p>
              <p className="text-xs mt-1">Post jobs from School Admin → Hiring</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {jobs.map((job: any) => (
                <Card key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl cursor-pointer hover:shadow-md transition-all ${selectedJob?.id === job.id ? "border-primary bg-primary/5 border-2" : "border-border"}`}>
                  <p className="font-bold text-sm text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.subject} • {job.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={job.status === "active" ? "default" : "secondary"} className="text-xs capitalize">{job.status || "active"}</Badge>
                    <span className="text-xs text-muted-foreground">{job.jobType?.replace("_", " ")}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Applicants Panel */}
        <div className="lg:col-span-2">
          {!selectedJob ? (
            <Card className="h-64 rounded-2xl flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold">Select a job posting</p>
                <p className="text-sm mt-1">View and manage applicants</p>
              </div>
            </Card>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-foreground">{selectedJob.title} — Applicants ({filteredApplicants.length})</h3>
                  <p className="text-xs text-muted-foreground">{selectedJob.subject} • {selectedJob.location}</p>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-36 rounded-xl h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({applicants.length})</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {appLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : filteredApplicants.length === 0 ? (
                <Card className="p-8 rounded-2xl text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-bold">{filterStatus === "all" ? "No applications yet" : `No ${filterStatus} applications`}</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredApplicants.map((app: any) => (
                    <Card key={app.id} className="p-4 rounded-xl border-border shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {(app.applicantName || app.name || "?")[0]}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{app.applicantName || app.name || "Applicant"}</p>
                            <p className="text-xs text-muted-foreground">{app.applicantEmail || app.email || ""}</p>
                            {app.coverLetter && <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">"{app.coverLetter}"</p>}
                            <p className="text-xs text-muted-foreground mt-0.5">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-IN") : ""}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Badge className={`text-xs rounded-full capitalize ${STATUS_COLOR[app.status] || STATUS_COLOR.pending}`}>{app.status || "pending"}</Badge>
                          <div className="flex gap-1">
                            {app.status !== "shortlisted" && <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "shortlisted")} className="rounded-lg h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">Shortlist</Button>}
                            {app.status !== "hired" && <Button size="sm" className="rounded-lg h-7 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus(app.id, "hired")}>Hire</Button>}
                            {app.status !== "rejected" && <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, "rejected")} className="rounded-lg h-7 text-xs text-red-600 hover:bg-red-50">Reject</Button>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
