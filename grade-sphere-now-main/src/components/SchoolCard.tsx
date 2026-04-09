import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Users, BadgeCheck, Crown, Heart, GraduationCap, Sparkles, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AskAIChat from "@/components/AskAIChat";
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
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group"
    >
      <div className="bg-card rounded-2xl border border-border/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
        {/* Image Section */}
        <Link to={`/school/${school.slug}`} className="block relative">
          <div className="relative overflow-hidden aspect-[16/10]">
            <img
              src={school.banner}
              alt={school.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }}
            />
            {/* Board badge top-left */}
            <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-md border-0 shadow-md text-xs font-semibold px-2.5 py-1">
              {school.board}
            </Badge>

            {/* Featured badge */}
            {(school as any).is_featured && (
              <Badge className="absolute top-3 right-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md gap-1 text-[10px] px-2 py-0.5">
                <Crown className="h-3 w-3" /> Featured
              </Badge>
            )}

            {/* Save heart */}
            {user && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave.mutate({ schoolId: school.id, saved: isSaved }); }}
                className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-card/70 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform border border-border/30"
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
              </button>
            )}

            {/* Rating pill bottom-left */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-md rounded-lg px-2.5 py-1.5 shadow-md border border-border/20">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-bold text-foreground">{school.rating}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Users className="h-3 w-3" />{school.reviewCount}</span>
            </div>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-4 space-y-2.5">
          {/* Name + Admission Button Row */}
          <div className="flex items-start justify-between gap-2">
            <Link to={`/school/${school.slug}`} className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-bold text-foreground text-[15px] leading-snug group-hover:text-primary transition-colors truncate">{school.name}</h3>
              {school.is_verified && <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />}
            </Link>
            <Link to={`/school/${school.slug}?tab=admission`}>
              <Button variant="outline" size="sm" className="rounded-lg text-[11px] h-7 px-2.5 border-primary/30 text-primary hover:bg-primary/10 shrink-0 font-medium">
                Admission Form
              </Button>
            </Link>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{school.location}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{school.description}</p>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <Link to={`/school/${school.slug}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full rounded-lg h-8 text-xs font-semibold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> School
              </Button>
            </Link>
            <div className="flex-1">
              <AskAIChat
                schoolName={school.name}
                schoolAbout={school.about || school.description}
                schoolFees={school.fees}
                schoolBoard={school.board}
                schoolFacilities={school.facilities || []}
                cardStyle
              />
            </div>
            <Link to="/tuition-enquiry" className="flex-1">
              <Button variant="outline" size="sm" className="w-full rounded-lg h-8 text-xs font-semibold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 gap-1.5">
                <BookOpen className="h-3.5 w-3.5" /> Tuition
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
