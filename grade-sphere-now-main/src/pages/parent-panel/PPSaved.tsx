import { useOutletContext, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function PPSaved() {
  const { saved } = useOutletContext<any>();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Saved Schools</h1>
        <p className="text-sm text-muted-foreground mt-1">{saved.length} schools saved</p>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No saved schools. <Link to="/schools" className="text-primary hover:underline">Browse schools</Link></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {saved.map((s: any) => (
            <Card key={s.id} className="border-border/30 hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <img src={s.schools?.banner} alt="" className="h-20 w-20 rounded-xl object-cover shadow-md"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80"; }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate text-foreground">{s.schools?.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3 text-primary" />{s.schools?.location}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-xs font-semibold">{Number(s.schools?.rating).toFixed(1)}</span>
                    <Badge variant="outline" className="text-[10px] border-border/30 ml-1">{s.schools?.board}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Link to={`/school/${s.schools?.slug}`}>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-primary/30 text-primary hover:bg-primary/10"><ExternalLink className="h-3.5 w-3.5" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                    onClick={() => toast.info("Remove saved school (demo mode)")}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
