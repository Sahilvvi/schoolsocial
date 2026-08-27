import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, Plus, Star, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  rating: number;
  email: string;
  avatar: string;
}

const INITIAL_TEACHERS: Teacher[] = [
  { id: "1", name: "Dr. Anita Sharma", subject: "Mathematics", qualification: "Ph.D. Mathematics", experience: "15 years", rating: 4.8, email: "anita.s@school.edu", avatar: "AS" },
  { id: "2", name: "Rajesh Kumar", subject: "Physics", qualification: "M.Sc. Physics", experience: "12 years", rating: 4.6, email: "rajesh.k@school.edu", avatar: "RK" },
  { id: "3", name: "Priya Patel", subject: "English", qualification: "M.A. English Literature", experience: "10 years", rating: 4.9, email: "priya.p@school.edu", avatar: "PP" },
  { id: "4", name: "Suresh Verma", subject: "Chemistry", qualification: "M.Sc. Chemistry", experience: "8 years", rating: 4.5, email: "suresh.v@school.edu", avatar: "SV" },
  { id: "5", name: "Meena Gupta", subject: "Biology", qualification: "M.Sc. Zoology", experience: "11 years", rating: 4.7, email: "meena.g@school.edu", avatar: "MG" },
  { id: "6", name: "Arun Mishra", subject: "Computer Science", qualification: "MCA", experience: "7 years", rating: 4.4, email: "arun.m@school.edu", avatar: "AM" },
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function SPTeachers() {
  const { school } = useOutletContext<any>();
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", qualification: "", experience: "", rating: "", email: "" });

  const handleAdd = () => {
    if (!form.name || !form.subject) {
      toast.error("Name and subject are required");
      return;
    }
    const newTeacher: Teacher = {
      id: `t-${Date.now()}`,
      name: form.name,
      subject: form.subject,
      qualification: form.qualification || "—",
      experience: form.experience || "—",
      rating: Number(form.rating) || 0,
      email: form.email || "—",
      avatar: getInitials(form.name),
    };
    setTeachers(prev => [newTeacher, ...prev]);
    setForm({ name: "", subject: "", qualification: "", experience: "", rating: "", email: "" });
    setOpen(false);
    toast.success("Teacher added");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" /> Teachers
          </h1>
          <p className="text-sm text-gray-500 mt-1">{teachers.length} faculty members</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" /> Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Add Teacher</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1"><Label htmlFor="teacher-name">Name *</Label><Input id="teacher-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Teacher's full name" /></div>
              <div className="space-y-1"><Label htmlFor="teacher-subject">Subject *</Label><Input id="teacher-subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Mathematics" /></div>
              <div className="space-y-1"><Label htmlFor="teacher-qualification">Qualification</Label><Input id="teacher-qualification" value={form.qualification} onChange={e => setForm(p => ({ ...p, qualification: e.target.value }))} placeholder="e.g. Ph.D. Mathematics" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label htmlFor="teacher-experience">Experience</Label><Input id="teacher-experience" value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))} placeholder="e.g. 10 years" /></div>
                <div className="space-y-1"><Label htmlFor="teacher-rating">Rating</Label><Input id="teacher-rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: e.target.value }))} placeholder="0-5" /></div>
              </div>
              <div className="space-y-1"><Label htmlFor="teacher-email">Email</Label><Input id="teacher-email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="teacher@school.edu" /></div>
              <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700">Add Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">{teacher.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{teacher.subject}</p>
                <p className="text-xs text-gray-500 mt-0.5">{teacher.qualification}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Experience</span>
                <span className="font-semibold text-gray-900">{teacher.experience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Rating</span>
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {teacher.rating}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                <Mail className="h-3 w-3" /> {teacher.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
