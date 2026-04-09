import { useState, useEffect } from "react";
import { superAdminLinks } from "./super-admin-links";
import { AdminLayout } from "@/components/layouts";
import { Activity, Building2, Users, IndianRupee, Star, Settings, User, Mail, Shield, GraduationCap, BookOpen, Baby, Search, RefreshCw, ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

const links = superAdminLinks;
const roleIcon: Record<string, any> = { super_admin: Shield, school_admin: Building2, teacher: BookOpen, parent: User, student: GraduationCap, job_seeker: Baby };
const roleColor: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  school_admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  teacher: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  parent: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  student: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  job_seeker: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

interface PlatformUser { id: number; name: string; email: string; role: string; schoolId?: number; schoolName?: string; status: string; createdAt: string; }

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [roleStats, setRoleStats] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${BASE}/api/platform/users?limit=100`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setRoleStats(d.roleStats || {}); setTotal(d.total || 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.role.includes(search.toLowerCase())
  );

  const statCards = [
    { role: "School Admins", count: roleStats.school_admin || 0, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { role: "Teachers", count: roleStats.teacher || 0, icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10" },
    { role: "Parents", count: roleStats.parent || 0, icon: User, color: "text-orange-500", bg: "bg-orange-500/10" },
    { role: "Students", count: roleStats.student || 0, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-600/10" },
  ];

  return (
    <AdminLayout title="All Users" links={links}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.role} className="p-5 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground dark:text-white">{stat.count.toLocaleString()}</div>
              <div className="text-sm font-medium text-muted-foreground dark:text-gray-400">{stat.role}</div>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl border-border shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 border-b border-border dark:border-gray-700 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-foreground dark:text-white">Platform Users</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">{total} total registered users</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 w-56 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <button onClick={fetchUsers} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}/>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"/></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/20 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 font-bold dark:text-gray-400">User</th>
                  <th className="px-6 py-4 font-bold dark:text-gray-400">Role</th>
                  <th className="px-6 py-4 font-bold dark:text-gray-400">School</th>
                  <th className="px-6 py-4 font-bold dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 font-bold dark:text-gray-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const Icon = roleIcon[u.role] || User;
                  return (
                    <tr key={u.id} className="border-b border-border/50 dark:border-gray-700 hover:bg-secondary/10 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-foreground dark:text-white">{u.name}</div>
                            <div className="text-xs text-muted-foreground dark:text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${roleColor[u.role] || "bg-secondary text-foreground"}`}>
                          <Icon className="w-3 h-3" />{u.role.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-muted-foreground dark:text-gray-400">{u.schoolName || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">active</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-muted-foreground dark:text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-border dark:border-gray-700 bg-secondary/20 dark:bg-gray-700/20 text-center">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Showing {filtered.length} of {total} users from live database</p>
        </div>
      </Card>
    </AdminLayout>
  );
}
