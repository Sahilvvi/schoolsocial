import { useOutletContext } from "react-router-dom";
import { BookOpen, Plus, Users, Clock, IndianRupee } from "lucide-react";
import { useState } from "react";

const DEMO_COURSES = [
  { id: "1", name: "Science Stream", grade: "Class 11-12", students: 120, duration: "2 Years", fee: "₹45,000/yr", status: "Active" },
  { id: "2", name: "Commerce Stream", grade: "Class 11-12", students: 95, duration: "2 Years", fee: "₹42,000/yr", status: "Active" },
  { id: "3", name: "Arts Stream", grade: "Class 11-12", students: 60, duration: "2 Years", fee: "₹38,000/yr", status: "Active" },
  { id: "4", name: "Primary Section", grade: "Class 1-5", students: 200, duration: "5 Years", fee: "₹30,000/yr", status: "Active" },
  { id: "5", name: "Middle School", grade: "Class 6-8", students: 180, duration: "3 Years", fee: "₹35,000/yr", status: "Active" },
  { id: "6", name: "Secondary", grade: "Class 9-10", students: 150, duration: "2 Years", fee: "₹40,000/yr", status: "Active" },
];

export default function SPCourses() {
  const { school } = useOutletContext<any>();
  const [courses] = useState(DEMO_COURSES);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" /> Courses & Batches
          </h1>
          <p className="text-sm text-gray-500 mt-1">{courses.length} courses offered</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.grade}</p>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">{course.status}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-3.5 w-3.5" /> {course.students} students
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-3.5 w-3.5" /> {course.duration}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <IndianRupee className="h-3.5 w-3.5" /> {course.fee}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
