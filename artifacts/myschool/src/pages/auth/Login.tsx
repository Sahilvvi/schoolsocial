import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { School, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const DEMO_CREDS: Record<string, { email: string; password: string; label: string }> = {
  super_admin: { email: "superadmin@myschool.in", password: "admin123", label: "Platform Admin" },
  school_admin: { email: "admin@dps.in", password: "school123", label: "School Admin" },
  teacher: { email: "rajesh@dps.in", password: "teacher123", label: "Teacher" },
  parent: { email: "parent@myschool.in", password: "parent123", label: "Parent" },
  student: { email: "student@myschool.in", password: "student123", label: "Student" },
  job_seeker: { email: "jobseeker@myschool.in", password: "job123", label: "Job Seeker" },
};

export default function Login() {
  const { login, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState("admin@dps.in");
  const [password, setPassword] = useState("school123");
  const [role, setRole] = useState("school_admin");
  const [error, setError] = useState("");

  const handleRoleChange = (val: string) => {
    setRole(val);
    const creds = DEMO_CREDS[val];
    if (creds) { setIdentifier(creds.email); setPassword(creds.password); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ identifier, password, role: role as any });
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background font-sans">
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/80" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white font-display font-bold text-3xl">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
              <School className="w-8 h-8 text-white" />
            </div>
            MySchool
          </div>
        </div>
        <div className="relative z-10 text-white max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            India's Leading School Ecosystem
          </div>
          <h1 className="text-5xl font-display font-bold leading-tight mb-6">Empowering education through technology</h1>
          <p className="text-lg text-white/80 font-medium">One platform connecting admins, teachers, parents, and students seamlessly.</p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[["1,245+", "Schools"], ["4.5L+", "Students"], ["25K+", "Teachers"]].map(([val, lbl]) => (
              <div key={lbl} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-display font-bold text-white">{val}</div>
                <div className="text-sm text-white/70 font-medium">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-24 bg-card">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto">
          <div className="mb-10 lg:hidden flex items-center gap-3 text-primary font-display font-bold text-3xl justify-center">
            <School className="w-8 h-8" /> MySchool
          </div>

          <h2 className="text-3xl font-display font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8 text-base">Select your role — credentials auto-fill for demo.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Select Role</label>
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger className="h-12 rounded-xl border-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DEMO_CREDS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Email or Phone</label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone"
                className="h-12 rounded-xl border-2 focus:ring-primary/20 bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-foreground">Password</label>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-12 rounded-xl border-2 focus:ring-primary/20 bg-background"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive text-sm font-semibold rounded-xl border border-destructive/20">{error}</div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>Sign In <ArrowRight className="w-5 h-5 ml-2" /></>)}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-secondary/50 rounded-xl border border-border">
            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Demo Credentials (auto-filled on role select)</p>
            <div className="space-y-1">
              {Object.entries(DEMO_CREDS).map(([key, { email, password: pw, label }]) => (
                <button key={key} onClick={() => handleRoleChange(key)} className="w-full text-left text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-0.5">
                  <span className="font-bold text-foreground w-28 shrink-0">{label}:</span>
                  <span>{email} / {pw}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-sm font-medium text-muted-foreground">
            Looking for a school?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setLocation('/'); }} className="text-primary hover:underline">Browse public portal</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
