import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, BadgeCheck, Heart, GraduationCap, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSavedSchoolIds, useToggleSaveSchool } from "@/hooks/useSaveSchool";
import { useAuth } from "@/hooks/useAuth";
import type { School } from "@/data/mock";

export default function SchoolCard({ school, index }: { school: School; index: number }) {
  const { user } = useAuth();
  const { data: savedIds } = useSavedSchoolIds();
  const toggleSave = useToggleSaveSchool();
  const isSaved = savedIds?.has(school.id) || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group h-full"
    >
      <div className="marketplace-card h-full flex flex-col bg-card">
        {/* Image Section */}
        <Link to={`/school/${school.slug}`} className="block relative aspect-[16/10] overflow-hidden">
          <img
            src={school.banner}
            alt={school.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Board badge top-left */}
          <Badge className="absolute top-4 left-4 gradient-primary text-white border-0 shadow-md font-bold px-3 py-1">
            {school.board}
          </Badge>

          {/* Save heart */}
          {user && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave.mutate({ schoolId: school.id, saved: isSaved }); }}
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform shadow-md border border-border/50"
            >
              <Heart className={`h-5 w-5 transition-colors ${isSaved ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500"}`} />
            </button>
          )}

          {/* Rating pill bottom */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-1.5 bg-background/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-lg border border-border/50">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-extrabold text-foreground">{Number(school.rating).toFixed(1)}</span>
              <span className="text-xs font-semibold text-muted-foreground ml-1">({school.reviewCount})</span>
            </div>
            
            {school.is_verified && (
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30" title="Verified School">
                <BadgeCheck className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Link to={`/school/${school.slug}`} className="flex-1 min-w-0">
              <h3 className="font-extrabold text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">{school.name}</h3>
            </Link>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{school.location}</span>
          </div>

          <div className="flex items-center gap-4 mb-5 text-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Annual Fees</span>
              <span className="font-extrabold text-foreground">{school.fees}</span>
            </div>
            <div className="w-px h-8 bg-border/60" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Facilities</span>
              <span className="font-extrabold text-foreground">{(school.facilities?.length || 5)}+</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="mt-auto grid grid-cols-2 gap-3 pt-5 border-t border-border/60">
            <Link to={`/school/${school.slug}?tab=admission`} className="col-span-1">
              <Button className="w-full rounded-xl gradient-primary font-bold h-11 shadow-md gap-2 text-sm">
                Apply Now <GraduationCap className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/schools?compare=${school.slug}`} className="col-span-1">
              <Button variant="outline" className="w-full rounded-xl font-bold h-11 gap-2 text-sm border-border/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5">
                Compare <GitCompare className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}