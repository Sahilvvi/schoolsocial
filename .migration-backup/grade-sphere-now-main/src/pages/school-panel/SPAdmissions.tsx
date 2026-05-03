import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search, Download } from "lucide-react";
import { DUMMY_ADMISSIONS } from "@/data/dummyData";
import { getDemoData, setDemoData } from "@/lib/demoStorage";

export default function SPAdmissions() {
  const { school } = useOutletContext<any>();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const queryKey = ["sp-admissions-full", school.id];

  const { data: admissions = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (isDemoUserId(user?.id)) {
        const stored = getDemoData<any[] | null>("sp-admissions", null);
        if (stored) return stored;
        const fallback = DUMMY_ADMISSIONS.filter((a) => a.school_id === school.id);
        setDemoData("sp-admissions", fallback);
        return fallback;
      }
      const { data, error } = await supabase.from("admissions").select("*").eq("school_id", school.id).order("created_at", { ascending: false });
      if (error || !data || data.length === 0) return DUMMY_ADMISSIONS.filter((a) => a.school_id === school.id);
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (isDemoUserId(user?.id)) {
        qc.setQueryData<any[]>(queryKey, (old = []) =>
          old.map((a) => (a.id === id ? { ...a, status } : a)),
        );
        return;
      }
      const { error } = await supabase.from("admissions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      if (isDemoUserId(user?.id)) {
        const current = qc.getQueryData<any[]>(queryKey);
        if (current) setDemoData("sp-admissions", current);
      } else {
        qc.invalidateQueries({ queryKey });
      }
      toast.success("Status updated");
    },
  });

  const filtered = admissions
    .filter(a => filter === "all" || a.status === filter)
    .filter(a => !search || a.student_name.toLowerCase().includes(search.toLowerCase()) || a.parent_name.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all: admissions.length,
    pending: admissions.filter(a => a.status === "pending").length,
    approved: admissions.filter(a => a.status === "approved").length,
    rejected: admissions.filter(a => a.status === "rejected").length,
  };

  const statusColor = (s: string): "default" | "destructive" | "secondary" =>
    s === "approved" ? "default" : s === "rejected" ? "destructive" : "secondary";

  const exportCSV = () => {
    const rows = [["Student", "Parent", "Grade", "Email", "Phone", "Status", "Date"]];
    admissions.forEach(a => rows.push([a.student_name, a.parent_name, a.grade, a.email, a.phone, a.status, format(new Date(a.created_at), "yyyy-MM-dd")]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `admissions-${school.slug}.csv`; a.click();
    toast.success("CSV downloaded");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admissions</h1>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-2" />Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map(key => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-xl p-3 text-center border transition-all ${filter === key ? "border-primary bg-primary/5" : "border-border/30 hover:border-primary/20"}`}
          >
            <div className="text-2xl font-bold">{counts[key]}</div>
            <div className="text-xs text-muted-foreground capitalize">{key}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student or parent name..." className="pl-10" />
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-xl border border-border/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.student_name}</TableCell>
                  <TableCell>{a.parent_name}</TableCell>
                  <TableCell>{a.grade}</TableCell>
                  <TableCell>
                    <div className="text-sm">{a.phone}</div>
                    <div className="text-xs text-muted-foreground">{a.email}</div>
                  </TableCell>
                  <TableCell className="text-sm">{format(new Date(a.created_at), "dd MMM yyyy")}</TableCell>
                  <TableCell><Badge variant={statusColor(a.status)}>{a.status}</Badge></TableCell>
                  <TableCell>
                    {a.status === "pending" ? (
                      <div className="flex gap-1">
                        <Button size="sm" className="h-7 text-xs" onClick={() => updateStatus.mutate({ id: a.id, status: "approved" })}>Approve</Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => updateStatus.mutate({ id: a.id, status: "rejected" })}>Reject</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus.mutate({ id: a.id, status: "pending" })}>Reset</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No admissions found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
