export interface School {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  board: string;
  rating: number;
  reviewCount: number;
  fees: string;
  feeAmount: number;
  type: string;
  established: number;
  students: number;
  isFeatured: boolean;
  isVerified: boolean;
  facilities: string[];
  image: string;
  description: string;
  principal: string;
  grades: string;
  affiliation: string;
}

export interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  mode: string[];
  bio: string;
  qualifications: string;
  languages: string[];
  successRate: number;
  studentsCount: number;
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  school: string;
  schoolId: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  description: string;
  isFeatured: boolean;
  registrationLink: string;
  seats: number;
  seatsLeft: number;
}

export interface Job {
  id: string;
  title: string;
  school: string;
  location: string;
  salary: string;
  type: string;
  subject: string;
  experience: string;
  postedDays: number;
}

export const SCHOOLS: School[] = [
  {
    id: "1",
    name: "Delhi Public School",
    slug: "delhi-public-school-loni",
    location: "Loni, Ghaziabad",
    city: "Ghaziabad",
    board: "CBSE",
    rating: 4.8,
    reviewCount: 342,
    fees: "₹80,000/yr",
    feeAmount: 80000,
    type: "Private",
    established: 1996,
    students: 2800,
    isFeatured: true,
    isVerified: true,
    facilities: ["Smart Classes", "Swimming Pool", "Sports Ground", "Lab", "Library", "AC Rooms"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    description: "One of the most reputed schools in the NCR region, offering world-class education with modern facilities and experienced faculty.",
    principal: "Dr. Sunita Sharma",
    grades: "Nursery – XII",
    affiliation: "CBSE New Delhi (Aff. No: 2130101)",
  },
  {
    id: "2",
    name: "Ryan International School",
    slug: "ryan-international-noida",
    location: "Sector 25, Noida",
    city: "Noida",
    board: "CBSE",
    rating: 4.6,
    reviewCount: 218,
    fees: "₹95,000/yr",
    feeAmount: 95000,
    type: "Private",
    established: 2001,
    students: 3200,
    isFeatured: true,
    isVerified: true,
    facilities: ["Olympic Pool", "Auditorium", "STEM Lab", "Basketball Court", "Cafeteria"],
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    description: "A premier CBSE school with state-of-the-art facilities, shaping well-rounded future leaders.",
    principal: "Mr. Rajan Kapoor",
    grades: "Nursery – XII",
    affiliation: "CBSE New Delhi",
  },
  {
    id: "3",
    name: "St. Mary's Convent",
    slug: "st-marys-convent-delhi",
    location: "Vasant Kunj, Delhi",
    city: "Delhi",
    board: "ICSE",
    rating: 4.9,
    reviewCount: 412,
    fees: "₹1,20,000/yr",
    feeAmount: 120000,
    type: "Private",
    established: 1978,
    students: 1800,
    isFeatured: true,
    isVerified: true,
    facilities: ["Music Room", "Dance Studio", "Science Lab", "Library", "Art Room"],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    description: "A century-old institution known for academic excellence and character development.",
    principal: "Sister Margaret",
    grades: "Nursery – XII",
    affiliation: "CISCE New Delhi",
  },
  {
    id: "4",
    name: "The Shriram School",
    slug: "shriram-school-gurgaon",
    location: "DLF Phase 2, Gurgaon",
    city: "Gurgaon",
    board: "CBSE",
    rating: 4.7,
    reviewCount: 289,
    fees: "₹1,50,000/yr",
    feeAmount: 150000,
    type: "Private",
    established: 1988,
    students: 1500,
    isFeatured: false,
    isVerified: true,
    facilities: ["Innovation Lab", "Pool", "Tennis Court", "Robotics Lab", "Theatre"],
    image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80",
    description: "Premium education with focus on holistic development, arts, and innovation.",
    principal: "Mrs. Priya Malhotra",
    grades: "Pre-Primary – XII",
    affiliation: "CBSE",
  },
  {
    id: "5",
    name: "Bal Bharati Public School",
    slug: "bal-bharati-ganga-ram",
    location: "Pitampura, Delhi",
    city: "Delhi",
    board: "CBSE",
    rating: 4.5,
    reviewCount: 195,
    fees: "₹55,000/yr",
    feeAmount: 55000,
    type: "Private",
    established: 1958,
    students: 4200,
    isFeatured: false,
    isVerified: true,
    facilities: ["Sports Ground", "Library", "Lab", "Computer Room", "Canteen"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    description: "Affordable quality education with strong academic and sports tradition.",
    principal: "Mr. Deepak Verma",
    grades: "Nursery – XII",
    affiliation: "CBSE",
  },
  {
    id: "6",
    name: "GD Goenka World School",
    slug: "gd-goenka-world-school",
    location: "Sohna Road, Gurgaon",
    city: "Gurgaon",
    board: "IB/IGCSE",
    rating: 4.8,
    reviewCount: 176,
    fees: "₹3,50,000/yr",
    feeAmount: 350000,
    type: "Private",
    established: 2004,
    students: 1200,
    isFeatured: true,
    isVerified: true,
    facilities: ["IB Centre", "Olympic Pool", "Golf Course", "Recording Studio", "Farm"],
    image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&q=80",
    description: "International curriculum school preparing students for global universities.",
    principal: "Dr. Anita Khanna",
    grades: "KG – XII",
    affiliation: "IB Organization / Cambridge",
  },
  {
    id: "7",
    name: "Kendriya Vidyalaya No. 1",
    slug: "kendriya-vidyalaya-ghaziabad",
    location: "Vasundhara, Ghaziabad",
    city: "Ghaziabad",
    board: "CBSE",
    rating: 4.4,
    reviewCount: 328,
    fees: "₹12,000/yr",
    feeAmount: 12000,
    type: "Government",
    established: 1965,
    students: 5600,
    isFeatured: false,
    isVerified: true,
    facilities: ["Playground", "Library", "Computer Lab", "Science Lab"],
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80",
    description: "Government school with excellent academic standards and nationwide recognition.",
    principal: "Mr. B.K. Singh",
    grades: "Class I – XII",
    affiliation: "CBSE",
  },
  {
    id: "8",
    name: "Amity International School",
    slug: "amity-international-noida",
    location: "Sector 44, Noida",
    city: "Noida",
    board: "CBSE",
    rating: 4.6,
    reviewCount: 241,
    fees: "₹1,10,000/yr",
    feeAmount: 110000,
    type: "Private",
    established: 1995,
    students: 3800,
    isFeatured: false,
    isVerified: true,
    facilities: ["Swimming Pool", "STEM Lab", "Auditorium", "Smart Boards", "Cafeteria"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    description: "Committed to excellence in education with a focus on innovation and character.",
    principal: "Dr. Ritu Bhatt",
    grades: "Nursery – XII",
    affiliation: "CBSE",
  },
];

export const TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Priya Sharma",
    subjects: ["Mathematics", "Physics"],
    experience: 8,
    rating: 4.9,
    reviewCount: 124,
    hourlyRate: 800,
    location: "Noida",
    mode: ["Online", "Home Tuition"],
    bio: "IIT Delhi alumna with 8+ years experience preparing students for JEE and Board exams.",
    qualifications: "B.Tech (IIT Delhi), M.Tech (IIT Bombay)",
    languages: ["Hindi", "English"],
    successRate: 96,
    studentsCount: 280,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    subjects: ["Chemistry", "Biology"],
    experience: 12,
    rating: 4.8,
    reviewCount: 98,
    hourlyRate: 700,
    location: "Delhi",
    mode: ["Online", "Centre"],
    bio: "NEET specialist with 12 years of experience. 95%+ students crack NEET in first attempt.",
    qualifications: "M.Sc Chemistry (DU), B.Ed",
    languages: ["Hindi", "English"],
    successRate: 95,
    studentsCount: 420,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "3",
    name: "Ananya Singh",
    subjects: ["English", "History"],
    experience: 6,
    rating: 4.7,
    reviewCount: 76,
    hourlyRate: 600,
    location: "Gurgaon",
    mode: ["Online", "Home Tuition"],
    bio: "Former school teacher with expertise in English literature and creative writing.",
    qualifications: "MA English (JNU), B.Ed (DU)",
    languages: ["Hindi", "English"],
    successRate: 92,
    studentsCount: 165,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "4",
    name: "Vikram Mehta",
    subjects: ["Mathematics", "Computer Science"],
    experience: 10,
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 900,
    location: "Noida",
    mode: ["Online"],
    bio: "Google engineer turned educator. Specializes in competitive programming and board math.",
    qualifications: "B.Tech CS (BITS Pilani)",
    languages: ["Hindi", "English"],
    successRate: 98,
    studentsCount: 340,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: "5",
    name: "Meena Gupta",
    subjects: ["Science", "Mathematics"],
    experience: 5,
    rating: 4.6,
    reviewCount: 62,
    hourlyRate: 500,
    location: "Ghaziabad",
    mode: ["Home Tuition", "Centre"],
    bio: "Passionate educator helping students from Class 6-10 excel in core STEM subjects.",
    qualifications: "M.Sc Physics (AKTU), B.Ed",
    languages: ["Hindi"],
    successRate: 90,
    studentsCount: 120,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "6",
    name: "Arjun Nair",
    subjects: ["Economics", "Business Studies"],
    experience: 9,
    rating: 4.8,
    reviewCount: 88,
    hourlyRate: 750,
    location: "Delhi",
    mode: ["Online", "Centre"],
    bio: "CA and MBA graduate with deep expertise in Class 11-12 commerce subjects.",
    qualifications: "CA, MBA Finance (MDI Gurgaon)",
    languages: ["Hindi", "English", "Malayalam"],
    successRate: 94,
    studentsCount: 290,
    avatar: "https://randomuser.me/api/portraits/men/56.jpg",
  },
];

export const EVENTS: Event[] = [
  {
    id: "1",
    title: "Inter-School Sports Meet 2026",
    school: "Delhi Public School, Loni",
    schoolId: "1",
    date: "May 25, 2026",
    time: "9:00 AM",
    location: "DPS Sports Complex, Loni",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    description: "Annual inter-school athletics competition with 20+ schools participating. Events include 100m sprint, relay, football, cricket, and basketball tournaments.",
    isFeatured: true,
    registrationLink: "https://myschool.in/events/1",
    seats: 500,
    seatsLeft: 127,
  },
  {
    id: "2",
    title: "Open Day: Ryan International School",
    school: "Ryan International School",
    schoolId: "2",
    date: "June 5, 2026",
    time: "10:00 AM",
    location: "Ryan International, Noida",
    category: "Admission",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    description: "Visit the campus, meet our faculty, and learn about our admission process for 2026-27. Interactive sessions with the principal and department heads.",
    isFeatured: true,
    registrationLink: "https://myschool.in/events/2",
    seats: 200,
    seatsLeft: 48,
  },
  {
    id: "3",
    title: "Annual Science Exhibition",
    school: "St. Mary's Convent",
    schoolId: "3",
    date: "June 12, 2026",
    time: "11:00 AM",
    location: "St. Mary's Auditorium, Delhi",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    description: "Showcasing innovative student science projects across robotics, environmental science, and space technology.",
    isFeatured: false,
    registrationLink: "https://myschool.in/events/3",
    seats: 300,
    seatsLeft: 89,
  },
  {
    id: "4",
    title: "National Art & Culture Festival",
    school: "GD Goenka World School",
    schoolId: "6",
    date: "June 20, 2026",
    time: "2:00 PM",
    location: "GD Goenka Campus, Gurgaon",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    description: "A celebration of Indian culture through music, dance, drama, and visual arts by students from 30+ schools.",
    isFeatured: false,
    registrationLink: "https://myschool.in/events/4",
    seats: 800,
    seatsLeft: 312,
  },
  {
    id: "5",
    title: "Parent-Teacher Orientation: CBSE Curriculum",
    school: "Amity International School",
    schoolId: "8",
    date: "July 3, 2026",
    time: "9:30 AM",
    location: "Amity Campus, Noida",
    category: "Admission",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    description: "Understanding the CBSE curriculum framework, assessment patterns, and how to support your child at home.",
    isFeatured: false,
    registrationLink: "https://myschool.in/events/5",
    seats: 150,
    seatsLeft: 22,
  },
];

export const JOBS: Job[] = [
  {
    id: "1",
    title: "PGT Mathematics Teacher",
    school: "Delhi Public School, Loni",
    location: "Loni, Ghaziabad",
    salary: "₹40,000–₹55,000/mo",
    type: "Full-time",
    subject: "Mathematics",
    experience: "3+ years",
    postedDays: 2,
  },
  {
    id: "2",
    title: "TGT English Teacher",
    school: "Ryan International School",
    location: "Noida",
    salary: "₹30,000–₹45,000/mo",
    type: "Full-time",
    subject: "English",
    experience: "2+ years",
    postedDays: 5,
  },
  {
    id: "3",
    title: "Vice Principal",
    school: "GD Goenka World School",
    location: "Gurgaon",
    salary: "₹80,000–₹1,20,000/mo",
    type: "Full-time",
    subject: "Administration",
    experience: "10+ years",
    postedDays: 1,
  },
];

export const STATS = {
  schools: 500,
  tuitions: 300,
  parents: 12000,
  rating: 4.8,
};

export const CATEGORIES = [
  { id: "schools", label: "Schools", icon: "school-outline", color: "#2563EB" },
  { id: "tutors", label: "Tutors", icon: "person-outline", color: "#7C3AED" },
  { id: "events", label: "Events", icon: "calendar-outline", color: "#F59E0B" },
  { id: "jobs", label: "Jobs", icon: "briefcase-outline", color: "#10B981" },
  { id: "news", label: "News", icon: "newspaper-outline", color: "#EF4444" },
  { id: "compare", label: "Compare", icon: "git-compare-outline", color: "#F97316" },
];
