import { useOutletContext } from "react-router-dom";
import { Star, MessageSquare } from "lucide-react";

const REVIEWS = [
  { id: "1", name: "Parent of Arjun", rating: 5, time: "2 days ago", comment: "Excellent coaching center! My son's marks improved significantly.", avatar: "PA", color: "bg-purple-500" },
  { id: "2", name: "Parent of Sneha", rating: 4, time: "1 week ago", comment: "Good faculty and systematic approach to teaching.", avatar: "PS", color: "bg-blue-500" },
  { id: "3", name: "Parent of Rahul", rating: 5, time: "2 weeks ago", comment: "Best tuition center in the area. Highly recommended!", avatar: "PR", color: "bg-green-500" },
  { id: "4", name: "Parent of Ananya", rating: 4, time: "3 weeks ago", comment: "Regular tests and doubt clearing sessions are very helpful.", avatar: "PA", color: "bg-orange-500" },
];

export default function TuPReviews() {
  const ctx = useOutletContext<any>();
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /> Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">{avg} average • {REVIEWS.length} reviews</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-6">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-gray-900">{avg}</p>
          <div className="flex gap-0.5 justify-center mt-1">{[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(avg)) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />)}</div>
          <p className="text-xs text-gray-500 mt-1">{REVIEWS.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5,4,3,2,1].map(star => {
            const count = REVIEWS.filter(r => r.rating === star).length;
            const pct = (count / REVIEWS.length) * 100;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-gray-500">{star}</span>
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-amber-400 h-2 rounded-full" style={{ width: `${pct}%` }} /></div>
                <span className="w-6 text-xs text-gray-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-3">
        {REVIEWS.map(r => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-full ${r.color} flex items-center justify-center shrink-0`}><span className="text-white text-xs font-bold">{r.avatar}</span></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-gray-900">{r.name}</p>
                  <span className="text-xs text-gray-400">{r.time}</span>
                </div>
                <div className="flex gap-0.5 mt-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />)}</div>
                <p className="text-sm text-gray-600 mt-1.5">{r.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
