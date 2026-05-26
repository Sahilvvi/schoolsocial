import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, Heart, School, CalendarDays, Briefcase, BookOpen, Newspaper, Crown, MessageSquare, Upload, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const quickLinks = [
  { label: "Schools", to: "/schools", icon: School },
  { label: "Events", to: "/events", icon: CalendarDays },
  { label: "Vacancies", to: "/jobs", icon: Briefcase },
  { label: "Tutors", to: "/tutors", icon: BookOpen },
  { label: "News", to: "/news", icon: Newspaper },
];

const moreLinks = [
  { label: "Plans & Pricing", to: "/plans" },
  { label: "Home Tuition", to: "/tuition-enquiry" },
  { label: "List Your School", to: "/upload-school" },
  { label: "Compare Schools", to: "/compare" },
  { label: "Parent Dashboard", to: "/dashboard" },
];

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/90 pt-16 pb-8 lg:pb-12 lg:pt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand & Contact */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="gradient-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">School<span className="text-indigo-400">Social</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground/80 pr-4">
              India's premier education marketplace. Helping parents find, compare, and apply to the perfect school for their children seamlessly.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <a href="mailto:hello@schoolsocial.in" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors group">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                hello@schoolsocial.in
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors group">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                +91 98765 43210
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Explore</h4>
            <div className="flex flex-col gap-4">
              {quickLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground/80 hover:text-primary transition-colors flex items-center gap-3 group">
                  <l.icon className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <div className="flex flex-col gap-4">
              {moreLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground/80 hover:text-primary transition-colors flex items-center gap-2">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Get Started</h4>
            <p className="text-sm text-muted-foreground/80 leading-relaxed mb-6">
              Join millions of parents discovering better education opportunities every day.
            </p>
            <Link to="/auth" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 rounded-xl gradient-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all">
              Sign In / Sign Up
            </Link>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <h5 className="font-bold text-white mb-4 text-xs uppercase tracking-widest">Follow Us</h5>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, i) => (
                  <a key={i} href={social.href} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:-translate-y-1 transition-all">
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 w-full mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground/60">
          <p>© {new Date().getFullYear()} SchoolSocial. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}