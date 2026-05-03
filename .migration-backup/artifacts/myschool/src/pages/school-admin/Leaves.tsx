import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { useAuth } from "@/hooks/use-auth";
import { adminLinks } from "./admin-links";
import { CalendarOff, CheckCircle2, XCircle, Loader2, RefreshCw, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

const STATUS_TAB = ["all", "pending", "approved", "rejected"] as const;
type StatusTab = typeof STATUS_TAB[number];

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
};

export default function Leaves() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;

  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [reviewLeave, setReviewLeave] = useState<any | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchLeaves = () => {
    setLoading(true);
    fetch(`${BASE}/api/leaves?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => setLeaves(d.leaves || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeaves(); }, [schoolId]);

  const filtered = leaves.filter(l => activeTab === "all" || l.status === activeTab);
  const pendingCount = leaves.filter(l => l.status === "pending").length;

  const handleUpdateStatus = async (status: "approved" | "rejected") => {
    if (!reviewLeave) return;
    setUpdating(true);
    try {
      const res = await fetch(`${BASE}/api/leaves/${reviewLeave.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status, adminNote }),
      });
      if (!res.ok) throw new Error();
      setLeaves(prev => prev.map(l => l.id === reviewLeave.id ? { ...l, status, adminNote } : l));
      toast({ title: status === "approved" ? "Leave Approved" : "Leave Rejected", description: `Leave request for ${reviewLeave.teacherName} has been ${status}.` });
      setReviewLeave(null);
      setAdminNote("");
    } catch {
      toast({ title: "Error", description: "Failed to update leave status", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  const daysBetween = (from: string, to: string) => {
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <AdminLayout title="Leave Approvals" links={adminLinks}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {STATUS_TAB.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-secondary text-muted-foreground hover:text-foreground dark:bg-gray-700 dark:text-gray-300"}`}>
                {tab} {tab === "pending" && pendingCount > 0 && <span className="ml-1 bg-white/30 text-xs px-1.5 rounded-full">{pendingCount}</span>}
              </button>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl dark:border-gray-600 dark:text-gray-300" onClick={fetchLeaves}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <CalendarOff className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold">{activeTab === "pending" ? "No pending leave requests" : "No leave requests"}</p>
          <p className="text-sm mt-2">All requests will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(leave => (
            <Card key={leave.id} className="p-5 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                    {(leave.teacherName || "T")[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold dark:text-white">{leave.teacherName || "Teacher"}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold border capitalize ${STATUS_COLOR[leave.status]}`}>
                        {leave.status}
                      </span>
                      <span className="text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full capitalize">
                        {leave.leaveType?.replace("_", " ")} Leave
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      <span className="font-medium">{new Date(leave.fromDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      {" — "}
                      <span className="font-medium">{new Date(leave.toDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="ml-2 text-xs">({daysBetween(leave.fromDate, leave.toDate)} day{daysBetween(leave.fromDate, leave.toDate) !== 1 ? "s" : ""})</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{leave.reason}</p>
                    {leave.adminNote && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">Admin note: {leave.adminNote}</p>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {leave.status === "pending" ? (
                    <Button size="sm" className="rounded-xl font-bold text-xs" onClick={() => { setReviewLeave(leave); setAdminNote(""); }}>
                      Review
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {leave.updatedAt ? new Date(leave.updatedAt).toLocaleDateString("en-IN") : ""}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!reviewLeave} onOpenChange={o => { if (!o) { setReviewLeave(null); setAdminNote(""); } }}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Review Leave Request</DialogTitle>
          </DialogHeader>
          {reviewLeave && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 dark:bg-gray-700/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-bold dark:text-white">{reviewLeave.teacherName}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold capitalize">
                    {reviewLeave.leaveType?.replace("_", " ")} Leave
                  </span>
                </div>
                <p className="text-sm font-medium dark:text-gray-300">
                  {new Date(reviewLeave.fromDate).toLocaleDateString("en-IN")} — {new Date(reviewLeave.toDate).toLocaleDateString("en-IN")}
                  <span className="ml-2 text-xs text-muted-foreground">({daysBetween(reviewLeave.fromDate, reviewLeave.toDate)} days)</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{reviewLeave.reason}</p>
              </div>
              <div>
                <Label className="dark:text-gray-300">Admin Note (optional)</Label>
                <Textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add a note for the teacher..."
                  rows={3}
                  className="mt-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                  disabled={updating}
                  onClick={() => handleUpdateStatus("approved")}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 font-bold rounded-xl"
                  disabled={updating}
                  onClick={() => handleUpdateStatus("rejected")}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
