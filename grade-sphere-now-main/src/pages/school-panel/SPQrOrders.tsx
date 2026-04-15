import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { DUMMY_QR_ORDERS } from "@/data/dummyData";

export default function SPQrOrders() {
  const { school } = useOutletContext<any>();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ order_type: "laminated", contact_name: "", contact_phone: "", shipping_address: "" });

  const queryKey = ["sp-qr-orders", school.id];

  const { data: orders = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await supabase.from("qr_orders").select("*").eq("school_id", school.id).order("created_at", { ascending: false });
      if (data && data.length > 0) return data;
      return DUMMY_QR_ORDERS.filter((o) => o.school_id === school.id);
    },
  });

  const createOrder = useMutation({
    mutationFn: async (order: any) => {
      const payload = { ...order, school_id: school.id, user_id: user?.id };
      if (isDemoUserId(user?.id)) {
        const fake = { ...payload, id: `demo-${Date.now()}`, status: "pending", tracking_number: null, created_at: new Date().toISOString() };
        qc.setQueryData<any[]>(queryKey, (old = []) => [fake, ...old]);
        return;
      }
      const { error } = await supabase.from("qr_orders").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      if (!isDemoUserId(user?.id)) qc.invalidateQueries({ queryKey });
      toast.success("QR order placed!");
      setForm({ order_type: "laminated", contact_name: "", contact_phone: "", shipping_address: "" });
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contact_name || !form.contact_phone || !form.shipping_address) {
      toast.error("All fields are required"); return;
    }
    createOrder.mutate(form);
  };

  const statusIcon = (s: string) => {
    if (s === "delivered") return "✅";
    if (s === "shipped") return "📦";
    if (s === "processing") return "⚙️";
    return "⏳";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">QR Code Orders</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Order QR Code</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Order Physical QR Code</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>QR Type</Label>
                <Select value={form.order_type} onValueChange={v => setForm(p => ({ ...p, order_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laminated">Laminated QR Card</SelectItem>
                    <SelectItem value="standee">QR Standee</SelectItem>
                    <SelectItem value="sticker">QR Sticker Pack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Contact Name *</Label><Input value={form.contact_name} onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))} placeholder="Your name" /></div>
              <div><Label>Contact Phone *</Label><Input value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))} placeholder="+91..." /></div>
              <div><Label>Shipping Address *</Label><Textarea value={form.shipping_address} onChange={e => setForm(p => ({ ...p, shipping_address: e.target.value }))} placeholder="Full shipping address" rows={3} /></div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createOrder.isPending}>Place Order</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No QR code orders yet</p>
          <p className="text-sm text-muted-foreground">Order physical QR codes to display at your school entrance, reception, or classrooms.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o.id}>
                  <TableCell>
                    <span className="mr-1">{statusIcon(o.status)}</span>
                    <Badge variant={o.status === "delivered" ? "default" : o.status === "shipped" ? "outline" : "secondary"}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize font-medium">{o.order_type}</TableCell>
                  <TableCell>
                    <div>{o.contact_name}</div>
                    <div className="text-xs text-muted-foreground">{o.contact_phone}</div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{o.shipping_address}</TableCell>
                  <TableCell>{o.tracking_number || <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                  <TableCell className="text-sm">{format(new Date(o.created_at), "dd MMM yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
