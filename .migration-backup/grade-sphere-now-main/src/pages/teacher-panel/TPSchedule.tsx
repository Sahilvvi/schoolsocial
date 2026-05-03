import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Calendar, Clock, Plus, Trash2, Users } from "lucide-react";

const defaultSchedule = [
  { id: "sch1", day: "Monday", time: "4:00 PM - 6:00 PM", subject: "Mathematics", grade: "Class 10", students: 5, type: "Home Tuition" },
  { id: "sch2", day: "Monday", time: "7:00 PM - 8:30 PM", subject: "Physics", grade: "Class 12", students: 8, type: "Online" },
  { id: "sch3", day: "Tuesday", time: "4:00 PM - 6:00 PM", subject: "Mathematics", grade: "Class 9", students: 6, type: "Home Tuition" },
  { id: "sch4", day: "Wednesday", time: "4:00 PM - 6:00 PM", subject: "Mathematics", grade: "Class 11", students: 4, type: "Online" },
  { id: "sch5", day: "Thursday", time: "4:00 PM - 6:00 PM", subject: "Physics", grade: "Class 10", students: 7, type: "Home Tuition" },
  { id: "sch6", day: "Friday", time: "4:00 PM - 6:00 PM", subject: "Mathematics", grade: "Class 12", students: 6, type: "Online" },
  { id: "sch7", day: "Saturday", time: "10:00 AM - 12:00 PM", subject: "Competitive Exam Prep", grade: "Class 11-12", students: 12, type: "Online" },
  { id: "sch8", day: "Saturday", time: "2:00 PM - 4:00 PM", subject: "Vedic Maths", grade: "Class 6-8", students: 10, type: "Home Tuition" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TPSchedule() {
  const [schedule, setSchedule] = useState(defaultSchedule);

  const addSlot = () => {
    setSchedule(prev => [...prev, { id: `sch-new-${Date.now()}`, day: "Monday", time: "", subject: "", grade: "", students: 0, type: "Online" }]);
  };

  const updateSlot = (index: number, key: string, value: string | number) => {
    setSchedule(prev => prev.map((s, i) => i === index ? { ...s, [key]: value } : s));
  };

  const removeSlot = (index: number) => {
    setSchedule(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Schedule updated!");
  };

  const totalStudents = schedule.reduce((s, slot) => s + slot.students, 0);
  const totalSlots = schedule.length;

  const groupedByDay = days.map(day => ({
    day,
    slots: schedule.filter(s => s.day === day),
  })).filter(g => g.slots.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Weekly Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">{totalSlots} classes • {totalStudents} students per week</p>
        </div>
        <Button onClick={addSlot} className="rounded-lg gradient-primary border-0 shadow-lg shadow-primary/20 gap-1">
          <Plus className="h-4 w-4" /> Add Slot
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {groupedByDay.map(group => (
          <Card key={group.day} className="border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                {group.day}
                <Badge variant="outline" className="ml-2 text-xs">{group.slots.length} classes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.slots.map(slot => {
                const idx = schedule.findIndex(s => s.id === slot.id);
                return (
                  <div key={slot.id} className="p-4 rounded-xl bg-accent/20 border border-border/30">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                      <div>
                        <Label className="text-xs">Time</Label>
                        <Input value={slot.time} onChange={e => updateSlot(idx, "time", e.target.value)} placeholder="4:00 PM - 6:00 PM" />
                      </div>
                      <div>
                        <Label className="text-xs">Subject</Label>
                        <Input value={slot.subject} onChange={e => updateSlot(idx, "subject", e.target.value)} placeholder="Mathematics" />
                      </div>
                      <div>
                        <Label className="text-xs">Grade</Label>
                        <Input value={slot.grade} onChange={e => updateSlot(idx, "grade", e.target.value)} placeholder="Class 10" />
                      </div>
                      <div>
                        <Label className="text-xs">Students</Label>
                        <Input type="number" value={slot.students} onChange={e => updateSlot(idx, "students", parseInt(e.target.value) || 0)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={slot.type === "Online" ? "bg-violet-500/10 text-violet-600 border-violet-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"}>
                          {slot.type}
                        </Badge>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeSlot(idx)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2 gradient-primary border-0 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" />
            Save Schedule
          </Button>
        </div>
      </form>
    </div>
  );
}
