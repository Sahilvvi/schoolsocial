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
          <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-all h-full">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{s.label}</p>
                {s.sub && <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline-block">({s.sub})</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Briefcase className="h-4 w-4 text-slate-400" /> Experience</h2>
              <Link to="/teacher-panel/experience" className="text-sm text-primary font-medium hover:underline">Edit</Link>
            </div>
            <div className="p-0 flex-1">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {teacherData.experience_list.map((exp: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{exp.role}</p>
                      <Badge variant="outline" className="text-[10px] font-medium bg-slate-50 dark:bg-slate-800/50 shadow-none text-slate-500 border-slate-200 dark:border-slate-700">{exp.duration}</Badge>
                    </div>
                    <p className="text-xs font-medium text-primary mb-2">{exp.school}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><TrendingUp className="h-4 w-4 text-slate-400" /> Achievements</h2>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {teacherData.achievements.map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Star className="h-3 w-3 text-amber-500" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /> Skills & Grades</h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {teacherData.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 shadow-none px-2.5 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Grades</h3>
                <div className="flex flex-wrap gap-2">
                  {teacherData.grades.map((g: string) => (
                    <Badge key={g} className="bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none px-2.5 py-0.5">{g}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">Services</h2>
              <Link to="/teacher-panel/services" className="text-sm text-primary font-medium hover:underline">Manage</Link>
            </div>
            <div className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { label: "Home Tuition", active: teacherData.homeTuition },
                  { label: "Online Classes", active: teacherData.onlineClasses },
                  { label: "Paid Notes", active: teacherData.paidNotes },
                ].map(s => (
                  <div key={s.label} className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${s.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                      <span className={`text-xs font-medium ${s.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>{s.active ? "Active" : "Inactive"}</span>
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
