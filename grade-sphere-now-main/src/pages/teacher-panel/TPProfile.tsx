import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, User, GraduationCap, MapPin, Phone, Mail, Globe, Sparkles } from "lucide-react";

export default function TPProfile() {
  const { teacherData, updateTeacher } = useOutletContext<any>();

  const [form, setForm] = useState({
    name: teacherData.name,
    title: teacherData.title,
    location: teacherData.location,
    bio: teacherData.bio,
    email: teacherData.email,
    phone: teacherData.phone,
    website: teacherData.website,
    hourlyRate: teacherData.hourlyRate,
    skills: teacherData.skills.join(", "),
    subjects: teacherData.subjects.join(", "),
    grades: teacherData.grades.join(", "),
  });

  const [eduForm, setEduForm] = useState(
    teacherData.education.map((e: any) => ({ ...e }))
  );

  const u = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacher({
      name: form.name,
      title: form.title,
      location: form.location,
      bio: form.bio,
      email: form.email,
      phone: form.phone,
      website: form.website,
      hourlyRate: form.hourlyRate,
      skills: form.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
      subjects: form.subjects.split(",").map((s: string) => s.trim()).filter(Boolean),
      grades: form.grades.split(",").map((s: string) => s.trim()).filter(Boolean),
      education: eduForm,
    });
    toast.success("Profile updated successfully!");
  };

  const updateEdu = (index: number, key: string, value: string) => {
    setEduForm((prev: any[]) => prev.map((e, i) => i === index ? { ...e, [key]: value } : e));
  };

  const addEducation = () => {
    setEduForm((prev: any[]) => [...prev, { degree: "", institution: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    setEduForm((prev: any[]) => prev.filter((_: any, i: number) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit your profile information visible to schools and parents</p>
        </div>
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Verified</Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary" />Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => u("name", e.target.value)} /></div>
              <div><Label>Title / Designation</Label><Input value={form.title} onChange={e => u("title", e.target.value)} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => u("location", e.target.value)} /></div>
              <div><Label>Hourly Rate</Label><Input value={form.hourlyRate} onChange={e => u("hourlyRate", e.target.value)} placeholder="e.g. ₹800 - ₹1,500" /></div>
            </div>
            <div><Label>Bio / About</Label><Textarea value={form.bio} onChange={e => u("bio", e.target.value)} rows={4} placeholder="Describe yourself, your teaching style, and expertise..." /></div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Phone className="h-5 w-5 text-primary" />Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1"><Label>Email</Label><Input value={form.email} onChange={e => u("email", e.target.value)} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1"><Label>Phone</Label><Input value={form.phone} onChange={e => u("phone", e.target.value)} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1"><Label>Website</Label><Input value={form.website} onChange={e => u("website", e.target.value)} /></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Subjects */}
        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5 text-primary" />Skills & Subjects</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Skills (comma separated)</Label>
              <Textarea value={form.skills} onChange={e => u("skills", e.target.value)} rows={2} placeholder="Mathematics, Physics, CBSE..." />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.skills.split(",").map((s: string, i: number) => s.trim() && (
                  <Badge key={i} variant="outline" className="text-xs">{s.trim()}</Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Subjects (comma separated)</Label>
                <Input value={form.subjects} onChange={e => u("subjects", e.target.value)} placeholder="Mathematics, Physics" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.subjects.split(",").map((s: string, i: number) => s.trim() && (
                    <Badge key={i} className="gradient-primary text-primary-foreground border-0 rounded-lg text-xs">{s.trim()}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Grades (comma separated)</Label>
                <Input value={form.grades} onChange={e => u("grades", e.target.value)} placeholder="Class 6-8, Class 9-10" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.grades.split(",").map((s: string, i: number) => s.trim() && (
                    <Badge key={i} variant="secondary" className="text-xs">{s.trim()}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="border-border/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5 text-primary" />Education</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addEducation} className="rounded-lg text-xs">+ Add Education</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {eduForm.map((edu: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-accent/20 border border-border/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Education #{i + 1}</span>
                  {eduForm.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="text-destructive text-xs h-7" onClick={() => removeEducation(i)}>Remove</Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><Label className="text-xs">Degree</Label><Input value={edu.degree} onChange={e => updateEdu(i, "degree", e.target.value)} placeholder="M.Sc. Mathematics" /></div>
                  <div><Label className="text-xs">Institution</Label><Input value={edu.institution} onChange={e => updateEdu(i, "institution", e.target.value)} placeholder="Delhi University" /></div>
                  <div><Label className="text-xs">Year</Label><Input value={edu.year} onChange={e => updateEdu(i, "year", e.target.value)} placeholder="2014" /></div>
                </div>
              </div>
            ))}
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
