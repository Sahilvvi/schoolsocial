import { useOutletContext } from "react-router-dom";
import { IndianRupee, Plus, TrendingUp, Users, FileText } from "lucide-react";

const DEMO_FEE_STRUCTURE = [
  { id: "1", grade: "Nursery - KG", tuition: "₹25,000", transport: "₹8,000", activity: "₹5,000", total: "₹38,000", students: 80 },
  { id: "2", grade: "Class 1-5", tuition: "₹30,000", transport: "₹8,000", activity: "₹6,000", total: "₹44,000", students: 200 },
  { id: "3", grade: "Class 6-8", tuition: "₹35,000", transport: "₹10,000", activity: "₹7,000", total: "₹52,000", students: 180 },
  { id: "4", grade: "Class 9-10", tuition: "₹40,000", transport: "₹10,000", activity: "₹8,000", total: "₹58,000", students: 150 },
  { id: "5", grade: "Class 11-12", tuition: "₹45,000", transport: "₹10,000", activity: "₹10,000", total: "₹65,000", students: 120 },
];

const STATS = [
  { label: "Total Revenue", value: "₹45.2L", icon: IndianRupee, change: "+12%", color: "bg-green-50 text-green-600" },
  { label: "Pending Fees", value: "₹8.5L", icon: TrendingUp, change: "-5%", color: "bg-amber-50 text-amber-600" },
  { label: "Students Paid", value: "620", icon: Users, change: "+85%", color: "bg-blue-50 text-blue-600" },
  { label: "Fee Receipts", value: "1,240", icon: FileText, change: "+18%", color: "bg-purple-50 text-purple-600" },
];

export default function SPFees() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-blue-600" /> Fees & Admission
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage fee structure and payment tracking</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Add Fee Structure
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-9 w-9 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-green-600">{s.change}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Fee Structure</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">Grade</th>
                <th className="px-5 py-3 text-left font-semibold">Tuition Fee</th>
                <th className="px-5 py-3 text-left font-semibold">Transport</th>
                <th className="px-5 py-3 text-left font-semibold">Activity</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-left font-semibold">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DEMO_FEE_STRUCTURE.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{fee.grade}</td>
                  <td className="px-5 py-3.5 text-gray-600">{fee.tuition}</td>
                  <td className="px-5 py-3.5 text-gray-600">{fee.transport}</td>
                  <td className="px-5 py-3.5 text-gray-600">{fee.activity}</td>
                  <td className="px-5 py-3.5 font-bold text-blue-600">{fee.total}</td>
                  <td className="px-5 py-3.5 text-gray-600">{fee.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
