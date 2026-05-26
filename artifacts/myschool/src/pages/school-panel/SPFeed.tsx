import { useOutletContext } from "react-router-dom";
import { Rss, Plus, Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

const DEMO_POSTS = [
  {
    id: "1", type: "photo",
    content: "Our students participated in the Inter-School Science Exhibition and won 3 gold medals! 🏆 Proud of our young scientists!",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
    likes: 45, comments: 12, shares: 8, time: "2h ago",
  },
  {
    id: "2", type: "announcement",
    content: "📢 Admissions open for 2024-25! Limited seats available for Nursery to Class 12. Apply now to secure your child's future.",
    image: null,
    likes: 78, comments: 23, shares: 34, time: "1d ago",
  },
  {
    id: "3", type: "photo",
    content: "Annual Sports Day celebrations! Our students showcased their athletic skills across various events. What a day! 🏃‍♂️⚽🏏",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80",
    likes: 92, comments: 18, shares: 15, time: "3d ago",
  },
  {
    id: "4", type: "update",
    content: "New smart classrooms inaugurated today! Equipped with interactive boards, projectors, and AI-powered learning tools. 🖥️",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80",
    likes: 56, comments: 9, shares: 6, time: "5d ago",
  },
];

export default function SPFeed() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Rss className="h-5 w-5 text-blue-600" /> Social Feed
          </h1>
          <p className="text-sm text-gray-500 mt-1">Share updates with parents and community</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Create Post
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {DEMO_POSTS.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">GS</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{school?.name || "Greenfield Public School"}</p>
                  <p className="text-xs text-gray-400">{post.time}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
            <div className="px-4 pb-3">
              <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
            </div>
            {post.image && (
              <img src={post.image} alt="" className="w-full h-56 object-cover" />
            )}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-6">
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <Heart className="h-4 w-4" /> {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="h-4 w-4" /> {post.comments}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-500 transition-colors">
                <Share2 className="h-4 w-4" /> {post.shares}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
