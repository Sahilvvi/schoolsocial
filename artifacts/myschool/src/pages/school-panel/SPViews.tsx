import { useOutletContext } from "react-router-dom";
import { Eye, TrendingUp, Users, Globe, Smartphone } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const VIEWS_DATA = [
  { date: "1 May", views: 120 }, { date: "5 May", views: 180 }, { date: "10 May", views: 250 },
  { date: "15 May", views: 320 }, { date: "20 May", views: 280 }, { date: "25 May", views: 410 },
  { date: "30 May", views: 380 },
];

const STATS = [
  { label: "Total Views", value: "2,456", change: "+18%", icon: Eye, color: "bg-blue-50 text-blue-600" },
  { label: "Unique Visitors", value: "1,890", change: "+12%", icon: Users, color: "bg-green-50 text-green-600" },
  { label: "Mobile Views", value: "1,650", change: "+25%", icon: Smartphone, color: "bg-purple-50 text-purple-600" },
  { label: "Avg. Time on Page", value: "3m 24s", change: "+8%", icon: Globe, color: "bg-orange-50 text-orange-600" },
];

const TOP_SOURCES = [
  { source: "Google Search", views: 890, pct: 36 },
  { source: "SchoolSocial Homepage", views: 650, pct: 26 },
  { source: "Direct Link", views: 420, pct: 17 },
  { source: "Social Media", views: 310, pct: 13 },
  { source: "Other", views: 186, pct: 8 },
];

export default function SPViews() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" /> Profile Views
        </h1>
        <p className="text-sm text-gray-500 mt-1">Track how many parents are viewing your school profile</p>
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

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">Views Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={VIEWS_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">Top Traffic Sources</h2>
        <div className="space-y-3">
          {TOP_SOURCES.map((src) => (
            <div key={src.source} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-40 truncate">{src.source}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${src.pct}%` }} />
              </div>
              <span className="text-sm font-semibold text-gray-600 w-16 text-right">{src.views}</span>
              <span className="text-xs text-gray-400 w-8 text-right">{src.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
