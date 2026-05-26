import { useOutletContext } from "react-router-dom";
import { MessageSquare, Search, Filter } from "lucide-react";
import { useState } from "react";

const DEMO_ENQUIRIES = [
  { id: "1", name: "Priya Verma", email: "priya@email.com", phone: "+91 98765 43210", subject: "Class 5 Admission", message: "Looking for admission for my daughter in Class 5 for the upcoming session.", status: "New", time: "2h ago" },
  { id: "2", name: "Amit Singh", email: "amit@email.com", phone: "+91 87654 32109", subject: "Fee Structure", message: "Can you please share the fee structure for Class 9-10?", status: "New", time: "5h ago" },
  { id: "3", name: "Neha Gupta", email: "neha@email.com", phone: "+91 76543 21098", subject: "Transport Facility", message: "Do you provide transport from Sector 62, Noida?", status: "In Progress", time: "1d ago" },
  { id: "4", name: "Rahul Mehta", email: "rahul@email.com", phone: "+91 65432 10987", subject: "Sports Activities", message: "What sports activities and coaching are available?", status: "In Progress", time: "2d ago" },
  { id: "5", name: "Sunita Rao", email: "sunita@email.com", phone: "+91 54321 09876", subject: "Scholarship Info", message: "Is there any scholarship program for meritorious students?", status: "Resolved", time: "3d ago" },
  { id: "6", name: "Vikram Joshi", email: "vikram@email.com", phone: "+91 43210 98765", subject: "Campus Visit", message: "Can we schedule a campus visit this weekend?", status: "New", time: "4h ago" },
];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Resolved: "bg-green-50 text-green-700",
};

export default function SPEnquiries() {
  const { school } = useOutletContext<any>();
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? DEMO_ENQUIRIES : DEMO_ENQUIRIES.filter(e => e.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" /> Enquiries
          </h1>
          <p className="text-sm text-gray-500 mt-1">{DEMO_ENQUIRIES.length} total enquiries</p>
        </div>
        <div className="flex items-center gap-2">
          {["All", "New", "In Progress", "Resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((enquiry) => (
          <div key={enquiry.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-blue-700 font-bold text-sm">{enquiry.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{enquiry.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[enquiry.status]}`}>
                      {enquiry.status}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">{enquiry.time}</span>
                  </div>
                  <p className="text-sm font-medium text-blue-600 mt-0.5">{enquiry.subject}</p>
                  <p className="text-sm text-gray-500 mt-1">{enquiry.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{enquiry.email}</span>
                    <span>{enquiry.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
