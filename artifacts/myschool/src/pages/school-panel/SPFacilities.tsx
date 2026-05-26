import { useOutletContext } from "react-router-dom";
import { Building2, Plus, Check } from "lucide-react";
import { useState } from "react";

const DEMO_FACILITIES = [
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

export default function SPFacilities() {
  const { school } = useOutletContext<any>();
  const [facilities] = useState(DEMO_FACILITIES);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" /> Facilities
          </h1>
          <p className="text-sm text-gray-500 mt-1">{facilities.filter(f => f.available).length} facilities available</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Add Facility
        </button>
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
