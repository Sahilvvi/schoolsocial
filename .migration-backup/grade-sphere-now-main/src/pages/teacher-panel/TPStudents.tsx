import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, MapPin, Phone, Mail, Star, Plus, Search } from "lucide-react";
import { toast } from "sonner";

const dummyStudents = [
  { id: "s1", name: "Arjun Patel", grade: "Class 10", subject: "Mathematics", phone: "+91 98765 11111", email: "arjun@email.com", rating: 4.5, status: "active", joinedDate: "2024-01-15" },
  { id: "s2", name: "Ishaan Kumar", grade: "Class 12", subject: "Physics", phone: "+91 98765 22222", email: "ishaan@email.com", rating: 4.8, status: "active", joinedDate: "2024-02-01" },
  { id: "s3", name: "Meera Sharma", grade: "Class 9", subject: "Mathematics", phone: "+91 98765 33333", email: "meera@email.com", rating: 4.2, status: "active", joinedDate: "2024-03-10" },
  { id: "s4", name: "Ananya Gupta", grade: "Class 11", subject: "Mathematics", phone: "+91 98765 44444", email: "ananya@email.com", rating: 4.7, status: "active", joinedDate: "2024-01-20" },
  { id: "s5", name: "Rahul Singh", grade: "Class 10", subject: "Physics", phone: "+91 98765 55555", email: "rahul@email.com", rating: 3.9, status: "inactive", joinedDate: "2023-09-01" },
  { id: "s6", name: "Priya Verma", grade: "Class 12", subject: "Mathematics", phone: "+91 98765 66666", email: "priya.v@email.com", rating: 4.6, status: "active", joinedDate: "2024-04-01" },
];

export default function TPStudents() {
  const [students, setStudents] = useState(dummyStudents);
  const [search, setSearch] = useState("");

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase()) ||
    s.grade.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = students.filter(s => s.status === "active").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Students</h1>
          <p className="text-sm text-muted-foreground mt-1">{activeCount} active students • {students.length} total</p>
        </div>
        <Button className="rounded-lg gradient-primary border-0 shadow-lg shadow-primary/20 gap-1" onClick={() => toast.info("Add student feature coming soon!")}>
          <Plus className="h-4 w-4" /> Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: students.length, color: "from-blue-500 to-cyan-500", icon: Users },
          { label: "Active", value: activeCount, color: "from-emerald-500 to-green-500", icon: GraduationCap },
          { label: "Avg Rating", value: (students.reduce((s, st) => s + st.rating, 0) / students.length).toFixed(1), color: "from-amber-500 to-orange-500", icon: Star },
          { label: "Subjects", value: [...new Set(students.map(s => s.subject))].length, color: "from-violet-500 to-purple-500", icon: GraduationCap },
        ].map(s => (
          <Card key={s.label} className="border-border/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shrink-0`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-extrabold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search students by name, subject, or grade..."
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {filtered.map(student => (
          <Card key={student.id} className="border-border/30 hover:border-primary/20 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground shadow-md">
                  {student.name[0]}
                </div>
                <div>
                  <p className="font-bold text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.grade} • {student.subject}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-sm font-semibold">{student.rating}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Joined {new Date(student.joinedDate).toLocaleDateString()}</p>
                </div>
                <Badge className={student.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/30"}>
                  {student.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
