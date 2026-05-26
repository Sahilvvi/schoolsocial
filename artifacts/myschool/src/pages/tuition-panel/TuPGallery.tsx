import { useOutletContext } from "react-router-dom";
import { Image, Plus, Trash2 } from "lucide-react";

const DEMO_PHOTOS = [
  { id: "1", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80", label: "Classroom" },
  { id: "2", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80", label: "Students" },
  { id: "3", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80", label: "Study Hall" },
  { id: "4", url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80", label: "Sports" },
  { id: "5", url: "https://images.unsplash.com/photo-1523050854058-8df90110c8f1?w=400&q=80", label: "Lab" },
  { id: "6", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80", label: "Library" },
];

export default function TuPGallery() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Image className="h-5 w-5 text-blue-600" /> Photo Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">{DEMO_PHOTOS.length} photos uploaded</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"><Plus className="h-4 w-4" /> Upload Photo</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {DEMO_PHOTOS.map(p => (
          <div key={p.id} className="relative group rounded-xl overflow-hidden border border-gray-200">
            <img src={p.url} alt={p.label} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="bg-white/90 text-red-600 p-2 rounded-lg"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-white text-sm font-semibold">{p.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
