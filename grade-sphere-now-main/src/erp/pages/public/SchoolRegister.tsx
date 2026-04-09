import { useState } from "react";
import { useLocation } from "wouter";
import { School, ArrowRight, ArrowLeft, CheckCircle, Building2, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const STEPS = ["School Info", "Contact & Location", "Admin Account"];

export default function SchoolRegister() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", board: "CBSE", type: "private", description: "",
    email: "", phone: "", website: "", address: "", city: "", state: "", pincode: "",
    adminName: "", adminEmail: "", adminPassword: "", confirmPassword: "",
  });

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const validateStep = () => {
    if (step === 0 && (!form.name || !form.board)) { toast({ title: "Please fill school name and board", variant: "destructive" }); return false; }
    if (step === 1 && (!form.email || !form.city || !form.state)) { toast({ title: "Please fill email, city and state", variant: "destructive" }); return false; }
    if (step === 2) {
      if (!form.adminName || !form.adminEmail || !form.adminPassword) { toast({ title: "Please fill all admin fields", variant: "destructive" }); return false; }
      if (form.adminPassword !== form.confirmPassword) { toast({ title: "Passwords do not match", variant: "destructive" }); return false; }
      if (form.adminPassword.length < 6) { toast({ title: "Password must be at least 6 characters", variant: "destructive" }); return false; }
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep(prev => prev + 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/schools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      setDone(true);
    } catch (e: any) {
      toast({ title: "Registration failed", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registration Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Your school has been registered and is pending approval by our team. You'll receive an email within 24-48 hours.</p>
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-left">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Next Steps:</p>
          <ul className="text-sm text-blue-600 dark:text-blue-400 mt-2 space-y-1 list-disc list-inside">
            <li>Check your email for confirmation</li>
            <li>Our team reviews your application</li>
            <li>Login with your admin credentials once approved</li>
          </ul>
        </div>
        <Button onClick={() => navigate("/schools")} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white">Browse Schools</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><School className="w-6 h-6 text-white"/></div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">MySchool</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Register Your School</h1>
            <p className="text-blue-100 text-sm mt-1">Join 1,245+ schools on India's leading school platform</p>
            <div className="flex items-center gap-4 mt-4">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? "bg-green-500" : i === step ? "bg-white text-blue-600" : "bg-blue-500/50 text-blue-200"}`}>
                    {i < step ? <CheckCircle className="w-4 h-4"/> : i + 1}
                  </div>
                  <span className={`text-sm ${i === step ? "font-semibold" : "text-blue-200"}`}>{s}</span>
                  {i < STEPS.length - 1 && <ArrowRight className="w-3 h-3 text-blue-300"/>}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {step === 0 && (
              <>
                <div className="flex items-center gap-2 mb-4"><Building2 className="w-5 h-5 text-blue-500"/><h2 className="font-semibold text-gray-900 dark:text-white">School Information</h2></div>
                <div>
                  <Label className="dark:text-gray-300">School Name *</Label>
                  <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Delhi Public School" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Board *</Label>
                    <Select value={form.board} onValueChange={v => set("board", v)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="State Board">State Board</SelectItem>
                        <SelectItem value="IB">IB</SelectItem>
                        <SelectItem value="Cambridge">Cambridge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">School Type *</Label>
                    <Select value={form.type} onValueChange={v => set("type", v)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="aided">Aided</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="dark:text-gray-300">About Your School</Label>
                  <Textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Briefly describe your school's vision, achievements..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex items-center gap-2 mb-4"><User className="w-5 h-5 text-blue-500"/><h2 className="font-semibold text-gray-900 dark:text-white">Contact & Location</h2></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">School Email *</Label>
                    <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Phone</Label>
                    <Input value={form.phone} onChange={e => set("phone", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div>
                  <Label className="dark:text-gray-300">Website</Label>
                  <Input value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Street Address</Label>
                  <Input value={form.address} onChange={e => set("address", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">City *</Label>
                    <Input value={form.city} onChange={e => set("city", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">State *</Label>
                    <Input value={form.state} onChange={e => set("state", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Pincode</Label>
                    <Input value={form.pincode} onChange={e => set("pincode", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex items-center gap-2 mb-4"><Lock className="w-5 h-5 text-blue-500"/><h2 className="font-semibold text-gray-900 dark:text-white">Admin Account</h2></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">Create the primary administrator account for your school</p>
                <div>
                  <Label className="dark:text-gray-300">Admin Full Name *</Label>
                  <Input value={form.adminName} onChange={e => set("adminName", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Admin Email *</Label>
                  <Input type="email" value={form.adminEmail} onChange={e => set("adminEmail", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Password *</Label>
                    <Input type="password" value={form.adminPassword} onChange={e => set("adminPassword", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Confirm Password *</Label>
                    <Input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300">By registering, you agree that your school will be reviewed by MySchool's team before going live on the platform. This typically takes 24-48 hours.</p>
                </div>
              </>
            )}

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Button variant="ghost" onClick={step === 0 ? () => navigate("/") : () => setStep(p => p - 1)} className="dark:text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2"/>{step === 0 ? "Cancel" : "Back"}
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Next <ArrowRight className="w-4 h-4 ml-2"/>
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white">
                  {submitting ? "Registering..." : "Register School"}
                  <CheckCircle className="w-4 h-4 ml-2"/>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
