import { useOutletContext } from "react-router-dom";
import { Briefcase, Plus, MapPin, Clock, IndianRupee } from "lucide-react";

const JOBS = [
  { id: "1", title: "Mathematics Faculty", type: "Full-time", salary: "₹25,000 - ₹35,000/mo", location: "On-site", experience: "3+ years", applications: 12, status: "Active" },
  { id: "2", title: "Science Faculty (Physics)", type: "Part-time", salary: "₹15,000 - ₹20,000/mo", location: "On-site", experience: "2+ years", applications: 8, status: "Active" },
  { id: "3", title: "English Language Tutor", type: "Part-time", salary: "₹12,000 - ₹18,000/mo", location: "Hybrid", experience: "1+ years", applications: 15, status: "Closed" },
];

export default function TuPJobs() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="h-5 w-5 text-blue-600" /> Job Postings</h1>
          <p className="text-sm text-gray-500 mt-1">{JOBS.filter(j => j.status === "Active").length} active postings</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"><Plus className="h-4 w-4" /> Post Job</button>
      </div>
      <div className="space-y-4">
        {JOBS.map(j => (
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
