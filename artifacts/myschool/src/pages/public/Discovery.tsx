import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useSearchPublicSchools } from "@workspace/api-client-react";
import { School, Search, MapPin, Star, Users, ArrowRight, Trophy, Map, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const CITY_COORDS: Record<string, [number, number]> = {
  "Mumbai": [19.076, 72.877],
  "Delhi": [28.6139, 77.2090],
  "Bangalore": [12.9716, 77.5946],
  "Bengaluru": [12.9716, 77.5946],
  "Chennai": [13.0827, 80.2707],
  "Hyderabad": [17.3850, 78.4867],
  "Kolkata": [22.5726, 88.3639],
  "Pune": [18.5204, 73.8567],
  "Ahmedabad": [23.0225, 72.5714],
  "Jaipur": [26.9124, 75.7873],
  "Lucknow": [26.8467, 80.9462],
  "Chandigarh": [30.7333, 76.7794],
  "Noida": [28.5355, 77.3910],
  "Gurgaon": [28.4595, 77.0266],
  "Gurugram": [28.4595, 77.0266],
  "Surat": [21.1702, 72.8311],
  "Bhopal": [23.2599, 77.4126],
  "Nagpur": [21.1458, 79.0882],
  "Patna": [25.5941, 85.1376],
  "Indore": [22.7196, 75.8577],
};

function getCityCoords(city: string): [number, number] {
  const key = Object.keys(CITY_COORDS).find(k => city?.toLowerCase().includes(k.toLowerCase()));
  if (key) return CITY_COORDS[key];
  return [20.5937 + (Math.random() - 0.5) * 8, 78.9629 + (Math.random() - 0.5) * 8];
}

function SchoolMapView({ schools }: { schools: any[] }) {
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([rl, L]) => {
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setMapComponents(rl);
    });
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  if (!MapComponents) {
    return <div className="h-96 rounded-2xl bg-muted flex items-center justify-center"><div className="text-center text-muted-foreground"><Map className="w-10 h-10 mx-auto mb-2 opacity-30 animate-pulse" /><p>Loading map...</p></div></div>;
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;
  const schoolsWithCoords = schools.map(s => ({ ...s, coords: getCityCoords(s.city) }));

  return (
    <div className="rounded-2xl overflow-hidden border border-border" style={{ height: 520 }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {schoolsWithCoords.map((school: any) => (
          <Marker key={school.id} position={school.coords}>
            <Popup>
              <div className="min-w-44">
                <p className="font-bold text-sm">{school.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{school.board} · {school.type}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><span>📍</span>{school.city}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">{school.averageRating}</span>
                  <span className="text-xs text-gray-500">· {school.totalStudents} students</span>
                </div>
                <a href={`/schools/${school.slug}`} className="mt-2 block text-xs text-blue-600 font-bold hover:underline">View Profile →</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function Discovery() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const { data, isLoading } = useSearchPublicSchools({ q: search });
  const schools = data?.schools || [];

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-display font-bold text-2xl">
            <School className="w-6 h-6" /> MySchool
          </div>
          <div className="flex items-center gap-4">
            <Link href="/schools/compare" className="text-sm font-bold text-foreground hover:text-primary transition-colors">Compare</Link>
            <Link href="/schools/leaderboard" className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors">
              <Trophy className="w-4 h-4 text-yellow-500" />Leaderboard
            </Link>
            <Link href="/login" className="text-sm font-bold text-foreground hover:text-primary transition-colors">Login</Link>
            <Button className="rounded-full font-bold shadow-md shadow-primary/20">Claim School</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="School Campus"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground mb-6 tracking-tight">
              Find the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">school</span> for your child.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discover, compare, and connect with top-rated schools across India. Trusted by over 1M+ parents.
            </p>
            
            <div className="bg-card p-2 rounded-2xl shadow-xl shadow-black/5 flex flex-col md:flex-row gap-2 border border-border/50 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by school name or location..." 
                  className="w-full h-14 pl-12 rounded-xl border-none bg-transparent focus-visible:ring-0 text-lg"
                />
              </div>
              <Button size="lg" className="h-14 px-8 rounded-xl font-bold text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Search Schools
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">Top Rated Schools</h2>
            <p className="text-muted-foreground mt-2">Based on parent reviews and academic excellence.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/schools/leaderboard">
              <Button variant="outline" className="rounded-xl font-bold border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                <Trophy className="w-4 h-4 mr-2" />View Leaderboard
              </Button>
            </Link>
            <div className="flex border border-border rounded-xl overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "hover:bg-secondary text-muted-foreground"}`}>
                <LayoutGrid className="w-4 h-4" />Grid
              </button>
              <button onClick={() => setViewMode("map")} className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === "map" ? "bg-primary text-white" : "hover:bg-secondary text-muted-foreground"}`}>
                <Map className="w-4 h-4" />Map
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-80 bg-muted rounded-2xl"></div>)}
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <School className="w-20 h-20 mx-auto mb-6 opacity-10" />
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">No schools found</h3>
            <p className="text-lg">{search ? `No schools match "${search}"` : "Schools will appear here once they register on MySchool."}</p>
            <Link href="/schools/register"><Button className="mt-6 rounded-xl font-bold">Register Your School</Button></Link>
          </div>
        ) : viewMode === "map" ? (
          <SchoolMapView schools={schools} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school: any) => (
              <motion.div key={school.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Link href={`/schools/${school.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 group cursor-pointer rounded-2xl">
                    <div className="h-40 bg-secondary relative">
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-sm">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        {school.averageRating}
                      </div>
                      <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-xl shadow-md border border-border flex items-center justify-center p-2">
                        <School className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="p-6 pt-10">
                      <div className="flex gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md">{school.board}</span>
                        <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-md capitalize">{school.type}</span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{school.name}</h3>
                      
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <MapPin className="w-4 h-4" /> {school.city}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <Users className="w-4 h-4" /> {school.totalStudents} Students
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between text-sm font-bold text-primary">
                      View Profile
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
