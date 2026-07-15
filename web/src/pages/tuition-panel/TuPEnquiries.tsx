import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageSquare, Phone, Mail, MapPin, IndianRupee, CheckCircle } from "lucide-react";

const statusColor: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  converted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function TuPEnquiries() {
  const { enquiries, updateEnquiries } = useOutletContext<any>();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Enquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">{enquiries.length} total • {enquiries.filter((e: any) => e.status === "new").length} new</p>
        </div>
      </div>

      <div className="space-y-4">
        {enquiries.map((enq: any) => (
          <Card key={enq.id} className="border-border/30 hover:border-primary/20 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{enq.parent_name}</h4>
                    <p className="text-sm text-muted-foreground">{enq.subject} • Class {enq.student_class}</p>
                  </div>
                </div>
                <Badge className={statusColor[enq.status] || statusColor.new}>{enq.status}</Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3 bg-accent/20 rounded-lg p-3 border border-border/20">{enq.message}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-primary" />{enq.phone}</span>
                <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-primary" />{enq.email}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary" />{enq.area}</span>
                <span className="flex items-center gap-1.5"><IndianRupee className="h-3 w-3 text-primary" />{enq.budget}</span>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
                <Button size="sm" className="rounded-lg gradient-primary border-0 shadow-md shadow-primary/20 text-xs h-8 gap-1"
                  onClick={() => {
                    if (updateEnquiries) {
                      const updated = enquiries.map((e: any) => e.id === enq.id ? { ...e, status: "contacted" } : e);
                      updateEnquiries(updated);
                    }
                    toast.success(`Contacted ${enq.parent_name}`);
                  }}>
                  <Phone className="h-3 w-3" /> Contact
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg border-border/30 text-xs h-8 gap-1"
                  onClick={() => {
                    if (updateEnquiries) {
                      const updated = enquiries.map((e: any) => e.id === enq.id ? { ...e, status: "contacted" } : e);
                      updateEnquiries(updated);
                    }
                    toast.success("Marked as contacted");
                  }}>
                  <CheckCircle className="h-3 w-3" /> Mark Contacted
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
