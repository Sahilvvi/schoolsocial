import { useOutletContext } from "react-router-dom";
import { FileText, Eye, Mail } from "lucide-react";

const APPS = [
  { id: "1", name: "Ravi Kumar", position: "Mathematics Faculty", experience: "5 years", email: "ravi@email.com", status: "New", date: "May 22, 2024" },
  { id: "2", name: "Sunita Sharma", position: "Science Faculty", experience: "3 years", email: "sunita@email.com", status: "Shortlisted", date: "May 20, 2024" },
  { id: "3", name: "Ankit Verma", position: "English Tutor", experience: "2 years", email: "ankit@email.com", status: "Interview", date: "May 18, 2024" },
];

const STATUS_COLORS: Record<string, string> = { New: "bg-blue-50 text-blue-700", Shortlisted: "bg-green-50 text-green-700", Interview: "bg-purple-50 text-purple-700" };

export default function TuPJobApps() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" /> Applications</h1>
        <p className="text-sm text-gray-500 mt-1">{APPS.length} applications received</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase"><th className="px-5 py-3 text-left">Applicant</th><th className="px-5 py-3 text-left">Position</th><th className="px-5 py-3 text-left">Experience</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Date</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {APPS.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-5 py-3.5"><p className="font-semibold text-gray-900">{a.name}</p><p className="text-xs text-gray-500">{a.email}</p></td>
                <td className="px-5 py-3.5 text-gray-700">{a.position}</td>
                <td className="px-5 py-3.5 text-gray-600">{a.experience}</td>
                <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status]}`}>{a.status}</span></td>
                <td className="px-5 py-3.5 text-gray-500">{a.date}</td>
                <td className="px-5 py-3.5 text-right flex gap-2 justify-end">
                  <button className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Eye className="h-3.5 w-3.5" /></button>
                  <button className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><Mail className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
