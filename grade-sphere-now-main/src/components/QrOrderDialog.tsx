import { useState } from "react";
import { QrCode, Package, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCreateQrOrder } from "@/hooks/useErp";
import { useAuth } from "@/hooks/useAuth";

interface Props { schoolId: string; schoolName: string; }

export default function QrOrderDialog({ schoolId, schoolName }: Props) {
  const { user } = useAuth();
  const createOrder = useCreateQrOrder();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ order_type: "laminated", contact_name: "", contact_phone: "", shipping_address: "" });
  const [ordered, setOrdered] = useState(false);

  const handleSubmit = async () => {
    if (!form.contact_name || !form.contact_phone || !form.shipping_address) { toast.error("All fields required"); return; }
    try {
      await createOrder.mutateAsync({ school_id: schoolId, ...form, user_id: user?.id });
      setOrdered(true);
      toast.success("QR order placed!");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setOrdered(false); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl gap-2"><QrCode className="h-4 w-4" />Order Physical QR</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" />Order Physical QR for {schoolName}</DialogTitle></DialogHeader>
        {ordered ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="font-bold text-lg">Order Placed!</h3>
            <p className="text-sm text-muted-foreground">Your physical QR will be shipped to the address provided. You'll receive tracking details via email.</p>
            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><Package className="h-3 w-3" />Processing</div>
              <div className="h-px w-6 bg-border" />
              <div className="flex items-center gap-1"><Truck className="h-3 w-3" />Shipping</div>
              <div className="h-px w-6 bg-border" />
              <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Delivered</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <Select value={form.order_type} onValueChange={(v) => setForm({ ...form, order_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="laminated">Laminated QR Card</SelectItem>
                <SelectItem value="physical">Physical Standee QR</SelectItem>
                <SelectItem value="profile_qr">School Profile QR</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Contact Name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            <Input placeholder="Phone Number" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
            <Input placeholder="Shipping Address" value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} />
            <p className="text-xs text-muted-foreground">Physical QR will be shipped within 3-5 business days to the provided address.</p>
            <Button onClick={handleSubmit} disabled={createOrder.isPending} className="w-full rounded-xl gradient-primary border-0">Place Order</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
