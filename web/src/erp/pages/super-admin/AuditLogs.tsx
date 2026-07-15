import { useState, useEffect } from "react";
import { superAdminLinks } from "./super-admin-links";
import { AdminLayout } from "@/erp/components/layouts";
import { Activity, Building2, Users, IndianRupee, Star, Settings, Shield, Search, RefreshCw, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

const links = superAdminLinks;
const ACTION_COLOR: Record<string, string> = {
  create: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  update: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  login: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  approve: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  reject: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  pay: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchLogs = (pg = 1, q = search) => {
    setLoading(true);
    fetch(`${BASE}/api/platform/audit-logs?page=${pg}&limit=50&search=${encodeURIComponent(q)}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => { setLogs(d.logs || []); setTotal(d.total || 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <AdminLayout title="Audit Logs" links={links}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Audit Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">{total} total events recorded</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 dark:border-gray-600" onClick={() => fetchLogs(page)}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search action, entity, user..." value={search} onChange={e => { setSearch(e.target.value); fetchLogs(1, e.target.value); }} className="pl-9 rounded-xl dark:bg-gray-800 dark:border-gray-700" />
      </div>
      <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Time</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Entity</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-16 text-center text-muted-foreground"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-16 text-center text-muted-foreground"><FileText className="w-8 h-8 mx-auto mb-2 opacity-20" /><p className="font-bold">No audit logs yet</p><p className="text-xs mt-1">Actions taken across the platform will appear here</p></td></tr>
              ) : logs.map((log: any) => (
                <tr key={log.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{log.createdAt ? new Date(log.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium dark:text-white">{log.user?.name || "System"}</div>
                    <div className="text-xs text-muted-foreground capitalize">{log.user?.role?.replace("_", " ") || ""}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${ACTION_COLOR[log.action] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-sm dark:text-gray-300">{log.entity}</span>
                    {log.entityId && <span className="text-xs text-muted-foreground ml-1">#{log.entityId}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">{log.details || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 50 && (
          <div className="flex justify-between items-center px-4 py-3 border-t dark:border-gray-700">
            <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 50)}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg" disabled={page <= 1} onClick={() => { setPage(p => p - 1); fetchLogs(page - 1); }}>Previous</Button>
              <Button variant="outline" size="sm" className="rounded-lg" disabled={page >= Math.ceil(total / 50)} onClick={() => { setPage(p => p + 1); fetchLogs(page + 1); }}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
