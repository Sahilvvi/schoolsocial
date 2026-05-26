import { useOutletContext } from "react-router-dom";
import { BookOpen, Plus, Users } from "lucide-react";

const SUBJECTS = [
  { id: "1", name: "Mathematics", classes: "Class 6-12", students: 85, tutors: 3, color: "bg-blue-50 text-blue-700" },
  { id: "2", name: "Physics", classes: "Class 9-12", students: 60, tutors: 2, color: "bg-purple-50 text-purple-700" },
  { id: "3", name: "Chemistry", classes: "Class 9-12", students: 55, tutors: 2, color: "bg-green-50 text-green-700" },
  { id: "4", name: "Biology", classes: "Class 9-12", students: 45, tutors: 1, color: "bg-red-50 text-red-700" },
  { id: "5", name: "English", classes: "Class 1-12", students: 120, tutors: 4, color: "bg-orange-50 text-orange-700" },
  { id: "6", name: "Computer Science", classes: "Class 8-12", students: 40, tutors: 1, color: "bg-cyan-50 text-cyan-700" },
  { id: "7", name: "Accountancy", classes: "Class 11-12", students: 35, tutors: 1, color: "bg-amber-50 text-amber-700" },
  { id: "8", name: "Economics", classes: "Class 11-12", students: 30, tutors: 1, color: "bg-indigo-50 text-indigo-700" },
];

export default function TuPSubjects() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /> Subjects & Courses</h1>
          <p className="text-sm text-gray-500 mt-1">{SUBJECTS.length} subjects offered</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"><Plus className="h-4 w-4" /> Add Subject</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUBJECTS.map(s => (
          <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${s.color}`}>{s.name}</div>
            <p className="text-sm text-gray-500">{s.classes}</p>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="flex items-center gap-1 text-gray-600"><Users className="h-3.5 w-3.5" /> {s.students} students</span>
              <span className="text-gray-400">{s.tutors} tutors</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
