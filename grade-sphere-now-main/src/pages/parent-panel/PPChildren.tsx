import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Baby, GraduationCap, Calendar, School, TrendingUp,
  ExternalLink, BookOpen, FileText, Clock, Save, Plus, Trash2
} from "lucide-react";

export default function PPChildren() {
  const { admissions, homework } = useOutletContext<any>();

  const [children, setChildren] = useState(
    admissions.map((a: any) => ({
      id: a.id,
      name: a.student_name,
      grade: a.grade,
      school: a.schools?.name || "—",
      schoolSlug: a.schools?.slug,
      status: a.status,
      dob: "",
      bloodGroup: "",
      allergies: "",
    }))
  );

  const updateChild = (index: number, key: string, value: string) => {
    setChildren((prev: any[]) => prev.map((c, i) => i === index ? { ...c, [key]: value } : c));
  };

  const addChild = () => {
    setChildren((prev: any[]) => [...prev, {
      id: `child-new-${Date.now()}`, name: "", grade: "", school: "", schoolSlug: "",
      status: "pending", dob: "", bloodGroup: "", allergies: "",
    }]);
  };

  const removeChild = (index: number) => {
    setChildren((prev: any[]) => prev.filter((_: any, i: number) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Children profiles updated!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Children</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your children's profiles and school information</p>
        </div>
        <Button onClick={addChild} className="rounded-lg gradient-primary border-0 shadow-lg shadow-primary/20 gap-1">
          <Plus className="h-4 w-4" /> Add Child
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {children.map((child: any, i: number) => (
          <Card key={child.id} className="border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground shadow-md">
                    {child.name ? child.name[0].toUpperCase() : "C"}
                  </div>
                  {child.name || "New Child"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={child.status === "approved" ? "bg-emerald-500/10 text-emerald-600" : child.status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-yellow-500/10 text-yellow-600"}>
                    {child.status}
                  </Badge>
                  {children.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="text-destructive text-xs h-7 gap-1" onClick={() => removeChild(i)}>
                      <Trash2 className="h-3 w-3" /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Child Name</Label><Input value={child.name} onChange={e => updateChild(i, "name", e.target.value)} placeholder="Full name" /></div>
                <div><Label>Grade / Class</Label><Input value={child.grade} onChange={e => updateChild(i, "grade", e.target.value)} placeholder="e.g. 10" /></div>
                <div><Label>School</Label><Input value={child.school} onChange={e => updateChild(i, "school", e.target.value)} placeholder="School name" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Date of Birth</Label><Input type="date" value={child.dob} onChange={e => updateChild(i, "dob", e.target.value)} /></div>
                <div><Label>Blood Group</Label><Input value={child.bloodGroup} onChange={e => updateChild(i, "bloodGroup", e.target.value)} placeholder="e.g. B+" /></div>
                <div><Label>Allergies / Medical Notes</Label><Input value={child.allergies} onChange={e => updateChild(i, "allergies", e.target.value)} placeholder="None" /></div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                {child.schoolSlug && (
                  <Link to={`/school/${child.schoolSlug}`}>
                    <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1">
                      <ExternalLink className="h-3 w-3" /> View School
                    </Button>
                  </Link>
                )}
                <Link to="/tutors">
                  <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs border-border/30 gap-1">
                    <BookOpen className="h-3 w-3" /> Find Tuition
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2 gradient-primary border-0 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>

      {/* Homework Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Homework & Notes</h2>
        <div className="space-y-3">
          {homework.map((hw: any) => (
            <Card key={hw.id} className="border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{hw.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{hw.subject} • {hw.class_name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(hw.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
