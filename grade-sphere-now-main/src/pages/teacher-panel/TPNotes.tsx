import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, FileText, Zap, Award, Plus, Trash2, CheckCircle } from "lucide-react";

const defaultPackages = [
  { name: "Basic Notes", price: "₹199/month", features: ["Chapter-wise notes PDF", "Practice worksheets", "Email support"] },
  { name: "Premium Notes", price: "₹499/month", features: ["Video explanations", "Previous year papers (solved)", "Doubt clearing sessions (2/month)", "All Basic features"] },
  { name: "Complete Package", price: "₹999/month", features: ["1-on-1 mentoring (4 sessions)", "Custom study plan", "Weekly tests with analysis", "All Premium features"] },
];

export default function TPNotes() {
  const { teacherData } = useOutletContext<any>();
  const [packages, setPackages] = useState(defaultPackages.map(p => ({ ...p, features: [...p.features] })));

  const updatePackage = (index: number, key: string, value: string) => {
    setPackages(prev => prev.map((p, i) => i === index ? { ...p, [key]: value } : p));
  };

  const updateFeature = (pkgIdx: number, featIdx: number, value: string) => {
    setPackages(prev => prev.map((p, i) => {
      if (i !== pkgIdx) return p;
      const features = [...p.features];
      features[featIdx] = value;
      return { ...p, features };
    }));
  };

  const addFeature = (pkgIdx: number) => {
    setPackages(prev => prev.map((p, i) => i === pkgIdx ? { ...p, features: [...p.features, ""] } : p));
  };

  const removeFeature = (pkgIdx: number, featIdx: number) => {
    setPackages(prev => prev.map((p, i) => i === pkgIdx ? { ...p, features: p.features.filter((_, j) => j !== featIdx) } : p));
  };

  const addPackage = () => {
    setPackages(prev => [...prev, { name: "", price: "", features: [""] }]);
  };

  const removePackage = (index: number) => {
    setPackages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Note packages updated!");
  };

  const icons = [FileText, Zap, Award];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notes & Study Material</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your subscription packages for students</p>
        </div>
        <Button variant="outline" onClick={addPackage} className="rounded-lg gap-1">
          <Plus className="h-4 w-4" /> Add Package
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {packages.map((pkg, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Card key={i} className={`border-border/30 ${i === 1 ? "ring-2 ring-primary/20" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className={`p-2 rounded-lg shadow-md ${i === 0 ? "bg-gradient-to-br from-blue-500 to-cyan-500" : i === 1 ? "bg-gradient-to-br from-violet-500 to-purple-500" : "bg-gradient-to-br from-amber-500 to-orange-500"}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    Package #{i + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {i === 1 && <Badge className="gradient-primary text-primary-foreground border-0">Most Popular</Badge>}
                    {packages.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="text-destructive text-xs h-7 gap-1" onClick={() => removePackage(i)}>
                        <Trash2 className="h-3 w-3" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Package Name</Label><Input value={pkg.name} onChange={e => updatePackage(i, "name", e.target.value)} placeholder="Basic Notes" /></div>
                  <div><Label>Price</Label><Input value={pkg.price} onChange={e => updatePackage(i, "price", e.target.value)} placeholder="₹199/month" /></div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Features</Label>
                    <Button type="button" variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => addFeature(i)}>
                      <Plus className="h-3 w-3" /> Add Feature
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {pkg.features.map((feat, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <Input value={feat} onChange={e => updateFeature(i, j, e.target.value)} placeholder="Feature description..." className="flex-1" />
                        {pkg.features.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeFeature(i, j)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2 gradient-primary border-0 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" />
            Save Packages
          </Button>
        </div>
      </form>
    </div>
  );
}
