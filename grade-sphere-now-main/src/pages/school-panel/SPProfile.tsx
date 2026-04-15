import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isDemoUserId } from "@/hooks/useDemoMode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, MapPin, School, BookOpen, Upload } from "lucide-react";

export default function SPProfile() {
  const { school } = useOutletContext<any>();
  const { user } = useAuth();
  const qc = useQueryClient();
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: school.name || "",
    location: school.location || "",
    board: school.board || "",
    fees: school.fees || "",
    description: school.description || "",
    about: school.about || "",
    banner: school.banner || "",
    facilities: (school.facilities || []).join(", "),
    achievements: (school.achievements || []).join(", "),
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setBannerPreview(localUrl);
    setForm(p => ({ ...p, banner: localUrl }));
    toast.success("Banner image selected");
  };

  const updateSchool = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        facilities: data.facilities.split(",").map((f: string) => f.trim()).filter(Boolean),
        achievements: data.achievements.split(",").map((a: string) => a.trim()).filter(Boolean),
      };
      if (isDemoUserId(user?.id)) {
        // Update the school-owner query cache directly
        qc.setQueriesData<any>({ queryKey: ["school-owner"] }, (old: any) => {
          if (!old) return old;
          return { ...old, ...payload };
        });
        return;
      }
      const { error } = await supabase.from("schools").update(payload).eq("id", school.id);
      if (error) throw error;
    },
    onSuccess: () => {
      if (!isDemoUserId(user?.id)) {
        qc.invalidateQueries({ queryKey: ["school-owner"] });
        qc.invalidateQueries({ queryKey: ["school", school.slug] });
      }
      toast.success("School profile updated!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool.mutate(form);
  };

  const u = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">School Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit your school's public profile information</p>
        </div>
        <div className="flex items-center gap-2">
          {school.is_verified && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">✓ Verified</Badge>}
          {school.is_featured && <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">⭐ Featured</Badge>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><School className="h-5 w-5 text-primary" />Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>School Name</Label><Input value={form.name} onChange={e => u("name", e.target.value)} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => u("location", e.target.value)} /></div>
              <div><Label>Board / Affiliation</Label><Input value={form.board} onChange={e => u("board", e.target.value)} placeholder="e.g. CBSE, ICSE, State Board" /></div>
              <div><Label>Fee Range</Label><Input value={form.fees} onChange={e => u("fees", e.target.value)} placeholder="e.g. ₹50,000 - ₹1,20,000/year" /></div>
            </div>
            <div>
              <Label>Banner Image</Label>
              <div className="flex items-center gap-3 mt-1">
                <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerFile} />
                <Button type="button" variant="outline" size="sm" onClick={() => bannerInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />Upload Image
                </Button>
                <span className="text-xs text-muted-foreground">or paste URL below</span>
              </div>
              <Input value={form.banner} onChange={e => { u("banner", e.target.value); setBannerPreview(null); }} placeholder="https://..." className="mt-2" />
            </div>
            {(bannerPreview || form.banner) && (
              <div className="rounded-xl overflow-hidden border border-border/30 h-40">
                <img src={bannerPreview || form.banner} alt="Banner" className="w-full h-full object-cover" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="h-5 w-5 text-primary" />Description & About</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Short Description</Label><Textarea value={form.description} onChange={e => u("description", e.target.value)} rows={2} placeholder="Brief one-liner about your school" /></div>
            <div><Label>About (Detailed)</Label><Textarea value={form.about} onChange={e => u("about", e.target.value)} rows={5} placeholder="Detailed information about your school, history, vision..." /></div>
          </CardContent>
        </Card>

        {/* Facilities & Achievements */}
        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5 text-primary" />Facilities & Achievements</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Facilities (comma separated)</Label>
              <Textarea value={form.facilities} onChange={e => u("facilities", e.target.value)} rows={2} placeholder="Library, Computer Lab, Sports Ground, Swimming Pool..." />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.facilities.split(",").map((f: string, i: number) => f.trim() && (
                  <Badge key={i} variant="outline" className="text-xs">{f.trim()}</Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Achievements (comma separated)</Label>
              <Textarea value={form.achievements} onChange={e => u("achievements", e.target.value)} rows={2} placeholder="Best School Award 2024, 100% Board Results..." />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.achievements.split(",").map((a: string, i: number) => a.trim() && (
                  <Badge key={i} variant="secondary" className="text-xs">{a.trim()}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={updateSchool.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateSchool.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
