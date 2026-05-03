import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/erp/components/layouts";
import { adminLinks } from "./admin-links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { QrCode, CheckCircle2, XCircle, Camera, User, RefreshCw } from "lucide-react";
import { useAuth } from "@/erp/hooks/use-auth";
import { useToast } from "@/erp/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

export default function QRScanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId;
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [manualQR, setManualQR] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedList, setScannedList] = useState<any[]>([]);

  useEffect(() => {
    if (!schoolId) return;
    fetch(`${BASE}/api/classes?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setClasses(d.classes || []));
  }, [schoolId]);

  const processQR = async (qrData: string) => {
    if (!qrData.trim() || !schoolId) return;
    setScanning(true);
    try {
      const res = await fetch(`${BASE}/api/attendance/qr-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ qrData: qrData.trim(), schoolId, classId: selectedClass !== "all" ? Number(selectedClass) : undefined, date }),
      });
      const data = await res.json();
      if (!res.ok) { toast({ title: "Scan failed", description: data.error || "Invalid QR code", variant: "destructive" }); return; }
      const entry = { id: Date.now(), studentName: data.student?.name, admissionNo: data.student?.admissionNo, status: "present", time: new Date().toLocaleTimeString("en-IN"), alreadyMarked: data.alreadyMarked };
      setScannedList(prev => [entry, ...prev.slice(0, 49)]);
      setManualQR("");
      if (data.alreadyMarked) toast({ title: `${data.student?.name} — Already marked present` });
      else toast({ title: `✓ ${data.student?.name}`, description: "Marked present via QR scan" });
    } catch { toast({ title: "Network error", variant: "destructive" }); }
    finally { setScanning(false); }
  };

  const handleManualSubmit = (e: React.FormEvent) => { e.preventDefault(); processQR(manualQR); };

  return (
    <AdminLayout title="QR Attendance Scanner" links={adminLinks}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold dark:text-white">QR Code Attendance Scanner</h2>
        <p className="text-sm text-muted-foreground mt-1">Scan student QR ID cards to mark attendance instantly</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Panel */}
        <div className="space-y-4">
          <Card className="p-6 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-bold dark:text-white mb-4">Scan Setup</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium dark:text-gray-300 mb-1 block">Date</label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="text-sm font-medium dark:text-gray-300 mb-1 block">Filter by Class (optional)</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="rounded-xl dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="All Classes" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Classes</SelectItem>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name} {c.section}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><QrCode className="w-5 h-5 text-primary" /></div>
              <div><h3 className="font-bold dark:text-white">Manual QR Entry</h3><p className="text-xs text-muted-foreground">Type/paste QR code value from student ID</p></div>
            </div>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input value={manualQR} onChange={e => setManualQR(e.target.value)} placeholder="student:ID:admissionNo" className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1" autoFocus />
              <Button type="submit" disabled={scanning || !manualQR.trim()} className="rounded-xl">
                {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Scan"}
              </Button>
            </form>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
              <Camera className="w-4 h-4 inline mr-2" /><strong>Camera scanning:</strong> Use a USB barcode scanner (it auto-types) or paste QR data from a QR reader app. Camera API requires HTTPS in production.
            </div>
          </Card>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 rounded-xl text-center dark:bg-gray-800 dark:border-gray-700">
              <p className="text-2xl font-black text-primary">{scannedList.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Scanned Today</p>
            </Card>
            <Card className="p-4 rounded-xl text-center dark:bg-gray-800 dark:border-gray-700">
              <p className="text-2xl font-black text-green-600">{scannedList.filter(s => !s.alreadyMarked).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Newly Marked</p>
            </Card>
            <Card className="p-4 rounded-xl text-center dark:bg-gray-800 dark:border-gray-700">
              <p className="text-2xl font-black text-orange-500">{scannedList.filter(s => s.alreadyMarked).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Already Present</p>
            </Card>
          </div>
        </div>
        {/* Scanned List */}
        <Card className="rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-bold dark:text-white">Scan Log — {date}</h3>
            {scannedList.length > 0 && <Button variant="ghost" size="sm" className="text-xs" onClick={() => setScannedList([])}>Clear</Button>}
          </div>
          <div className="divide-y dark:divide-gray-700 max-h-[500px] overflow-y-auto">
            {scannedList.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <QrCode className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold">No scans yet</p>
                <p className="text-sm">Scan a student QR ID to mark attendance</p>
              </div>
            ) : scannedList.map(s => (
              <div key={s.id} className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.alreadyMarked ? "bg-orange-100 dark:bg-orange-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                  {s.alreadyMarked ? <RefreshCw className="w-5 h-5 text-orange-500" /> : <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold dark:text-white">{s.studentName}</p>
                  <p className="text-xs text-muted-foreground">{s.admissionNo} · {s.time}</p>
                </div>
                <Badge className={`text-xs rounded-full ${s.alreadyMarked ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                  {s.alreadyMarked ? "Already Present" : "Marked Present"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
