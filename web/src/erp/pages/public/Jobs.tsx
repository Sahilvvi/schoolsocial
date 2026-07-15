import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, MapPin, IndianRupee, Briefcase, Clock, Filter, ChevronRight, School, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");

const JOB_TYPE_LABELS: Record<string, string> = { full_time: "Full Time", part_time: "Part Time", contract: "Contract", temporary: "Temporary" };

export default function PublicJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch(`${BASE()}/api/jobs?status=open`)
      .then(r => r.json()).then(d => setJobs(d.jobs || [])).finally(() => setLoading(false));
  }, []);

  const SUBJECTS = ["Mathematics", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "Computer Science", "Physical Education", "Arts", "Music"];

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title?.toLowerCase().includes(q) || j.subject?.toLowerCase().includes(q) || j.schoolName?.toLowerCase().includes(q);
    const matchLoc = !filterLocation || j.location?.toLowerCase().includes(filterLocation.toLowerCase());
    const matchSubj = !filterSubject || j.subject === filterSubject;
    const matchType = !filterType || j.jobType === filterType;
    return matchSearch && matchLoc && matchSubj && matchType;
  });

  const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))].slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold font-display">Teaching Jobs in India</h1>
          </div>
          <p className="text-white/80 text-lg mb-8">Find your perfect teaching opportunity from {jobs.length}+ schools nationwide</p>
          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by subject, school, location..." className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 bg-white border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" />
            </div>
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-xl px-4 font-bold"><Filter className="w-4 h-4 mr-1.5" />Filter</Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 rounded-xl text-center shadow-sm"><p className="text-2xl font-bold text-primary">{jobs.length}</p><p className="text-xs text-muted-foreground mt-0.5">Open Positions</p></Card>
          <Card className="p-4 rounded-xl text-center shadow-sm"><p className="text-2xl font-bold text-primary">{new Set(jobs.map(j => j.schoolId)).size}</p><p className="text-xs text-muted-foreground mt-0.5">Schools Hiring</p></Card>
          <Card className="p-4 rounded-xl text-center shadow-sm"><p className="text-2xl font-bold text-primary">{new Set(jobs.map(j => j.location).filter(Boolean)).size}</p><p className="text-xs text-muted-foreground mt-0.5">Cities</p></Card>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-4 rounded-xl border-border shadow-sm mb-6">
            <p className="font-bold text-sm text-foreground mb-3">Refine Results</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Location</label>
                <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="w-full border border-border rounded-xl p-2.5 text-sm bg-background focus:outline-none focus:border-primary">
                  <option value="">All locations</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Subject</label>
                <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="w-full border border-border rounded-xl p-2.5 text-sm bg-background focus:outline-none focus:border-primary">
                  <option value="">All subjects</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Job Type</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full border border-border rounded-xl p-2.5 text-sm bg-background focus:outline-none focus:border-primary">
                  <option value="">All types</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
            </div>
            {(filterLocation || filterSubject || filterType) && (
              <button onClick={() => { setFilterLocation(""); setFilterSubject(""); setFilterType(""); }} className="text-xs text-primary font-bold mt-2 hover:underline">Clear filters</button>
            )}
          </Card>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-muted-foreground">{filtered.length} job{filtered.length !== 1 ? "s" : ""} found</p>
          <Link href="/career"><Button variant="outline" className="rounded-xl text-xs font-bold h-8">Login to Apply →</Button></Link>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p>Loading jobs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold mb-2">No jobs found</p>
            <p className="text-sm">Try different search terms or clear filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => (
              <Card key={job.id} className="p-5 rounded-2xl border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Briefcase className="w-6 h-6 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-base leading-tight">{job.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground"><School className="w-3.5 h-3.5" /><span>{job.schoolName || "School"}</span></div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.subject && <Badge className="text-xs bg-primary/10 text-primary border-0">{job.subject}</Badge>}
                      {job.jobType && <Badge className="text-xs bg-secondary text-muted-foreground border-0">{JOB_TYPE_LABELS[job.jobType] || job.jobType}</Badge>}
                      {job.location && <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium"><MapPin className="w-3 h-3" />{job.location}</span>}
                      {(job.salaryMin || job.salaryMax) && <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium"><IndianRupee className="w-3 h-3" />{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}K` : ""}–{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}K/mo` : ""}</span>}
                    </div>
                    {job.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{job.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {job.createdAt && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86400000)}d ago</span>}
                    <Link href="/career"><Button size="sm" className="rounded-xl font-bold text-xs">Apply Now <ChevronRight className="w-3 h-3 ml-0.5" /></Button></Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        <Card className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10 text-center mt-8">
          <h3 className="text-xl font-bold font-display text-foreground mb-2">Ready to take the next step?</h3>
          <p className="text-muted-foreground text-sm mb-4">Create your free teacher profile and apply to schools across India</p>
          <Link href="/career"><Button className="rounded-xl font-bold px-8">Join MySchool Careers →</Button></Link>
        </Card>
      </div>
    </div>
  );
}
