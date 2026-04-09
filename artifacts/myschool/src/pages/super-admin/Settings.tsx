import { useState, useEffect } from "react";
import { superAdminLinks } from "./super-admin-links";
import { AdminLayout } from "@/components/layouts";
import { Activity, Building2, Users, IndianRupee, Star, Settings, Save, Bell, Shield, Database, Globe, Mail, Loader2, CheckCircle2, Briefcase, ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function getToken() { return localStorage.getItem("myschool_token"); }

const links = superAdminLinks;
export default function SuperAdminSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [platformStats, setPlatformStats] = useState<{ totalSchools: number; totalUsers: number; totalReviews: number; totalJobs: number } | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/platform/stats`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setPlatformStats(d)).catch(() => {});
  }, []);

  const [platform, setPlatform] = useState({
    name: "MySchool",
    tagline: "India's School Discovery & ERP Platform",
    supportEmail: "support@myschool.in",
    supportPhone: "+91 0000000000",
    website: "https://myschool.in",
    about: "MySchool is India's leading multi-panel school ecosystem — connecting schools, parents, students, teachers, and job seekers through a unified platform.",
  });

  const [notifications, setNotifications] = useState({
    emailOnSchoolApproval: true,
    emailOnNewReview: true,
    emailOnNewApplication: false,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
  });

  const [security, setSecurity] = useState({
    requireEmailVerification: false,
    twoFactorAuth: false,
    sessionTimeout: "60",
    allowPublicRegistration: true,
    reviewModeration: true,
    autoApproveSchools: false,
  });

  const [plans, setPlans] = useState({
    basicPrice: "1999",
    proPrice: "4999",
    enterprisePrice: "9999",
    trialDays: "14",
  });

  useEffect(() => {
    fetch(`${BASE}/api/platform/settings`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => {
        if (d.settings) {
          const s = d.settings;
          setPlatform(prev => ({ ...prev,
            name: s.platformName ?? prev.name,
            tagline: s.tagline ?? prev.tagline,
            supportEmail: s.supportEmail ?? prev.supportEmail,
            supportPhone: s.supportPhone ?? prev.supportPhone,
            website: s.website ?? prev.website,
          }));
          setNotifications(prev => ({
            ...prev,
            emailOnSchoolApproval: s.emailOnSchoolApproval !== undefined ? s.emailOnSchoolApproval === "true" : prev.emailOnSchoolApproval,
            emailOnNewReview: s.emailOnNewReview !== undefined ? s.emailOnNewReview === "true" : prev.emailOnNewReview,
            emailOnNewApplication: s.emailOnNewApplication !== undefined ? s.emailOnNewApplication === "true" : prev.emailOnNewApplication,
          }));
          setSecurity(prev => ({
            ...prev,
            twoFactorAuth: s.requireMFA !== undefined ? s.requireMFA === "true" : prev.twoFactorAuth,
            sessionTimeout: s.sessionTimeout ?? prev.sessionTimeout,
            autoApproveSchools: s.autoApproveSchools !== undefined ? s.autoApproveSchools === "true" : prev.autoApproveSchools,
          }));
        }
      }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        platformName: platform.name,
        tagline: platform.tagline,
        supportEmail: platform.supportEmail,
        supportPhone: platform.supportPhone,
        website: platform.website,
        emailOnSchoolApproval: String(notifications.emailOnSchoolApproval),
        emailOnNewReview: String(notifications.emailOnNewReview),
        emailOnNewApplication: String(notifications.emailOnNewApplication),
        requireMFA: String(security.twoFactorAuth),
        sessionTimeout: security.sessionTimeout,
        autoApproveSchools: String(security.autoApproveSchools),
      };
      const res = await fetch(`${BASE}/api/platform/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      toast({ title: "Settings saved!", description: "Platform configuration has been updated." });
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast({ title: "Save failed", description: "Could not save settings. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Platform Settings" links={links}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold font-display">Platform Configuration</h2>
          <p className="text-sm text-muted-foreground font-medium mt-1">Manage global settings for the MySchool platform</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl font-bold shadow-lg shadow-primary/20 h-11 px-6">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-300" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="bg-secondary/50 p-1 rounded-xl h-auto mb-6 flex-wrap gap-1">
          {[
            { value: "general", label: "General", icon: Globe },
            { value: "notifications", label: "Notifications", icon: Bell },
            { value: "security", label: "Security", icon: Shield },
            { value: "plans", label: "Pricing Plans", icon: IndianRupee },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="rounded-lg px-5 py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
              <Icon className="w-4 h-4" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-2xl border-border shadow-sm lg:col-span-2">
              <h3 className="font-bold font-display text-lg mb-5 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Platform Identity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Platform Name</label>
                  <Input value={platform.name} onChange={e => setPlatform(p => ({ ...p, name: e.target.value }))} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Tagline</label>
                  <Input value={platform.tagline} onChange={e => setPlatform(p => ({ ...p, tagline: e.target.value }))} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Support Email</label>
                  <Input value={platform.supportEmail} onChange={e => setPlatform(p => ({ ...p, supportEmail: e.target.value }))} className="rounded-xl h-11" type="email" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Support Phone</label>
                  <Input value={platform.supportPhone} onChange={e => setPlatform(p => ({ ...p, supportPhone: e.target.value }))} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold text-foreground">Website</label>
                  <Input value={platform.website} onChange={e => setPlatform(p => ({ ...p, website: e.target.value }))} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold text-foreground">About Platform</label>
                  <Textarea value={platform.about} onChange={e => setPlatform(p => ({ ...p, about: e.target.value }))} className="rounded-xl min-h-[100px]" />
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border-border shadow-sm lg:col-span-2">
              <h3 className="font-bold font-display text-lg mb-5 flex items-center gap-2"><Database className="w-5 h-5 text-primary" /> Live Platform Stats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Schools", value: platformStats?.totalSchools ?? "…", icon: Building2 },
                  { label: "Total Users", value: platformStats ? (platformStats as any).totalStudents + (platformStats as any).totalTeachers + (platformStats as any).activeParents : "…", icon: Users },
                  { label: "Reviews", value: platformStats?.totalReviews ?? "…", icon: Star },
                  { label: "Jobs Posted", value: platformStats?.totalJobs ?? "…", icon: Briefcase },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="p-4 bg-secondary/30 rounded-xl text-center">
                    <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold font-display text-primary">{String(value)}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6 rounded-2xl border-border shadow-sm">
            <h3 className="font-bold font-display text-lg mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notification Preferences</h3>
            <div className="space-y-5">
              {[
                { key: "emailOnSchoolApproval" as const, label: "Email when a school is approved/suspended", desc: "Send email notification to school admin on status change" },
                { key: "emailOnNewReview" as const, label: "Email on new review submitted", desc: "Alert super admin when a new review needs moderation" },
                { key: "emailOnNewApplication" as const, label: "Email on new job application", desc: "Notify school admins when someone applies to their job post" },
                { key: "smsAlerts" as const, label: "SMS alerts for critical events", desc: "Send SMS for system-critical alerts (requires SMS provider)" },
                { key: "pushNotifications" as const, label: "Push notifications", desc: "Browser push notifications for real-time updates" },
                { key: "weeklyReports" as const, label: "Weekly analytics report", desc: "Auto-send weekly platform performance report to super admins" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4 pb-5 border-b border-border/50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-foreground text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{desc}</p>
                  </div>
                  <Switch checked={notifications[key]} onCheckedChange={v => setNotifications(n => ({ ...n, [key]: v }))} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6 rounded-2xl border-border shadow-sm">
            <h3 className="font-bold font-display text-lg mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Security Settings</h3>
            <div className="space-y-5">
              {[
                { key: "requireEmailVerification" as const, label: "Require email verification on signup", desc: "New accounts must verify their email before accessing the platform" },
                { key: "twoFactorAuth" as const, label: "Enable 2FA for super admins", desc: "Require two-factor authentication for super admin accounts" },
                { key: "allowPublicRegistration" as const, label: "Allow public registration", desc: "Anyone can create a job seeker account without an invite" },
                { key: "reviewModeration" as const, label: "Manual review moderation", desc: "All school reviews must be approved by super admin before publishing" },
                { key: "autoApproveSchools" as const, label: "Auto-approve new schools", desc: "New school registrations are approved automatically without review" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4 pb-5 border-b border-border/50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-foreground text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{desc}</p>
                  </div>
                  <Switch checked={security[key as keyof typeof security] as boolean} onCheckedChange={v => setSecurity(s => ({ ...s, [key]: v }))} />
                </div>
              ))}
              <div className="pt-2">
                <p className="font-bold text-foreground text-sm mb-1">Session Timeout (minutes)</p>
                <p className="text-xs text-muted-foreground font-medium mb-3">Automatically log out inactive users after this period</p>
                <Input type="number" value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))} className="rounded-xl h-11 max-w-xs" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card className="p-6 rounded-2xl border-border shadow-sm">
            <h3 className="font-bold font-display text-lg mb-6 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-primary" /> SaaS Pricing Plans</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { key: "trialDays" as const, label: "Free Trial Days", desc: "Number of days for the free trial", suffix: "days" },
                { key: "basicPrice" as const, label: "Basic Plan (₹/month)", desc: "Price for Basic school plan", suffix: "/mo" },
                { key: "proPrice" as const, label: "Pro Plan (₹/month)", desc: "Price for Pro school plan", suffix: "/mo" },
                { key: "enterprisePrice" as const, label: "Enterprise Plan (₹/month)", desc: "Price for Enterprise plan", suffix: "/mo" },
              ].map(({ key, label, desc, suffix }) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-bold text-foreground">{label}</label>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                  <div className="relative">
                    <Input type="number" value={plans[key]} onChange={e => setPlans(p => ({ ...p, [key]: e.target.value }))} className="rounded-xl h-11 pr-10" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">{suffix}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm font-bold text-primary mb-1">Plan Feature Summary</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs text-muted-foreground">
                <div><p className="font-bold text-foreground mb-1">Basic (₹{plans.basicPrice}/mo)</p><p>• Up to 500 students</p><p>• Attendance & Fees</p><p>• 1 Admin account</p></div>
                <div><p className="font-bold text-foreground mb-1">Pro (₹{plans.proPrice}/mo)</p><p>• Up to 2,000 students</p><p>• Full ERP + Hiring</p><p>• 5 Admin accounts</p></div>
                <div><p className="font-bold text-foreground mb-1">Enterprise (₹{plans.enterprisePrice}/mo)</p><p>• Unlimited students</p><p>• AI Assistant + API</p><p>• Unlimited admins</p></div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
