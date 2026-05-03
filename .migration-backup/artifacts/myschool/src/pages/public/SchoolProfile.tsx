import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetPublicSchool, useCreateReview } from "@workspace/api-client-react";
import { MapPin, Star, Phone, Mail, Globe, GraduationCap, CheckCircle2, ChevronRight, ArrowLeft, Calendar, Briefcase, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function SchoolProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useGetPublicSchool(slug || "");
  const { toast } = useToast();
  const createReviewMutation = useCreateReview();
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const school = data?.school;
  const reviews = data?.reviews || [];
  const events = data?.events || [];
  const jobs = data?.jobs || [];

  const handleSubmitReview = async () => {
    if (!reviewRating) { toast({ title: "Please select a rating", variant: "destructive" }); return; }
    if (!reviewComment.trim()) { toast({ title: "Please write a comment", variant: "destructive" }); return; }
    if (!school?.id) return;
    setSubmittingReview(true);
    try {
      await createReviewMutation.mutateAsync({
        data: {
          schoolId: school.id,
          overallRating: reviewRating,
          comment: reviewComment,
          reviewerName: reviewName || "Anonymous",
        } as any,
      });
      toast({ title: "Review submitted!", description: "Your review will appear after moderation." });
      setReviewDialogOpen(false);
      setReviewRating(0);
      setReviewComment("");
      setReviewName("");
    } catch {
      toast({ title: "Error submitting review", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Building2 className="w-16 h-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold text-foreground">School Not Found</h1>
        <p className="text-muted-foreground">This school profile doesn't exist or hasn't been published yet.</p>
        <Link href="/schools"><Button className="rounded-xl font-bold"><ArrowLeft className="w-4 h-4 mr-2" />Back to Schools</Button></Link>
      </div>
    );
  }

  const ratingDisplay = typeof school.averageRating === "number" ? school.averageRating.toFixed(1) : reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.overallRating, 0) / reviews.length).toFixed(1) : "—";

  const facilities: string[] = (() => {
    if (!school.facilities) return [];
    if (Array.isArray(school.facilities)) return school.facilities;
    try { return JSON.parse(school.facilities); } catch { return String(school.facilities).split(",").map((s: string) => s.trim()).filter(Boolean); }
  })();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Back button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/schools">
            <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Schools
            </button>
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm font-bold text-foreground truncate">{school.name}</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="h-64 md:h-80 w-full relative bg-gradient-to-br from-primary via-primary/80 to-accent">
        {school.coverUrl && (
          <img src={school.coverUrl} className="absolute inset-0 w-full h-full object-cover" alt={school.name} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 w-full">
          <div className="max-w-5xl mx-auto px-4 md:px-8 pb-8 flex flex-col md:flex-row gap-6 items-end">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-2 shadow-xl shrink-0 -mb-4 border border-border">
              {school.logoUrl ? (
                <img src={school.logoUrl} alt={school.name} className="w-full h-full rounded-xl object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center text-4xl font-display font-bold text-primary">
                  {school.name?.[0]}
                </div>
              )}
            </div>
            <div className="text-white flex-1 mb-2">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {school.board && <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">{school.board}</Badge>}
                {school.type && <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm capitalize">{school.type}</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{school.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{school.city}, {school.state}</span>
                <span className="flex items-center gap-1.5 text-yellow-400 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                  <Star className="w-4 h-4 fill-current" /> {ratingDisplay} ({reviews.length} Reviews)
                </span>
                {school.totalStudents && (
                  <span className="flex items-center gap-1.5 text-white/80">
                    {Number(school.totalStudents).toLocaleString()}+ Students
                  </span>
                )}
              </div>
            </div>
            <div className="w-full md:w-auto mb-2 flex gap-3">
              <Link href={`/schools/${slug}/admission`}>
                <Button className="flex-1 md:flex-none rounded-xl font-bold bg-white text-foreground hover:bg-white/90 shadow-lg">Apply for Admission</Button>
              </Link>
              <Link href={`/schools/${slug}/blog`}>
                <Button variant="secondary" className="rounded-xl font-bold bg-white/20 text-white hover:bg-white/30 border-0">Blog</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {school.about && (
              <section>
                <h2 className="text-2xl font-bold font-display text-foreground mb-4">About School</h2>
                <Card className="p-6 rounded-2xl border-border shadow-sm">
                  <p className="text-muted-foreground font-medium leading-relaxed">{school.about}</p>
                </Card>
              </section>
            )}

            {facilities.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold font-display text-foreground mb-4">Facilities & Infrastructure</h2>
                <div className="flex flex-wrap gap-3">
                  {facilities.map((fac: string, i: number) => (
                    <div key={i} className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> {fac}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {events.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold font-display text-foreground mb-4">Upcoming Events</h2>
                <div className="space-y-3">
                  {events.map((event: any) => (
                    <Card key={event.id} className="p-4 rounded-xl border-border/50 shadow-sm flex items-center gap-4">
                      <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{event.date || (event.startDate ? new Date(event.startDate).toLocaleDateString("en-IN") : "")}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-display text-foreground">Parent Reviews</h2>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-xl font-bold border-border" onClick={() => setReviewDialogOpen(true)}>Write a Review</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-display font-bold text-2xl">Write a Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <p className="text-sm font-bold text-muted-foreground mb-1">Your Name</p>
                        <input
                          type="text"
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          className="w-full rounded-xl border border-border px-3 h-10 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-muted-foreground mb-2">Your Rating</p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-8 h-8 cursor-pointer transition-colors ${star <= (hoveredStar || reviewRating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              onClick={() => setReviewRating(star)}
                            />
                          ))}
                          {reviewRating > 0 && <span className="text-sm font-bold text-muted-foreground self-center ml-1">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][reviewRating]}</span>}
                        </div>
                      </div>
                      <Textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Share your experience — teaching quality, infrastructure, activities..."
                        className="min-h-[120px] rounded-xl"
                      />
                      <Button
                        className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                        disabled={submittingReview}
                        onClick={handleSubmitReview}>
                        {submittingReview ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        Submit Review
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-white rounded-2xl border border-border">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-bold">No reviews yet</p>
                  <p className="text-sm mt-1">Be the first to review this school</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev: any) => (
                    <Card key={rev.id} className="p-6 rounded-2xl border-border shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                          {(rev.reviewerName || rev.userName || "U")[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{rev.reviewerName || rev.userName || "Anonymous"}</h4>
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center text-yellow-500">
                              {Array.from({ length: Math.round(rev.overallRating || rev.rating || 0) }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </span>
                            {rev.createdAt && <span>• {new Date(rev.createdAt).toLocaleDateString("en-IN")}</span>}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground font-medium">{rev.comment || rev.text}</p>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 rounded-2xl border-border shadow-sm">
              <h3 className="font-bold font-display text-lg mb-4">Contact Info</h3>
              <div className="space-y-3">
                {school.phone && (
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-foreground" /></div>
                    {school.phone}
                  </div>
                )}
                {school.email && (
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-foreground" /></div>
                    {school.email}
                  </div>
                )}
                {school.website && (
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Globe className="w-4 h-4 text-foreground" /></div>
                    {school.website}
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-foreground" /></div>
                  {school.address || `${school.city}, ${school.state}`}
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border-border shadow-sm">
              <h3 className="font-bold font-display text-lg mb-4">School Info</h3>
              <div className="space-y-3">
                {[
                  { label: "Board", value: school.board },
                  { label: "Type", value: school.type },
                  { label: "City", value: school.city },
                  { label: "State", value: school.state },
                  { label: "Rating", value: reviews.length > 0 ? `${ratingDisplay}/5 ⭐` : "Not rated yet" },
                ].filter(({ value }) => value).map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-muted-foreground font-medium">{label}</span>
                    <span className="font-bold text-foreground capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {jobs.length > 0 && (
              <Card className="p-6 rounded-2xl border-border shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h3 className="font-bold font-display text-lg">We are Hiring!</h3>
                </div>
                <div className="space-y-2 mb-4">
                  {jobs.slice(0, 2).map((job: any) => (
                    <div key={job.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-medium">{job.title}</span>
                    </div>
                  ))}
                  {jobs.length > 2 && (
                    <p className="text-sm text-muted-foreground font-medium">+{jobs.length - 2} more positions</p>
                  )}
                </div>
                <Link href="/career">
                  <Button variant="outline" className="w-full rounded-xl font-bold bg-white">
                    View All Openings <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </Card>
            )}

            {school.gallery && school.gallery.length > 0 && (
              <Card className="p-6 rounded-2xl border-border shadow-sm">
                <h3 className="font-bold font-display text-lg mb-4">Gallery</h3>
                <div className="grid grid-cols-2 gap-2">
                  {school.gallery.slice(0, 4).map((img: any, i: number) => (
                    <img key={i} src={img.imageUrl || img} alt={img.caption || "Gallery"} className="w-full h-24 object-cover rounded-xl" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ))}
                </div>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
