export interface School {
  id: string;
  slug: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  fees: string;
  board: string;
  description: string;
  banner: string;
  about: string;
  facilities: string[];
  gallery: string[];
  achievements: string[];
  is_verified?: boolean;
}

export interface Review {
  id: string;
  schoolId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Job {
  id: string;
  schoolId: string;
  schoolName: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  description: string;
  postedDate: string;
}

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  hourlyRate: string;
  experience: string;
  avatar: string;
  bio: string;
  location: string;
}

export interface SchoolEvent {
  id: string;
  schoolId: string;
  schoolName: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

const bannerImages = [
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "https://images.unsplash.com/photo-1592066575517-58df903152f2?w=800&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
];

export const schools: School[] = [
  {
    id: "1", slug: "greenfield-academy", name: "Greenfield Academy",
    location: "Mumbai, Maharashtra", lat: 19.076, lng: 72.8777,
    rating: 4.7, reviewCount: 234, fees: "₹1,20,000/yr", board: "CBSE",
    description: "A leading CBSE school known for academic excellence and holistic development.",
    banner: bannerImages[0],
    about: "Greenfield Academy was established in 1995 and has since been a beacon of educational excellence. With state-of-the-art infrastructure, experienced faculty, and a student-centric approach, we nurture future leaders.",
    facilities: ["Smart Classrooms", "Olympic Swimming Pool", "Science Labs", "Library", "Sports Complex", "Auditorium", "Computer Lab", "Art Studio"],
    gallery: [bannerImages[0], bannerImages[1], bannerImages[2], bannerImages[3]],
    achievements: ["100% pass rate in Board Exams 2024", "National Science Olympiad Winners", "Best School Award 2023 - Education Today", "15 students selected for IIT JEE 2024"],
  },
  {
    id: "2", slug: "sunrise-international", name: "Sunrise International School",
    location: "Delhi, NCR", lat: 28.6139, lng: 77.209,
    rating: 4.5, reviewCount: 189, fees: "₹2,50,000/yr", board: "IB",
    description: "International Baccalaureate school with a global curriculum and multicultural environment.",
    banner: bannerImages[1],
    about: "Sunrise International School offers the IB curriculum with a focus on creating globally-minded citizens. Our diverse student body represents over 30 nationalities.",
    facilities: ["IB Resource Center", "Language Lab", "Robotics Lab", "Indoor Sports", "Music Room", "Dance Studio", "Cafeteria", "Medical Room"],
    gallery: [bannerImages[1], bannerImages[2], bannerImages[3], bannerImages[4]],
    achievements: ["Average IB Score: 38/45", "Model UN Best Delegation Award", "Global Citizen Award 2024", "12 students placed in Ivy League"],
  },
  {
    id: "3", slug: "heritage-public-school", name: "Heritage Public School",
    location: "Bangalore, Karnataka", lat: 12.9716, lng: 77.5946,
    rating: 4.8, reviewCount: 312, fees: "₹95,000/yr", board: "ICSE",
    description: "One of Bangalore's most prestigious ICSE schools with a legacy of 40+ years.",
    banner: bannerImages[2],
    about: "Heritage Public School has been nurturing young minds since 1980. Our commitment to academic rigor combined with extracurricular excellence makes us a top choice for parents.",
    facilities: ["STEM Lab", "Observatory", "Tennis Courts", "Basketball Courts", "Swimming Pool", "Theatre", "Greenhouse", "Coding Lab"],
    gallery: [bannerImages[2], bannerImages[3], bannerImages[4], bannerImages[5]],
    achievements: ["Best ICSE School in Karnataka 2024", "State-level Sports Champions", "National Coding Championship Winners", "Published 3 student research papers"],
  },
  {
    id: "4", slug: "lotus-valley-school", name: "Lotus Valley School",
    location: "Hyderabad, Telangana", lat: 17.385, lng: 78.4867,
    rating: 4.3, reviewCount: 156, fees: "₹85,000/yr", board: "CBSE",
    description: "A progressive CBSE school focused on experiential learning and technology integration.",
    banner: bannerImages[3],
    about: "Lotus Valley School believes in learning by doing. Our innovative pedagogy and tech-integrated classrooms prepare students for the challenges of tomorrow.",
    facilities: ["AI Lab", "Maker Space", "Sports Arena", "Digital Library", "Meditation Room", "Innovation Hub", "Recording Studio", "3D Printing Lab"],
    gallery: [bannerImages[3], bannerImages[4], bannerImages[5], bannerImages[0]],
    achievements: ["Ed-Tech Innovation Award 2024", "National Robotics Competition Finalists", "Best Digital School Award", "Student startup incubated"],
  },
  {
    id: "5", slug: "oak-ridge-school", name: "Oak Ridge International",
    location: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567,
    rating: 4.6, reviewCount: 198, fees: "₹1,80,000/yr", board: "Cambridge",
    description: "Cambridge-affiliated school providing world-class education with Indian values.",
    banner: bannerImages[4],
    about: "Oak Ridge International combines the Cambridge curriculum with Indian cultural values, creating well-rounded individuals ready for global opportunities.",
    facilities: ["Cambridge Resource Center", "Amphitheatre", "Cricket Ground", "Squash Courts", "Pottery Studio", "Planetarium", "Language Center", "Debate Hall"],
    gallery: [bannerImages[4], bannerImages[5], bannerImages[0], bannerImages[1]],
    achievements: ["Cambridge Learner Awards 2024", "Inter-school Debate Champions", "Environmental Sustainability Award", "5 students in Cambridge Top Achievers"],
  },
  {
    id: "6", slug: "new-era-school", name: "New Era Public School",
    location: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707,
    rating: 4.4, reviewCount: 167, fees: "₹70,000/yr", board: "State Board",
    description: "Affordable quality education with a strong emphasis on arts and culture.",
    banner: bannerImages[5],
    about: "New Era Public School has been providing quality education at affordable fees for over 25 years. We believe every child deserves access to excellent education.",
    facilities: ["Art Gallery", "Music Room", "Dance Hall", "Science Park", "Reading Room", "Playground", "Computer Lab", "Cultural Center"],
    gallery: [bannerImages[5], bannerImages[0], bannerImages[1], bannerImages[2]],
    achievements: ["State Topper in Board Exams", "Cultural Festival Best School Award", "100% placement record", "Community Service Excellence Award"],
  },
];

export const reviews: Review[] = [
  { id: "1", schoolId: "1", author: "Priya Sharma", rating: 5, comment: "Excellent school! My child has thrived here. The teachers are incredibly dedicated and the facilities are world-class.", date: "2024-11-15" },
  { id: "2", schoolId: "1", author: "Rahul Verma", rating: 4, comment: "Good academic standards. The sports facilities could be improved but overall a great school.", date: "2024-10-20" },
  { id: "3", schoolId: "1", author: "Anjali Patel", rating: 5, comment: "The best decision we made for our children's education. Highly recommend!", date: "2024-09-05" },
  { id: "4", schoolId: "2", author: "David Chen", rating: 5, comment: "The IB curriculum is challenging but rewarding. Great international exposure.", date: "2024-11-01" },
  { id: "5", schoolId: "2", author: "Meera Nair", rating: 4, comment: "Wonderful multicultural environment. My kids love going to school every day.", date: "2024-10-15" },
  { id: "6", schoolId: "3", author: "Suresh Kumar", rating: 5, comment: "Heritage has maintained its legacy of excellence. Top-notch faculty and infrastructure.", date: "2024-11-10" },
];

export const jobs: Job[] = [
  { id: "1", schoolId: "1", schoolName: "Greenfield Academy", title: "Mathematics Teacher (Senior)", type: "Full-time", location: "Mumbai", salary: "₹6-8 LPA", description: "Experienced math teacher for classes 9-12. Must have M.Sc. in Mathematics and B.Ed.", postedDate: "2024-11-20" },
  { id: "2", schoolId: "2", schoolName: "Sunrise International", title: "IB Biology Teacher", type: "Full-time", location: "Delhi", salary: "₹8-12 LPA", description: "IB-trained biology teacher with minimum 5 years experience in IB curriculum.", postedDate: "2024-11-18" },
  { id: "3", schoolId: "3", schoolName: "Heritage Public School", title: "Physical Education Coach", type: "Full-time", location: "Bangalore", salary: "₹4-6 LPA", description: "Sports coach with expertise in cricket and athletics. NIS certification preferred.", postedDate: "2024-11-15" },
  { id: "4", schoolId: "1", schoolName: "Greenfield Academy", title: "School Counselor", type: "Part-time", location: "Mumbai", salary: "₹3-4 LPA", description: "Licensed counselor for student mental health and well-being programs.", postedDate: "2024-11-12" },
  { id: "5", schoolId: "4", schoolName: "Lotus Valley School", title: "AI & Robotics Instructor", type: "Full-time", location: "Hyderabad", salary: "₹7-10 LPA", description: "Teach AI fundamentals and robotics to students. Engineering degree required.", postedDate: "2024-11-10" },
  { id: "6", schoolId: "5", schoolName: "Oak Ridge International", title: "English Literature Teacher", type: "Full-time", location: "Pune", salary: "₹5-7 LPA", description: "Cambridge-trained English teacher. Experience with IGCSE curriculum preferred.", postedDate: "2024-11-08" },
];

export const tutors: Tutor[] = [
  { id: "1", name: "Dr. Ananya Reddy", subject: "Physics", rating: 4.9, hourlyRate: "₹800/hr", experience: "12 years", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", bio: "Ph.D. in Physics from IIT Bombay. Specializes in JEE/NEET preparation.", location: "Mumbai" },
  { id: "2", name: "Vikram Malhotra", subject: "Mathematics", rating: 4.8, hourlyRate: "₹1,000/hr", experience: "15 years", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", bio: "Ex-IITian. Has coached over 500 students for competitive exams.", location: "Delhi" },
  { id: "3", name: "Sneha Iyer", subject: "English", rating: 4.7, hourlyRate: "₹600/hr", experience: "8 years", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", bio: "Cambridge-certified English trainer. Expert in IELTS and creative writing.", location: "Bangalore" },
  { id: "4", name: "Rajesh Gupta", subject: "Chemistry", rating: 4.6, hourlyRate: "₹750/hr", experience: "10 years", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", bio: "M.Sc. Chemistry from Delhi University. Specializes in organic chemistry.", location: "Delhi" },
  { id: "5", name: "Kavitha Menon", subject: "Biology", rating: 4.9, hourlyRate: "₹900/hr", experience: "14 years", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", bio: "MBBS doctor turned educator. Expert in NEET Biology preparation.", location: "Chennai" },
  { id: "6", name: "Amit Joshi", subject: "Computer Science", rating: 4.8, hourlyRate: "₹1,200/hr", experience: "9 years", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", bio: "Software engineer from Google. Teaches DSA and competitive programming.", location: "Pune" },
];

export const events: SchoolEvent[] = [
  { id: "1", schoolId: "1", schoolName: "Greenfield Academy", title: "Annual Science Fair 2024", date: "2024-12-15", location: "Main Campus Auditorium", description: "Showcase of innovative student projects. Open to public.", image: bannerImages[0] },
  { id: "2", schoolId: "2", schoolName: "Sunrise International", title: "Model United Nations", date: "2024-12-20", location: "Conference Hall", description: "Inter-school MUN conference with delegates from 20+ schools.", image: bannerImages[1] },
  { id: "3", schoolId: "3", schoolName: "Heritage Public School", title: "Sports Day Celebration", date: "2025-01-10", location: "School Grounds", description: "Annual sports day with athletics, team sports, and awards ceremony.", image: bannerImages[2] },
  { id: "4", schoolId: "4", schoolName: "Lotus Valley School", title: "Tech Fest 2025", date: "2025-01-25", location: "Innovation Hub", description: "Robotics competitions, hackathons, and tech exhibitions.", image: bannerImages[3] },
  { id: "5", schoolId: "5", schoolName: "Oak Ridge International", title: "Cultural Night", date: "2025-02-05", location: "Amphitheatre", description: "Annual cultural extravaganza featuring music, dance, and drama.", image: bannerImages[4] },
];

export const news: NewsItem[] = [
  { id: "1", title: "New Education Policy 2024: What Parents Need to Know", excerpt: "The revised NEP brings significant changes to school education. Here's a comprehensive breakdown of what's changing.", date: "2024-11-20", author: "Education Desk", image: bannerImages[0], category: "Policy" },
  { id: "2", title: "Top 10 Schools in India: 2024 Rankings", excerpt: "Annual school rankings are out. See which schools made it to the top and what sets them apart.", date: "2024-11-18", author: "MySchool Team", image: bannerImages[1], category: "Rankings" },
  { id: "3", title: "The Rise of AI in Indian Classrooms", excerpt: "How schools across India are integrating artificial intelligence into their teaching methodologies.", date: "2024-11-15", author: "Tech Desk", image: bannerImages[2], category: "Technology" },
  { id: "4", title: "Board Exam Preparation Tips from Toppers", excerpt: "Insights and study strategies from students who scored above 99% in board examinations.", date: "2024-11-12", author: "Student Corner", image: bannerImages[3], category: "Academics" },
  { id: "5", title: "Mental Health in Schools: A Growing Priority", excerpt: "Schools are increasingly focusing on student mental health. Here's how they're making a difference.", date: "2024-11-10", author: "Wellness Desk", image: bannerImages[4], category: "Wellness" },
];
