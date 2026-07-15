import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function PPBookings() {
  const { bookings } = useOutletContext<any>();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tutor Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">{bookings.length} bookings • {bookings.filter((b: any) => b.status === "confirmed").length} confirmed</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No tutor bookings yet. <Link to="/tutors" className="text-primary hover:underline">Find tutors</Link></p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b: any) => (
            <Card key={b.id} className="border-border/30 hover:border-primary/20 transition-colors">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shrink-0">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{b.tutors?.name || "Tutor"}</p>
                    <p className="text-sm text-muted-foreground">{b.tutors?.subject}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(b.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className={statusColor[b.status] || statusColor.pending}>{b.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
