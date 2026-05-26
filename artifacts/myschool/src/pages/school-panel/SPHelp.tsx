import { useOutletContext } from "react-router-dom";
import { HelpCircle, MessageCircle, Mail, Phone, FileText, ChevronRight } from "lucide-react";

const FAQS = [
  { q: "How do I update my school profile?", a: "Go to Profile Management from the sidebar and click Edit. You can update all details including photos, facilities, and fee structure." },
  { q: "How can I respond to parent enquiries?", a: "Navigate to Enquiries from the sidebar. Click on any enquiry to view details and respond directly via email or phone." },
  { q: "How do I add events?", a: "Go to Events from the sidebar and click 'Add Event'. Fill in the event details, add an image, and publish." },
  { q: "How does the analytics dashboard work?", a: "The analytics section shows your profile views, enquiries, and application trends. Premium users get advanced analytics with demographic data." },
  { q: "How can I get verified?", a: "Apply for verification through your Profile Management page. Our team will verify your school details within 48 hours." },
];

export default function SPHelp() {
  const { school } = useOutletContext<any>();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-600" /> Help & Support
        </h1>
        <p className="text-sm text-gray-500 mt-1">Get help with your school panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="mailto:support@schoolsocial.in" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-gray-900">Email Support</h3>
          <p className="text-xs text-gray-500 mt-1">support@schoolsocial.in</p>
        </a>
        <a href="tel:+911234567890" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
          <Phone className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-gray-900">Phone Support</h3>
          <p className="text-xs text-gray-500 mt-1">+91 123 456 7890</p>
        </a>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
          <MessageCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-gray-900">Live Chat</h3>
          <p className="text-xs text-gray-500 mt-1">Mon-Sat, 9AM-6PM</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" /> Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {FAQS.map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
