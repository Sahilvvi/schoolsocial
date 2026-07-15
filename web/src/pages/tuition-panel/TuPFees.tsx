import { useOutletContext } from "react-router-dom";
import { IndianRupee, Plus, TrendingUp, Users } from "lucide-react";

const FEE_STRUCTURE = [
  { id: "1", course: "JEE Preparation", duration: "1 Year", batchSize: 25, fee: "₹35,000/yr", status: "Active" },
  { id: "2", course: "NEET Preparation", duration: "1 Year", batchSize: 20, fee: "₹40,000/yr", status: "Active" },
  { id: "3", course: "Class 9-10 (Science)", duration: "Per Month", batchSize: 30, fee: "₹3,500/mo", status: "Active" },
  { id: "4", course: "Class 11-12 (Commerce)", duration: "Per Month", batchSize: 25, fee: "₹3,000/mo", status: "Active" },
  { id: "5", course: "Foundation (Class 6-8)", duration: "Per Month", batchSize: 35, fee: "₹2,500/mo", status: "Active" },
];

export default function TuPFees() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-blue-600" /> Fee Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage course fees and payment tracking</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Fee Structure
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1"><IndianRupee className="h-4 w-4 text-green-600" /><span className="text-xs text-gray-500">Monthly Revenue</span></div>
          <p className="text-lg font-bold text-gray-900">₹2.8L</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-blue-600" /><span className="text-xs text-gray-500">Pending Dues</span></div>
          <p className="text-lg font-bold text-gray-900">₹45,000</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-purple-600" /><span className="text-xs text-gray-500">Paid Students</span></div>
          <p className="text-lg font-bold text-gray-900">112/135</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase"><th className="px-5 py-3 text-left">Course</th><th className="px-5 py-3 text-left">Duration</th><th className="px-5 py-3 text-left">Batch Size</th><th className="px-5 py-3 text-left">Fee</th><th className="px-5 py-3 text-left">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {FEE_STRUCTURE.map(f => (
              <tr key={f.id} className="hover:bg-gray-50"><td className="px-5 py-3.5 font-semibold text-gray-900">{f.course}</td><td className="px-5 py-3.5 text-gray-600">{f.duration}</td><td className="px-5 py-3.5 text-gray-600">{f.batchSize}</td><td className="px-5 py-3.5 font-bold text-blue-600">{f.fee}</td><td className="px-5 py-3.5"><span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{f.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
