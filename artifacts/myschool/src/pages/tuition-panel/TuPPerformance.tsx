import { useOutletContext } from "react-router-dom";
import { Star, Award, TrendingUp, Users } from "lucide-react";

const METRICS = [
  { label: "Overall Rating", value: "4.6/5", icon: Star, color: "bg-amber-50 text-amber-600", desc: "Based on 48 reviews" },
  { label: "Student Satisfaction", value: "92%", icon: Award, color: "bg-green-50 text-green-600", desc: "From monthly surveys" },
  { label: "Result Improvement", value: "+28%", icon: TrendingUp, color: "bg-blue-50 text-blue-600", desc: "Avg. marks improvement" },
  { label: "Retention Rate", value: "88%", icon: Users, color: "bg-purple-50 text-purple-600", desc: "Students continuing" },
];

const TOP_SUBJECTS = [
  { name: "Mathematics", avgScore: 85, improvement: "+15%", students: 85 },
  { name: "Physics", avgScore: 78, improvement: "+12%", students: 60 },
  { name: "Chemistry", avgScore: 82, improvement: "+18%", students: 55 },
  { name: "English", avgScore: 88, improvement: "+8%", students: 120 },
];

export default function TuPPerformance() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Star className="h-5 w-5 text-blue-600" /> Performance Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Track your center's performance metrics</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map(m => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className={`h-9 w-9 rounded-lg ${m.color} flex items-center justify-center mb-2`}><m.icon className="h-4 w-4" /></div>
            <p className="text-lg font-bold text-gray-900">{m.value}</p>
            <p className="text-xs font-semibold text-gray-700">{m.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Subject-wise Performance</h2></div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase"><th className="px-5 py-3 text-left">Subject</th><th className="px-5 py-3 text-left">Avg Score</th><th className="px-5 py-3 text-left">Improvement</th><th className="px-5 py-3 text-left">Students</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {TOP_SUBJECTS.map(s => (
              <tr key={s.name} className="hover:bg-gray-50">
                <td className="px-5 py-3.5 font-semibold text-gray-900">{s.name}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${s.avgScore}%` }} /></div>
                    <span className="text-gray-600">{s.avgScore}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-green-600 font-semibold">{s.improvement}</td>
                <td className="px-5 py-3.5 text-gray-600">{s.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
