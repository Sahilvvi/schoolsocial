import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Calendar, User, Clock, Share2, Heart, Loader2,
  Bookmark, Tag, ChevronRight, Newspaper, ArrowUpRight, Quote
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNews } from "@/hooks/useData";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: news = [], isLoading } = useNews();
  const [liked, setLiked] = useState(false);

  const article = news.find((n) => n.id === id);
  const relatedArticles = news.filter((n) => n.id !== id && n.category === article?.category).slice(0, 3);
  const otherArticles = relatedArticles.length > 0 ? relatedArticles : news.filter((n) => n.id !== id).slice(0, 3);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground text-lg">Article not found.</p></div>;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: "easeOut" }}
          src={article.image} alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

        <div className="absolute top-24 left-4 md:left-8 z-10">
          <Link to="/news">
            <Button variant="outline" size="sm" className="rounded-xl bg-card/60 backdrop-blur-sm border-border/30 hover:bg-card/80">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...fadeUp}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="gradient-primary text-primary-foreground border-0 shadow-lg text-xs font-semibold">{article.category}</Badge>
                <Badge variant="outline" className="border-border/40 bg-card/40 backdrop-blur-sm text-foreground">
                  <Clock className="h-3 w-3 mr-1.5" />5 min read
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />{article.author}</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-secondary" />{article.published_date}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky top-16 z-30 bg-card/80 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className={`rounded-xl ${liked ? "text-red-400" : "text-muted-foreground"}`} onClick={() => setLiked(!liked)}>
              <Heart className={`h-4 w-4 mr-1.5 ${liked ? "fill-red-400" : ""}`} />{liked ? "Liked" : "Like"}
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
              <Share2 className="h-4 w-4 mr-1.5" />Share
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground">
              <Bookmark className="h-4 w-4 mr-1.5" />Save
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tag className="h-3.5 w-3.5 text-primary" />{article.category}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Article Content */}
          <motion.div {...fadeUp} className="lg:col-span-2 space-y-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground leading-relaxed font-medium">{article.excerpt}</p>

              <div className="my-8 p-6 rounded-2xl bg-card/60 backdrop-blur-sm border-l-4 border-primary">
                <Quote className="h-6 w-6 text-primary mb-3" />
                <p className="text-foreground italic text-lg leading-relaxed">
                  "Education is the most powerful weapon which you can use to change the world."
                </p>
                <p className="text-sm text-muted-foreground mt-3">— Nelson Mandela</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                The landscape of education in India is undergoing a significant transformation. With the implementation of
                new policies and the integration of technology in classrooms, schools across the country are adapting to
                meet the needs of 21st-century learners.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                From innovative teaching methodologies to state-of-the-art facilities, educational institutions are
                investing heavily in creating environments that foster creativity, critical thinking, and holistic development.
                The emphasis on experiential learning and skill-based education is reshaping how students prepare for their futures.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Key Takeaways</h2>
              <div className="space-y-3">
                {[
                  "Technology integration in classrooms is accelerating across all school boards",
                  "Focus on experiential and project-based learning is increasing",
                  "Mental health and well-being programs are becoming standard",
                  "Parent-teacher collaboration tools are being widely adopted",
                  "Skill-based assessments are supplementing traditional examinations",
                ].map((point, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card/60 border border-border/30">
                    <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{point}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mt-8">
                As we move forward, the role of schools extends beyond academic excellence. They are becoming community
                hubs that nurture the next generation of leaders, innovators, and responsible citizens. The future of
                Indian education looks promising, with increased investment in infrastructure, teacher training, and
                curriculum development.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border/30">
              <span className="text-sm text-muted-foreground mr-2">Tags:</span>
              {["Education", "Schools", "India", article.category, "Learning", "Innovation"].map((tag, i) => (
                <Badge key={i} variant="outline" className="rounded-lg border-border/40 bg-card/40 text-xs">{tag}</Badge>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <Card className="rounded-2xl bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">About the Author</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{article.author}</p>
                      <p className="text-xs text-muted-foreground">Education Correspondent</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A seasoned journalist covering education policy, school developments, and edtech trends across India.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <Card className="rounded-2xl bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Article Info</h3>
                  {[
                    { icon: Calendar, label: "Published", value: article.published_date },
                    { icon: Clock, label: "Read Time", value: "5 minutes" },
                    { icon: Tag, label: "Category", value: article.category },
                    { icon: Newspaper, label: "Type", value: "Feature Article" },
                  ].map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <d.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{d.label}</p>
                        <p className="text-sm font-semibold text-foreground">{d.value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Related Articles */}
        {otherArticles.length > 0 && (
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" /> Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherArticles.map((item, i) => (
                <Link key={item.id} to={`/news/${item.id}`}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }} className="group h-full">
                    <Card className="bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all h-full overflow-hidden">
                      <div className="relative overflow-hidden aspect-video">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                        <Badge className="absolute top-3 left-3 gradient-primary text-primary-foreground border-0 text-xs">{item.category}</Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">{item.title}</h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.author}</span>
                          <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
