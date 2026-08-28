import { useOutletContext } from "react-router-dom";
import { Briefcase, Plus, MapPin, Clock, IndianRupee } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  type: string;
  salary: string;
  location: string;
  experience: string;
  applications: number;
  status: string;
}

const INITIAL_JOBS: Job[] = [
  { id: "1", title: "Mathematics Faculty", type: "Full-time", salary: "₹25,000 - ₹35,000/mo", location: "On-site", experience: "3+ years", applications: 12, status: "Active" },
  { id: "2", title: "Science Faculty (Physics)", type: "Part-time", salary: "₹15,000 - ₹20,000/mo", location: "On-site", experience: "2+ years", applications: 8, status: "Active" },
  { id: "3", title: "English Language Tutor", type: "Part-time", salary: "₹12,000 - ₹18,000/mo", location: "Hybrid", experience: "1+ years", applications: 15, status: "Closed" },
];

export default function TuPJobs() {
  const ctx = useOutletContext<any>();
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", salary: "", location: "", experience: "" });

  const handleAdd = () => {
    if (!form.title || !form.type) {
      toast.error("Job title and type are required");
      return;
    }
    const newJob: Job = {
      id: `j-${Date.now()}`,
      title: form.title,
      type: form.type,
      salary: form.salary || "—",
      location: form.location || "—",
      experience: form.experience || "—",
      applications: 0,
      status: "Active",
    };
    setJobs(prev => [newJob, ...prev]);
    setForm({ title: "", type: "", salary: "", location: "", experience: "" });
    setOpen(false);
    toast.success("Job posted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="h-5 w-5 text-blue-600" /> Job Postings</h1>
          <p className="text-sm text-gray-500 mt-1">{jobs.filter(j => j.status === "Active").length} active postings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"><Plus className="h-4 w-4" /> Post Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Post Job</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1"><Label htmlFor="job-title">Job Title *</Label><Input id="job-title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Mathematics Faculty" /></div>
              <div className="space-y-1"><Label htmlFor="job-type">Job Type *</Label><Input id="job-type" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} placeholder="Full-time / Part-time" /></div>
              <div className="space-y-1"><Label htmlFor="job-salary">Salary</Label><Input id="job-salary" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="e.g. ₹25,000 - ₹35,000/mo" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label htmlFor="job-location">Location</Label><Input id="job-location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. On-site" /></div>
                <div className="space-y-1"><Label htmlFor="job-experience">Experience</Label><Input id="job-experience" value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. 2+ years" /></div>
              </div>
              <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700">Post Job</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {jobs.map(j => (
          <div key={j.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{j.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {j.type}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {j.salary}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.location}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{j.experience} experience • {j.applications} applications</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${j.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{j.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
