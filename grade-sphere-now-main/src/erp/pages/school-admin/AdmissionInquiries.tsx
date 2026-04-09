import { useState, useEffect } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { useAuth } from "@/erp/hooks/use-auth";
import { UserPlus, Loader2, Phone, Mail, Check, XCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";
const STATUS_COLOR: Record<string, string> = { new: "bg-blue-100 text-blue-700", contacted: "bg-yellow-100 text-yellow-700", enrolled: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };

export default function AdmissionInquiries() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchAll = async () => {
    setLoading(true);
    const res = await fetch(`${BASE}/api/admissions/inquiry?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } });
    setInquiries((await res.json()).inquiries || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${BASE}/api/admissions/inquiry/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ status }) });
    toast({ title: `Status updated to ${status}` }); fetchAll();
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <AdminLayout title="Admission Inquiries" links={adminLinks}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="grid grid-cols-4 gap-3">
          {["new","contacted","enrolled","rejected"].map(s => (
            <div key={s} className="text-center">
              <p className="text-lg font-bold dark:text-white">{inquiries.filter(i => i.status === s).length}</p>
              <p className="text-xs text-muted-foreground capitalize">{s}</p>
            </div>
          ))}
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36 dark:bg-gray-800 dark:border-gray-700"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="new">New</SelectItem><SelectItem value="contacted">Contacted</SelectItem><SelectItem value="enrolled">Enrolled</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent>
        </Select>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      : filtered.length === 0 ? <div className="text-center py-16 text-muted-foreground"><UserPlus className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No admission inquiries yet</p><p className="text-sm">Inquiries submitted from the public portal will appear here</p></div>
      : <div className="space-y-3">
          {filtered.map(i => (
            <Card key={i.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold dark:text-white">{i.studentName}</p>
                    <Badge className={`text-xs rounded-full ${STATUS_COLOR[i.status]}`}>{i.status}</Badge>
                    {i.gradeApplying && <Badge variant="outline" className="text-xs rounded-full">Grade: {i.gradeApplying}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Parent: {i.parentName}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{i.parentPhone}</span>
                    {i.parentEmail && <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{i.parentEmail}</span>}
                  </div>
                  {i.message && <p className="text-xs text-muted-foreground mt-2 italic">"{i.message}"</p>}
                  <p className="text-xs text-muted-foreground mt-1">{new Date(i.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {i.status === "new" && <Button size="sm" onClick={() => updateStatus(i.id, "contacted")} className="rounded-lg h-8 text-xs"><MessageSquare className="w-3 h-3 mr-1" />Contacted</Button>}
                  {i.status === "contacted" && <Button size="sm" className="rounded-lg h-8 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus(i.id, "enrolled")}><Check className="w-3 h-3 mr-1" />Enroll</Button>}
                  {i.status !== "rejected" && <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs text-red-600 border-red-200" onClick={() => updateStatus(i.id, "rejected")}><XCircle className="w-3 h-3 mr-1" />Reject</Button>}
                </div>
              </div>
            </Card>
          ))}
        </div>}
    </AdminLayout>
  );
}
