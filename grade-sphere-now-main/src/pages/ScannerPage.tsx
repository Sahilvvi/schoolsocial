import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, Camera, Loader2, AlertCircle, CheckCircle, School, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ScannerPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    setError(null);
    setResult(null);
    setScanning(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setResult(decodedText);
          scanner.stop().catch(() => {});
          setScanning(false);

          // If the QR code contains a school URL, navigate to it
          if (decodedText.includes("/school/")) {
            const slug = decodedText.split("/school/").pop()?.split("?")[0];
            if (slug) {
              setTimeout(() => navigate(`/school/${slug}`), 1500);
            }
          }
        },
        () => {} // ignore scan failures (no QR in frame)
      );
    } catch (err: any) {
      setError(err?.message || "Failed to access camera. Please allow camera permissions.");
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-20 right-[15%] w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-blob" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <QrCode className="h-3.5 w-3.5" /> QR Scanner
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold mb-5">
            Scan School <span className="text-gradient">QR Code</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Point your camera at any school's QR code to instantly access their profile, apply for admission, or leave a review.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-lg mx-auto">
          {/* Scanner Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card/60 backdrop-blur-sm border-border/30 overflow-hidden">
              <CardContent className="pt-6">
                {/* QR Reader Container */}
                <div ref={containerRef} className="relative rounded-2xl overflow-hidden bg-black/90 aspect-square mb-6">
                  <div id="qr-reader" className="w-full h-full" />

                  {!scanning && !result && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="h-24 w-24 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl shadow-primary/30">
                        <Camera className="h-12 w-12 text-primary-foreground" />
                      </div>
                      <p className="text-white/70 text-sm">Tap below to start scanning</p>
                    </div>
                  )}

                  {scanning && (
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2" />
                        Scanning...
                      </Badge>
                      <Button variant="outline" size="sm" onClick={stopScanner}
                        className="rounded-lg bg-black/50 border-white/20 text-white hover:bg-black/70 h-8">
                        <X className="h-3.5 w-3.5 mr-1" /> Stop
                      </Button>
                    </div>
                  )}
                </div>

                {/* Result */}
                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-bold text-green-500">QR Code Detected!</span>
                    </div>
                    <p className="text-sm text-muted-foreground break-all">{result}</p>
                    {result.includes("/school/") && (
                      <div className="flex items-center gap-2 mt-3">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-primary font-medium">Redirecting to school profile...</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Error */}
                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="text-sm text-destructive">{error}</span>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {!scanning ? (
                    <Button onClick={startScanner} className="w-full rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20 h-12 text-base gap-2">
                      <Camera className="h-5 w-5" /> {result ? "Scan Again" : "Start Scanning"}
                    </Button>
                  ) : (
                    <Button onClick={stopScanner} variant="outline" className="w-full rounded-xl border-border/40 h-12 text-base gap-2">
                      <X className="h-5 w-5" /> Stop Scanner
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10">
            <h3 className="text-lg font-bold text-center mb-6">How It Works</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: "1", title: "Scan QR", desc: "Point camera at school's QR code", icon: QrCode },
                { step: "2", title: "View Profile", desc: "See school details instantly", icon: School },
                { step: "3", title: "Take Action", desc: "Apply, review, or explore", icon: ArrowRight },
              ].map((item, i) => (
                <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/30 text-center">
                  <CardContent className="pt-5 pb-4">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-md shadow-primary/20">
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
