import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Briefcase, Award, Plus, Trash2 } from "lucide-react";

export default function TPExperience() {
  const { teacherData, updateTeacher } = useOutletContext<any>();

  const [expList, setExpList] = useState(
    teacherData.experience_list.map((e: any) => ({ ...e }))
  );
  const [achievements, setAchievements] = useState(teacherData.achievements.join("\n"));

  const updateExp = (index: number, key: string, value: string) => {
    setExpList((prev: any[]) => prev.map((e, i) => i === index ? { ...e, [key]: value } : e));
  };

  const addExperience = () => {
    setExpList((prev: any[]) => [...prev, { role: "", school: "", duration: "", desc: "" }]);
  };

  const removeExperience = (index: number) => {
    setExpList((prev: any[]) => prev.filter((_: any, i: number) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacher({
      experience_list: expList,
      achievements: achievements.split("\n").map((a: string) => a.trim()).filter(Boolean),
    });
    toast.success("Experience & achievements updated!");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Experience & Achievements</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your work history and notable achievements</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Work Experience */}
        <Card className="border-border/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="h-5 w-5 text-primary" />Work Experience</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addExperience} className="rounded-lg text-xs gap-1">
                <Plus className="h-3 w-3" /> Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {expList.map((exp: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-accent/20 border border-border/30 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">Position #{i + 1}</Badge>
                  {expList.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="text-destructive text-xs h-7 gap-1" onClick={() => removeExperience(i)}>
                      <Trash2 className="h-3 w-3" /> Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><Label className="text-xs">Role / Title</Label><Input value={exp.role} onChange={e => updateExp(i, "role", e.target.value)} placeholder="Senior Math Teacher" /></div>
                  <div><Label className="text-xs">School / Organization</Label><Input value={exp.school} onChange={e => updateExp(i, "school", e.target.value)} placeholder="Delhi Public School" /></div>
                  <div><Label className="text-xs">Duration</Label><Input value={exp.duration} onChange={e => updateExp(i, "duration", e.target.value)} placeholder="2020 - Present" /></div>
                </div>
                <div><Label className="text-xs">Description</Label><Textarea value={exp.desc} onChange={e => updateExp(i, "desc", e.target.value)} rows={2} placeholder="Key responsibilities and achievements..." /></div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-border/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Award className="h-5 w-5 text-primary" />Achievements</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Achievements (one per line)</Label>
              <Textarea
                value={achievements}
                onChange={e => setAchievements(e.target.value)}
                rows={6}
                placeholder={"Best Teacher Award — DPS RK Puram (2022)\nPublished 'Fun with Numbers' workbook series\n100% pass rate in Class 12 Board Exams"}
              />
              <div className="mt-3 space-y-2">
                {achievements.split("\n").filter((a: string) => a.trim()).map((a: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-accent/20 border border-border/20">
                    <Award className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{a.trim()}</span>
                  </div>
                ))}
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
