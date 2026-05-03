import { Loader2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTuitionBatches } from "@/hooks/useErp";

export default function AdminBatches() {
  const { data: batches = [], isLoading } = useTuitionBatches();

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2"><Users className="h-6 w-6 text-primary" />Tuition Batches</h1>
        <p className="text-sm text-muted-foreground">View all batches across tuition centers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map((b: any) => (
          <Card key={b.id} className="bg-card/60 border-border/30">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">{b.batch_name}</h4>
                  <p className="text-xs text-muted-foreground">{b.subject} • {b.schedule || "TBD"}</p>
                </div>
                <Badge variant={b.is_active ? "default" : "secondary"}>{b.is_active ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">{b.current_students}/{b.max_students} students</span>
                <span className="font-bold text-primary">₹{Number(b.fee_per_month).toLocaleString()}/mo</span>
              </div>
              <Progress value={(b.current_students / b.max_students) * 100} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
        {batches.length === 0 && <p className="text-center text-muted-foreground py-8">No batches created yet</p>}
      </div>
    </div>
  );
}
