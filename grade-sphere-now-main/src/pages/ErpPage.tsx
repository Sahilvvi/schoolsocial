import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, Shield, Settings, RefreshCcw, Maximize2, Minimize2,
  Loader2, AlertTriangle, School, ArrowLeft, CheckCircle2, Zap,
  Users, BookOpen, CalendarCheck, CreditCard, Brain, BarChart3,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

// The MySchool ERP runs on a separate dev server on port 5173
const ERP_URL = "http://localhost:5173";
const ERP_DIRECT_URL = `${ERP_URL}/login`;

const ERP_FEATURES = [
  { icon: Users, label: "Students & Staff", desc: "Complete directory management", color: "from-violet-500 to-purple-600" },
  { icon: CalendarCheck, label: "Smart Attendance", desc: "QR-based real-time tracking", color: "from-blue-500 to-cyan-600" },
  { icon: CreditCard, label: "Fee Management", desc: "Automated collection & receipts", color: "from-emerald-500 to-green-600" },
  { icon: BookOpen, label: "Homework & Notes", desc: "Digital assignment system", color: "from-orange-500 to-amber-600" },
  { icon: Brain, label: "AI Assistant", desc: "Natural language data queries", color: "from-pink-500 to-rose-600" },
  { icon: BarChart3, label: "Reports & Analytics", desc: "Insights across all modules", color: "from-indigo-500 to-blue-600" },
];

type LoadState = "connecting" | "loaded" | "error" | "timeout";

export default function ErpPage() {
  const [launched, setLaunched] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("connecting");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!launched) return;

    setLoadState("connecting");
    const timer = setTimeout(() => {
      // After 12 seconds if still "connecting", show timeout
      setLoadState((s) => (s === "connecting" ? "timeout" : s));
    }, 12000);

    return () => clearTimeout(timer);
  }, [launched, retryCount]);

  const handleLaunch = () => {
    setLaunched(true);
    setLoadState("connecting");
  };

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
    setLoadState("connecting");
  };

  const handleIframeLoad = () => {
    setLoadState("loaded");
  };

  const handleIframeError = () => {
    setLoadState("error");
  };

  // ─── Landing / Splash Screen ─────────────────────────────────────────────
  if (!launched) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.12)_0%,_transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(262_91%_70%/0.08)_0%,_transparent_60%)]" />

          <div className="container mx-auto px-4 relative z-10 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary mb-6"
            >
              <Zap className="h-3.5 w-3.5" />
              Powered by MySchool Platform
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-5 tracking-tight"
            >
              School{" "}
              <span className="text-gradient">ERP System</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10"
            >
              India's most complete school management platform. Attendance, fees,
              exams, payroll, AI assistant — all unified in a single dashboard.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button
                onClick={handleLaunch}
                size="lg"
                className="h-14 px-8 rounded-2xl shadow-xl shadow-primary/25 font-bold text-base gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-opacity group"
              >
                <Settings className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Launch ERP Dashboard
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <a href={ERP_DIRECT_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-semibold text-base border-border/50">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </a>
            </motion.div>

            {/* Security note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground px-4 py-2 rounded-full bg-muted/40 border border-border/30"
            >
              <Shield className="h-3.5 w-3.5 text-primary" />
              Encrypted • Role-based access • Demo credentials auto-filled on login
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">What's inside the ERP</h2>
            <p className="text-muted-foreground">Complete school management across every department</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {ERP_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.07 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-5 cursor-default"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className={`w-11 h-11 bg-gradient-to-br ${feat.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{feat.label}</h3>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Quick launch repeat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-12"
          >
            <Button
              onClick={handleLaunch}
              size="lg"
              className="h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 font-semibold gradient-primary border-0 text-primary-foreground hover:opacity-90"
            >
              <Settings className="h-4 w-4 mr-2" />
              Launch ERP Dashboard
            </Button>
          </motion.div>
        </section>
      </div>
    );
  }

  // ─── ERP Iframe View ──────────────────────────────────────────────────────
  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "min-h-screen"}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/95 backdrop-blur-md shrink-0 h-12">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setLaunched(false)}
            title="Back to marketplace"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md gradient-primary flex items-center justify-center">
              <School className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold hidden sm:block">MySchool ERP</span>
          </div>
          {/* Status indicator */}
          <AnimatePresence mode="wait">
            {loadState === "connecting" && (
              <motion.span key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Connecting…
              </motion.span>
            )}
            {loadState === "loaded" && (
              <motion.span key="loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs text-emerald-500">
                <CheckCircle2 className="h-3 w-3" /> Connected
              </motion.span>
            )}
            {(loadState === "error" || loadState === "timeout") && (
              <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3" /> Not reachable
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleRetry} title="Refresh">
            <RefreshCcw className="h-3.5 w-3.5" />
          </Button>
          <a href={ERP_DIRECT_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Open in new tab">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setIsFullscreen((f) => !f)}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Iframe container */}
      <div className="relative flex-1 overflow-hidden">
        {/* Loading overlay */}
        <AnimatePresence>
          {loadState === "connecting" && (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary"
              />
              <p className="text-sm text-muted-foreground font-medium">Starting ERP server…</p>
              <p className="text-xs text-muted-foreground max-w-xs text-center">
                Make sure the ERP is running:{" "}
                <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                  cd artifacts\myschool && npm run dev:local
                </code>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error / timeout state */}
        <AnimatePresence>
          {(loadState === "error" || loadState === "timeout") && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background gap-6 p-6"
            >
              <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
              <div className="text-center space-y-2 max-w-sm">
                <h3 className="text-lg font-bold">ERP Server Not Running</h3>
                <p className="text-sm text-muted-foreground">
                  The MySchool ERP isn't reachable at{" "}
                  <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground text-xs">{ERP_URL}</code>
                </p>
                <div className="mt-4 p-4 bg-muted/50 rounded-xl border border-border/40 text-left">
                  <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Start the ERP server:</p>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-muted-foreground">
                      <span className="text-primary">1.</span> Open a new terminal
                    </div>
                    <div className="text-muted-foreground">
                      <span className="text-primary">2.</span>{" "}
                      <code className="bg-background px-1 rounded border border-border/40">
                        cd artifacts\myschool
                      </code>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="text-primary">3.</span>{" "}
                      <code className="bg-background px-1 rounded border border-border/40">
                        pnpm run dev:local
                      </code>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRetry} className="rounded-xl gradient-primary border-0 text-primary-foreground">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <a href={ERP_DIRECT_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-xl">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Direct
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The actual iframe */}
        <iframe
          key={`erp-frame-${retryCount}`}
          src={ERP_DIRECT_URL}
          className="w-full h-full border-0"
          style={{ minHeight: isFullscreen ? "calc(100vh - 48px)" : "calc(100vh - 100px)" }}
          title="MySchool ERP"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="camera; microphone"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-downloads"
        />
      </div>
    </div>
  );
}
