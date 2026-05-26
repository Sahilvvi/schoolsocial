import { useOutletContext } from "react-router-dom";
import { BarChart2, Eye, Users, MessageSquare, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const CHART_DATA = [
  { month: "Jan", views: 200, enquiries: 12 }, { month: "Feb", views: 280, enquiries: 18 },
  { month: "Mar", views: 350, enquiries: 25 }, { month: "Apr", views: 420, enquiries: 30 },
  { month: "May", views: 510, enquiries: 38 },
];

const STATS = [
  { label: "Profile Views", value: "1,890", change: "+22%", icon: Eye, color: "bg-blue-50 text-blue-600" },
  { label: "Total Enquiries", value: "143", change: "+15%", icon: MessageSquare, color: "bg-green-50 text-green-600" },
  { label: "Students Enrolled", value: "135", change: "+8%", icon: Users, color: "bg-purple-50 text-purple-600" },
  { label: "Conversion Rate", value: "28%", change: "+3%", icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
];

export default function TuPAnalytics() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><BarChart2 className="h-5 w-5 text-blue-600" /> Analytics & Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Performance overview for your tuition center</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-9 w-9 rounded-lg ${s.color} flex items-center justify-center`}><s.icon className="h-4 w-4" /></div>
              <span className="text-xs font-semibold text-green-600">{s.change}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">Monthly Performance</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="Views" />
              <Area type="monotone" dataKey="enquiries" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} name="Enquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
