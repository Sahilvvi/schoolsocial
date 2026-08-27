import { useOutletContext } from "react-router-dom";
import { Building2, Plus, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Facility {
  id: string;
  name: string;
  description: string;
  available: boolean;
  icon: string;
}

const DEMO_FACILITIES: Facility[] = [
  { id: "1", name: "Smart Classrooms", description: "Air-conditioned rooms with digital boards and projectors", available: true, icon: "🖥️" },
  { id: "2", name: "Science Labs", description: "Fully equipped Physics, Chemistry, and Biology labs", available: true, icon: "🔬" },
  { id: "3", name: "Computer Lab", description: "50+ computers with high-speed internet", available: true, icon: "💻" },
  { id: "4", name: "Library", description: "10,000+ books with digital catalog system", available: true, icon: "📚" },
  { id: "5", name: "Sports Complex", description: "Cricket ground, basketball court, swimming pool", available: true, icon: "🏟️" },
  { id: "6", name: "Auditorium", description: "500-seat capacity with modern audio-visual setup", available: true, icon: "🎭" },
  { id: "7", name: "Cafeteria", description: "Hygienic food with nutritious meal plans", available: true, icon: "🍽️" },
  { id: "8", name: "Transport", description: "GPS-enabled buses covering 20+ routes", available: true, icon: "🚌" },
  { id: "9", name: "Medical Room", description: "Full-time nurse with first-aid facilities", available: true, icon: "🏥" },
  { id: "10", name: "Art & Music Room", description: "Dedicated space for creative activities", available: false, icon: "🎨" },
  { id: "11", name: "Playground", description: "Spacious outdoor play area with modern equipment", available: true, icon: "🎪" },
  { id: "12", name: "CCTV Surveillance", description: "24/7 monitoring for campus security", available: true, icon: "📷" },
];

const ICONS = ["🖥️", "🔬", "💻", "📚", "🏟️", "🎭", "🍽️", "🚌", "🏥", "🎨", "🎪", "📷", "⚽", "🏀", "🏊", "🎸"];

export default function SPFacilities() {
  const { school } = useOutletContext<any>();
  const [facilities, setFacilities] = useState<Facility[]>(DEMO_FACILITIES);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", icon: "🖥️" });

  const handleAdd = () => {
    if (!form.name || !form.description) {
      toast.error("Facility name and description are required");
      return;
    }
    const newFacility: Facility = {
      id: `f-${Date.now()}`,
      name: form.name,
      description: form.description,
      available: true,
      icon: form.icon || ICONS[0],
    };
    setFacilities(prev => [newFacility, ...prev]);
    setForm({ name: "", description: "", icon: "🖥️" });
    setOpen(false);
    toast.success("Facility added");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" /> Facilities
          </h1>
          <p className="text-sm text-gray-500 mt-1">{facilities.filter(f => f.available).length} facilities available</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" /> Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Add Facility</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1"><Label htmlFor="facility-name">Facility Name *</Label><Input id="facility-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Swimming Pool" /></div>
              <div className="space-y-1"><Label htmlFor="facility-desc">Description *</Label><Input id="facility-desc" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description" /></div>
              <div className="space-y-1"><Label htmlFor="facility-icon">Icon</Label><Input id="facility-icon" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="Emoji icon" /></div>
              <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700">Add Facility</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((facility) => (
          <div key={facility.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{facility.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 truncate">{facility.name}</h3>
                  {facility.available && (
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{facility.description}</p>
                <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  facility.available ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {facility.available ? "Available" : "Coming Soon"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
