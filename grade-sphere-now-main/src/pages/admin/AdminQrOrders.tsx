import { QrCode, Package, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQrOrders } from "@/hooks/useErp";
import { useAuth } from "@/hooks/useAuth";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { setDemoData } from "@/lib/demoStorage";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
};

export default function AdminQrOrders() {
  const { data: orders = [], isLoading } = useQrOrders();
  const { user } = useAuth();
  const qc = useQueryClient();

  const updateStatus = async (id: string, status: string) => {
    if (isDemoUserId(user?.id)) {
      qc.setQueryData<any[]>(["qr-orders"], (old = []) =>
        old.map(o => o.id === id ? { ...o, status } : o),
      );
      const current = qc.getQueryData<any[]>(["qr-orders"]);
      if (current) setDemoData("admin-qr-orders", current);
      toast.success("Status updated");
      return;
    }
    const { error } = await supabase.from("qr_orders").update({ status } as any).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["qr-orders"] });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2"><QrCode className="h-6 w-6 text-primary" />QR Orders</h1>
        <p className="text-sm text-muted-foreground">Manage physical QR card orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["pending", "processing", "shipped", "delivered"].map((s) => (
          <Card key={s} className="bg-card/60 border-border/30">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{orders.filter((o: any) => o.status === s).length}</p>
              <p className="text-xs text-muted-foreground capitalize">{s}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {orders.map((o: any) => (
          <Card key={o.id} className="bg-card/60 border-border/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-medium text-sm">{o.contact_name}</p>
                  <p className="text-xs text-muted-foreground">{o.contact_phone} • {o.order_type}</p>
                  <p className="text-xs text-muted-foreground mt-1">{o.shipping_address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColors[o.status] || ""}>{o.status}</Badge>
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && <p className="text-center text-muted-foreground py-8">No QR orders yet</p>}
      </div>
    </div>
  );
}
