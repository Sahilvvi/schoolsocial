import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin, Star, CheckCircle, Loader2, Image, MessageSquare,
  GraduationCap, Heart, Phone, Mail, Globe, IndianRupee,
  CalendarDays, Search, ArrowLeft, Share2, ChevronRight,
  Bus, Monitor, FlaskConical, LibraryBig, Dumbbell, Laptop,
  Camera, Stethoscope, Navigation, Edit
} from "lucide-react";
import { toast } from "sonner";
import AskAIChat from "@/components/AskAIChat";
import QrOrderDialog from "@/components/QrOrderDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolBySlug, useReviews, useJobs, useEvents, useSubmitAdmission } from "@/hooks/useData";
import { useSavedSchoolIds, useToggleSaveSchool } from "@/hooks/useSaveSchool";

const admissionSchema = z.object({
  student_name: z.string().min(2, "Student name is required"),
  parent_name: z.string().min(2, "Parent name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number required"),
  grade: z.string().min(1, "Please select a grade"),
});

/* ─── Facility icon map ─────────────────────────────────── */
const FACILITY_ICONS: Record<string, React.ElementType> = {
  "Transport": Bus, "Smart Classrooms": Monitor, "Science Labs": FlaskConical,
  "Library": LibraryBig, "Sports": Dumbbell, "Sports Complex": Dumbbell,
  "Sports Ground": Dumbbell, "Computer Lab": Laptop, "CCTV Security": Camera,
  "Medical Room": Stethoscope, "Swimming Pool": Dumbbell,
  "Basketball Court": Dumbbell, "Auditorium": Monitor, "Music Room": Monitor,
  "Art Studio": Edit, "Dance Room": Dumbbell, "Robotics Lab": Laptop,
  "Cafeteria": LibraryBig, "Olympic Pool": Dumbbell, "Playground": Dumbbell,
};

function FacilityIcon({ name }: { name: string }) {
  const Icon = FACILITY_ICONS[name] || CheckCircle;
  return <Icon className="h-5 w-5 text-blue-600" />;
}

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export default function SchoolProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: school, isLoading } = useSchoolBySlug(slug);
  const { data: reviews = [] } = useReviews(school?.id);
  const { data: allJobs = [] } = useJobs();
  const { data: allEvents = [] } = useEvents();
  const { user } = useAuth();

  const { data: savedIds } = useSavedSchoolIds();
  const toggleSave = useToggleSaveSchool();
  const isSaved = school ? savedIds?.has(school.id) ?? false : false;

  const submitAdmission = useSubmitAdmission();

  const admissionForm = useForm<z.infer<typeof admissionSchema>>({
    resolver: zodResolver(admissionSchema),
    defaultValues: { student_name: "", parent_name: "", email: "", phone: "", grade: "" },
  });

  useEffect(() => {
    if (user) {
      admissionForm.setValue("email", user.email || "");
      admissionForm.setValue("parent_name", user.user_metadata?.full_name || "");
    }
  }, [user?.id]);

  const onSubmitAdmission = async (values: z.infer<typeof admissionSchema>) => {
    if (!school) return;
    try {
      await submitAdmission.mutateAsync({ school_id: school.id, ...values });
      toast.success("Application submitted successfully! The school will contact you soon.");
      admissionForm.reset();
    } catch {
      toast.error("Failed to submit application. Please try again.");
    }
  };

  const [activeTab, setActiveTab] = useState("about");
  const [showFullAbout, setShowFullAbout] = useState(false);

  const schoolJobs = allJobs.filter((j) => j.school_id === school?.id);
  const schoolEvents = allEvents.filter((e: any) => e.school_id === school?.id || (e.school_name && school?.name && e.school_name === school.name));

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
  if (!school) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-500 font-bold text-xl">School not found.</p>
    </div>
  );

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : Number(school.rating).toFixed(1);

  const classFees = (school as any).class_fees || [];
  const gallery = school.gallery ?? [];
  const facilities = school.facilities ?? [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">

      {/* ══════════════════════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden bg-white">

        {/* Mobile Top Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
          <Link to="/schools" className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <h1 className="flex-1 font-bold text-gray-900 text-base truncate">{school.name}</h1>
          <button
            onClick={() => user && toggleSave.mutate({ schoolId: school.id, saved: isSaved })}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Share2 className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Hero Image */}
        <div className="pt-14">
          <div className="relative">
            <img
              src={school.banner}
              alt={school.name}
              className="w-full h-52 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }}
            />
            <div className="absolute bottom-2 right-3 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">
              1/{gallery.length > 0 ? gallery.length + 1 : 1}
            </div>
          </div>

          {/* School Info Card */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              {/* School crest */}
              <div className="h-14 w-14 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center shrink-0 overflow-hidden">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-extrabold text-gray-900 text-base">{school.name}</h2>
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" /> {avgRating}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" /> {school.location}
                </p>
                {school.is_verified && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-[11px] text-blue-600 font-semibold">Verified</span>
                  </div>
                )}
                <p className="text-[11px] text-gray-400 mt-0.5">({school.review_count} Reviews)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <a href="tel:+911234567890">
                <button className="w-full flex items-center justify-center gap-1.5 bg-green-500 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">
                  <Phone className="h-4 w-4" /> Call Now
                </button>
              </a>
              <Link to={`/school/${school.slug}#enquiry`}>
                <button className="w-full flex items-center justify-center gap-1.5 bg-green-500 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">
                  <MessageSquare className="h-4 w-4" /> Enquiry
                </button>
              </Link>
              <Link to={`/school/${school.slug}#apply`}>
                <button className="w-full flex items-center justify-center gap-1.5 border border-green-500 text-green-600 rounded-xl py-2.5 text-xs font-bold hover:bg-green-50 transition-colors">
                  <Edit className="h-4 w-4" /> Apply Now
                </button>
              </Link>
            </div>
          </div>

          {/* Info chips */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Board", value: school.board },
                { label: "Classes", value: "Nursery - 12th" },
                { label: "Medium", value: "English" },
                { label: "Established", value: "2005" },
              ].map((info) => (
                <div key={info.label} className="flex flex-col items-center text-center p-2">
                  <p className="text-[10px] text-gray-400 font-medium">{info.label}</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5 leading-tight">{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Bar */}
          <div className="bg-white border-b border-gray-100 overflow-x-auto no-scrollbar sticky top-14 z-40">
            <div className="flex gap-0 px-2 min-w-max">
              {["About", "Gallery", "Facilities", "Events", "Community", "Compare"].map((tab) => {
                const val = tab.toLowerCase();
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(val)}
                    className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === val
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── ABOUT Section ─── */}
          <div className="bg-white mt-2 px-4 py-4">
            <h3 className="font-extrabold text-gray-900 text-sm mb-3">About School</h3>
            <p className={`text-sm text-gray-600 leading-relaxed ${!showFullAbout ? "line-clamp-4" : ""}`}>
              {school.about || school.description}
            </p>
            <button onClick={() => setShowFullAbout(!showFullAbout)} className="text-blue-600 text-xs font-semibold mt-1">
              {showFullAbout ? "Show Less" : "Read More"}
            </button>
          </div>

          {/* ─── Gallery Section ─── */}
          <div className="bg-white mt-2 px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-gray-900 text-sm">Gallery</h3>
              <button className="text-blue-600 text-xs font-semibold flex items-center gap-0.5">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {gallery.length > 0 ? (
              <div className="grid grid-cols-3 gap-1.5">
                {gallery.slice(0, 6).map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden">
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {[school.banner, ...(gallery)].concat([
                  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=80",
                  "https://images.unsplash.com/photo-1562774053-701939374585?w=300&q=80",
                  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&q=80",
                  "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=300&q=80",
                ]).slice(0, 6).map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden">
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Facilities Section ─── */}
          <div className="bg-white mt-2 px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-gray-900 text-sm">Facilities</h3>
              <button className="text-blue-600 text-xs font-semibold flex items-center gap-0.5">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {facilities.slice(0, 8).map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center">
                    <FacilityIcon name={f} />
                  </div>
                  <p className="text-[10px] text-gray-600 font-medium leading-tight">{f}</p>
                </div>
              ))}
              {facilities.length === 0 && (
                ["Transport", "Smart Classrooms", "Science Labs", "Library", "Sports", "Computer Lab", "CCTV Security", "Medical Room"].map((f) => (
                  <div key={f} className="flex flex-col items-center gap-1.5 text-center">
                    <div className="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center">
                      <FacilityIcon name={f} />
                    </div>
                    <p className="text-[10px] text-gray-600 font-medium leading-tight">{f}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ─── Admissions Open Card ─── */}
          <div className="mx-4 mt-2 mb-2 rounded-2xl border-2 border-green-500 bg-white overflow-hidden">
            <div className="bg-green-50 px-4 py-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-extrabold text-gray-900 text-sm">Admissions Open 2024-25</p>
                <p className="text-xs text-gray-500">Apply now for a bright future!</p>
              </div>
            </div>
            <div className="px-4 py-3">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl py-3 transition-colors">
                Apply Now
              </button>
            </div>
          </div>

          {/* ─── Events & Activities ─── */}
          <div className="bg-white mt-2 px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-gray-900 text-sm">Events &amp; Activities</h3>
              <Link to="/events" className="text-blue-600 text-xs font-semibold flex items-center gap-0.5">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {(schoolEvents.length > 0 ? schoolEvents : [
                { title: "Annual Day Celebration", event_date: "2025-01-15" },
                { title: "Sports Day", event_date: "2024-11-26" },
                { title: "Science Exhibition", event_date: "2024-10-10" },
              ] as any[]).slice(0, 3).map((ev: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-xs font-semibold text-gray-800">{ev.title}</p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(ev.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Contact Us ─── */}
          <div className="bg-white mt-2 px-4 py-4 mb-20">
            <h3 className="font-extrabold text-gray-900 text-sm mb-3">Contact Us</h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 text-xs text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <span>{school.location}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <span>+91 01234 56789</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <span>info@{school.slug}.edu.in</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                <span>www.{school.slug}.edu</span>
              </div>
            </div>
            {/* Map placeholder */}
            <div className="mt-3 h-28 rounded-xl overflow-hidden bg-gray-100 flex items-end justify-end">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${school.lat},${school.lng}&zoom=14&size=400x120&markers=color:red%7C${school.lat},${school.lng}&key=placeholder`}
                alt="Map"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  el.parentElement!.style.background = "linear-gradient(135deg, #e0f2fe, #bfdbfe)";
                }}
              />
              <div className="absolute bottom-1 right-1 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center">
                <MapPin className="h-3.5 w-3.5 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 grid grid-cols-3 gap-2">
          <a href="tel:+911234567890">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl py-3 flex items-center justify-center gap-1.5 transition-colors shadow-sm">
              <Phone className="h-4 w-4" /> Call Now
            </button>
          </a>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl py-3 flex items-center justify-center gap-1.5 transition-colors shadow-sm">
            <MessageSquare className="h-4 w-4" /> Enquiry
          </button>
          <a href={`https://www.google.com/maps?q=${school.lat},${school.lng}`} target="_blank" rel="noopener noreferrer">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl py-3 flex items-center justify-center gap-1.5 transition-colors shadow-sm">
              <Navigation className="h-4 w-4" /> Directions
            </button>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block">
        {/* Hero Banner */}
        <div className="relative h-[55vh] overflow-hidden bg-gray-200">
          <motion.img
            initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
            src={school.banner} alt={school.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />

          <div className="absolute top-6 right-6 flex gap-3 z-20">
            {user && (
              <button
                className={`h-12 w-12 rounded-full backdrop-blur-md shadow-xl flex items-center justify-center transition-all hover:scale-110 ${isSaved ? "bg-rose-500 text-white" : "bg-black/20 text-white border border-white/20 hover:bg-rose-500"}`}
                onClick={() => toggleSave.mutate({ schoolId: school.id, saved: isSaved })}
              >
                <Heart className={`h-6 w-6 ${isSaved ? "fill-current" : ""}`} />
              </button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10 container mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-blue-600 text-white border-0 shadow-lg px-4 py-1.5 text-sm font-bold uppercase tracking-widest">{school.board}</Badge>
              <Badge variant="outline" className="bg-white/90 backdrop-blur-md border-0 text-gray-900 px-3 py-1.5 font-bold shadow-md">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1.5" /> {avgRating} ({school.review_count} Reviews)
              </Badge>
              {school.is_verified && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-400/30 px-3 py-1.5 font-bold">
                  <CheckCircle className="h-4 w-4 mr-1.5" /> Verified
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">{school.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <MapPin className="h-5 w-5 text-blue-400" />{school.location}
              </span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <IndianRupee className="h-5 w-5 text-blue-400" />{school.fees} / yr
              </span>
              <AskAIChat schoolName={school.name} schoolAbout={school.about} schoolFees={school.fees} schoolBoard={school.board} schoolFacilities={school.facilities ?? []} />
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-0 overflow-x-auto no-scrollbar">
              {[
                { value: "about", label: "About" },
                { value: "fees", label: "Fees & Structure" },
                { value: "gallery", label: "Gallery" },
                { value: "reviews", label: "Reviews" },
                { value: "admission", label: "Apply Now" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.value ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="container mx-auto px-4 py-12">
          {activeTab === "about" && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <h2 className="text-2xl font-extrabold mb-4 text-gray-900">About School</h2>
                  <p className="text-gray-600 leading-relaxed">{school.about || school.description}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Facilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {facilities.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 font-semibold text-gray-700 text-sm">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Gallery preview */}
                {gallery.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-extrabold text-gray-900">Gallery</h2>
                      <button onClick={() => setActiveTab("gallery")} className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                        View All <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {gallery.slice(0, 6).map((img, i) => (
                        <div key={i} className="aspect-video rounded-xl overflow-hidden">
                          <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                {/* Contact */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-extrabold text-lg text-gray-900 mb-4">Contact Info</h3>
                  <div className="space-y-4 text-sm">
                    {[
                      { icon: MapPin, value: school.location },
                      { icon: Phone, value: "+91 98765 43210" },
                      { icon: Mail, value: `admissions@${school.slug}.edu` },
                      { icon: Globe, value: `www.${school.slug}.edu` },
                    ].map(({ icon: Icon, value }) => (
                      <div key={value} className="flex items-start gap-3 text-gray-700">
                        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="pt-2 text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Admissions CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-80" />
                  <h3 className="font-extrabold text-xl mb-2">Admissions Open</h3>
                  <p className="text-white/80 text-sm mb-4">Apply now for 2024-25 academic year</p>
                  <button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl py-3 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Fee Structure</h2>
              {classFees.length > 0 ? (
                <div className="space-y-4">
                  {classFees.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="font-extrabold text-lg text-gray-900">{item.class}</span>
                      <span className="font-extrabold text-xl text-blue-600">{item.fee}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <IndianRupee className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold text-lg mb-4">Fee structure not publicly available.</p>
                  <button className="border border-blue-600 text-blue-600 rounded-xl px-6 py-2.5 font-semibold text-sm hover:bg-blue-50">Request Fee Details</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img, i) => (
                <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-sm group relative">
                  <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-extrabold mb-2 text-gray-900">Verified Parent Reviews</h2>
              <p className="text-gray-500 font-medium mb-6">See what other parents are saying about {school.name}.</p>
              <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors">Write a Review</button>
            </div>
          )}

          {activeTab === "admission" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <div className="p-8 text-center border-b border-gray-100">
                <GraduationCap className="h-14 w-14 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Apply to {school.name}</h2>
                <p className="text-gray-500 font-medium">Submit your details to initiate the admission process for the upcoming academic year.</p>
              </div>
              <div className="p-8">
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-medium mb-4">Please sign in to submit your application and track its status in your dashboard.</p>
                    <Link to="/auth">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl">Sign In to Apply</Button>
                    </Link>
                  </div>
                ) : (
                <Form {...admissionForm}>
                  <form onSubmit={admissionForm.handleSubmit(onSubmitAdmission)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={admissionForm.control} name="student_name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-sm text-gray-700">Student Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Child's full name" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={admissionForm.control} name="parent_name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-sm text-gray-700">Parent / Guardian Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={admissionForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-sm text-gray-700">Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@email.com" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={admissionForm.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-sm text-gray-700">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 XXXXX XXXXX" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={admissionForm.control} name="grade" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-sm text-gray-700">Applying for Grade</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
                              "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm mt-2"
                      disabled={submitAdmission.isPending}
                    >
                      {submitAdmission.isPending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </form>
                </Form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
