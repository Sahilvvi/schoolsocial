import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Calendar, ExternalLink, CheckCircle } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function PPAdmissions() {
  const { admissions } = useOutletContext<any>();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admissions</h1>
        <p className="text-sm text-muted-foreground mt-1">{admissions.length} total • {admissions.filter((a: any) => a.status === "pending").length} pending</p>
      </div>

      {admissions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No admissions yet. <Link to="/schools" className="text-primary hover:underline">Browse schools</Link></p>
        </div>
      ) : (
        <div className="space-y-4">
          {admissions.map((a: any) => (
            <Card key={a.id} className="border-border/30 hover:border-primary/20 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground shadow-md">
                      {a.student_name?.[0]?.toUpperCase() || "S"}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{a.student_name} — Grade {a.grade}</p>
                      <p className="text-sm text-muted-foreground">{a.schools?.name || "School"}</p>
                    </div>
                  </div>
                  <Badge className={statusColor[a.status] || statusColor.pending}>{a.status}</Badge>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-0 mt-2">
                  {[
                    { label: "Submitted", done: true },
                    { label: "Under Review", done: a.status !== "pending" },
                    { label: a.status === "rejected" ? "Rejected" : "Approved", done: a.status === "approved" || a.status === "rejected" },
                  ].map((step, si) => (
                    <div key={si} className="flex items-center flex-1">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        step.done ? (a.status === "rejected" && si === 2 ? "bg-destructive/10 text-destructive" : "gradient-primary text-primary-foreground shadow-md shadow-primary/20") : "bg-muted text-muted-foreground"
                      }`}>
                        {step.done ? <CheckCircle className="h-3.5 w-3.5" /> : si + 1}
                      </div>
                      {si < 2 && <div className={`h-0.5 flex-1 mx-1.5 rounded-full ${step.done ? "bg-primary/40" : "bg-border"}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  {["Submitted", "Reviewing", a.status === "rejected" ? "Rejected" : "Approved"].map((l) => (
                    <span key={l} className="text-[10px] text-muted-foreground">{l}</span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(a.created_at).toLocaleDateString()}</span>
                  {a.schools?.slug && (
                    <Link to={`/school/${a.schools.slug}`}>
                      <Button variant="outline" size="sm" className="rounded-lg text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1 h-7">
                        <ExternalLink className="h-3 w-3" /> View School
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
