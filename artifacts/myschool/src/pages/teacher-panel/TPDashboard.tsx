import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, BookOpen, Clock, TrendingUp, IndianRupee, Briefcase, FileText } from "lucide-react";

export default function TPDashboard() {
  const { teacherData } = useOutletContext<any>();

  const stats = [
    { label: "Experience", value: teacherData.experience, icon: Clock, color: "from-blue-500 to-cyan-500" },
    { label: "Rating", value: `${teacherData.rating}/5`, sub: `${teacherData.reviews} reviews`, icon: Star, color: "from-amber-500 to-orange-500" },
    { label: "Subjects", value: teacherData.subjects.length, sub: teacherData.subjects.join(", "), icon: BookOpen, color: "from-violet-500 to-purple-500" },
    { label: "Students Taught", value: "500+", sub: "across all batches", icon: Users, color: "from-emerald-500 to-green-500" },
    { label: "Hourly Rate", value: teacherData.hourlyRate, sub: "per hour", icon: IndianRupee, color: "from-rose-500 to-pink-500" },
    { label: "Achievements", value: teacherData.achievements.length, sub: "awards & milestones", icon: TrendingUp, color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">{teacherData.name}</h1>
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Verified Teacher</Badge>
      </div>
      <p className="text-muted-foreground mb-8">{teacherData.title} • {teacherData.location}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Card key={s.label} className="border-border/30 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shrink-0`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                {s.sub && <p className="text-[10px] text-muted-foreground/60">{s.sub}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/30">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />Work Experience</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherData.experience_list.map((exp: any, i: number) => (
                <div key={i} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{exp.role}</p>
                    <p className="text-xs text-muted-foreground">{exp.school}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{exp.duration}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Skills & Expertise</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {teacherData.skills.map((skill: string) => (
                <Badge key={skill} variant="outline" className="px-3 py-1.5 rounded-lg border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-colors font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Grades</h4>
              <div className="flex flex-wrap gap-2">
                {teacherData.grades.map((g: string) => (
                  <Badge key={g} className="gradient-primary text-primary-foreground border-0 rounded-lg text-xs">{g}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Achievements</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherData.achievements.map((a: string, i: number) => (
                <div key={i} className="flex items-start gap-3 border-b border-border/20 pb-3 last:border-0">
                  <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                    <Star className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader><CardTitle className="text-lg">Services Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Home Tuition", active: teacherData.homeTuition },
              { label: "Online Classes", active: teacherData.onlineClasses },
              { label: "Paid Notes", active: teacherData.paidNotes },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm font-medium">{s.label}</span>
                <Badge className={s.active ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/30"}>
                  {s.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
