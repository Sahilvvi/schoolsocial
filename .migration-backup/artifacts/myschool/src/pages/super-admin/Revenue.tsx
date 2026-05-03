import { useState, useEffect } from "react";
import { superAdminLinks } from "./super-admin-links";
import { AdminLayout } from "@/components/layouts";
import { Activity, Building2, Users, IndianRupee, Star, Settings, TrendingUp, ArrowUpRight, ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

const links = superAdminLinks;
interface RevenueData { chartData: { month: string; revenue: number; transactions: number }[]; totalCollected: number; totalPending: number; planData: { plan: string; count: number }[]; }

export default function SuperAdminRevenue() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/platform/revenue`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

  const revStats = [
    { label: "Total Collected", value: fmt(data?.totalCollected || 0), change: "from real fees", icon: IndianRupee, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Pending Collection", value: fmt(data?.totalPending || 0), change: "from real fees", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Plan: Free", value: String(data?.planData?.find(p => p.plan === "free")?.count || 0), change: "schools", icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Plan: Premium", value: String(data?.planData?.find(p => p.plan === "premium")?.count || 0), change: "schools", icon: ArrowUpRight, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <AdminLayout title="Revenue Analytics" links={links}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {revStats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-foreground dark:text-white">{loading ? "..." : stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground dark:text-gray-400">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-2 dark:text-white">Fee Collection Trend</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Real data from platform fees</p>
          {loading ? <div className="h-64 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"/></div> : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.chartData || []}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-6 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Plan Distribution</h3>
          {loading ? <div className="space-y-4">{[0,1,2].map(i => <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"/>)}</div> : (
            <div className="space-y-5">
              {(data?.planData || []).map(p => {
                const total = data?.planData?.reduce((a, b) => a + b.count, 0) || 1;
                const pct = Math.round((p.count / total) * 100);
                return (
                  <div key={p.plan}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-sm text-foreground dark:text-white capitalize">{p.plan}</span>
                      <span className="text-sm text-muted-foreground dark:text-gray-400">{p.count} schools</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">{pct}% of schools</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-2 dark:text-white">Monthly Transactions</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Number of fee transactions processed per month</p>
        {!loading && (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="transactions" name="Transactions" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
