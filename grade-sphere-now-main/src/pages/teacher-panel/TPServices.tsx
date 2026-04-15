import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Home, Video, FileText, IndianRupee, Target } from "lucide-react";

export default function TPServices() {
  const { teacherData, updateTeacher } = useOutletContext<any>();

  const [homeTuition, setHomeTuition] = useState(teacherData.homeTuition);
  const [onlineClasses, setOnlineClasses] = useState(teacherData.onlineClasses);
  const [paidNotes, setPaidNotes] = useState(teacherData.paidNotes);
  const [hourlyRate, setHourlyRate] = useState(teacherData.hourlyRate);
  const [onlineRate, setOnlineRate] = useState("₹600 - ₹1,000");
  const [notesRate, setNotesRate] = useState("₹199 - ₹999");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacher({
      homeTuition,
      onlineClasses,
      paidNotes,
      hourlyRate,
    });
    toast.success("Services updated successfully!");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Services</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure the services you offer to students and parents</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Home Tuition */}
        <Card className={`border-border/30 transition-all ${homeTuition ? "ring-2 ring-green-500/20" : "opacity-70"}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><Home className="h-5 w-5 text-blue-500" />Home Tuition</CardTitle>
              <div className="flex items-center gap-3">
                <Badge className={homeTuition ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/30"}>
                  {homeTuition ? "Active" : "Inactive"}
                </Badge>
                <Switch checked={homeTuition} onCheckedChange={setHomeTuition} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Personalized 1-on-1 tuition at the student's home. Flexible timing and customized study plans.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Hourly Rate</Label>
                <Input value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="₹800 - ₹1,500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Classes */}
        <Card className={`border-border/30 transition-all ${onlineClasses ? "ring-2 ring-green-500/20" : "opacity-70"}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><Video className="h-5 w-5 text-violet-500" />Online Classes</CardTitle>
              <div className="flex items-center gap-3">
                <Badge className={onlineClasses ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/30"}>
                  {onlineClasses ? "Active" : "Inactive"}
                </Badge>
                <Switch checked={onlineClasses} onCheckedChange={setOnlineClasses} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Live interactive sessions via Zoom/Google Meet. Screen sharing and recorded sessions available.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Rate per Hour</Label>
                <Input value={onlineRate} onChange={e => setOnlineRate(e.target.value)} placeholder="₹600 - ₹1,000" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paid Notes */}
        <Card className={`border-border/30 transition-all ${paidNotes ? "ring-2 ring-green-500/20" : "opacity-70"}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5 text-amber-500" />Paid Notes & Material</CardTitle>
              <div className="flex items-center gap-3">
                <Badge className={paidNotes ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/30"}>
                  {paidNotes ? "Active" : "Inactive"}
                </Badge>
                <Switch checked={paidNotes} onCheckedChange={setPaidNotes} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Curated study materials, solved papers, and chapter-wise notes for exam preparation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Monthly Price Range</Label>
                <Input value={notesRate} onChange={e => setNotesRate(e.target.value)} placeholder="₹199 - ₹999" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2 gradient-primary border-0 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
