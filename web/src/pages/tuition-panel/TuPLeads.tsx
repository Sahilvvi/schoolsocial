import { useOutletContext } from "react-router-dom";
import { TrendingUp, Users, MessageSquare, FileText, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const DATA = [
  { week: "W1", enquiries: 8, conversions: 3 }, { week: "W2", enquiries: 12, conversions: 5 },
  { week: "W3", enquiries: 10, conversions: 4 }, { week: "W4", enquiries: 15, conversions: 7 },
];

export default function TuPLeads() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-600" /> Leads Report</h1>
        <p className="text-sm text-gray-500 mt-1">Track enquiry-to-enrollment conversion</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: "45", icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "Converted", value: "19", icon: ArrowUpRight, color: "bg-green-50 text-green-600" },
          { label: "Pending", value: "18", icon: MessageSquare, color: "bg-amber-50 text-amber-600" },
          { label: "Conversion Rate", value: "42%", icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className={`h-9 w-9 rounded-lg ${s.color} flex items-center justify-center mb-2`}><s.icon className="h-4 w-4" /></div>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">Weekly Conversion Funnel</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
              <Bar dataKey="enquiries" fill="#3b82f6" radius={[4,4,0,0]} barSize={20} />
              <Bar dataKey="conversions" fill="#22c55e" radius={[4,4,0,0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
