import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import L from "leaflet";
import type { School } from "@/data/mock";

// Fix default marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface SchoolMapProps {
  schools: School[];
}

export default function SchoolMap({ schools }: SchoolMapProps) {
  const center: [number, number] = [20.5937, 78.9629]; // India center

  return (
    <div className="rounded-xl overflow-hidden border border-border" style={{ height: 400 }}>
      <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {schools.map((school) => (
          <Marker key={school.id} position={[school.lat, school.lng]}>
            <Popup>
              <div className="space-y-1 min-w-[180px]">
                <h3 className="font-semibold text-sm">{school.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {school.location}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {school.rating} ({school.reviewCount} reviews)
                </div>
                <p className="text-xs font-semibold">{school.fees}</p>
                <Link
                  to={`/school/${school.slug}`}
                  className="text-xs text-blue-600 hover:underline block mt-1"
                >
                  View Profile →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
