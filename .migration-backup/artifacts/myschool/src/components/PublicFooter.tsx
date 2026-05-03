import { Link } from "wouter";
import { motion } from "framer-motion";
import { School, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { label: "School ERP", href: "/schools-info" },
    { label: "AI Assistant", href: "/" },
    { label: "QR ID System", href: "/" },
    { label: "School Discovery", href: "/schools" },
    { label: "Teacher Marketplace", href: "/jobs" },
    { label: "Career Portal", href: "/career" },
  ],
  Schools: [
    { label: "Register School", href: "/schools/register" },
    { label: "School Login", href: "/login" },
    { label: "Pricing", href: "/schools-info#pricing" },
    { label: "School Blog", href: "/schools" },
    { label: "Demo Request", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Leaderboard", href: "/schools/leaderboard" },
    { label: "School Events", href: "/events" },
  ],
};

const SOCIAL = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export default function PublicFooter() {
  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="flex items-center gap-2.5 mb-4 cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                  <School className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">MySchool<span className="text-violet-400">.</span></span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              India's comprehensive digital ecosystem for schools — connecting schools, parents, teachers, and learners on one intelligent platform.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-gray-500 hover:text-gray-300 text-sm cursor-pointer transition-colors duration-200">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="border-t border-white/10 pt-8 pb-6">
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { icon: Mail, text: "hello@myschool.in" },
              { icon: Phone, text: "+91 0000000000" },
              { icon: MapPin, text: "New Delhi, India" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-500 text-sm">
                <Icon className="w-4 h-4 text-violet-400" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 MySchool Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
