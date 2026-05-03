import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";

export default function TuPTutors() {
  const { tutors } = useOutletContext<any>();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Our Tutors</h1>
          <p className="text-sm text-muted-foreground mt-1">{tutors.length} tutors on your team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tutors.map((tutor: any) => (
          <Card key={tutor.id} className="border-border/30 hover:border-primary/20 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden border border-border/30 shrink-0">
                  <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"; }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-lg">{tutor.name}</h4>
                  <p className="text-sm text-muted-foreground">{tutor.subject}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-primary text-primary" /> {Number(tutor.rating).toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {tutor.experience}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {tutor.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">In-Person & Online</Badge>
                    <span className="text-xs font-semibold text-gradient">{tutor.hourly_rate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
