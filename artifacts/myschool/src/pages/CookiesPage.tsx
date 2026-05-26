import { Link } from "react-router-dom";
import { Cookie, Settings, BarChart2, Shield, Mail } from "lucide-react";

const cookieTypes = [
  {
    name: "Essential Cookies",
    required: true,
    description: "Required for the platform to function. These handle authentication, security, and basic navigation.",
    examples: ["Session management", "Login state", "Security tokens", "Language preferences"],
  },
  {
    name: "Analytics Cookies",
    required: false,
    description: "Help us understand how users interact with SchoolSocial so we can improve the experience.",
    examples: ["Page visit counts", "Feature usage tracking", "Performance monitoring", "Error reporting"],
  },
  {
    name: "Functional Cookies",
    required: false,
    description: "Remember your preferences and settings to provide a personalized experience.",
    examples: ["Search filters and preferences", "Recently viewed schools", "Comparison lists", "Notification settings"],
  },
  {
    name: "Marketing Cookies",
    required: false,
    description: "Used to deliver relevant advertisements and measure campaign effectiveness.",
    examples: ["Ad personalization", "Campaign tracking", "Social media integration", "Retargeting pixels"],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-6">
            <Cookie className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie Settings</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We use cookies to enhance your browsing experience. Learn about the cookies we use and manage your preferences.
          </p>
          <p className="text-sm text-slate-400 mt-4">Last updated: May 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">What are cookies?</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how you use the platform. You can manage your cookie preferences at any time.
          </p>
        </div>

        <div className="space-y-6">
          {cookieTypes.map((cookie) => (
            <div key={cookie.name} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    {cookie.name.includes("Essential") ? <Shield className="h-5 w-5 text-indigo-600" /> :
                     cookie.name.includes("Analytics") ? <BarChart2 className="h-5 w-5 text-indigo-600" /> :
                     cookie.name.includes("Functional") ? <Settings className="h-5 w-5 text-indigo-600" /> :
                     <Cookie className="h-5 w-5 text-indigo-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{cookie.name}</h3>
                    {cookie.required && (
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Always active</span>
                    )}
                  </div>
                </div>
                {!cookie.required && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                  </label>
                )}
              </div>
              <p className="text-slate-600 mb-4">{cookie.description}</p>
              <div className="flex flex-wrap gap-2">
                {cookie.examples.map((example, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-indigo-50 rounded-2xl p-8 text-center">
          <Mail className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Cookie-related questions?</h3>
          <p className="text-slate-600 mb-4">
            Reach out at{" "}
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
  );
}
