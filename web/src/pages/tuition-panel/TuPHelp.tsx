import { useOutletContext } from "react-router-dom";
import { HelpCircle, Mail, Phone, MessageCircle, FileText, ChevronRight } from "lucide-react";

const FAQS = [
  { q: "How do I add a new batch?", a: "Go to Batches from the sidebar and click 'Add Batch'. Fill in subject, schedule, fee, and capacity details." },
  { q: "How do I respond to enquiries?", a: "Navigate to Enquiries, click on any enquiry to view details. You can respond via email or phone." },
  { q: "How can I upload photos?", a: "Go to Photo Gallery and click 'Upload Photo'. You can upload classroom, events, and facility photos." },
  { q: "How does the analytics work?", a: "Analytics shows your center's views, enquiries, and conversion metrics. Premium users get advanced insights." },
];

export default function TuPHelp() {
  const ctx = useOutletContext<any>();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-blue-600" /> Help & Support</h1>
        <p className="text-sm text-gray-500 mt-1">Get help with your tuition panel</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="mailto:support@schoolsocial.in" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" /><h3 className="font-bold text-sm text-gray-900">Email Support</h3><p className="text-xs text-gray-500 mt-1">support@schoolsocial.in</p>
        </a>
        <a href="tel:+911234567890" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <Phone className="h-6 w-6 text-green-600 mx-auto mb-2" /><h3 className="font-bold text-sm text-gray-900">Phone Support</h3><p className="text-xs text-gray-500 mt-1">+91 123 456 7890</p>
        </a>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
          <MessageCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" /><h3 className="font-bold text-sm text-gray-900">Live Chat</h3><p className="text-xs text-gray-500 mt-1">Mon-Sat, 9AM-6PM</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900 flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600" /> FAQ</h2></div>
        <div className="divide-y divide-gray-100">
          {FAQS.map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50">
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
              </summary>
              <div className="px-5 pb-4"><p className="text-sm text-gray-600">{faq.a}</p></div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
