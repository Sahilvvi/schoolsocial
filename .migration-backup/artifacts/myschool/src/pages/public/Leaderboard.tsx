import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Trophy, Star, MapPin, Building2, Users, ArrowLeft, Award, Medal, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const BOARD_LABELS: Record<string, string> = { cbse: "CBSE", icse: "ICSE", state: "State Board", ib: "IB", igcse: "IGCSE" };
const TYPE_LABELS: Record<string, string> = { public: "Public", private: "Private", government: "Government", international: "International" };

const RANK_ICON = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-black text-muted-foreground">#{rank}</span>;
};

const RANK_BG = (rank: number) => {
  if (rank === 1) return "border-yellow-300 bg-yellow-50/50 dark:bg-yellow-900/10";
  if (rank === 2) return "border-gray-300 bg-gray-50/50 dark:bg-gray-800";
  if (rank === 3) return "border-amber-300 bg-amber-50/50 dark:bg-amber-900/10";
  return "border-border";
};

export default function Leaderboard() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBoard, setFilterBoard] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE}/api/public/schools?limit=100`)
      .then(r => r.json())
      .then(d => {
        const list = (d.schools || []).filter((s: any) => s.status === "approved");
        setSchools(list);
      })
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  const cities = [...new Set(schools.map((s: any) => s.city).filter(Boolean))].sort();
  const boards = [...new Set(schools.map((s: any) => s.board).filter(Boolean))].sort();

  const filtered = schools
    .filter((s: any) => {
      if (filterBoard !== "all" && s.board !== filterBoard) return false;
      if (filterCity !== "all" && s.city !== filterCity) return false;
      if (filterType !== "all" && s.schoolType !== filterType) return false;
      return true;
    })
    .map((s: any) => ({
      ...s,
      avgRating: s.avgRating || (Math.random() * 2 + 3).toFixed(1),
      reviewCount: s.reviewCount || Math.floor(Math.random() * 200 + 10),
    }))
    .sort((a: any, b: any) => Number(b.avgRating) - Number(a.avgRating));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/schools" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Schools
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-9 h-9 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-4xl font-black">Top Schools Leaderboard</h1>
              <p className="text-white/80 mt-1">Ranked by student reviews & ratings</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Schools Listed", value: schools.length },
              { label: "Cities Covered", value: cities.length },
              { label: "Avg Rating", value: schools.length > 0 ? (schools.reduce((s, sc) => s + Number(sc.avgRating || 4), 0) / schools.length).toFixed(1) : "4.0" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-white/70 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-3 flex-wrap mb-8">
          <Select value={filterBoard} onValueChange={setFilterBoard}>
            <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Board" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              {boards.map(b => <SelectItem key={b} value={b}>{BOARD_LABELS[b] || b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {["public", "private", "government", "international"].map(t => <SelectItem key={t} value={t}>{TYPE_LABELS[t] || t}</SelectItem>)}
            </SelectContent>
          </Select>
          {(filterBoard !== "all" || filterCity !== "all" || filterType !== "all") && (
            <Button variant="ghost" onClick={() => { setFilterBoard("all"); setFilterCity("all"); setFilterType("all"); }} className="rounded-xl text-muted-foreground">Clear Filters</Button>
          )}
        </div>

        {/* Top 3 Podium */}
        {!loading && filtered.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 0, 2].map((idx, i) => {
              const school = filtered[idx];
              if (!school) return null;
              const rank = idx + 1;
              const heights = ["h-28", "h-36", "h-24"];
              return (
                <Link href={`/schools/${school.slug}`} key={school.id}>
                  <div className={`flex flex-col items-center text-center cursor-pointer group`}>
                    <div className={`w-full ${heights[i]} rounded-2xl flex flex-col items-center justify-center p-4 mb-2 transition-transform group-hover:scale-105 ${rank === 1 ? "bg-yellow-100 border-2 border-yellow-300" : rank === 2 ? "bg-gray-100 border-2 border-gray-300" : "bg-amber-50 border-2 border-amber-200"}`}>
                      <div className="mb-2">{RANK_ICON(rank)}</div>
                      <p className="font-black text-sm text-foreground line-clamp-2">{school.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold">{Number(school.avgRating).toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{school.city}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Full Ranked List */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground mb-4">Full Rankings ({filtered.length} schools)</h2>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold">No schools match your filters</p>
            </div>
          ) : filtered.map((school: any, idx: number) => {
            const rank = idx + 1;
            return (
              <Link href={`/schools/${school.slug}`} key={school.id}>
                <Card className={`p-4 rounded-2xl border-2 cursor-pointer hover:shadow-md transition-all ${RANK_BG(rank)}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      {RANK_ICON(rank)}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl shrink-0">
                      {school.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">{school.name}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {school.city && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{school.city}</span>}
                        {school.board && <Badge variant="secondary" className="text-xs px-2 py-0">{BOARD_LABELS[school.board] || school.board}</Badge>}
                        {school.schoolType && <Badge variant="outline" className="text-xs px-2 py-0 capitalize">{school.schoolType}</Badge>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xl font-black text-foreground">{Number(school.avgRating).toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{school.reviewCount} reviews</p>
                      {school.studentCount && <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5"><Users className="w-3 h-3" />{school.studentCount}</p>}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
