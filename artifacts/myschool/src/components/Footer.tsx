import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, Heart, School, CalendarDays, Briefcase, BookOpen, Newspaper, Crown, MessageSquare, Upload } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="border-t border-border/30 mt-16 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/schools" className="flex items-center gap-2">
              <div className="gradient-primary p-2 rounded-lg shadow-md shadow-primary/20">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-gradient font-extrabold text-xl">MySchool</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's premier education marketplace. Helping parents find the perfect school for their children.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:hello@myschool.edu" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-3.5 w-3.5 text-primary" />hello@myschool.edu
              </a>
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" />+91 98765 43210
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <l.icon className="h-3.5 w-3.5" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* More */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">More</h4>
            <div className="flex flex-col gap-2.5">
              {moreLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Get Started</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Join thousands of parents who trust MySchool to make the best education choice.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
              Sign In / Sign Up
            </Link>
          </div>
        </div>

        <div className="h-px bg-border/30 my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MySchool. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <Heart className="h-3 w-3 text-destructive fill-destructive" /> in India</p>
        </div>
      </div>
    </footer>
  );
}
