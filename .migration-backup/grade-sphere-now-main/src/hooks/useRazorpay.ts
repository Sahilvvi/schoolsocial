import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.head.appendChild(script);
  });
}

export async function initiatePayment(planName: string, amount: number) {
  try {
    await loadRazorpayScript();

    const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
      body: { amount, plan_name: planName },
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return new Promise<{ success: boolean; payment_id?: string }>((resolve) => {
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "MySchool",
        description: `${planName} Plan`,
        order_id: data.order_id,
        handler: (response: any) => {
          toast.success("Payment successful!");
          resolve({ success: true, payment_id: response.razorpay_payment_id });
        },
        modal: {
          ondismiss: () => resolve({ success: false }),
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  } catch (e: any) {
    toast.error(e.message || "Payment failed");
    return { success: false };
  }
}
