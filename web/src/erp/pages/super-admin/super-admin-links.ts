import { Activity, Building2, Users, IndianRupee, Star, Settings, ScrollText, Ticket, Megaphone, CreditCard } from "lucide-react";

export const superAdminLinks = [
  { href: "/super-admin", label: "Dashboard", icon: Activity },
  { href: "/super-admin/schools", label: "Manage Schools", icon: Building2 },
  { href: "/super-admin/users", label: "All Users", icon: Users },
  { href: "/super-admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/super-admin/revenue", label: "Revenue", icon: IndianRupee },
  { href: "/super-admin/reviews", label: "Reviews", icon: Star },
  { href: "/super-admin/support-tickets", label: "Support Tickets", icon: Ticket },
  { href: "/super-admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/super-admin/settings", label: "Settings", icon: Settings },
  { href: "/super-admin/audit-logs", label: "Audit Logs", icon: ScrollText },
];
