import { useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, GraduationCap, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const CLASSES = ["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"];

export default function AdmissionForm() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    studentName: "", dob: "", gender: "male",
    fatherName: "", motherName: "", phone: "", email: "",
    address: "", applyingForClass: "", previousSchool: "", message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.phone || !form.applyingForClass) {
      toast({ title: "Please fill all required fields", variant: "destructive" }); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/admissions/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: form.studentName, parentName: form.fatherName || form.motherName, parentEmail: form.email, parentPhone: form.phone, gradeApplying: form.applyingForClass, message: form.message || form.address, schoolSlug: slug, schoolId: 1 })
      });
      if (res.ok) setSubmitted(true);
      else toast({ title: "Submission failed. Please try again.", variant: "destructive" });
    } catch {
      toast({ title: "Network error. Please try again.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-black mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">Thank you for your interest. The school will contact you shortly to guide you through the next steps.</p>
          <Link href={`/schools/${slug}`}>
            <Button className="w-full rounded-xl font-bold">Back to School Profile</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/schools/${slug}`}>
            <Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black">Admission Inquiry</h1>
            <p className="text-sm text-muted-foreground">Fill in the form and the school will get back to you</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-5 rounded-2xl shadow-sm">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" />Student Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Student Full Name *</label>
                <Input name="studentName" value={form.studentName} onChange={handleChange} placeholder="Enter student's full name" className="rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Date of Birth</label>
                  <Input name="dob" type="date" value={form.dob} onChange={handleChange} className="rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Applying for Class *</label>
                <select name="applyingForClass" value={form.applyingForClass} onChange={handleChange} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" required>
                  <option value="">Select class</option>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Previous School (if any)</label>
                <Input name="previousSchool" value={form.previousSchool} onChange={handleChange} placeholder="Name of previous school" className="rounded-xl" />
              </div>
            </div>
          </Card>

          <Card className="p-5 rounded-2xl shadow-sm">
            <h2 className="font-bold text-sm mb-3">Parent / Guardian Details</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Father's Name</label>
                  <Input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's full name" className="rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Mother's Name</label>
                  <Input name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's full name" className="rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Contact Phone *</label>
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" className="rounded-xl" required />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Email</label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Address</label>
                <Input name="address" value={form.address} onChange={handleChange} placeholder="Home address" className="rounded-xl" />
              </div>
            </div>
          </Card>

          <Card className="p-5 rounded-2xl shadow-sm">
            <label className="text-xs font-bold text-muted-foreground block mb-1">Additional Message</label>
            <textarea name="message" value={form.message} onChange={handleChange}
              placeholder="Any specific requirements or questions for the school..."
              className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </Card>

          <Button type="submit" disabled={loading} className="w-full rounded-xl font-bold h-12 text-base shadow-lg">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</> : <><Send className="w-4 h-4 mr-2" />Submit Application</>}
          </Button>
          <p className="text-xs text-center text-muted-foreground">By submitting this form, you agree to be contacted by the school regarding your application.</p>
        </form>
      </div>
    </div>
  );
}
