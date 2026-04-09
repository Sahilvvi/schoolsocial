import { Link } from "react-router-dom";
import { BookOpen, Rocket, Sparkles, LayoutDashboard, Users, CreditCard, ClipboardCheck, MessageSquare, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SPErp() {
  const modules = [
    { name: "Attendance", desc: "Track student & staff attendance", icon: <ClipboardCheck className="h-6 w-6" />, path: "/erp/school-admin/attendance", color: "text-blue-500" },
    { name: "Fees", desc: "Collect payments & generate receipts", icon: <CreditCard className="h-6 w-6" />, path: "/erp/school-admin/fees", color: "text-green-500" },
    { name: "Students", desc: "Manage student profiles & records", icon: <Users className="h-6 w-6" />, path: "/erp/school-admin/students", color: "text-purple-500" },
    { name: "Exams", desc: "Result entry & report cards", icon: <LayoutDashboard className="h-6 w-6" />, path: "/erp/school-admin/exams", color: "text-orange-500" },
    { name: "Communication", desc: "Send notices & notifications", icon: <MessageSquare className="h-6 w-6" />, path: "/erp/school-admin/notices", color: "text-cyan-500" },
    { name: "Admin Control", desc: "Manage staff & settings", icon: <ShieldAlert className="h-6 w-6" />, path: "/erp/school-admin", color: "text-red-500" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight">ERP Dashboard</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Rocket className="h-3.5 w-3.5" />
              Fully Integrated
            </span>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Access all school management functions in one place. Your marketplace and ERP are now seamlessly connected.
          </p>
        </div>
        <Link to="/erp/school-admin">
          <Button className="gradient-primary shadow-lg shadow-primary/25 border-0 font-bold px-6">
            Launch Full ERP <Rocket className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {modules.map(m => (
          <Link key={m.name} to={m.path}>
            <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-border/40 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:scale-110 transition-transform">
                 <div className={`${m.color} bg-current/10 p-2 rounded-lg`}>
                   {m.icon}
                 </div>
              </div>
              <CardContent className="pt-8">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{m.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{m.desc}</p>
                <div className="mt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Module <Rocket className="ml-1.5 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <CardContent className="pt-6 relative z-10 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Seamless Experience</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You are currently logged in with your marketplace credentials. Any data updated in the ERP will reflect across the platform instantly.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-secondary/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <CardContent className="pt-6 relative z-10 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Help & Documentation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Need help with the ERP? Access our comprehensive user guides and video tutorials for every module.
              </p>
              <Button variant="link" className="p-0 text-secondary h-auto mt-2 font-bold text-xs uppercase tracking-wider">
                Support Center →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
