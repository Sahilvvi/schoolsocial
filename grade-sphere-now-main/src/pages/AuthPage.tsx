import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, ArrowRight, UserPlus, LogIn, Shield, Zap, Star, Mail, Lock, User, Eye, EyeOff, CheckCircle, Sparkles, School, BookOpen, Users, Building2 } from "lucide-react";
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

const benefits = [
  { icon: Star, text: "Access verified school reviews & ratings" },
  { icon: Zap, text: "Apply to multiple schools instantly" },
  { icon: Shield, text: "Your data is always encrypted & secure" },
  { icon: CheckCircle, text: "Track admissions in real-time" },
];

function IconInput({ icon: Icon, rightIcon, onRightClick, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
        <Icon className="h-[18px] w-[18px] text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200" />
      </div>
      <input
        {...props}
        className="w-full h-[52px] pl-12 pr-12 rounded-2xl bg-muted/10 border border-border/30 text-[15px] text-foreground placeholder:text-muted-foreground/35 focus:outline-none focus:border-primary/50 focus:bg-muted/20 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
      />
      {rightIcon && (
        <button type="button" onClick={onRightClick} className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground/35 hover:text-muted-foreground transition-colors">
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

    // Route demo users by role
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

    // Check roles: admin first, then school owner, then default
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
    // Navigate based on role
    if (data.role === "school") { navigate("/upload-school"); }
    else if (data.role === "teacher") { navigate("/jobs"); }
    else if (data.role === "tuition_center") { navigate("/tuition-enquiry"); }
    else { navigate("/schools"); }
  };

  const passToggle = showPass
    ? <EyeOff className="h-[18px] w-[18px]" />
    : <Eye className="h-[18px] w-[18px]" />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(217_91%_60%/0.08)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_hsl(174_62%_47%/0.06)_0%,_transparent_50%)]" />
      <div className="absolute top-10 left-[10%] w-[600px] h-[600px] bg-primary/4 rounded-full blur-[150px] animate-blob" />
      <div className="absolute bottom-10 right-[10%] w-[500px] h-[500px] bg-secondary/4 rounded-full blur-[120px] animate-blob animation-delay-2000" />

      <div className="w-full max-w-[1080px] grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left - Branding */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="hidden md:block">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
            <Sparkles className="h-3.5 w-3.5" /> Welcome to MySchool
          </motion.div>

          <div className="flex items-center gap-3 mb-10">
            <div className="gradient-primary p-3.5 rounded-2xl shadow-xl shadow-primary/25 animate-pulse-glow">
              <GraduationCap className="h-9 w-9 text-primary-foreground" />
            </div>
            <span className="text-gradient font-extrabold text-4xl tracking-tight">MySchool</span>
          </div>

          <h2 className="text-4xl font-extrabold mb-5 leading-[1.15]">
            Your education journey<br />
            <span className="text-gradient">starts here.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 text-base">
            Join thousands of parents who trust MySchool to discover, compare, and apply to the best schools across India.
          </p>

          <div className="space-y-5">
            {benefits.map((b, i) => (
              <motion.div key={b.text} initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <b.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground/80 font-medium">{b.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border/20">
            <p className="text-xs text-muted-foreground/50">
              Trusted by <span className="text-foreground font-semibold">10,000+</span> parents · <span className="text-foreground font-semibold">500+</span> schools listed
            </p>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          {/* Mobile logo */}
          <div className="text-center mb-8 md:hidden">
            <div className="gradient-primary p-3 rounded-2xl inline-block mb-4 shadow-xl shadow-primary/30">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-extrabold text-gradient">MySchool</h1>
          </div>

          <div className="rounded-3xl bg-card/70 backdrop-blur-2xl border border-border/25 shadow-2xl shadow-black/10">
            {/* Tab Switcher */}
            <div className="p-5 pb-0">
              <div className="flex gap-1 p-1.5 rounded-2xl bg-muted/15 border border-border/15">
                {[
                  { key: "login" as const, label: "Sign In", icon: LogIn },
                  { key: "signup" as const, label: "Sign Up", icon: UserPlus },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setMode(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      mode === tab.key
                        ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" /> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Header */}
            <div className="px-7 pt-7 pb-1">
              <AnimatePresence mode="wait">
                <motion.div key={mode} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                  <h3 className="text-[22px] font-bold text-foreground">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 mb-1">
                    {mode === "login" ? "Sign in to continue to your dashboard" : "Get started with MySchool in seconds"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Form */}
            <div className="px-7 py-6">
              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.div key="login" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField control={loginForm.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput icon={Mail} type="email" placeholder="Email address" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs ml-1 mt-1" />
                          </FormItem>
                        )} />
                        <FormField control={loginForm.control} name="password" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput icon={Lock} type={showPass ? "text" : "password"} placeholder="Password" rightIcon={passToggle} onRightClick={() => setShowPass(!showPass)} {...field} />
                            </FormControl>
                            <FormMessage className="text-xs ml-1 mt-1" />
                          </FormItem>
                        )} />

                        <div className="pt-2">
                          <Button type="submit" className="w-full h-[52px] rounded-2xl shadow-xl shadow-primary/25 font-bold text-[15px] gradient-primary border-0 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 group">
                            Sign In <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div key="signup" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                    <Form {...signupForm}>
                      <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                        {/* Role Selection */}
                        <FormField control={signupForm.control} name="role" render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-2">
                              {roleOptions.map((role) => {
                                const isSelected = field.value === role.value;
                                const RoleIcon = role.icon;
                                return (
                                  <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => field.onChange(role.value)}
                                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                                      isSelected
                                        ? "border-primary/50 bg-primary/10 shadow-md shadow-primary/10"
                                        : "border-border/30 bg-muted/10 hover:border-border/60 hover:bg-muted/20"
                                    }`}
                                  >
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "gradient-primary shadow-md" : "bg-muted/30"}`}>
                                      <RoleIcon className={`h-4 w-4 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className={`text-xs font-bold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>{role.label}</p>
                                      <p className="text-[10px] text-muted-foreground leading-tight truncate">{role.desc}</p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <FormMessage className="text-xs ml-1 mt-1" />
                          </FormItem>
                        )} />

                        <FormField control={signupForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput icon={User} placeholder="Full name" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs ml-1 mt-1" />
                          </FormItem>
                        )} />
                        <FormField control={signupForm.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput icon={Mail} type="email" placeholder="Email address" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs ml-1 mt-1" />
                          </FormItem>
                        )} />
                        <FormField control={signupForm.control} name="password" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput icon={Lock} type={showPass ? "text" : "password"} placeholder="Create password (min 6 chars)" rightIcon={passToggle} onRightClick={() => setShowPass(!showPass)} {...field} />
                            </FormControl>
                            <FormMessage className="text-xs ml-1 mt-1" />
                          </FormItem>
                        )} />

                        <div className="pt-2">
                          <Button type="submit" className="w-full h-[52px] rounded-2xl shadow-xl shadow-primary/25 font-bold text-[15px] gradient-primary border-0 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 group">
                            Create Account <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Demo Credentials */}
              <div className="mt-4 space-y-2">
                <p className="text-[11px] text-muted-foreground/60 text-center font-semibold uppercase tracking-wider">Quick Demo Login</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: "admin" as const, label: "Admin Panel", icon: Shield, color: "text-red-500" },
                    { key: "school" as const, label: "School Panel", icon: School, color: "text-blue-500" },
                    { key: "parent" as const, label: "Parent", icon: Users, color: "text-green-500" },
                    { key: "teacher" as const, label: "Teacher", icon: User, color: "text-purple-500" },
                    { key: "tuition" as const, label: "Tuition Center", icon: Building2, color: "text-orange-500" },
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
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-border/40 bg-muted/10 hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
                    >
                      <d.icon className={`h-3.5 w-3.5 ${d.color} shrink-0`} />
                      <span className="text-xs font-semibold text-foreground/70">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                <span className="text-[11px] text-muted-foreground/40 font-semibold uppercase tracking-[0.2em]">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
              </div>

              {/* Switch mode */}
              <p className="text-center text-sm text-muted-foreground">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-primary font-semibold hover:underline underline-offset-4 transition-all">
                  {mode === "login" ? "Sign up for free" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="px-7 py-4 border-t border-border/10">
              <p className="text-[11px] text-muted-foreground/30 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
