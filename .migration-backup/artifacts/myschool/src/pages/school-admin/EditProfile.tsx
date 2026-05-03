import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { adminLinks } from "./admin-links";
import { useAuth } from "@/hooks/use-auth";
import { Save, School, MapPin, Phone, Globe, BookOpen, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function getToken() { return localStorage.getItem("myschool_token"); }
export default function EditProfile() {
  const { user } = useAuth();
  const schoolId = user?.schoolId || 1;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", website: "", address: "", city: "", state: "", pincode: "",
    board: "", type: "private", description: "", facilities: "", logoUrl: "", coverUrl: "",
  });

  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    fetch(`${BASE}/api/schools/${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => {
        const s = data.school || data;
        setForm({
          name: s.name || "", email: s.email || "", phone: s.phone || "", website: s.website || "",
          address: s.address || "", city: s.city || "", state: s.state || "", pincode: s.pincode || "",
          board: s.board || "", type: s.type || "private", description: s.description || "",
          facilities: s.facilities || "", logoUrl: s.logoUrl || "", coverUrl: s.coverUrl || "",
        });
      })
      .catch(() => toast({ title: "Error", description: "Failed to load school profile", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/schools/${schoolId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Profile updated!", description: "School profile saved successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to save profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout title="School Profile" links={adminLinks}>
      <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"/></div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="School Profile" links={adminLinks}>
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit School Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your school's public information</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><School className="w-5 h-5 text-blue-500"/>Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="dark:text-gray-300">School Name *</Label>
                <Input value={form.name} onChange={e => handleChange("name", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">Email *</Label>
                <Input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">Phone</Label>
                <Input value={form.phone} onChange={e => handleChange("phone", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">Website</Label>
                <Input value={form.website} onChange={e => handleChange("website", e.target.value)} placeholder="https://" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">Board (CBSE, ICSE, State...)</Label>
                <Input value={form.board} onChange={e => handleChange("board", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">School Type</Label>
                <Select value={form.type} onValueChange={v => handleChange("type", v)}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="aided">Aided</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="dark:text-gray-300">About School</Label>
              <Textarea rows={4} value={form.description} onChange={e => handleChange("description", e.target.value)} placeholder="Describe your school..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <Label className="dark:text-gray-300">Facilities (comma-separated)</Label>
              <Input value={form.facilities} onChange={e => handleChange("facilities", e.target.value)} placeholder="Library, Lab, Sports Ground, Canteen..." className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-500"/>Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="dark:text-gray-300">Street Address</Label>
                <Input value={form.address} onChange={e => handleChange("address", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">City</Label>
                <Input value={form.city} onChange={e => handleChange("city", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">State</Label>
                <Input value={form.state} onChange={e => handleChange("state", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <Label className="dark:text-gray-300">Pincode</Label>
                <Input value={form.pincode} onChange={e => handleChange("pincode", e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Camera className="w-5 h-5 text-blue-500"/>School Logo</h2>
            <div className="flex flex-col items-center gap-3">
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="Logo" className="w-24 h-24 rounded-full object-cover border-4 border-blue-100" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <School className="w-12 h-12 text-white" />
                </div>
              )}
              <Label className="dark:text-gray-300 text-xs">Logo URL</Label>
              <Input value={form.logoUrl} onChange={e => handleChange("logoUrl", e.target.value)} placeholder="https://..." className="text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Upload className="w-5 h-5 text-blue-500"/>Cover Image</h2>
            <div>
              {form.coverUrl && <img src={form.coverUrl} alt="Cover" className="w-full h-24 object-cover rounded-lg mb-2" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
              <Label className="dark:text-gray-300 text-xs">Cover Image URL</Label>
              <Input value={form.coverUrl} onChange={e => handleChange("coverUrl", e.target.value)} placeholder="https://..." className="text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Profile Tip</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">A complete profile with logo, description, and facilities gets 3x more parent inquiries on the public portal.</p>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}
