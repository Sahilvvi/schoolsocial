import { useOutletContext } from "react-router-dom";
import { FileText, Download, Eye, Mail } from "lucide-react";

const DEMO_APPLICATIONS = [
  { id: "1", name: "Rajesh Kumar", position: "Mathematics Teacher", experience: "8 years", qualification: "M.Sc. Mathematics, B.Ed", email: "rajesh@email.com", phone: "+91 98765 43210", status: "New", date: "May 20, 2024" },
  { id: "2", name: "Priya Singh", position: "English Teacher", experience: "5 years", qualification: "M.A. English, B.Ed", email: "priya@email.com", phone: "+91 87654 32109", status: "Shortlisted", date: "May 18, 2024" },
  { id: "3", name: "Amit Verma", position: "Science Teacher", experience: "10 years", qualification: "M.Sc. Physics, B.Ed", email: "amit@email.com", phone: "+91 76543 21098", status: "Interview", date: "May 15, 2024" },
  { id: "4", name: "Neha Gupta", position: "Computer Science", experience: "6 years", qualification: "MCA, B.Ed", email: "neha@email.com", phone: "+91 65432 10987", status: "New", date: "May 22, 2024" },
  { id: "5", name: "Suresh Rao", position: "Physical Education", experience: "12 years", qualification: "B.P.Ed, M.P.Ed", email: "suresh@email.com", phone: "+91 54321 09876", status: "Rejected", date: "May 10, 2024" },
];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  Shortlisted: "bg-green-50 text-green-700",
  Interview: "bg-purple-50 text-purple-700",
  Rejected: "bg-red-50 text-red-600",
};

export default function SPJobApps() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" /> Job Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">{DEMO_APPLICATIONS.length} applications received</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">Applicant</th>
                <th className="px-5 py-3 text-left font-semibold">Position</th>
                <th className="px-5 py-3 text-left font-semibold">Experience</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Date</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DEMO_APPLICATIONS.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-semibold text-gray-900">{app.name}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{app.position}</td>
                  <td className="px-5 py-3.5 text-gray-600">{app.experience}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{app.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100">
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
