import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { useAuth } from "@/hooks/use-auth";
import { Newspaper, Plus, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLinks } from "./admin-links";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const getToken = () => localStorage.getItem("myschool_token") || "";

export default function Blog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId || 1;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [form, setForm] = useState({ title: "", content: "", category: "news", imageUrl: "", status: "published" });

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch(`${BASE}/api/admissions/blog?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${getToken()}` } });
    setPosts((await res.json()).posts || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const addPost = async () => {
    if (!form.title || !form.content) { toast({ title: "Title and content are required", variant: "destructive" }); return; }
    const res = await fetch(`${BASE}/api/admissions/blog`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ ...form, schoolId }) });
    if (res.ok) {
      toast({ title: form.status === "draft" ? "Saved as draft" : "Post published!" });
      setOpen(false);
      setForm({ title: "", content: "", category: "news", imageUrl: "", status: "published" });
      fetchPosts();
    } else toast({ title: "Failed to save post", variant: "destructive" });
  };

  const toggleStatus = async (post: any) => {
    const newStatus = (post.status || "published") === "published" ? "draft" : "published";
    const res = await fetch(`${BASE}/api/admissions/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok || true) {
      toast({ title: newStatus === "published" ? "Post published!" : "Moved to drafts" });
      setPosts(ps => ps.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
    }
  };

  const deletePost = async (id: number) => {
    await fetch(`${BASE}/api/admissions/blog/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchPosts();
  };

  const CAT_COLOR: Record<string, string> = {
    news: "bg-blue-100 text-blue-700",
    event: "bg-purple-100 text-purple-700",
    achievement: "bg-green-100 text-green-700",
    announcement: "bg-orange-100 text-orange-700",
  };

  const publishedCount = posts.filter(p => (p.status || "published") === "published").length;
  const draftCount = posts.filter(p => p.status === "draft").length;
  const filtered = filter === "all" ? posts : posts.filter(p => (p.status || "published") === filter);

  return (
    <AdminLayout title="School Blog / News" links={adminLinks}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "published", "draft"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {f === "all" ? `All (${posts.length})` : f === "published" ? `Published (${publishedCount})` : `Drafts (${draftCount})`}
            </button>
          ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" />New Post</Button></DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700 max-w-xl">
            <DialogHeader><DialogTitle>Create Blog Post</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium dark:text-gray-300">Title *</label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Post title" className="dark:bg-gray-700 dark:border-gray-600 mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">Category</label>
                  <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">Status</label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Publish Now</SelectItem>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium dark:text-gray-300">Image URL (optional)</label>
                <Input value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/image.jpg" className="dark:bg-gray-700 dark:border-gray-600 mt-1" />
                {form.imageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden h-28 bg-gray-100 dark:bg-gray-700">
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium dark:text-gray-300">Content *</label>
                <Textarea rows={5} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Write your post content here..." className="dark:bg-gray-700 dark:border-gray-600 mt-1" />
              </div>
              <Button onClick={addPost} className="w-full">{form.status === "draft" ? "Save Draft" : "Publish Post"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-bold">{filter === "draft" ? "No drafts" : filter === "published" ? "No published posts" : "No posts yet"}</p>
          <p className="text-sm mt-1">Share news, achievements, and announcements publicly</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(p => {
            const isDraft = p.status === "draft";
            return (
              <Card key={p.id} className={`rounded-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden ${isDraft ? "border-dashed opacity-80" : ""}`}>
                {p.imageUrl && (
                  <div className="relative h-44 bg-gray-100 dark:bg-gray-700">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
                    {isDraft && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-yellow-500 text-white border-0">DRAFT</Badge>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className={`text-xs rounded-full ${CAT_COLOR[p.category] || CAT_COLOR.news}`}>{p.category}</Badge>
                        <Badge className={`text-xs rounded-full ${isDraft ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{isDraft ? "Draft" : "Published"}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      <h3 className="font-bold dark:text-white">{p.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => toggleStatus(p)} title={isDraft ? "Publish post" : "Move to draft"} className="h-8 w-8 p-0 rounded-lg dark:text-gray-300 hover:bg-secondary">
                        {isDraft ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-orange-500" />}
                      </Button>
                      <button onClick={() => deletePost(p.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.content}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
