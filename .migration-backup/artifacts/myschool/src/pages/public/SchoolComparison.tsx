import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Search, Star, MapPin, Users, GraduationCap, CheckCircle2, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useSearchSchools(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`${BASE}/api/schools/public?q=${encodeURIComponent(query)}&limit=5`)
        .then(r => r.json()).then(d => setResults(d.schools || [])).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);
  return { results, loading };
}

function SchoolPicker({ label, selected, onSelect }: { label: string; selected: any; onSelect: (s: any) => void }) {
  const [query, setQuery] = useState("");
  const { results, loading } = useSearchSchools(query);
  return (
    <div className="flex-1">
      <p className="font-bold text-sm mb-2 text-muted-foreground">{label}</p>
      {selected ? (
        <Card className="p-4 rounded-xl flex items-center gap-3 border-primary/30 bg-primary/5">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{selected.name}</p>
            <p className="text-xs text-muted-foreground">{selected.city}, {selected.state}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onSelect(null)} className="rounded-lg h-7 w-7"><X className="w-4 h-4" /></Button>
        </Card>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search school name..." className="pl-9 rounded-xl" />
            {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
          {results.length > 0 && (
            <Card className="absolute top-full mt-1 w-full z-10 shadow-lg rounded-xl overflow-hidden">
              {results.map(s => (
                <button key={s.id} className="w-full p-3 hover:bg-muted/50 flex items-center gap-3 text-left transition-colors" onClick={() => { onSelect(s); setQuery(""); }}>
                  <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                  <div><p className="font-bold text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.city}, {s.state}</p></div>
                </button>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

const COMPARE_FIELDS = [
  { label: "Type", key: "type" },
  { label: "Board", key: "board" },
  { label: "City", key: "city" },
  { label: "State", key: "state" },
  { label: "Established", key: "established" },
  { label: "Students", key: "totalStudents" },
  { label: "Teachers", key: "totalTeachers" },
  { label: "Avg Rating", key: "avgRating" },
  { label: "Review Count", key: "reviewCount" },
  { label: "Fee (Annual)", key: "annualFee" },
  { label: "Affiliation", key: "affiliation" },
  { label: "Hostel", key: "hasHostel" },
  { label: "Transport", key: "hasTransport" },
  { label: "Sports", key: "hasSports" },
  { label: "Labs", key: "hasLabs" },
];

function formatValue(key: string, val: any) {
  if (val === undefined || val === null || val === "") return <span className="text-muted-foreground">—</span>;
  if (typeof val === "boolean") return val ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />;
  if (key === "avgRating") return <span className="flex items-center justify-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{Number(val).toFixed(1)}</span>;
  if (key === "annualFee") return `₹${Number(val).toLocaleString("en-IN")}`;
  return String(val);
}

export default function SchoolComparison() {
  const [schoolA, setSchoolA] = useState<any>(null);
  const [schoolB, setSchoolB] = useState<any>(null);
  const [detailA, setDetailA] = useState<any>(null);
  const [detailB, setDetailB] = useState<any>(null);

  useEffect(() => {
    if (schoolA?.slug) fetch(`${BASE}/api/schools/public/${schoolA.slug}`).then(r => r.json()).then(d => setDetailA(d.school || schoolA)); else setDetailA(null);
  }, [schoolA]);
  useEffect(() => {
    if (schoolB?.slug) fetch(`${BASE}/api/schools/public/${schoolB.slug}`).then(r => r.json()).then(d => setDetailB(d.school || schoolB)); else setDetailB(null);
  }, [schoolB]);

  const a = detailA || schoolA;
  const b = detailB || schoolB;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/schools">
            <Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black">Compare Schools</h1>
            <p className="text-sm text-muted-foreground">Select two schools to compare them side-by-side</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <SchoolPicker label="School A" selected={schoolA} onSelect={s => { setSchoolA(s); setDetailA(null); }} />
          <div className="flex items-center pt-6 text-muted-foreground font-black text-sm">VS</div>
          <SchoolPicker label="School B" selected={schoolB} onSelect={s => { setSchoolB(s); setDetailB(null); }} />
        </div>

        {(!schoolA || !schoolB) ? (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-lg font-bold text-muted-foreground">Select two schools to start comparing</p>
          </div>
        ) : (
          <Card className="rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-4 bg-muted/30 flex items-center"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Feature</p></div>
              <div className="p-4 bg-primary/5 text-center">
                <p className="font-black text-sm text-primary line-clamp-1">{a?.name || "School A"}</p>
                <p className="text-xs text-muted-foreground">{a?.city}</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 text-center">
                <p className="font-black text-sm text-orange-600 line-clamp-1">{b?.name || "School B"}</p>
                <p className="text-xs text-muted-foreground">{b?.city}</p>
              </div>
            </div>
            {COMPARE_FIELDS.map((field, i) => (
              <div key={field.key} className={`grid grid-cols-3 divide-x divide-border border-t border-border ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <div className="p-3 px-4 flex items-center"><p className="text-xs font-bold text-muted-foreground">{field.label}</p></div>
                <div className="p-3 text-center text-sm font-medium">{formatValue(field.key, a?.[field.key])}</div>
                <div className="p-3 text-center text-sm font-medium">{formatValue(field.key, b?.[field.key])}</div>
              </div>
            ))}
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
              <div className="p-3 px-4 flex items-center" />
              <div className="p-3 text-center">
                <Link href={`/schools/${a?.slug}`}><Button size="sm" className="rounded-xl text-xs w-full">View Profile</Button></Link>
              </div>
              <div className="p-3 text-center">
                <Link href={`/schools/${b?.slug}`}><Button size="sm" variant="outline" className="rounded-xl text-xs w-full border-orange-200 text-orange-600">View Profile</Button></Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
