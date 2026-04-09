import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Search, X, ChevronLeft, ChevronRight, Loader2, Newspaper, ArrowUpRight, TrendingUp, Bookmark } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNews } from "@/hooks/useData";

const PER_PAGE = 6;

export default function NewsPage() {
  const { data: news = [], isLoading } = useNews();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const categories = [...new Set(news.map((n) => n.category))];

  const filtered = useMemo(() => news.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || n.category === category;
    return matchSearch && matchCat;
  }), [news, search, category]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const featured = paginated[0];
  const rest = paginated.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(217_91%_60%/0.1)_0%,_transparent_60%)]" />
        <div className="absolute top-20 left-[30%] w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Newspaper className="h-3.5 w-3.5" /> Latest Updates
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold mb-5">
            Education <span className="text-gradient">News</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Stay informed with the latest trends, policies, and stories in education
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl overflow-hidden">
              <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search articles..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-14 h-14 bg-transparent border-0 shadow-none focus-visible:ring-0" />
            </div>
            {search && <button onClick={() => setSearch("")} className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"><X className="h-3 w-3" />Clear</button>}
          </motion.div>

          {/* Category pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button onClick={() => { setCategory("all"); setPage(1); }} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${category === "all" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-card/60 border border-border/30 text-muted-foreground hover:text-foreground"}`}>All</button>
            {categories.map((c) => (
              <button key={c} onClick={() => { setCategory(c); setPage(1); }} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${category === c ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-card/60 border border-border/30 text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {isLoading ? <div className="flex flex-col items-center py-20 gap-3"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div> : (
          <>
            {/* Featured Article */}
            {featured && page === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <Link to={`/news/${featured.id}`} className="block">
                <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/30 group cursor-pointer hover:border-primary/20 transition-all duration-300">
                  <div className="relative overflow-hidden aspect-video md:aspect-auto">
                    <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
                    <Badge className="absolute top-4 left-4 gradient-primary text-primary-foreground border-0 shadow-lg text-xs font-semibold">{featured.category}</Badge>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">Featured</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{featured.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-primary" />{featured.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-secondary" />{featured.published_date}</span>
                    </div>
                  </div>
                </div>
                </Link>
              </motion.div>
            )}

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(page === 1 ? rest : paginated).map((item, i) => (
                <Link key={item.id} to={`/news/${item.id}`}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -6, transition: { duration: 0.3 } }} className="group">
                  <div className="h-full rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col">
                    <div className="relative overflow-hidden aspect-video">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                      <Badge className="absolute top-3 left-3 gradient-primary text-primary-foreground border-0 shadow-lg text-xs font-semibold">{item.category}</Badge>
                      <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border/30">
                        <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-3">{item.title}</h3>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2 flex-1 mb-4">{item.excerpt}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border/20">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5"><User className="h-3 w-3 text-primary" />{item.author}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-secondary" />{item.published_date}</span>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </motion.div>
                </Link>
              ))}
            </div>
          </>
        )}
        {filtered.length === 0 && !isLoading && <div className="text-center py-20"><Newspaper className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" /><p className="text-muted-foreground">No articles found.</p></div>}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-xl border-border/30"><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl ${page === i + 1 ? "shadow-lg shadow-primary/30" : "border-border/30"}`}>{i + 1}</Button>)}
            <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-xl border-border/30"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
