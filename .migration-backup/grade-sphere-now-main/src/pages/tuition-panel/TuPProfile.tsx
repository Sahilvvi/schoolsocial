import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Building2, MapPin, Phone, Mail, Globe } from "lucide-react";

export default function TuPProfile() {
  const { centerData, updateCenter } = useOutletContext<any>();

  const [form, setForm] = useState({
    name: centerData.name,
    location: centerData.location,
    phone: centerData.phone,
    email: centerData.email,
    website: centerData.website,
    description: centerData.description,
    established: centerData.established,
  });

  const u = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCenter(form);
    toast.success("Center profile updated!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Center Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit your tuition center's public information</p>
        </div>
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5 text-primary" />Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Center Name</Label><Input value={form.name} onChange={e => u("name", e.target.value)} /></div>
              <div><Label>Established Year</Label><Input value={form.established} onChange={e => u("established", e.target.value)} /></div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => u("description", e.target.value)} rows={3} /></div>
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Phone className="h-5 w-5 text-primary" />Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1"><Label>Location</Label><Input value={form.location} onChange={e => u("location", e.target.value)} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1"><Label>Phone</Label><Input value={form.phone} onChange={e => u("phone", e.target.value)} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1"><Label>Email</Label><Input value={form.email} onChange={e => u("email", e.target.value)} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1"><Label>Website</Label><Input value={form.website} onChange={e => u("website", e.target.value)} /></div>
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
