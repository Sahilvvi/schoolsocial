import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Heart, Share2, MapPin, Star, CheckCircle,
  Phone, MessageSquare, Navigation, FileText, ChevronRight,
  Users, BookOpen, Clock, CalendarDays, GraduationCap, SlidersHorizontal,
  Home, Search, BarChart2, Calendar, User as UserIcon, Check
} from "lucide-react";

/* ─── Static demo data (matches reference screenshot) ─────── */
const CENTER = {
  name: "Bright Future Tuition Center",
  rating: 4.7,
  reviews: 98,
  location: "Loni, Ghaziabad, Uttar Pradesh",
  phone: "+91 98765 43210",
  isVerified: true,
  hero: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
  logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&q=80",
  photoCount: 12,
  classes: "1st – 12th",
  boards: "CBSE, ICSE, State Board",
  subjects: "All Major Subjects",
  teachers: "6+ Experienced",
  batchSize: "10-15 Students",
  established: "2018",
};

const BATCH_FILTERS = [
  { label: "All Batches", value: "all" },
  { label: "Primary (1-5)", value: "primary" },
  { label: "Middle (6-8)", value: "middle" },
  { label: "High School (9-10)", value: "high" },
  { label: "Senior (11-12)", value: "senior" },
];

const BATCHES = [
  {
    id: 1,
    isPopular: true,
    name: "CBSE Foundation Batch",
    classRange: "Class 6th – 8th",
    subjects: "All Subjects",
    desc: "Strong foundation for concept clarity and better academic performance.",
    students: "10-12",
    days: "Mon – Sat",
    timing: "5:00 PM – 7:00 PM",
    price: "₹2,000",
    filter: "middle",
    tags: ["Concept Building", "Weekly Tests", "Notes & Worksheets", "Doubt Clearing"],
  },
  {
    id: 2,
    isPopular: false,
    name: "Board Exam Batch",
    classRange: "Class 9th – 10th",
    subjects: "All Subjects",
    desc: "Complete syllabus coverage with regular tests and doubt sessions.",
    students: "12-15",
    days: "Mon – Sat",
    timing: "6:30 PM – 8:30 PM",
    price: "₹2,500",
    filter: "high",
    tags: ["Full Syllabus Coverage", "Weekly & Monthly Tests", "Previous Year Papers", "Personal Attention"],
  },
  {
    id: 3,
    isPopular: false,
    name: "Science & Maths Batch",
    classRange: "Class 9th – 10th",
    subjects: "Science, Maths",
    desc: "Focused batch for strong understanding of concepts and problem solving.",
    students: "10-12",
    days: "Tue, Thu, Sat",
    timing: "7:00 PM – 9:00 PM",
    price: "₹2,000",
    filter: "high",
    tags: ["Advanced Concepts", "Problem Solving", "MCQ Practice", "Doubt Sessions"],
  },
  {
    id: 4,
    isPopular: false,
    name: "Board + Competitive Batch",
    classRange: "Class 11th – 12th",
    subjects: "PCM / PCB",
    desc: "Perfect blend of board preparation and competitive exam training (JEE/NEET).",
    students: "10-15",
    days: "Mon – Sat",
    timing: "5:30 PM – 8:30 PM",
    price: "₹3,500",
    filter: "senior",
    tags: ["Board Preparation", "Competitive Training", "Mock Tests", "Performance Tracking"],
  },
];

const INFO_CHIPS = [
  { icon: GraduationCap, label: "Classes", value: CENTER.classes },
  { icon: BookOpen,      label: "Boards",  value: CENTER.boards   },
  { icon: FileText,      label: "Subjects",value: CENTER.subjects  },
  { icon: Users,         label: "Teachers",value: CENTER.teachers  },
  { icon: Users,         label: "Batch Size", value: CENTER.batchSize },
  { icon: CalendarDays,  label: "Established", value: CENTER.established },
];

const TABS = ["Overview", "Courses & Batches", "Faculty", "Results", "Gallery", "Reviews", "More"];

const BOTTOM_NAV = [
  { icon: Home,     label: "Home",    to: "/"        },
  { icon: Search,   label: "Search",  to: "/tutors"  },
  { icon: BarChart2,label: "Compare", to: "/compare" },
  { icon: Calendar, label: "Events",  to: "/events"  },
  { icon: UserIcon, label: "Profile", to: "/auth"    },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`h-3 w-3 ${s <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function TuitionCenterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Courses & Batches");
  const [liked, setLiked] = useState(false);
  const [batchFilter, setBatchFilter] = useState("all");

  const visibleBatches = batchFilter === "all"
    ? BATCHES
    : BATCHES.filter(b => b.filter === batchFilter);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* ── FIXED TOP HEADER ─────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-900 flex-1 text-center mx-2 truncate">{CENTER.name}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setLiked(!liked)}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Share2 className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[57px]" />

      {/* ── HERO IMAGE ───────────────────────────────────── */}
      <div className="relative">
        <img
          src={CENTER.hero}
          alt={CENTER.name}
          className="w-full h-52 object-cover"
        />
        <div className="absolute bottom-2 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <span>📷</span> 1/{CENTER.photoCount} Photos
        </div>
      </div>

      {/* ── INFO CARD ────────────────────────────────────── */}
      <div className="bg-white mx-0 px-4 pt-4 pb-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="h-16 w-16 rounded-2xl border-2 border-blue-100 overflow-hidden shrink-0 bg-blue-50 flex items-center justify-center">
            <img src={CENTER.logo} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">{CENTER.name}</h2>
              <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                {CENTER.rating} <Star className="h-2.5 w-2.5 fill-white text-white inline" />
              </span>
            </div>
            <p className="text-[12px] text-gray-500 mt-0.5">({CENTER.reviews} Reviews)</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <p className="text-[12px] text-gray-600 leading-tight">{CENTER.location}</p>
            </div>
            {CENTER.isVerified && (
              <div className="flex items-center gap-1 mt-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                <span className="text-[11px] text-green-600 font-semibold">Verified Tuition Center</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <a href={`tel:${CENTER.phone}`} className="flex flex-col items-center gap-1.5 border-2 border-green-500 rounded-xl py-2.5 hover:bg-green-50 transition-colors">
            <Phone className="h-4.5 w-4.5 text-green-600" style={{ width: 18, height: 18 }} />
            <span className="text-[10px] font-bold text-green-600 whitespace-nowrap">Call Now</span>
          </a>
          <Link to="/tuition-enquiry" className="flex flex-col items-center gap-1.5 border-2 border-blue-500 rounded-xl py-2.5 hover:bg-blue-50 transition-colors">
            <MessageSquare className="h-4.5 w-4.5 text-blue-600" style={{ width: 18, height: 18 }} />
            <span className="text-[10px] font-bold text-blue-600">Enquiry</span>
          </Link>
          <button className="flex flex-col items-center gap-1.5 border-2 border-gray-300 rounded-xl py-2.5 hover:bg-gray-50 transition-colors">
            <Navigation className="h-4.5 w-4.5 text-gray-500" style={{ width: 18, height: 18 }} />
            <span className="text-[10px] font-bold text-gray-600">Directions</span>
          </button>
          <Link to="/tuition-enquiry" className="flex flex-col items-center gap-1.5 border-2 border-pink-400 rounded-xl py-2.5 hover:bg-pink-50 transition-colors">
            <FileText className="h-4.5 w-4.5 text-pink-500" style={{ width: 18, height: 18 }} />
            <span className="text-[10px] font-bold text-pink-500">Apply Now</span>
          </Link>
        </div>
      </div>

      {/* ── INFO CHIPS (horizontal scroll) ───────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {INFO_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <div key={chip.label} className="flex flex-col items-center gap-1 shrink-0 min-w-[70px]">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon className="h-4.5 w-4.5 text-blue-600" style={{ width: 18, height: 18 }} />
                </div>
                <p className="text-[11px] font-bold text-gray-900 text-center leading-tight">{chip.value}</p>
                <p className="text-[10px] text-gray-400 text-center">{chip.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TAB BAR ──────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-40">
        <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────── */}
      <div className="px-4 py-4 space-y-4">

        {activeTab === "Courses & Batches" && (
          <>
            {/* Section heading */}
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Our Batches</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">Well structured batches for every class and goal!</p>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto items-center" style={{ scrollbarWidth: "none" }}>
              {BATCH_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setBatchFilter(f.value)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                    batchFilter === f.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <button className="shrink-0 h-7 w-7 flex items-center justify-center rounded-full border border-gray-200 bg-white ml-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
              </button>
            </div>

            {/* Batch cards */}
            <div className="space-y-3">
              {visibleBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        {batch.isPopular && (
                          <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5">
                            ✦ Most Popular
                          </span>
                        )}
                        <h4 className="text-sm font-extrabold text-gray-900">{batch.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{batch.classRange} | {batch.subjects}</p>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{batch.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-extrabold text-gray-900">{batch.price}</p>
                        <p className="text-[10px] text-gray-400">/ Month</p>
                        <button className="mt-2 bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                          Enroll Now
                        </button>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-3 mt-2">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-semibold">Batch Size</p>
                        <p className="text-[12px] font-bold text-gray-800">{batch.students} Students</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-semibold">Days</p>
                        <p className="text-[12px] font-bold text-gray-800">{batch.days}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-semibold">Timing</p>
                        <p className="text-[12px] font-bold text-gray-800">{batch.timing}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-gray-100">
                      {batch.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Check className="h-3 w-3 text-green-500 shrink-0" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Counselor CTA */}
            <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-900">Not sure which batch is right for your child?</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Talk to our academic counselor for personalized guidance.</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl whitespace-nowrap transition-colors shrink-0">
                Talk to Counselor
              </button>
            </div>
          </>
        )}

        {activeTab === "Overview" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-extrabold text-gray-900 mb-2">About Us</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Bright Future Tuition Center is a premier coaching institute based in Loni, Ghaziabad. 
                We provide high-quality education for students from Class 1st to 12th across all major boards 
                including CBSE, ICSE, and State Board. Our experienced faculty ensures concept clarity, 
                regular assessments, and personalized attention to every student.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-extrabold text-gray-900 mb-3">Why Choose Us</h3>
              <div className="space-y-2">
                {["Experienced & Qualified Faculty", "Small Batch Sizes for Personal Attention", "Regular Tests & Doubt Clearing", "Comprehensive Study Material", "Proven Track Record of Results"].map(pt => (
                  <div key={pt} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-[13px] text-gray-700">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === "Faculty" || activeTab === "Results" || activeTab === "Gallery" || activeTab === "Reviews" || activeTab === "More") && (
          <div className="text-center py-16 text-gray-400">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-200" />
            <p className="text-sm font-medium">Coming Soon</p>
            <p className="text-xs text-gray-400 mt-1">This section is being updated.</p>
          </div>
        )}
      </div>

      {/* ── FIXED BOTTOM ACTION BAR ───────────────────────── */}
      <div className="fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${CENTER.phone}`}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <Link
            to="/tuition-enquiry"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="h-4 w-4" /> Enquiry
          </Link>
          <Link
            to="/tuition-enquiry"
            className="text-white text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
            style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}
          >
            <FileText className="h-4 w-4" /> Apply Now
          </Link>
        </div>
      </div>

      {/* ── BOTTOM NAV TABS ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-center px-2 py-2">
        {BOTTOM_NAV.map((tab) => {
          const Icon = tab.icon;
          const active = tab.to === "/" && location.pathname === "/";
          return (
            <Link key={tab.label} to={tab.to} className="flex-1 flex flex-col items-center gap-0.5 py-0.5">
              <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
              <span className={`text-[10px] font-semibold ${active ? "text-blue-600" : "text-gray-400"}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
