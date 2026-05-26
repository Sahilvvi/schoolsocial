import { Link } from "react-router-dom";
import { FileText, Users, AlertTriangle, Scale, CreditCard, Ban, Mail } from "lucide-react";

const sections = [
  {
    icon: Users,
    title: "User Accounts",
    content: [
      "You must be at least 18 years old to create an account, or have parental consent.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "One person or institution may maintain only one account per role (Parent, School, Teacher, Tuition Center).",
      "You agree to provide accurate and up-to-date information in your profile.",
    ],
  },
  {
    icon: FileText,
    title: "Platform Usage",
    content: [
      "SchoolSocial is a marketplace connecting parents with educational institutions. We do not guarantee admission outcomes.",
      "School listings and information are provided by institutions themselves. We verify data where possible but cannot guarantee accuracy.",
      "Users may submit reviews and ratings that must be honest, relevant, and free from abusive content.",
      "Unauthorized scraping, data mining, or automated access to the platform is prohibited.",
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Subscriptions",
    content: [
      "Subscription plans are billed according to the plan selected (monthly or annually).",
      "Payments are processed securely through our authorized payment partners.",
      "Refunds are available within 7 days of purchase if no premium features have been used.",
      "We reserve the right to modify pricing with 30 days advance notice to existing subscribers.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Content Guidelines",
    content: [
      "All content uploaded must comply with Indian law and not infringe on intellectual property rights.",
      "Schools and tuition centers must provide truthful information about their facilities, fees, and accreditation.",
      "Reviews must be based on genuine experiences. Fake or incentivized reviews will be removed.",
      "We reserve the right to remove any content that violates these guidelines without notice.",
    ],
  },
  {
    icon: Ban,
    title: "Prohibited Activities",
    content: [
      "Impersonating another person, institution, or SchoolSocial representative.",
      "Posting misleading information about schools, fees, or admission processes.",
      "Harassing other users through reviews, messages, or community posts.",
      "Attempting to bypass platform features or access restricted data.",
    ],
  },
  {
    icon: Scale,
    title: "Limitation of Liability",
    content: [
      "SchoolSocial acts as an intermediary and is not liable for decisions made based on listed information.",
      "We are not responsible for disputes between parents and educational institutions.",
      "Our liability is limited to the amount paid for our services in the preceding 12 months.",
      "These terms are governed by the laws of India, with jurisdiction in New Delhi courts.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-6">
            <Scale className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            By using SchoolSocial, you agree to these terms. Please read them carefully before using our platform.
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
                {section.content.map((item, i) => (
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
            <h3 className="text-lg font-bold text-slate-900 mb-2">Questions about these terms?</h3>
            <p className="text-slate-600 mb-4">
              Contact our legal team at{" "}
              <a href="mailto:legal@schoolsocial.in" className="text-indigo-600 font-semibold hover:underline">
                legal@schoolsocial.in
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
