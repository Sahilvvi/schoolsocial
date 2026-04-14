import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell, Users, School, Heart, MessageSquare, Send, Search, Star,
  MapPin, ChevronRight, CheckCircle, Megaphone, Calendar, Newspaper,
  UserPlus, Globe, Shield, Sparkles, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchools } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

/* Sample announcements data */
const sampleAnnouncements = [
  { id: "1", schoolName: "Delhi Public School", schoolSlug: "delhi-public-school", type: "announcement", title: "Annual Day Celebration 2025", content: "We are excited to announce our Annual Day celebrations on March 15th. Parents are cordially invited to attend the cultural programs and prize distribution ceremony.", time: "2 hours ago", icon: Megaphone },
  { id: "2", schoolName: "Modern School", schoolSlug: "modern-school", type: "event", title: "Science Exhibition - Open for All", content: "Modern School is hosting an Inter-School Science Exhibition. Register your students by Feb 28th. Exciting prizes for top 3 projects!", time: "5 hours ago", icon: Calendar },
  { id: "3", schoolName: "Springdales School", schoolSlug: "springdales-school", type: "news", title: "New Smart Classrooms Inaugurated", content: "We are proud to share that our new state-of-the-art smart classrooms have been inaugurated. All classes from Grade 6 onwards will now have interactive digital boards.", time: "1 day ago", icon: Newspaper },
  { id: "4", schoolName: "Delhi Public School", schoolSlug: "delhi-public-school", type: "announcement", title: "Winter Vacation Notice", content: "School will remain closed from December 25th to January 5th for winter vacation. Online homework will be shared via the parent app.", time: "2 days ago", icon: Bell },
  { id: "5", schoolName: "Ryan International", schoolSlug: "ryan-international", type: "event", title: "Parent-Teacher Meeting Schedule", content: "PTM for classes 1-5 will be held on Saturday, 10 AM to 1 PM. Please carry the student diary. Appointment slots can be booked online.", time: "3 days ago", icon: Users },
  { id: "6", schoolName: "Modern School", schoolSlug: "modern-school", type: "news", title: "Board Exam Results - 100% Pass Rate!", content: "We are thrilled to announce that Modern School achieved 100% pass rate in the Class 12 board examinations this year with 45 students scoring above 95%.", time: "5 days ago", icon: Star },
];

const typeColors: Record<string, string> = {
  announcement: "gradient-primary text-primary-foreground",
  event: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
  news: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
};

export default function SchoolCommunityPage() {
  const { user } = useAuth();
  const { data: schools = [] } = useSchools();
  const [followedSchools, setFollowedSchools] = useState<Set<string>>(new Set(["delhi-public-school", "modern-school"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [feedFilter, setFeedFilter] = useState("all");

  const toggleFollow = (slug: string, name: string) => {
    setFollowedSchools((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
        toast.success(`Unfollowed ${name}`);
      } else {
        next.add(slug);
        toast.success(`Now following ${name}! You'll get their updates.`);
      }
      return next;
    });
  };

  const filteredSchools = schools.filter((s: any) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAnnouncements = sampleAnnouncements.filter((a) => {
    const schoolMatch = followedSchools.has(a.schoolSlug);
    const typeMatch = feedFilter === "all" || a.type === feedFilter;
    return schoolMatch && typeMatch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-blob" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Globe className="h-3.5 w-3.5" /> School Community
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold mb-5">
            School <span className="text-gradient">Community</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow schools, stay updated with announcements, events, and news. Your personalized school feed in one place.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-4 mb-12">
        <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-border/30 bg-card/40 backdrop-blur-sm max-w-2xl mx-auto">
          {[
            { icon: School, value: String(followedSchools.size), label: "Following" },
            { icon: Bell, value: String(filteredAnnouncements.length), label: "Updates" },
            { icon: Users, value: "2.5K+", label: "Community" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              className={`py-5 px-4 text-center ${i < 2 ? "border-r border-border/20" : ""}`}>
              <s.icon className="h-5 w-5 mx-auto mb-2 text-primary opacity-60" />
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="feed" className="space-y-8">
          <TabsList className="flex gap-1 h-auto bg-transparent p-0 justify-center">
            <TabsTrigger value="feed" className="rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-semibold text-sm px-5 py-3">
              <Bell className="h-4 w-4" /> Feed
            </TabsTrigger>
            <TabsTrigger value="discover" className="rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-semibold text-sm px-5 py-3">
              <Search className="h-4 w-4" /> Discover Schools
            </TabsTrigger>
            <TabsTrigger value="following" className="rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-semibold text-sm px-5 py-3">
              <Heart className="h-4 w-4" /> Following
            </TabsTrigger>
          </TabsList>

          {/* FEED TAB */}
          <TabsContent value="feed" className="space-y-6">
            {/* Filter bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { value: "all", label: "All Updates" },
                { value: "announcement", label: "Announcements" },
                { value: "event", label: "Events" },
                { value: "news", label: "News" },
              ].map((f) => (
                <Button key={f.value} variant={feedFilter === f.value ? "default" : "outline"} size="sm"
                  onClick={() => setFeedFilter(f.value)}
                  className={`rounded-xl shrink-0 ${feedFilter === f.value ? "gradient-primary border-0 shadow-lg shadow-primary/20" : "border-border/40"}`}>
                  {f.label}
                </Button>
              ))}
            </div>

            {!user ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="py-12 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Sign in to follow schools and see your personalized feed</p>
                  <Link to="/auth"><Button className="mt-2 rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20">Sign In</Button></Link>
                </CardContent>
              </Card>
            ) : followedSchools.size === 0 ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="py-12 text-center">
                  <School className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">You're not following any schools yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Go to the "Discover Schools" tab to find and follow schools</p>
                </CardContent>
              </Card>
            ) : filteredAnnouncements.length === 0 ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground">No updates for this filter. Try "All Updates".</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                      <CardContent className="pt-5">
                        <div className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-md shrink-0 ${typeColors[item.type] || "gradient-primary"}`}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Link to={`/school/${item.schoolSlug}`} className="text-sm font-bold text-primary hover:underline">{item.schoolName}</Link>
                              <Badge variant="outline" className="rounded-lg border-border/40 text-[10px] capitalize">{item.type}</Badge>
                              <span className="text-[11px] text-muted-foreground ml-auto shrink-0">{item.time}</span>
                            </div>
                            <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/20">
                              <Button variant="ghost" size="sm" className="rounded-lg text-xs text-muted-foreground hover:text-primary gap-1 h-8">
                                <Heart className="h-3.5 w-3.5" /> Like
                              </Button>
                              <Button variant="ghost" size="sm" className="rounded-lg text-xs text-muted-foreground hover:text-primary gap-1 h-8">
                                <MessageSquare className="h-3.5 w-3.5" /> Comment
                              </Button>
                              <Button variant="ghost" size="sm" className="rounded-lg text-xs text-muted-foreground hover:text-primary gap-1 h-8">
                                <Send className="h-3.5 w-3.5" /> Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* DISCOVER TAB */}
          <TabsContent value="discover" className="space-y-6">
            <div className="max-w-xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
                <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search schools to follow..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-14 bg-transparent border-0 shadow-none focus-visible:ring-0" />
                {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4"><X className="h-4 w-4 text-muted-foreground" /></button>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchools.slice(0, 12).map((school: any, i: number) => {
                const isFollowing = followedSchools.has(school.slug);
                return (
                  <motion.div key={school.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                      <CardContent className="pt-5 flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-border/30">
                          <img src={school.banner} alt={school.name} className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80"; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/school/${school.slug}`} className="font-bold text-foreground hover:text-primary transition-colors text-sm">{school.name}</Link>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 text-primary" />{school.location}
                            <Star className="h-3 w-3 fill-primary text-primary ml-2" />{Number(school.rating).toFixed(1)}
                          </div>
                        </div>
                        <Button size="sm" variant={isFollowing ? "outline" : "default"}
                          onClick={() => toggleFollow(school.slug, school.name)}
                          className={`rounded-xl shrink-0 h-9 ${isFollowing ? "border-primary/30 text-primary hover:bg-primary/10" : "gradient-primary border-0 shadow-lg shadow-primary/20"}`}>
                          {isFollowing ? (
                            <><CheckCircle className="h-3.5 w-3.5 mr-1" /> Following</>
                          ) : (
                            <><UserPlus className="h-3.5 w-3.5 mr-1" /> Follow</>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* FOLLOWING TAB */}
          <TabsContent value="following" className="space-y-6">
            {followedSchools.size === 0 ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground">You're not following any schools yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schools.filter((s: any) => followedSchools.has(s.slug)).map((school: any, i: number) => (
                  <motion.div key={school.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-colors">
                      <CardContent className="pt-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-border/30">
                            <img src={school.banner} alt={school.name} className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80"; }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/school/${school.slug}`} className="font-bold text-foreground hover:text-primary transition-colors text-sm">{school.name}</Link>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 text-primary" />{school.location}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => toggleFollow(school.slug, school.name)}
                            className="rounded-xl shrink-0 h-9 border-destructive/30 text-destructive hover:bg-destructive/10">
                            Unfollow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
