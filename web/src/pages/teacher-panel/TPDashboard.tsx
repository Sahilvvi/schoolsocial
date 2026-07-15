import { useOutletContext, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Users, Star, BookOpen, Clock, TrendingUp, IndianRupee, Briefcase, FileText, ArrowUpRight } from "lucide-react";

export default function TPDashboard() {
  const { teacherData } = useOutletContext<any>();

  const stats = [
    { label: "Experience", value: teacherData.experience, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Rating", value: `${teacherData.rating}/5`, sub: `${teacherData.reviews} reviews`, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Subjects", value: teacherData.subjects.length, sub: "active", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Students Taught", value: "500+", sub: "all time", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {teacherData.name}
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 px-2 py-0">Verified</Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{teacherData.title} • {teacherData.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/teacher-panel/profile" className="btn-primary text-sm px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl ${s.bg} ring-1 ring-inset ring-white/20 flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              {s.label === "Rating" && <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">★ Top</span>}
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 mb-0.5 tabular-nums">{s.value}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
                {s.sub && <span className="text-[10px] text-slate-400 hidden sm:inline-block">· {s.sub}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2"><Briefcase className="h-4 w-4 text-slate-400" /> Experience</h2>
              <Link to="/teacher-panel/experience" className="text-xs text-primary font-bold hover:text-primary/80 transition-colors">Edit</Link>
            </div>
            <div className="flex-1">
              <div className="divide-y divide-slate-50">
                {teacherData.experience_list.map((exp: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm text-slate-900">{exp.role}</p>
                      <Badge variant="outline" className="text-[10px] font-semibold bg-slate-50 shadow-none text-slate-500 border-slate-200">{exp.duration}</Badge>
                    </div>
                    <p className="text-xs font-semibold text-primary mb-1.5">{exp.school}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-slate-400" /> Achievements</h2>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {teacherData.achievements.map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-amber-50 ring-1 ring-amber-100 flex items-center justify-center shrink-0">
                      <Star className="h-3 w-3 text-amber-500" />
                    </div>
                    <span className="text-sm text-slate-700 leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /> Skills & Grades</h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {teacherData.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 shadow-none px-2.5 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Grades</h3>
                <div className="flex flex-wrap gap-2">
                  {teacherData.grades.map((g: string) => (
                    <Badge key={g} className="bg-primary/8 text-primary hover:bg-primary/15 border border-primary/20 shadow-none px-2.5 py-0.5">{g}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">Services</h2>
              <Link to="/teacher-panel/services" className="text-xs text-primary font-bold hover:text-primary/80 transition-colors">Manage</Link>
            </div>
            <div>
              <div className="divide-y divide-slate-50">
                {[
                  { label: "Home Tuition", active: teacherData.homeTuition },
                  { label: "Online Classes", active: teacherData.onlineClasses },
                  { label: "Paid Notes", active: teacherData.paidNotes },
                ].map(s => (
                  <div key={s.label} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-semibold text-slate-700">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${s.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span className={`text-xs font-bold ${s.active ? 'text-emerald-600' : 'text-slate-400'}`}>{s.active ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
