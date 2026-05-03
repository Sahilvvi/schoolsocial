import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, ArrowRight, UserPlus, LogIn, Shield, Zap, Star, Mail, Lock, User, Eye, EyeOff, Sparkles, School, BookOpen, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_USERS, isDemoEmail } from "@/data/dummyData";

const loginSchema = z.object({ email: z.string().email("Please enter a valid email"), password: z.string().min(6, "Password must be at least 6 characters") });
const signupSchema = z.object({ name: z.string().min(2, "Name is required"), email: z.string().email("Please enter a valid email"), password: z.string().min(6, "Password must be at least 6 characters"), role: z.string().min(1, "Please select a role") });

const roleOptions = [
  { value: "parent", label: "Parent", icon: Users, desc: "Find schools & track admissions" },
  { value: "teacher", label: "Teacher", icon: User, desc: "Find jobs & create your profile" },
  { value: "school", label: "School", icon: School, desc: "List your school & manage admissions" },
  { value: "tuition_center", label: "Tuition Center", icon: Building2, desc: "List batches & manage students" },
];

function IconInput({ icon: Icon, rightIcon, onRightClick, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
        <Icon className="h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors duration-200" />
      </div>
      <input
        {...props}
        className="w-full h-14 pl-12 pr-12 rounded-2xl bg-background border border-border/60 text-base font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-sm"
      />
      {rightIcon && (
        <button type="button" onClick={onRightClick} className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground/50 hover:text-foreground transition-colors">
          {rightIcon}
        </button>
      )}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const signupForm = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema), defaultValues: { name: "", email: "", password: "", role: "" } });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    const { error } = await signIn(data.email, data.password);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back! 🎉");

    if (isDemoEmail(data.email)) {
      const demoUser = Object.values(DEMO_USERS).find((u) => u.email === data.email);
      if (demoUser) {
        if (demoUser.role === "admin") { navigate("/admin"); return; }
        if (demoUser.role === "school") { navigate("/school-panel"); return; }
        if (demoUser.role === "parent") { navigate("/parent-panel"); return; }
        if (demoUser.role === "teacher") { navigate("/teacher-panel"); return; }
        if (demoUser.role === "tuition_center") { navigate("/tuition-panel"); return; }
      }
    }

    const { data: roleData } = await supabase.from("user_roles").select("role").eq("role", "admin").maybeSingle();
    if (roleData) { navigate("/admin"); return; }
    const { data: ownerData } = await supabase.from("school_owners").select("id").limit(1).maybeSingle();
    if (ownerData) { navigate("/school-panel"); return; }
    navigate("/schools");
  };

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    const { error } = await signUp(data.email, data.password, data.name, data.role);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created successfully! 🎉");
    if (data.role === "school") { navigate("/upload-school"); }
    else if (data.role === "teacher") { navigate("/jobs"); }
    else if (data.role === "tuition_center") { navigate("/tuition-enquiry"); }
    else { navigate("/schools"); }
  };

  const passToggle = showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      <div className="absolute inset-0 hero-pattern opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="gradient-primary p-3 rounded-2xl shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="font-extrabold text-3xl text-foreground tracking-tight">MySchool</span>
          </Link>
          
          <h1 className="text-5xl font-extrabold leading-[1.1] text-foreground">
            The easiest way to <br/>
            <span className="text-gradient">discover schools.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
            Join the largest community of parents, teachers, and schools in India. Simple, secure, and smart.
          </p>

          <div className="space-y-6 pt-6">
            {[
              { icon: Shield, title: "100% Secure", desc: "Your data is encrypted and protected" },
              { icon: Star, title: "Verified Reviews", desc: "Real feedback from actual parents" },
              { icon: Zap, title: "Instant Apply", desc: "One form, multiple school applications" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-extrabold text-foreground">{item.title}</h4>
                  <p className="text-sm font-medium text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="gradient-primary p-3 rounded-xl inline-block shadow-lg shadow-primary/20 mb-4">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-extrabold text-2xl text-foreground">MySchool</h1>
          </div>

          <div className="bg-card rounded-[2rem] border border-border/60 shadow-2xl shadow-black/5 overflow-hidden">
            {/* Tabs */}
            <div className="flex p-2 bg-muted/20 border-b border-border/40">
              {[
                { key: "login" as const, label: "Sign In" },
                { key: "signup" as const, label: "Create Account" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setMode(tab.key)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    mode === tab.key
                      ? "bg-background text-primary shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-extrabold mb-1">
                {mode === "login" ? "Welcome back" : "Get started"}
              </h2>
              <p className="text-sm font-medium text-muted-foreground mb-8">
                {mode === "login" ? "Sign in to access your dashboard." : "Create an account in seconds."}
              </p>

              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.div key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                        <FormField control={loginForm.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormControl><IconInput icon={Mail} type="email" placeholder="Email address" {...field} /></FormControl>
                            <FormMessage className="text-xs font-medium" />
                          </FormItem>
                        )} />
                        <FormField control={loginForm.control} name="password" render={({ field }) => (
                          <FormItem>
                            <FormControl><IconInput icon={Lock} type={showPass ? "text" : "password"} placeholder="Password" rightIcon={passToggle} onRightClick={() => setShowPass(!showPass)} {...field} /></FormControl>
                            <FormMessage className="text-xs font-medium" />
                          </FormItem>
                        )} />
                        <Button type="submit" className="w-full h-14 rounded-2xl font-extrabold text-base gradient-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform group">
                          Sign In <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                    <Form {...signupForm}>
                      <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-5">
                        <FormField control={signupForm.control} name="role" render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-3">
                              {roleOptions.map((role) => (
                                <button
                                  key={role.value}
                                  type="button"
                                  onClick={() => field.onChange(role.value)}
                                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                                    field.value === role.value
                                      ? "border-primary bg-primary/5"
                                      : "border-border/60 bg-background hover:border-primary/30"
                                  }`}
                                >
                                  <role.icon className={`h-5 w-5 shrink-0 ${field.value === role.value ? "text-primary" : "text-muted-foreground"}`} />
                                  <div className="min-w-0">
                                    <p className={`text-xs font-extrabold ${field.value === role.value ? "text-primary" : "text-foreground"}`}>{role.label}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                            <FormMessage className="text-xs font-medium" />
                          </FormItem>
                        )} />
                        <FormField control={signupForm.control} name="name" render={({ field }) => (
                          <FormItem><FormControl><IconInput icon={User} placeholder="Full name" {...field} /></FormControl><FormMessage className="text-xs font-medium" /></FormItem>
                        )} />
                        <FormField control={signupForm.control} name="email" render={({ field }) => (
                          <FormItem><FormControl><IconInput icon={Mail} type="email" placeholder="Email address" {...field} /></FormControl><FormMessage className="text-xs font-medium" /></FormItem>
                        )} />
                        <FormField control={signupForm.control} name="password" render={({ field }) => (
                          <FormItem><FormControl><IconInput icon={Lock} type={showPass ? "text" : "password"} placeholder="Create password" rightIcon={passToggle} onRightClick={() => setShowPass(!showPass)} {...field} /></FormControl><FormMessage className="text-xs font-medium" /></FormItem>
                        )} />
                        <Button type="submit" className="w-full h-14 rounded-2xl font-extrabold text-base gradient-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform group">
                          Create Account <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Demo Credentials */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center mb-4">Quick Demo Login</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {([
                    { key: "parent" as const, label: "Parent" },
                    { key: "school" as const, label: "School" },
                    { key: "teacher" as const, label: "Teacher" },
                    { key: "admin" as const, label: "Admin" },
                    { key: "tuition" as const, label: "Tuition" },
                  ] as const).map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => {
                        const demo = DEMO_USERS[d.key];
                        if (mode !== "login") setMode("login");
                        loginForm.setValue("email", demo.email);
                        loginForm.setValue("password", demo.password);
                        setTimeout(() => loginForm.handleSubmit(handleLogin)(), 100);
                      }}
                      className="px-3 py-2 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary text-xs font-bold text-muted-foreground transition-colors"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}