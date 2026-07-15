import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar } from "lucide-react";

const statusColor: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function PPFees() {
  const { fees } = useOutletContext<any>();

  const totalPaid = fees.filter((f: any) => f.status === "paid").reduce((s: number, f: any) => s + f.amount, 0);
  const totalDue = fees.filter((f: any) => f.status !== "paid").reduce((s: number, f: any) => s + f.amount, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Fee Records</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fees.length} records • ₹{totalPaid.toLocaleString()} paid • ₹{totalDue.toLocaleString()} due
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}`, color: "from-emerald-500 to-green-500" },
          { label: "Total Due", value: `₹${totalDue.toLocaleString()}`, color: "from-amber-500 to-orange-500" },
          { label: "Total Records", value: fees.length, color: "from-blue-500 to-cyan-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shrink-0`}>
                <IndianRupee className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-extrabold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fee List */}
      <div className="space-y-3">
        {fees.map((fee: any) => (
          <Card key={fee.id} className="border-border/30 hover:border-primary/20 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-md shrink-0 ${
                  fee.status === "paid" ? "bg-gradient-to-br from-emerald-500 to-green-500" :
                  fee.status === "overdue" ? "bg-gradient-to-br from-red-500 to-rose-500" :
                  "bg-gradient-to-br from-amber-500 to-orange-500"
                }`}>
                  <IndianRupee className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{fee.fee_type}</p>
                  <p className="text-sm text-muted-foreground">{fee.person_name} • ₹{fee.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Due: {new Date(fee.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className={statusColor[fee.status] || statusColor.pending}>{fee.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
