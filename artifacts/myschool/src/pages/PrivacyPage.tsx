import { Link } from "react-router-dom";
import { Shield, Eye, Lock, Server, UserCheck, Mail } from "lucide-react";

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    items: [
      "Account information (name, email, phone number) when you register",
      "School preferences and search history to improve recommendations",
      "Device information and usage analytics for performance optimization",
      "Location data (with your consent) to show nearby schools and tuitions",
    ],
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    items: [
      "All data is encrypted in transit (TLS 1.3) and at rest (AES-256)",
      "Access controls and regular security audits",
      "No selling of personal data to third parties",
      "Regular data backups with disaster recovery procedures",
    ],
  },
  {
    icon: Server,
    title: "How We Use Your Information",
    items: [
      "To provide personalized school and tuition recommendations",
      "To process admission applications and enquiries",
      "To send relevant notifications about schools and events",
      "To improve our platform through anonymized analytics",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    items: [
      "Access and download your personal data at any time",
      "Request correction or deletion of your information",
      "Opt out of marketing communications",
      "Withdraw consent for data processing",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-6">
            <Shield className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your privacy matters to us. This policy explains how SchoolSocial collects, uses, and protects your personal information.
          </p>
          <p className="text-sm text-slate-400 mt-4">Last updated: May 2026</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-indigo-50 rounded-2xl p-8 text-center">
            <Mail className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Questions about your privacy?</h3>
            <p className="text-slate-600 mb-4">
              Contact our Data Protection Officer at{" "}
              <a href="mailto:privacy@schoolsocial.in" className="text-indigo-600 font-semibold hover:underline">
                privacy@schoolsocial.in
              </a>
            </p>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
