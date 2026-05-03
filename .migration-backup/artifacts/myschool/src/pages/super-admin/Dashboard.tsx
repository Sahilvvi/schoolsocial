import { useState } from "react";
import { superAdminLinks } from "./super-admin-links";
import { AdminLayout, StatCard } from "@/components/layouts";
import { useGetPlatformStats, useListSchools, useApproveSchool, useSuspendSchool } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, Briefcase, IndianRupee, Activity, CheckCircle2, XCircle, Star, Settings, Eye, ScrollText, TrendingUp, BarChart2, Globe, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

function useGrowthData() {
  return useQuery({
    queryKey: ["platform-growth"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/platform/growth`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      return data.chartData || [];
    },
    staleTime: 60000,
  });
}

function useRevenueData() {
  return useQuery({
    queryKey: ["platform-revenue"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/platform/revenue`, { headers: { Authorization: `Bearer ${getToken()}` } });
      return res.json();
    },
    staleTime: 60000,
  });
}

export default function SuperAdminDashboard() {
  const { data: stats } = useGetPlatformStats();
  const { data: schoolsData, refetch } = useListSchools({ status: "pending" });
  const { data: allSchoolsData } = useListSchools({});
  const approveMutation = useApproveSchool();
  const suspendMutation = useSuspendSchool();
  const [activeChart, setActiveChart] = useState<"schools" | "revenue">("schools");

  const { data: growthChartData } = useGrowthData();
  const { data: revenueApiData } = useRevenueData();

  const links = superAdminLinks;
const handleApprove = async (id: number) => {
    try { await approveMutation.mutateAsync({ id }); refetch(); } catch (e) { console.error(e); }
  };

  const handleSuspend = async (id: number) => {
    try { await suspendMutation.mutateAsync({ id }); refetch(); } catch (e) { console.error(e); }
  };

  const recentSchools = allSchoolsData?.schools?.slice(0, 5) || [];

  const growthData = growthChartData && growthChartData.length > 0 ? growthChartData : [];
  const revenueData = revenueApiData?.chartData && revenueApiData.chartData.length > 0 ? revenueApiData.chartData : [];
  const totalRevenue = revenueApiData?.totalCollected ?? stats?.totalRevenue ?? 0;
  const totalPendingRevenue = revenueApiData?.totalPending ?? 0;

  return (
    <AdminLayout title="Platform Overview" links={links}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Schools" value={stats?.totalSchools?.toString() || "0"} icon={Building2} trend="+12" />
          <StatCard title="Total Students" value={stats?.totalStudents ? `${Math.round(stats.totalStudents / 1000)}K+` : "0"} icon={Users} trend="+5.2%" colorClass="text-accent" bgClass="bg-accent/10" />
          <StatCard title="Active Teachers" value={stats?.totalTeachers?.toString() || "0"} icon={Briefcase} trend="+1.1%" colorClass="text-green-500" bgClass="bg-green-500/10" />
          <StatCard title="Fee Collected" value={`₹${totalRevenue ? (totalRevenue / 100000).toFixed(1) + 'L' : '0'}`} icon={IndianRupee} trend="+14%" colorClass="text-purple-500" bgClass="bg-purple-500/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-display">Platform Growth</h3>
              <div className="flex gap-2">
                <button onClick={() => setActiveChart("schools")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeChart === "schools" ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                  Schools
                </button>
                <button onClick={() => setActiveChart("revenue")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeChart === "revenue" ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                  Revenue
                </button>
              </div>
            </div>
            <div className="h-64">
              {activeChart === "schools" ? (
                growthData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p className="font-bold">No growth data yet</p>
                      <p className="text-sm mt-1">Data will appear as schools onboard</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="schoolsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }} />
                      <Area type="monotone" dataKey="schools" stroke="hsl(var(--primary))" fill="url(#schoolsGrad)" strokeWidth={2} name="Schools" />
                      <Area type="monotone" dataKey="students" stroke="hsl(var(--accent))" fill="none" strokeWidth={2} strokeDasharray="4 2" name="Students" />
                    </AreaChart>
                  </ResponsiveContainer>
                )
              ) : (
                revenueData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p className="font-bold">No revenue data yet</p>
                      <p className="text-sm mt-1">Revenue will appear as fees are collected</p>
                      {totalPendingRevenue > 0 && <p className="text-sm mt-2 text-orange-600 font-medium">₹{totalPendingRevenue.toLocaleString("en-IN")} pending collection</p>}
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )
              )}
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-display">Pending Approvals</h3>
              <span className="bg-destructive/10 text-destructive text-xs font-bold px-2.5 py-1 rounded-full">
                {stats?.pendingSchools || schoolsData?.schools?.length || 0} pending
              </span>
            </div>
            <div className="space-y-4">
              {schoolsData?.schools?.length ? (
                schoolsData.schools.map((s: any) => (
                  <div key={s.id} className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors">
                    <p className="font-bold text-foreground">{s.name}</p>
                    <p className="text-sm text-muted-foreground mb-3">{s.city} • {s.board}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 text-xs font-bold rounded-lg" onClick={() => handleApprove(s.id)} disabled={approveMutation.isPending}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs font-bold rounded-lg text-destructive hover:text-destructive border-destructive/30" onClick={() => handleSuspend(s.id)} disabled={suspendMutation.isPending}>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20 text-green-500" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm">No pending approvals</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Analytics Drill-Down */}
        {allSchoolsData?.schools && allSchoolsData.schools.length > 0 && (() => {
          const schools = allSchoolsData.schools as any[];
          const boardCounts: Record<string, number> = {};
          const statusCounts: Record<string, number> = {};
          const cityCounts: Record<string, number> = {};
          for (const s of schools) {
            if (s.board) boardCounts[s.board] = (boardCounts[s.board] || 0) + 1;
            const status = s.status || "approved";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            if (s.city) cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
          }
          const boardData = Object.entries(boardCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
          const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
          const cityData = Object.entries(cityCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
          const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-6 rounded-2xl shadow-sm">
                <h3 className="text-base font-bold font-display mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" />Schools by Board</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={boardData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                        {boardData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-6 rounded-2xl shadow-sm">
                <h3 className="text-base font-bold font-display mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" />School Status</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                        {statusData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-6 rounded-2xl shadow-sm">
                <h3 className="text-base font-bold font-display mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" />Top Cities</h3>
                <div className="space-y-2.5">
                  {cityData.map((c: any, i: number) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                      <div className="flex-1"><div className="flex justify-between items-center mb-1"><span className="text-sm font-bold text-foreground">{c.name}</span><span className="text-xs text-muted-foreground font-medium">{c.value} school{c.value !== 1 ? "s" : ""}</span></div><div className="h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.round((c.value / (cityData[0]?.value || 1)) * 100)}%`, backgroundColor: COLORS[i % COLORS.length] }} /></div></div>
                    </div>
                  ))}
                  {cityData.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No city data available</p>}
                </div>
              </Card>
            </div>
          );
        })()}

        <Card className="p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-display">Recently Onboarded Schools</h3>
            <Button variant="ghost" size="sm" className="text-primary font-bold rounded-xl"><Eye className="w-4 h-4 mr-2" /> View All</Button>
          </div>
          {recentSchools.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">No schools onboarded yet</p>
              <p className="text-sm">Schools will appear here once they register</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold rounded-tl-xl">School Name</th>
                    <th className="px-4 py-3 text-left font-bold">City</th>
                    <th className="px-4 py-3 text-left font-bold">Board</th>
                    <th className="px-4 py-3 text-left font-bold rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSchools.map((school: any) => (
                    <tr key={school.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="px-4 py-3 font-bold text-foreground">{school.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{school.city}</td>
                      <td className="px-4 py-3 text-muted-foreground">{school.board}</td>
                      <td className="px-4 py-3">
                        <Badge variant={school.status === "approved" ? "default" : "secondary"} className="capitalize rounded-full text-xs font-bold">{school.status === "approved" ? "Active" : school.status || "pending"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
