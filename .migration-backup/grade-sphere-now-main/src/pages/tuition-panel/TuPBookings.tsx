import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Clock } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function TuPBookings() {
  const { bookings } = useOutletContext<any>();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">{bookings.length} total • {bookings.filter((b: any) => b.status === "confirmed").length} confirmed</p>
        </div>
      </div>

      <div className="space-y-4">
        {bookings.map((booking: any) => (
          <Card key={booking.id} className="border-border/30 hover:border-primary/20 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shrink-0">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{booking.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {booking.email} • <Clock className="h-3 w-3" /> {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className={statusColor[booking.status] || statusColor.pending}>{booking.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
