import { useOutletContext } from "react-router-dom";
import { FileText, Plus, Eye, Calendar, Edit2 } from "lucide-react";

const DEMO_BLOGS = [
  { id: "1", title: "10 Tips for Preparing Your Child for Board Exams", excerpt: "Expert advice from our top faculty on how to help your child prepare effectively...", status: "Published", views: 1240, date: "May 15, 2024", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&q=80" },
  { id: "2", title: "The Importance of Extracurricular Activities", excerpt: "Why sports, arts, and clubs matter as much as academics in child development...", status: "Published", views: 890, date: "May 10, 2024", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80" },
  { id: "3", title: "Our Journey to Becoming a Smart School", excerpt: "How we transformed our classrooms with technology and digital learning tools...", status: "Draft", views: 0, date: "May 18, 2024", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=80" },
  { id: "4", title: "Parent-Teacher Collaboration: A Guide", excerpt: "Building strong partnerships between parents and teachers for student success...", status: "Published", views: 650, date: "May 5, 2024", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80" },
];

export default function SPBlogs() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" /> Blog Posts
          </h1>
          <p className="text-sm text-gray-500 mt-1">{DEMO_BLOGS.length} articles</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" /> Write Blog
        </button>
      </div>

      <div className="space-y-4">
        {DEMO_BLOGS.map((blog) => (
          <div key={blog.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
            <img src={blog.image} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0 hidden sm:block" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-900 line-clamp-1">{blog.title}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  blog.status === "Published" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>{blog.status}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{blog.excerpt}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {blog.date}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {blog.views} views</span>
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 ml-auto">
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
