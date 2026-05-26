import { useOutletContext } from "react-router-dom";
import { TrendingUp, Users, MessageSquare, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const LEADS_DATA = [
  { week: "W1", enquiries: 12, applications: 5, conversions: 3 },
  { week: "W2", enquiries: 18, applications: 8, conversions: 5 },
  { week: "W3", enquiries: 15, applications: 6, conversions: 4 },
  { week: "W4", enquiries: 22, applications: 12, conversions: 8 },
];

const STATS = [
  { label: "Total Leads", value: "96", change: "+24%", up: true, icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Enquiries", value: "67", change: "+18%", up: true, icon: MessageSquare, color: "bg-green-50 text-green-600" },
  { label: "Applications", value: "31", change: "+15%", up: true, icon: FileText, color: "bg-purple-50 text-purple-600" },
  { label: "Conversion Rate", value: "32%", change: "-2%", up: false, icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
];

export default function SPLeads() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" /> Leads Report
        </h1>
        <p className="text-sm text-gray-500 mt-1">Track enquiry-to-admission conversion</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-9 w-9 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="h-4 w-4" />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? "text-green-600" : "text-red-500"}`}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.change}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">Weekly Lead Funnel</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={LEADS_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
              <Bar dataKey="enquiries" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} name="Enquiries" />
              <Bar dataKey="applications" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} name="Applications" />
              <Bar dataKey="conversions" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
