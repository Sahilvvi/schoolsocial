import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, BookOpen, Users, Clock, IndianRupee, TrendingUp, Plus, Trash2 } from "lucide-react";

export default function TuPBatches() {
  const { batches: initialBatches } = useOutletContext<any>();
  const [batches, setBatches] = useState(initialBatches.map((b: any) => ({ ...b })));

  const updateBatch = (index: number, key: string, value: any) => {
    setBatches((prev: any[]) => prev.map((b, i) => i === index ? { ...b, [key]: value } : b));
  };

  const addBatch = () => {
    setBatches((prev: any[]) => [...prev, {
      id: `batch-new-${Date.now()}`, batch_name: "", subject: "", schedule: "",
      current_students: 0, max_students: 20, fee_per_month: 0, is_active: true,
    }]);
  };

  const removeBatch = (index: number) => {
    setBatches((prev: any[]) => prev.filter((_: any, i: number) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Batches updated!");
  };

  const totalStudents = batches.reduce((s: number, b: any) => s + b.current_students, 0);
  const totalRevenue = batches.reduce((s: number, b: any) => s + b.current_students * b.fee_per_month, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Batches</h1>
          <p className="text-sm text-muted-foreground mt-1">{batches.length} batches • {totalStudents} students • ₹{(totalRevenue / 1000).toFixed(0)}K/mo revenue</p>
        </div>
        <Button onClick={addBatch} className="rounded-lg gradient-primary border-0 shadow-lg shadow-primary/20 gap-1">
          <Plus className="h-4 w-4" /> Add Batch
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {batches.map((batch: any, i: number) => (
          <Card key={batch.id} className="border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shrink-0">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  {batch.batch_name || "New Batch"}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Active</span>
                    <Switch checked={batch.is_active} onCheckedChange={v => updateBatch(i, "is_active", v)} />
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="text-destructive text-xs h-7 gap-1" onClick={() => removeBatch(i)}>
                    <Trash2 className="h-3 w-3" /> Remove
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Batch Name</Label><Input value={batch.batch_name} onChange={e => updateBatch(i, "batch_name", e.target.value)} placeholder="JEE Maths Batch A" /></div>
                <div><Label>Subject</Label><Input value={batch.subject} onChange={e => updateBatch(i, "subject", e.target.value)} placeholder="Mathematics" /></div>
                <div><Label>Schedule</Label><Input value={batch.schedule} onChange={e => updateBatch(i, "schedule", e.target.value)} placeholder="Mon, Wed, Fri — 4-6 PM" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Current Students</Label><Input type="number" value={batch.current_students} onChange={e => updateBatch(i, "current_students", parseInt(e.target.value) || 0)} /></div>
                <div><Label>Max Students</Label><Input type="number" value={batch.max_students} onChange={e => updateBatch(i, "max_students", parseInt(e.target.value) || 0)} /></div>
                <div><Label>Fee per Month (₹)</Label><Input type="number" value={batch.fee_per_month} onChange={e => updateBatch(i, "fee_per_month", parseInt(e.target.value) || 0)} /></div>
              </div>
              {/* Occupancy bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted/30 rounded-full h-2">
                  <div className="h-2 rounded-full gradient-primary transition-all" style={{ width: `${Math.round((batch.current_students / batch.max_students) * 100)}%` }} />
                </div>
                <span className="text-xs text-muted-foreground font-semibold">{Math.round((batch.current_students / batch.max_students) * 100)}% full</span>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2 gradient-primary border-0 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" /> Save All Batches
          </Button>
        </div>
      </form>
    </div>
  );
}
