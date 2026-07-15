import { useOutletContext } from "react-router-dom";
import { Users, Plus, Star, Mail, Phone } from "lucide-react";

const DEMO_TEACHERS = [
  { id: "1", name: "Dr. Anita Sharma", subject: "Mathematics", qualification: "Ph.D. Mathematics", experience: "15 years", rating: 4.8, email: "anita.s@school.edu", avatar: "AS" },
  { id: "2", name: "Rajesh Kumar", subject: "Physics", qualification: "M.Sc. Physics", experience: "12 years", rating: 4.6, email: "rajesh.k@school.edu", avatar: "RK" },
  { id: "3", name: "Priya Patel", subject: "English", qualification: "M.A. English Literature", experience: "10 years", rating: 4.9, email: "priya.p@school.edu", avatar: "PP" },
  { id: "4", name: "Suresh Verma", subject: "Chemistry", qualification: "M.Sc. Chemistry", experience: "8 years", rating: 4.5, email: "suresh.v@school.edu", avatar: "SV" },
  { id: "5", name: "Meena Gupta", subject: "Biology", qualification: "M.Sc. Zoology", experience: "11 years", rating: 4.7, email: "meena.g@school.edu", avatar: "MG" },
  { id: "6", name: "Arun Mishra", subject: "Computer Science", qualification: "MCA", experience: "7 years", rating: 4.4, email: "arun.m@school.edu", avatar: "AM" },
];

export default function SPTeachers() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" /> Teachers
          </h1>
          <p className="text-sm text-gray-500 mt-1">{DEMO_TEACHERS.length} faculty members</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_TEACHERS.map((teacher) => (
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
