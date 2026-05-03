import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { useAuth } from "@/hooks/use-auth";
import { Bus, Plus, Trash2, MapPin, Phone, User, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

export default function Transport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [routes, setRoutes] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"routes" | "students">("routes");
  const [routeOpen, setRouteOpen] = useState(false);
  const [allocOpen, setAllocOpen] = useState(false);
  const [form, setForm] = useState({ routeName: "", vehicleNumber: "", driverName: "", driverPhone: "", capacity: "", stops: "", morningTime: "", eveningTime: "" });
  const [allocForm, setAllocForm] = useState({ studentId: "", routeId: "", pickupStop: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [rRes, aRes, sRes] = await Promise.all([
      fetch(`${BASE}/api/transport?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/transport/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      fetch(`${BASE}/api/students?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
    ]);
    const [rd, ad, sd] = await Promise.all([rRes.json(), aRes.json(), sRes.json()]);
    setRoutes(rd.routes || []); setAllocations(ad.allocations || []); setStudents(sd.students || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addRoute = async () => {
    const res = await fetch(`${BASE}/api/transport`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(form) });
    if (res.ok) { toast({ title: "Route added!" }); setRouteOpen(false); fetchAll(); }
  };

  const allocate = async () => {
    const res = await fetch(`${BASE}/api/transport/students`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(allocForm) });
    if (res.ok) { toast({ title: "Student allocated to route!" }); setAllocOpen(false); fetchAll(); }
  };

  const deleteRoute = async (id: number) => { await fetch(`${BASE}/api/transport/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };
  const removeAlloc = async (id: number) => { await fetch(`${BASE}/api/transport/students/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); };

  return (
    <AdminLayout title="Transport Management" links={adminLinks}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {(["routes", "students"] as const).map(t => (
            <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)} className="rounded-xl capitalize">{t === "routes" ? "Bus Routes" : "Student Allocation"}</Button>
          ))}
        </div>
        <div className="flex gap-2">
          {tab === "routes" && (
            <Dialog open={routeOpen} onOpenChange={setRouteOpen}>
              <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />Add Route</Button></DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader><DialogTitle>Add Bus Route</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  {[["Route Name *", "routeName", "e.g. Route A - Rajouri Garden"], ["Vehicle Number", "vehicleNumber", "DL 1C 2345"], ["Driver Name", "driverName", "Driver's name"], ["Driver Phone", "driverPhone", "9xxxxxxxxx"], ["Capacity", "capacity", "e.g. 40"], ["Morning Time", "morningTime", "7:30 AM"], ["Evening Time", "eveningTime", "3:00 PM"], ["Stops (comma separated)", "stops", "Stop 1, Stop 2, Stop 3"]].map(([label, key, ph]) => (
                    <div key={key}><label className="text-sm font-medium dark:text-gray-300">{label}</label>
                      <Input value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  ))}
                  <Button onClick={addRoute} className="w-full">Add Route</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {tab === "students" && (
            <Dialog open={allocOpen} onOpenChange={setAllocOpen}>
              <DialogTrigger asChild><Button className="rounded-xl"><UserPlus className="w-4 h-4 mr-2" />Allocate Student</Button></DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader><DialogTitle>Assign Student to Route</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium dark:text-gray-300">Student</label>
                    <Select value={allocForm.studentId} onValueChange={v => setAllocForm(p => ({ ...p, studentId: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select student" /></SelectTrigger>
                      <SelectContent>{students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Route</label>
                    <Select value={allocForm.routeId} onValueChange={v => setAllocForm(p => ({ ...p, routeId: v }))}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue placeholder="Select route" /></SelectTrigger>
                      <SelectContent>{routes.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.routeName}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><label className="text-sm font-medium dark:text-gray-300">Pickup Stop</label><Input value={allocForm.pickupStop} onChange={e => setAllocForm(p => ({ ...p, pickupStop: e.target.value }))} placeholder="Nearest stop" className="dark:bg-gray-700 dark:border-gray-600" /></div>
                  <Button onClick={allocate} className="w-full">Assign Route</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <>
          {tab === "routes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.length === 0 ? <div className="col-span-2 text-center py-16 text-muted-foreground"><Bus className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No routes added yet</p></div>
              : routes.map(r => (
                <Card key={r.id} className="p-5 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center"><Bus className="w-5 h-5 text-blue-600" /></div>
                      <div><p className="font-bold dark:text-white">{r.routeName}</p><p className="text-xs text-muted-foreground">{r.vehicleNumber}</p></div>
                    </div>
                    <button onClick={() => deleteRoute(r.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-1 text-sm">
                    {r.driverName && <div className="flex items-center gap-2 text-muted-foreground"><User className="w-3.5 h-3.5" />{r.driverName} {r.driverPhone && `• ${r.driverPhone}`}</div>}
                    {r.stops && <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span className="text-xs">{r.stops}</span></div>}
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {r.morningTime && <span>🌅 {r.morningTime}</span>}
                      {r.eveningTime && <span>🌆 {r.eveningTime}</span>}
                      {r.capacity && <span>👥 {r.capacity} seats</span>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {tab === "students" && (
            <div className="space-y-3">
              {allocations.length === 0 ? <div className="text-center py-16 text-muted-foreground"><User className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-bold">No students allocated to routes</p></div>
              : allocations.map(a => (
                <Card key={a.id} className="p-4 rounded-xl dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold dark:text-white">{a.studentName}</p>
                    <p className="text-sm text-muted-foreground">{a.routeName} {a.pickupStop && `• Stop: ${a.pickupStop}`}</p>
                  </div>
                  <button onClick={() => removeAlloc(a.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
