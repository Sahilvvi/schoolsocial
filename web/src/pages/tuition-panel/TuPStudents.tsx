import { useOutletContext } from "react-router-dom";
import { Users, Search, BookOpen } from "lucide-react";

const STUDENTS = [
  { id: "1", name: "Arjun Sharma", class: "Class 10", subjects: "Maths, Science", batch: "Morning", status: "Active", fees: "Paid", avatar: "AS" },
  { id: "2", name: "Sneha Patel", class: "Class 12", subjects: "Physics, Chemistry", batch: "Evening", status: "Active", fees: "Paid", avatar: "SP" },
  { id: "3", name: "Rahul Verma", class: "Class 9", subjects: "Maths, English", batch: "Morning", status: "Active", fees: "Pending", avatar: "RV" },
  { id: "4", name: "Ananya Gupta", class: "Class 11", subjects: "Biology, Chemistry", batch: "Afternoon", status: "Active", fees: "Paid", avatar: "AG" },
  { id: "5", name: "Vikas Kumar", class: "Class 10", subjects: "Maths, Science", batch: "Morning", status: "Inactive", fees: "Paid", avatar: "VK" },
  { id: "6", name: "Priya Singh", class: "Class 12", subjects: "Maths, Physics", batch: "Evening", status: "Active", fees: "Paid", avatar: "PS" },
];

export default function TuPStudents() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" /> Students</h1>
          <p className="text-sm text-gray-500 mt-1">{STUDENTS.filter(s => s.status === "Active").length} active students</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase"><th className="px-5 py-3 text-left">Student</th><th className="px-5 py-3 text-left">Class</th><th className="px-5 py-3 text-left">Subjects</th><th className="px-5 py-3 text-left">Batch</th><th className="px-5 py-3 text-left">Fees</th><th className="px-5 py-3 text-left">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {STUDENTS.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-3.5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0"><span className="text-white text-xs font-bold">{s.avatar}</span></div>
                  <span className="font-semibold text-gray-900">{s.name}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-600">{s.class}</td>
                <td className="px-5 py-3.5 text-gray-600">{s.subjects}</td>
                <td className="px-5 py-3.5 text-gray-600">{s.batch}</td>
                <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.fees === "Paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{s.fees}</span></td>
                <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.status === "Active" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
