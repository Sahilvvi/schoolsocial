import { useOutletContext } from "react-router-dom";
import { Rss, Plus, Calendar } from "lucide-react";

const ANNOUNCEMENTS = [
  { id: "1", title: "New Batch Starting - JEE 2025", content: "New batch for JEE 2025 preparation starting from June 1st. Limited seats available!", date: "May 25, 2024", type: "Important" },
  { id: "2", title: "Holiday Notice - Summer Break", content: "The center will remain closed from May 27 to June 5 for summer break.", date: "May 22, 2024", type: "Notice" },
  { id: "3", title: "Parent-Teacher Meeting", content: "PTM scheduled for this Saturday, 10 AM - 1 PM. All parents are requested to attend.", date: "May 20, 2024", type: "Event" },
  { id: "4", title: "Monthly Test Results Published", content: "May monthly test results are now available. Check with your batch coordinator.", date: "May 18, 2024", type: "Academic" },
];

const TYPE_COLORS: Record<string, string> = {
  Important: "bg-red-50 text-red-700",
  Notice: "bg-blue-50 text-blue-700",
  Event: "bg-purple-50 text-purple-700",
  Academic: "bg-green-50 text-green-700",
};

export default function TuPAnnouncements() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Rss className="h-5 w-5 text-blue-600" /> Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">{ANNOUNCEMENTS.length} announcements</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"><Plus className="h-4 w-4" /> New Announcement</button>
      </div>
      <div className="space-y-3">
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{a.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[a.type]}`}>{a.type}</span>
                </div>
                <p className="text-sm text-gray-600">{a.content}</p>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Calendar className="h-3 w-3" /> {a.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
