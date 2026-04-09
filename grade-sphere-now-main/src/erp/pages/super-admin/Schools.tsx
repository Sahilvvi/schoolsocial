import { useState } from "react";
import { superAdminLinks } from "./super-admin-links";
import { AdminLayout } from "@/erp/components/layouts";
import { useListSchools, useApproveSchool, useSuspendSchool } from "@/erp/api-client";
import { Building2, Search, CheckCircle2, XCircle, Eye, Loader2, LogIn, AlertTriangle, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useToast } from "@/erp/hooks/use-toast";

const links = superAdminLinks;
const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  approved: "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-700",
  suspended: "bg-red-100 text-red-700",
};

const BASE = () => import.meta.env.BASE_URL.replace(/\/$/, "");
const tok = () => localStorage.getItem("myschool_token") || "";

export default function SuperAdminSchools() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const { data, isLoading, refetch } = useListSchools({ search: search || undefined, status: statusFilter === "all" ? undefined : statusFilter as any });
  const approveMutation = useApproveSchool();
  const suspendMutation = useSuspendSchool();

  const schools = data?.schools || [];
  const pending = schools.filter((s: any) => s.status === "pending");

  const handleApprove = async (id: number) => {
    try { await approveMutation.mutateAsync({ id }); refetch(); toast({ title: "School approved!" }); }
    catch { toast({ title: "Failed to approve", variant: "destructive" }); }
  };
  const handleSuspend = async (id: number) => {
    try { await suspendMutation.mutateAsync({ id }); refetch(); toast({ title: "School suspended" }); }
    catch { toast({ title: "Failed to suspend", variant: "destructive" }); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}" permanently? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${BASE()}/api/schools/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } });
      if (res.ok) { refetch(); toast({ title: "School deleted" }); }
      else toast({ title: "Failed to delete", variant: "destructive" });
    } catch { toast({ title: "Error deleting", variant: "destructive" }); }
  };

  const handleImpersonate = async (schoolId: number, schoolName: string) => {
    try {
      const res = await fetch(`${BASE()}/api/schools/${schoolId}/impersonate`, { method: "POST", headers: { Authorization: `Bearer ${tok()}` } });
      if (res.ok) {
        const d = await res.json();
        const prevToken = localStorage.getItem("myschool_token");
        if (prevToken) localStorage.setItem("myschool_prev_token", prevToken);
        localStorage.setItem("myschool_token", d.token);
        toast({ title: `Now logged in as ${schoolName} admin` });
        setLocation("/school-admin");
      } else toast({ title: "Impersonation not available", variant: "destructive" });
    } catch { toast({ title: "Error impersonating", variant: "destructive" }); }
  };

  const toggleSelect = (id: number) => {
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleSelectAll = () => {
    if (selected.size === schools.length) setSelected(new Set());
    else setSelected(new Set(schools.map((s: any) => s.id)));
  };

  const bulkApprove = async () => {
    setBulkLoading(true);
    const ids = Array.from(selected).filter(id => schools.find((s: any) => s.id === id)?.status === "pending");
    for (const id of ids) { try { await approveMutation.mutateAsync({ id }); } catch {} }
    setSelected(new Set()); refetch(); setBulkLoading(false);
    toast({ title: `Approved ${ids.length} schools` });
  };

  const bulkSuspend = async () => {
    if (!confirm(`Suspend ${selected.size} selected schools?`)) return;
    setBulkLoading(true);
    const ids = Array.from(selected);
    for (const id of ids) { try { await suspendMutation.mutateAsync({ id }); } catch {} }
    setSelected(new Set()); refetch(); setBulkLoading(false);
    toast({ title: `Suspended ${ids.length} schools` });
  };

  return (
    <AdminLayout title="Manage Schools" links={links}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display">All Schools</h2>
          <p className="text-muted-foreground font-medium">{data?.total || 0} schools on the platform</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools..." className="pl-9 h-11 rounded-xl bg-secondary/50 border-none" />
        </div>
      </div>

      {/* Pending Approval Queue */}
      {pending.length > 0 && (
        <Card className="p-4 rounded-2xl border-orange-200 bg-orange-50 dark:bg-orange-900/10 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="font-bold text-orange-700">{pending.length} school{pending.length > 1 ? "s" : ""} awaiting approval</p>
          </div>
          <div className="space-y-2">
            {pending.map((school: any) => (
              <div key={school.id} className="flex items-center justify-between gap-3 bg-white dark:bg-orange-950/20 rounded-xl p-3">
                <div>
                  <p className="font-bold text-sm text-foreground">{school.name}</p>
                  <p className="text-xs text-muted-foreground">{school.city}, {school.state} • {school.email}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleApprove(school.id)} disabled={approveMutation.isPending} className="rounded-lg text-xs font-bold bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleSuspend(school.id)} disabled={suspendMutation.isPending} className="rounded-lg text-xs font-bold text-red-600 border-red-200">
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tabs + Bulk Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <Tabs value={statusFilter} onValueChange={v => { setStatusFilter(v); setSelected(new Set()); }} className="flex-1">
          <TabsList className="bg-secondary/50 p-1 rounded-xl h-auto">
            <TabsTrigger value="all" className="rounded-lg px-4 py-2 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">All ({data?.total || 0})</TabsTrigger>
            <TabsTrigger value="approved" className="rounded-lg px-4 py-2 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Active</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg px-4 py-2 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
            <TabsTrigger value="suspended" className="rounded-lg px-4 py-2 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Suspended</TabsTrigger>
          </TabsList>
        </Tabs>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-xl">
            <span className="text-sm font-bold text-primary">{selected.size} selected</span>
            <Button size="sm" onClick={bulkApprove} disabled={bulkLoading} className="rounded-lg text-xs font-bold h-7 bg-green-600 hover:bg-green-700">Approve All</Button>
            <Button size="sm" variant="outline" onClick={bulkSuspend} disabled={bulkLoading} className="rounded-lg text-xs font-bold h-7 text-red-600 border-red-200">Suspend All</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} className="rounded-lg text-xs h-7 text-muted-foreground">Clear</Button>
          </div>
        )}
      </div>

      {/* Schools Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : schools.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold mb-2">No schools found</p>
          <p>Try changing your filters</p>
        </div>
      ) : (
        <>
          {/* Select all bar */}
          <div className="flex items-center gap-3 px-2 mb-2">
            <input type="checkbox" checked={selected.size === schools.length && schools.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded accent-primary" />
            <span className="text-xs text-muted-foreground font-medium">Select all {schools.length} schools</span>
          </div>
          <div className="space-y-3">
            {schools.map((school: any) => (
              <Card key={school.id} className={`p-5 rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow ${selected.has(school.id) ? "ring-2 ring-primary" : ""}`}>
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={selected.has(school.id)} onChange={() => toggleSelect(school.id)} className="w-4 h-4 rounded accent-primary shrink-0" />
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                    {school.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-foreground text-base leading-tight">{school.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusColors[school.status] || "bg-secondary text-foreground"}`}>{school.status === "approved" ? "Active" : school.status || "pending"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium flex-wrap mt-0.5">
                      <span>{school.city}, {school.state}</span>
                      {school.board && <span className="font-bold text-foreground/60">{school.board}</span>}
                      {school.type && <span className="capitalize">{school.type}</span>}
                      {school.email && <span>{school.email}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setLocation(`/schools/${school.slug}`)} className="font-bold text-primary hover:bg-primary/10 rounded-lg h-8 text-xs">
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => handleImpersonate(school.id, school.name)} className="font-bold text-blue-600 hover:bg-blue-50 rounded-lg h-8 text-xs">
                      <LogIn className="w-3.5 h-3.5 mr-1" /> Login As
                    </Button>

                    {school.status === "pending" && (
                      <Button size="sm" onClick={() => handleApprove(school.id)} disabled={approveMutation.isPending} className="rounded-lg text-xs font-bold h-8 bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    )}

                    {school.status !== "suspended" && school.status !== "pending" && (
                      <Button size="sm" variant="outline" onClick={() => handleSuspend(school.id)} disabled={suspendMutation.isPending} className="rounded-lg text-xs font-bold h-8 text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Suspend
                      </Button>
                    )}

                    {school.status === "suspended" && (
                      <Button size="sm" variant="outline" onClick={() => handleApprove(school.id)} disabled={approveMutation.isPending} className="rounded-lg text-xs font-bold h-8 text-green-600 border-green-200 hover:bg-green-50">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Reinstate
                      </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={() => handleDelete(school.id, school.name)} className="font-bold text-red-500 hover:bg-red-50 rounded-lg h-8 text-xs">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
