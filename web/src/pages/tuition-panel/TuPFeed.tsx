import { Rss, Heart, MessageCircle, Share2, MoreHorizontal, Image, Send } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Summer Crash Course 2024",
    content: "Admissions open for Class 9th & 10th (All Subjects). Limited seats available — enroll now!",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
    date: "25 May 2024",
    likes: 24,
    comments: 8,
    status: "Published",
  },
  {
    id: 2,
    title: "New Batch for Class 11th (Science)",
    content: "Batch starting from 1st June 2024, limited seats! Experienced faculty for Physics, Chemistry, Mathematics & Biology.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
    date: "20 May 2024",
    likes: 18,
    comments: 5,
    status: "Published",
  },
  {
    id: 3,
    title: "Weekly Test Schedule",
    content: "Weekly tests for all batches will start from this Sunday. Students are requested to prepare well.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
    date: "18 May 2024",
    likes: 12,
    comments: 3,
    status: "Published",
  },
  {
    id: 4,
    title: "Results: Board Exam Batch",
    content: "We are proud to announce that 95% of our students scored above 90% in their Board Exams!",
    date: "10 May 2024",
    likes: 45,
    comments: 12,
    status: "Published",
  },
];

export default function TuPFeed() {
  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Rss className="h-6 w-6 text-indigo-600" />
            Social Feed
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Share updates, announcements, and news with parents</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <Send className="h-4 w-4" />
          New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-6">
        <textarea
          className="w-full border-0 resize-none text-sm placeholder:text-muted-foreground/60 focus:outline-none"
          rows={3}
          placeholder="Share an update with parents and students..."
        />
        <div className="flex items-center justify-between pt-3 border-t">
          <button className="text-sm text-muted-foreground flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Image className="h-4 w-4" /> Add Photo
          </button>
          <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Post
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border overflow-hidden">
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{post.title}</h3>
                  <p className="text-xs text-muted-foreground">Posted on {post.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {post.status}
                  </span>
                  <button className="text-muted-foreground hover:text-slate-900">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">{post.content}</p>
              <div className="flex items-center gap-6 pt-3 border-t text-sm text-muted-foreground">
                <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
