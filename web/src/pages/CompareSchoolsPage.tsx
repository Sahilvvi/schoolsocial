import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Star, MapPin, BadgeCheck, GraduationCap, Check, Minus, Share2, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-24 right-[20%] w-72 h-72 bg-primary/6 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-10 left-[25%] w-60 h-60 bg-secondary/5 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <GitCompareArrows className="h-3.5 w-3.5" /> School Comparison
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold mb-5">
            Compare <span className="text-gradient">Schools</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Select up to 3 schools to compare side by side and make the best choice
          </motion.p>
          {selectedIds.length >= 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Button variant="outline" size="sm" className="rounded-xl gap-2 border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5" onClick={shareLink}>
                <Share2 className="h-4 w-4" /> Share Comparison
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
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
                className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/20 transition-all duration-300"
              >
                {school ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-primary/5 border border-border/30 flex-shrink-0">
                          <img
                            src={(school as any).banner}
                            alt={school.name}
                            className="h-full w-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm text-foreground">{school.name}</h3>
                            {(school as any).is_verified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{school.location}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge className="gradient-primary text-primary-foreground border-0 text-[10px] px-2 py-0">{school.board}</Badge>
                            <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground"><Star className="h-3 w-3 fill-primary text-primary" />{Number(school.rating).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 hover:bg-destructive/10 hover:text-destructive rounded-lg" onClick={() => removeSchool(school.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Select onValueChange={addSchool}>
                    <SelectTrigger className="border-dashed border-2 border-border/40 h-16 rounded-xl bg-transparent hover:border-primary/40 hover:bg-primary/5 transition-all">
                      <SelectValue placeholder={
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">Add School {slot + 1}</span>
                        </span>
                      } />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/40">
                      {schools
                        .filter((s) => !selectedIds.includes(s.id))
                        .map((s) => (
                          <SelectItem key={s.id} value={s.id} className="rounded-lg">{s.name}</SelectItem>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xl shadow-primary/5">
            {/* Header */}
            <div className="grid" style={{ gridTemplateColumns: `180px repeat(${selected.length}, 1fr)` }}>
              <div className="p-4 bg-muted/30 border-b border-r border-border/30 font-bold text-sm text-muted-foreground">Criteria</div>
              {selected.map((s) => (
                <div key={s!.id} className="p-4 bg-muted/30 border-b border-border/30 text-center">
                  <Link to={`/school/${s!.slug}`} className="font-bold text-sm hover:text-primary transition-colors">{s!.name}</Link>
                </div>
              ))}
            </div>

            {/* Rows */}
            {[
              { label: "Board", render: (s: any) => <Badge className="gradient-primary text-primary-foreground border-0 text-xs">{s.board}</Badge> },
              { label: "Rating", render: (s: any) => <span className="flex items-center justify-center gap-1 font-semibold"><Star className="h-4 w-4 fill-primary text-primary" />{Number(s.rating).toFixed(1)}</span> },
              { label: "Reviews", render: (s: any) => <span className="text-muted-foreground">{s.review_count} reviews</span> },
              { label: "Fees", render: (s: any) => <span className="font-bold text-gradient">{s.fees}</span> },
              { label: "Location", render: (s: any) => <span className="flex items-center justify-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary" />{s.location}</span> },
              { label: "Verified", render: (s: any) => s.is_verified ? <BadgeCheck className="h-5 w-5 text-blue-500 mx-auto" /> : <Minus className="h-5 w-5 text-muted-foreground/40 mx-auto" /> },
              { label: "Featured", render: (s: any) => s.is_featured ? <Check className="h-5 w-5 text-emerald-500 mx-auto" /> : <Minus className="h-5 w-5 text-muted-foreground/40 mx-auto" /> },
            ].map((row, idx) => (
              <div key={row.label} className={`grid ${idx % 2 === 0 ? "" : "bg-muted/10"}`} style={{ gridTemplateColumns: `180px repeat(${selected.length}, 1fr)` }}>
                <div className="p-4 border-b border-r border-border/30 text-sm font-semibold text-foreground">{row.label}</div>
                {selected.map((s) => (
                  <div key={s!.id} className="p-4 border-b border-border/30 text-center text-sm">{row.render(s)}</div>
                ))}
              </div>
            ))}

            {/* Facilities comparison */}
            {allFacilities.length > 0 && (
              <>
                <div className="grid" style={{ gridTemplateColumns: `180px repeat(${selected.length}, 1fr)` }}>
                  <div className="p-4 bg-primary/5 border-b border-r border-border/30 font-bold text-sm flex items-center gap-2 text-primary">
                    <GraduationCap className="h-4 w-4" /> Facilities
                  </div>
                  {selected.map((s) => (
                    <div key={s!.id} className="p-4 bg-primary/5 border-b border-border/30" />
                  ))}
                </div>
                {allFacilities.map((facility, idx) => (
                  <div key={facility} className={`grid ${idx % 2 === 0 ? "" : "bg-muted/10"}`} style={{ gridTemplateColumns: `180px repeat(${selected.length}, 1fr)` }}>
                    <div className="p-3 border-b border-r border-border/30 text-xs text-muted-foreground pl-6">{facility}</div>
                    {selected.map((s) => (
                      <div key={s!.id} className="p-3 border-b border-border/30 text-center">
                        {(s as any).facilities?.includes(facility) ? (
                          <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : (
                          <Minus className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}

            {/* CTA Row */}
            <div className="grid" style={{ gridTemplateColumns: `180px repeat(${selected.length}, 1fr)` }}>
              <div className="p-4 border-t border-r border-border/30" />
              {selected.map((s) => (
                <div key={s!.id} className="p-4 border-t border-border/30 text-center">
                  <Link to={`/school/${s!.slug}`}>
                    <Button size="sm" className="gradient-primary text-primary-foreground border-0 rounded-xl shadow-lg shadow-primary/20 font-semibold">
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selected.length < 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center py-20">
            <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground mb-2">Start Comparing Schools</p>
            <p className="text-muted-foreground">Select at least 2 schools above to see a detailed side-by-side comparison</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
