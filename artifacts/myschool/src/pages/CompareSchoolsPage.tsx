import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Star, MapPin, BadgeCheck, GraduationCap, Check, Minus, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchools } from "@/hooks/useData";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function CompareSchoolsPage() {
  const { data: schools = [] } = useSchools();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const ids = searchParams.get("ids");
    return ids ? ids.split(",").filter(Boolean) : [];
  });

  useEffect(() => {
    if (selectedIds.length > 0) {
      setSearchParams({ ids: selectedIds.join(",") }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [selectedIds]);

  const shareLink = () => {
    const url = `${window.location.origin}/compare?ids=${selectedIds.join(",")}`;
    navigator.clipboard.writeText(url);
    toast.success("Comparison link copied!");
  };

  const selected = useMemo(
    () => selectedIds.map((id) => schools.find((s) => s.id === id)).filter(Boolean),
    [selectedIds, schools]
  );

  const addSchool = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeSchool = (id: string) => setSelectedIds(selectedIds.filter((i) => i !== id));

  const allFacilities = useMemo(() => {
    const set = new Set<string>();
    selected.forEach((s) => (s as any).facilities?.forEach((f: string) => set.add(f)));
    return [...set].sort();
  }, [selected]);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Compare <span className="text-gradient">Schools</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Select up to 3 schools to compare side by side
          </p>
          {selectedIds.length >= 2 && (
            <Button variant="outline" size="sm" className="mt-4 rounded-xl gap-2" onClick={shareLink}>
              <Share2 className="h-4 w-4" /> Share Comparison
            </Button>
          )}
        </motion.div>

        {/* School Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[0, 1, 2].map((slot) => {
            const school = selected[slot];
            return (
              <motion.div
                key={slot}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: slot * 0.1 }}
                className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4"
              >
                {school ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img src={(school as any).banner} alt={school.name} className="h-12 w-12 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-sm">{school.name}</h3>
                            {(school as any).is_verified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{school.location}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeSchool(school.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Select onValueChange={addSchool}>
                    <SelectTrigger className="border-dashed border-2 h-16 rounded-xl">
                      <SelectValue placeholder={<span className="flex items-center gap-2 text-muted-foreground"><Plus className="h-4 w-4" /> Select school {slot + 1}</span>} />
                    </SelectTrigger>
                    <SelectContent>
                      {schools
                        .filter((s) => !selectedIds.includes(s.id))
                        .map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        {selected.length >= 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
              <div className="p-4 bg-muted/30 border-b border-r border-border/30 font-bold text-sm">Criteria</div>
              {selected.map((s) => (
                <div key={s!.id} className="p-4 bg-muted/30 border-b border-border/30 text-center">
                  <Link to={`/school/${s!.slug}`} className="font-bold text-sm hover:text-primary transition-colors">{s!.name}</Link>
                </div>
              ))}
            </div>

            {/* Rows */}
            {[
              { label: "Board", render: (s: any) => <span className="font-semibold">{s.board}</span> },
              { label: "Rating", render: (s: any) => <span className="flex items-center justify-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" />{Number(s.rating).toFixed(1)}</span> },
              { label: "Reviews", render: (s: any) => <span>{s.review_count} reviews</span> },
              { label: "Fees", render: (s: any) => <span className="font-bold text-gradient">{s.fees}</span> },
              { label: "Location", render: (s: any) => <span className="flex items-center justify-center gap-1 text-sm"><MapPin className="h-3.5 w-3.5" />{s.location}</span> },
              { label: "Verified", render: (s: any) => s.is_verified ? <BadgeCheck className="h-5 w-5 text-blue-500 mx-auto" /> : <Minus className="h-5 w-5 text-muted-foreground mx-auto" /> },
              { label: "Featured", render: (s: any) => s.is_featured ? <Check className="h-5 w-5 text-emerald-500 mx-auto" /> : <Minus className="h-5 w-5 text-muted-foreground mx-auto" /> },
            ].map((row) => (
              <div key={row.label} className="grid" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                <div className="p-4 border-b border-r border-border/30 text-sm font-medium text-muted-foreground">{row.label}</div>
                {selected.map((s) => (
                  <div key={s!.id} className="p-4 border-b border-border/30 text-center text-sm">{row.render(s)}</div>
                ))}
              </div>
            ))}

            {/* Facilities comparison */}
            {allFacilities.length > 0 && (
              <>
                <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                  <div className="p-4 bg-muted/20 border-b border-r border-border/30 font-bold text-sm flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" /> Facilities
                  </div>
                  {selected.map((s) => (
                    <div key={s!.id} className="p-4 bg-muted/20 border-b border-border/30" />
                  ))}
                </div>
                {allFacilities.map((facility) => (
                  <div key={facility} className="grid" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                    <div className="p-3 border-b border-r border-border/30 text-xs text-muted-foreground pl-6">{facility}</div>
                    {selected.map((s) => (
                      <div key={s!.id} className="p-3 border-b border-border/30 text-center">
                        {(s as any).facilities?.includes(facility) ? (
                          <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : (
                          <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}
          </motion.div>
        )}

        {selected.length < 2 && (
          <div className="text-center py-16 text-muted-foreground">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Select at least 2 schools to start comparing</p>
          </div>
        )}
      </div>
    </div>
  );
}
