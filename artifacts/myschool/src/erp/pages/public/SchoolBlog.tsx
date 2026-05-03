import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, BookOpen, Calendar, Loader2, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const CATEGORY_COLORS: Record<string, string> = {
  news: "bg-blue-100 text-blue-700",
  event: "bg-purple-100 text-purple-700",
  achievement: "bg-green-100 text-green-700",
  notice: "bg-orange-100 text-orange-700",
  academic: "bg-red-100 text-red-700",
  general: "bg-gray-100 text-gray-700",
};

export default function SchoolBlog() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [schoolName, setSchoolName] = useState("");

  useEffect(() => {
    fetch(`${BASE}/api/admissions/blog?slug=${slug}`)
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setSchoolName(d.schoolName || ""); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-6 rounded-xl flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />Back to Blog
          </Button>
          <div>
            {selectedPost.category && (
              <Badge className={`mb-3 ${CATEGORY_COLORS[selectedPost.category] || CATEGORY_COLORS.general}`}>{selectedPost.category}</Badge>
            )}
            <h1 className="text-3xl font-black mb-3">{selectedPost.title}</h1>
            <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2"><Calendar className="w-4 h-4" />{selectedPost.publishedAt ? new Date(selectedPost.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
            {selectedPost.coverImage && <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full rounded-2xl mb-6 object-cover max-h-64" />}
            <div className="prose prose-sm max-w-none text-foreground">
              {selectedPost.content?.split("\n").map((para: string, i: number) => para.trim() && <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{para}</p>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/schools/${slug}`}>
            <Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black">{schoolName || "School"} Blog</h1>
            <p className="text-sm text-muted-foreground">News, events and achievements</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-xl font-bold text-muted-foreground">No blog posts yet</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for news and updates from this school</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id} className="p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedPost(post)}>
                <div className="flex gap-4">
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {post.category && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general}`}>{post.category}</span>}
                    </div>
                    <h2 className="font-bold text-foreground line-clamp-2 mb-1">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN") : ""}</p>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
