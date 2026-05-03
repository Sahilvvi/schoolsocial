// Comprehensive dummy data for all pages, dashboards, and panels
// This data is used as fallback when Supabase returns empty results

const now = new Date().toISOString();
const today = new Date().toISOString().split("T")[0];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

// ─── Demo credentials & user IDs ───
export const DEMO_USERS = {
  admin: { email: "admin@myschool.demo", password: "Demo@1234", role: "admin", id: "demo-admin-001", name: "Admin User" },
  school: { email: "school@myschool.demo", password: "Demo@1234", role: "school", id: "demo-school-001", name: "School Manager" },
  parent: { email: "parent@myschool.demo", password: "Demo@1234", role: "parent", id: "demo-parent-001", name: "Rajesh Kumar" },
  teacher: { email: "teacher@myschool.demo", password: "Demo@1234", role: "teacher", id: "demo-teacher-001", name: "Priya Sharma" },
  tuition: { email: "tuition@myschool.demo", password: "Demo@1234", role: "tuition_center", id: "demo-tuition-001", name: "Tuition Center Admin" },
} as const;

export function isDemoEmail(email: string): boolean {
  return Object.values(DEMO_USERS).some((u) => u.email === email);
}

export function getDemoUser(email: string) {
  return Object.values(DEMO_USERS).find((u) => u.email === email) ?? null;
}

// ─── Schools ───
export const DUMMY_SCHOOLS = [
  {
    id: "school-001", name: "Delhi Public School", slug: "delhi-public-school", location: "Mathura Road, New Delhi",
    board: "CBSE", fees: "₹1,20,000/year", description: "One of India's most prestigious school chains with a legacy of academic excellence.",
    about: "Delhi Public School was established in 1949 and has been a beacon of quality education for over 7 decades. We offer holistic development through academics, sports, arts, and community service.",
    banner: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    lat: 28.5815, lng: 77.2507, rating: 4.7, review_count: 156, is_featured: true, is_verified: true,
    facilities: ["Smart Classrooms", "Olympic Pool", "Science Labs", "Library", "Auditorium", "Sports Complex", "Computer Lab", "Music Room"],
    gallery: ["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400", "https://images.unsplash.com/photo-1562774053-701939374585?w=400", "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400"],
    achievements: ["Best CBSE School 2024", "100% Board Results", "National Science Olympiad Winners"],
    class_fees: {}, created_at: daysAgo(365), updated_at: now,
  },
  {
    id: "school-002", name: "Modern School", slug: "modern-school", location: "Barakhamba Road, New Delhi",
    board: "CBSE", fees: "₹1,50,000/year", description: "A premier co-educational school known for its progressive teaching methods.",
    about: "Modern School was founded in 1920 and is one of the oldest schools in Delhi. We focus on nurturing creativity, critical thinking, and leadership qualities in our students.",
    banner: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    lat: 28.6292, lng: 77.2282, rating: 4.5, review_count: 132, is_featured: true, is_verified: true,
    facilities: ["Science Labs", "Art Studio", "Sports Ground", "Library", "Cafeteria", "Dance Room", "Robotics Lab"],
    gallery: ["https://images.unsplash.com/photo-1562774053-701939374585?w=400", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400"],
    achievements: ["ICSE Top 10 School", "National Debate Champions", "Green School Award"],
    class_fees: {}, created_at: daysAgo(300), updated_at: now,
  },
  {
    id: "school-003", name: "Springdales School", slug: "springdales-school", location: "Pusa Road, New Delhi",
    board: "CBSE", fees: "₹95,000/year", description: "Committed to providing quality education with a focus on values and culture.",
    about: "Springdales School believes in the holistic development of a child. Our curriculum integrates academic excellence with cultural enrichment and moral values.",
    banner: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",
    lat: 28.6417, lng: 77.1849, rating: 4.3, review_count: 89, is_featured: false, is_verified: true,
    facilities: ["Computer Lab", "Playground", "Library", "Science Lab", "Music Room"],
    gallery: ["https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400"],
    achievements: ["Best Value School 2024", "State Level Sports Champions"],
    class_fees: {}, created_at: daysAgo(250), updated_at: now,
  },
  {
    id: "school-004", name: "Ryan International School", slug: "ryan-international", location: "Sector 40, Noida",
    board: "ICSE", fees: "₹1,10,000/year", description: "Part of a global school chain known for its international curriculum and facilities.",
    about: "Ryan International School is part of the Ryan Group of Institutions, one of the largest school chains in India. We provide world-class education with a global perspective.",
    banner: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    lat: 28.5708, lng: 77.3527, rating: 4.2, review_count: 97, is_featured: true, is_verified: true,
    facilities: ["Swimming Pool", "Basketball Court", "Smart Classrooms", "Library", "Science Labs", "Auditorium"],
    gallery: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400"],
    achievements: ["International School Award", "Best Sports Infrastructure"],
    class_fees: {}, created_at: daysAgo(200), updated_at: now,
  },
  {
    id: "school-005", name: "The Heritage School", slug: "heritage-school", location: "Sector 62, Gurgaon",
    board: "CBSE", fees: "₹2,00,000/year", description: "Premium school with state-of-the-art infrastructure and innovative teaching.",
    about: "The Heritage School is a leading educational institution that combines academic rigor with creative expression. Our campus features cutting-edge facilities and a nurturing environment.",
    banner: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    lat: 28.4595, lng: 77.0266, rating: 4.6, review_count: 78, is_featured: true, is_verified: true,
    facilities: ["AI Lab", "Makerspace", "Organic Garden", "Theatre", "Indoor Pool", "Library", "Sports Complex"],
    gallery: ["https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400"],
    achievements: ["Innovation Award 2024", "Best Green Campus"],
    class_fees: {}, created_at: daysAgo(180), updated_at: now,
  },
  {
    id: "school-006", name: "Amity International School", slug: "amity-international", location: "Sector 44, Noida",
    board: "CBSE", fees: "₹1,35,000/year", description: "An Amity universe school providing holistic education with global exposure.",
    about: "Amity International School is backed by the Amity Education Group and provides a well-rounded education that prepares students for global challenges.",
    banner: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    lat: 28.5569, lng: 77.3420, rating: 4.4, review_count: 112, is_featured: false, is_verified: true,
    facilities: ["Robotics Lab", "Language Lab", "Gymnasium", "Library", "Smart Classrooms"],
    gallery: [], achievements: ["Best Emerging School 2023"],
    class_fees: {}, created_at: daysAgo(150), updated_at: now,
  },
  {
    id: "school-007", name: "Lotus Valley International", slug: "lotus-valley", location: "Sector 126, Noida",
    board: "CBSE", fees: "₹1,75,000/year", description: "A school that nurtures innovation, creativity, and critical thinking.",
    about: "Lotus Valley International School emphasizes experiential learning and provides students with opportunities to explore, innovate, and lead.",
    banner: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    lat: 28.5362, lng: 77.3900, rating: 4.5, review_count: 65, is_featured: false, is_verified: true,
    facilities: ["STEM Lab", "Observatory", "Indoor Sports Arena", "Library", "Cafeteria"],
    gallery: [], achievements: ["STEM Excellence Award"],
    class_fees: {}, created_at: daysAgo(120), updated_at: now,
  },
  {
    id: "school-008", name: "Sanskriti School", slug: "sanskriti-school", location: "Chanakyapuri, New Delhi",
    board: "CBSE", fees: "₹80,000/year", description: "Known for value-based education and cultural awareness programs.",
    about: "Sanskriti School integrates traditional Indian values with modern education, producing well-rounded individuals who are rooted in their culture while being globally competitive.",
    banner: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",
    lat: 28.5961, lng: 77.1774, rating: 4.1, review_count: 54, is_featured: false, is_verified: true,
    facilities: ["Library", "Computer Lab", "Playground", "Art Room"],
    gallery: [], achievements: ["Cultural Excellence Award"],
    class_fees: {}, created_at: daysAgo(100), updated_at: now,
  },
];

// ─── Events ───
export const DUMMY_EVENTS = [
  {
    id: "event-001", title: "Annual Science Fair 2025", description: "Showcase of innovative student projects in physics, chemistry, biology, and technology. Students from classes 6-12 will present their science experiments and models.",
    event_date: daysFromNow(15), location: "Delhi Public School Campus", school_id: "school-001", school_name: "Delhi Public School",
    image: "https://images.unsplash.com/photo-1564429238961-bf8e8a1e4c16?w=800&q=80", is_public: true, created_at: daysAgo(5),
  },
  {
    id: "event-002", title: "Inter-School Debate Championship", description: "Annual debate competition featuring top schools from across NCR. Topics include AI Ethics, Climate Change, and Education Reform.",
    event_date: daysFromNow(22), location: "Modern School Auditorium", school_id: "school-002", school_name: "Modern School",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80", is_public: true, created_at: daysAgo(3),
  },
  {
    id: "event-003", title: "Sports Day 2025", description: "Annual athletics meet featuring track & field events, team sports, and fun activities for all grades.",
    event_date: daysFromNow(30), location: "Springdales School Grounds", school_id: "school-003", school_name: "Springdales School",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba24e916?w=800&q=80", is_public: true, created_at: daysAgo(7),
  },
  {
    id: "event-004", title: "Cultural Festival - Rang Tarang", description: "A celebration of art, music, dance, and drama. Students perform classical and contemporary pieces.",
    event_date: daysFromNow(45), location: "Ryan International Auditorium", school_id: "school-004", school_name: "Ryan International School",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80", is_public: true, created_at: daysAgo(2),
  },
  {
    id: "event-005", title: "STEM Innovation Workshop", description: "Hands-on workshop on robotics, coding, and AI for students interested in technology and engineering.",
    event_date: daysFromNow(10), location: "The Heritage School STEM Lab", school_id: "school-005", school_name: "The Heritage School",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80", is_public: true, created_at: daysAgo(1),
  },
  {
    id: "event-006", title: "Parent-Teacher Conference", description: "Quarterly parent-teacher meeting to discuss student progress, upcoming curriculum changes, and school initiatives.",
    event_date: daysFromNow(7), location: "Amity International School Hall", school_id: "school-006", school_name: "Amity International School",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80", is_public: false, created_at: daysAgo(4),
  },
  {
    id: "event-007", title: "Book Fair & Literary Fest", description: "Annual book fair with author interactions, poetry recitations, creative writing contests, and storytelling sessions.",
    event_date: daysFromNow(20), location: "Delhi Public School Library", school_id: "school-001", school_name: "Delhi Public School",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80", is_public: true, created_at: daysAgo(6),
  },
  {
    id: "event-008", title: "Coding Hackathon 2025", description: "24-hour coding challenge for high school students. Build innovative solutions for real-world problems.",
    event_date: daysFromNow(35), location: "Lotus Valley Innovation Hub", school_id: "school-007", school_name: "Lotus Valley International",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", is_public: true, created_at: daysAgo(8),
  },
];

// ─── Jobs ───
export const DUMMY_JOBS = [
  {
    id: "job-001", title: "PGT Mathematics Teacher", school_name: "Delhi Public School", school_id: "school-001",
    location: "New Delhi", type: "Full-time", salary: "₹45,000 - ₹65,000/month", posted_date: daysAgo(3).split("T")[0],
    description: "We are looking for an experienced Mathematics teacher for classes 11-12. Must have M.Sc Mathematics with B.Ed and 3+ years of teaching experience.", created_at: daysAgo(3),
  },
  {
    id: "job-002", title: "TGT English Teacher", school_name: "Modern School", school_id: "school-002",
    location: "New Delhi", type: "Full-time", salary: "₹35,000 - ₹50,000/month", posted_date: daysAgo(5).split("T")[0],
    description: "Seeking a creative English teacher for middle school. Must have excellent communication skills and experience with CBSE curriculum.", created_at: daysAgo(5),
  },
  {
    id: "job-003", title: "Computer Science Instructor", school_name: "The Heritage School", school_id: "school-005",
    location: "Gurgaon", type: "Full-time", salary: "₹50,000 - ₹75,000/month", posted_date: daysAgo(1).split("T")[0],
    description: "Looking for a tech-savvy CS instructor to teach Python, Java, and Web Development to senior students. Experience with STEM education preferred.", created_at: daysAgo(1),
  },
  {
    id: "job-004", title: "Physical Education Teacher", school_name: "Ryan International School", school_id: "school-004",
    location: "Noida", type: "Full-time", salary: "₹30,000 - ₹45,000/month", posted_date: daysAgo(7).split("T")[0],
    description: "Certified PE teacher needed for all grades. Must have experience in organizing sports events and training students for competitions.", created_at: daysAgo(7),
  },
  {
    id: "job-005", title: "Art & Craft Teacher", school_name: "Springdales School", school_id: "school-003",
    location: "New Delhi", type: "Part-time", salary: "₹20,000 - ₹30,000/month", posted_date: daysAgo(2).split("T")[0],
    description: "Creative art teacher for primary classes. Should be skilled in drawing, painting, origami, and other craft activities.", created_at: daysAgo(2),
  },
  {
    id: "job-006", title: "School Counselor", school_name: "Amity International School", school_id: "school-006",
    location: "Noida", type: "Full-time", salary: "₹40,000 - ₹55,000/month", posted_date: daysAgo(4).split("T")[0],
    description: "Experienced school counselor to provide emotional and academic guidance to students. M.A. Psychology with relevant certification required.", created_at: daysAgo(4),
  },
  {
    id: "job-007", title: "Librarian", school_name: "Sanskriti School", school_id: "school-008",
    location: "New Delhi", type: "Full-time", salary: "₹25,000 - ₹35,000/month", posted_date: daysAgo(10).split("T")[0],
    description: "Qualified librarian to manage school library, organize book fairs, and promote reading culture. B.Lib.Sc required.", created_at: daysAgo(10),
  },
  {
    id: "job-008", title: "Vice Principal", school_name: "Delhi Public School", school_id: "school-001",
    location: "New Delhi", type: "Full-time", salary: "₹80,000 - ₹1,20,000/month", posted_date: daysAgo(6).split("T")[0],
    description: "Senior leadership position requiring 15+ years of experience in education. Must have proven track record of school administration and academic leadership.", created_at: daysAgo(6),
  },
];

// ─── Tutors ───
export const DUMMY_TUTORS = [
  {
    id: "tutor-001", name: "Dr. Anil Verma", subject: "Mathematics", location: "Noida, Uttar Pradesh",
    experience: "15 years", hourly_rate: "₹1,200/hr", rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    bio: "PhD in Mathematics from IIT Delhi. Specializes in competitive exam preparation (IIT-JEE, Olympiad). 500+ students mentored with 95% selection rate.", created_at: daysAgo(100),
  },
  {
    id: "tutor-002", name: "Sneha Kapoor", subject: "Physics", location: "South Delhi, New Delhi",
    experience: "8 years", hourly_rate: "₹800/hr", rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    bio: "M.Sc Physics from JNU. Expert in CBSE and ICSE physics. Uses hands-on experiments to make learning fun. Available for home tuition and online classes.", created_at: daysAgo(80),
  },
  {
    id: "tutor-003", name: "Rahul Mehta", subject: "Chemistry", location: "Gurgaon, Haryana",
    experience: "12 years", hourly_rate: "₹1,000/hr", rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    bio: "Former chemistry faculty at a leading coaching institute. Specializes in organic chemistry and NEET preparation. Interactive teaching methodology.", created_at: daysAgo(60),
  },
  {
    id: "tutor-004", name: "Priya Sharma", subject: "English", location: "Dwarka, New Delhi",
    experience: "10 years", hourly_rate: "₹700/hr", rating: 4.6,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    bio: "MA English Literature from DU. Certified IELTS trainer. Helps students improve communication, creative writing, and exam scores.", created_at: daysAgo(45),
  },
  {
    id: "tutor-005", name: "Vikram Singh", subject: "Computer Science", location: "Noida, Uttar Pradesh",
    experience: "6 years", hourly_rate: "₹900/hr", rating: 4.5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    bio: "B.Tech from NIT + 3 years industry experience at Google. Teaches Python, Java, Data Structures, and Web Development. Great for board exams and competitive coding.", created_at: daysAgo(30),
  },
  {
    id: "tutor-006", name: "Meera Joshi", subject: "Biology", location: "South Delhi, New Delhi",
    experience: "9 years", hourly_rate: "₹850/hr", rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    bio: "MBBS graduate turned educator. Passionate about making biology accessible. Specializes in NEET preparation with a 90% success rate.", created_at: daysAgo(40),
  },
];

// ─── News ───
export const DUMMY_NEWS = [
  {
    id: "news-001", title: "CBSE Announces New Exam Pattern for 2025-26", author: "Education Desk",
    category: "Policy", published_date: daysAgo(1).split("T")[0],
    excerpt: "The Central Board of Secondary Education has announced significant changes to the board exam pattern including competency-based questions and internal assessment reforms.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", created_at: daysAgo(1),
  },
  {
    id: "news-002", title: "Top 10 Schools in Delhi NCR: Rankings 2025", author: "SchoolSocial Team",
    category: "Rankings", published_date: daysAgo(3).split("T")[0],
    excerpt: "Our annual school rankings are out! Discover which schools made the cut based on academics, infrastructure, extracurriculars, and parent satisfaction.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80", created_at: daysAgo(3),
  },
  {
    id: "news-003", title: "How AI is Transforming Education in India", author: "Tech Education",
    category: "Technology", published_date: daysAgo(5).split("T")[0],
    excerpt: "From personalized learning to automated grading, artificial intelligence is reshaping how Indian schools operate. Here's what parents need to know.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80", created_at: daysAgo(5),
  },
  {
    id: "news-004", title: "Summer Camp Registrations Open Across NCR Schools", author: "Events Team",
    category: "Events", published_date: daysAgo(7).split("T")[0],
    excerpt: "Looking for productive summer activities? Top schools in NCR are now accepting registrations for their summer camps featuring robotics, arts, sports, and more.",
    image: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=800&q=80", created_at: daysAgo(7),
  },
  {
    id: "news-005", title: "NEP 2020 Implementation: Progress Report", author: "Policy Desk",
    category: "Policy", published_date: daysAgo(10).split("T")[0],
    excerpt: "Three years into the National Education Policy, here's a comprehensive look at what's changed, what hasn't, and what schools need to prepare for next.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", created_at: daysAgo(10),
  },
  {
    id: "news-006", title: "Parent Guide: Choosing the Right School Board", author: "Admissions Expert",
    category: "Guide", published_date: daysAgo(12).split("T")[0],
    excerpt: "CBSE vs ICSE vs IB vs State Board — confused? This comprehensive guide helps parents understand the differences and choose the best board for their child.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80", created_at: daysAgo(12),
  },
];

// ─── Admissions ───
export const DUMMY_ADMISSIONS = [
  { id: "adm-001", school_id: "school-001", student_name: "Arjun Patel", parent_name: "Vikram Patel", email: "vikram.patel@email.com", phone: "9876543210", grade: "6", status: "approved", created_at: daysAgo(2) },
  { id: "adm-002", school_id: "school-001", student_name: "Aaradhya Singh", parent_name: "Meena Singh", email: "meena.singh@email.com", phone: "9876543211", grade: "3", status: "pending", created_at: daysAgo(1) },
  { id: "adm-003", school_id: "school-001", student_name: "Rohan Gupta", parent_name: "Amit Gupta", email: "amit.gupta@email.com", phone: "9876543212", grade: "9", status: "approved", created_at: daysAgo(5) },
  { id: "adm-004", school_id: "school-001", student_name: "Kavya Reddy", parent_name: "Sunita Reddy", email: "sunita.r@email.com", phone: "9876543213", grade: "1", status: "pending", created_at: daysAgo(3) },
  { id: "adm-005", school_id: "school-001", student_name: "Ishaan Kumar", parent_name: "Rajesh Kumar", email: "rajesh.k@email.com", phone: "9876543214", grade: "11", status: "rejected", created_at: daysAgo(8) },
  { id: "adm-006", school_id: "school-002", student_name: "Ananya Sharma", parent_name: "Deepak Sharma", email: "deepak.s@email.com", phone: "9876543215", grade: "4", status: "approved", created_at: daysAgo(4) },
  { id: "adm-007", school_id: "school-002", student_name: "Dev Malhotra", parent_name: "Neha Malhotra", email: "neha.m@email.com", phone: "9876543216", grade: "7", status: "pending", created_at: daysAgo(2) },
  { id: "adm-008", school_id: "school-003", student_name: "Saanvi Verma", parent_name: "Anil Verma", email: "anil.v@email.com", phone: "9876543217", grade: "5", status: "approved", created_at: daysAgo(6) },
  { id: "adm-009", school_id: "school-004", student_name: "Vivaan Joshi", parent_name: "Priya Joshi", email: "priya.j@email.com", phone: "9876543218", grade: "8", status: "pending", created_at: daysAgo(1) },
  { id: "adm-010", school_id: "school-005", student_name: "Myra Kapoor", parent_name: "Rohit Kapoor", email: "rohit.k@email.com", phone: "9876543219", grade: "2", status: "approved", created_at: daysAgo(9) },
];

// ─── Reviews ───
export const DUMMY_REVIEWS = [
  { id: "rev-001", school_id: "school-001", author: "Vikram Patel", rating: 5, comment: "Excellent school with amazing faculty. My son has shown tremendous improvement in academics and confidence. The facilities are world-class.", status: "approved", user_id: null, created_at: daysAgo(10) },
  { id: "rev-002", school_id: "school-001", author: "Meena Singh", rating: 4, comment: "Very good infrastructure and teaching quality. However, the fee structure could be more transparent. Overall a great experience.", status: "approved", user_id: null, created_at: daysAgo(15) },
  { id: "rev-003", school_id: "school-001", author: "Sunita Reddy", rating: 5, comment: "The best school in Delhi! Teachers are very caring and the extracurricular activities are fantastic.", status: "approved", user_id: null, created_at: daysAgo(20) },
  { id: "rev-004", school_id: "school-002", author: "Deepak Sharma", rating: 4, comment: "Progressive teaching methods and great campus. My daughter loves going to school every day.", status: "approved", user_id: null, created_at: daysAgo(8) },
  { id: "rev-005", school_id: "school-002", author: "Neha Malhotra", rating: 5, comment: "Outstanding school with a perfect balance of academics and extracurriculars. Highly recommended!", status: "approved", user_id: null, created_at: daysAgo(12) },
  { id: "rev-006", school_id: "school-003", author: "Anil Verma", rating: 4, comment: "Good value for money. The cultural programs are exceptional and teachers are very dedicated.", status: "pending", user_id: null, created_at: daysAgo(5) },
  { id: "rev-007", school_id: "school-004", author: "Priya Joshi", rating: 3, comment: "Decent school but could improve on communication with parents. Sports facilities are top-notch.", status: "approved", user_id: null, created_at: daysAgo(25) },
  { id: "rev-008", school_id: "school-005", author: "Rohit Kapoor", rating: 5, comment: "Premium education at its finest. The STEM lab is incredible and kids love the maker space.", status: "approved", user_id: null, created_at: daysAgo(18) },
];

// ─── Job Applications ───
export const DUMMY_JOB_APPLICATIONS = [
  { id: "japp-001", job_id: "job-001", name: "Sanjay Mishra", email: "sanjay.m@email.com", phone: "9900112233", experience: "5 years at Kendriya Vidyalaya", created_at: daysAgo(2) },
  { id: "japp-002", job_id: "job-001", name: "Nandini Rao", email: "nandini.r@email.com", phone: "9900112234", experience: "8 years at DPS RK Puram", created_at: daysAgo(1) },
  { id: "japp-003", job_id: "job-002", name: "Aisha Khan", email: "aisha.k@email.com", phone: "9900112235", experience: "3 years at Cambridge School", created_at: daysAgo(4) },
  { id: "japp-004", job_id: "job-003", name: "Ravi Shankar", email: "ravi.s@email.com", phone: "9900112236", experience: "6 years at Infosys + 2 years teaching", created_at: daysAgo(1) },
  { id: "japp-005", job_id: "job-005", name: "Kavita Nair", email: "kavita.n@email.com", phone: "9900112237", experience: "4 years at Shri Ram School", created_at: daysAgo(2) },
  { id: "japp-006", job_id: "job-006", name: "Dr. Pooja Aggarwal", email: "pooja.a@email.com", phone: "9900112238", experience: "7 years clinical psychology + 3 years school counseling", created_at: daysAgo(3) },
];

// ─── Tutor Bookings ───
export const DUMMY_TUTOR_BOOKINGS = [
  { id: "tbk-001", tutor_id: "tutor-001", name: "Rajesh Kumar", email: "rajesh.k@email.com", message: "Need maths tuition for my son in class 10. Available weekends.", status: "confirmed", created_at: daysAgo(3) },
  { id: "tbk-002", tutor_id: "tutor-002", name: "Meena Singh", email: "meena.s@email.com", message: "Looking for physics coaching for NEET preparation.", status: "pending", created_at: daysAgo(1) },
  { id: "tbk-003", tutor_id: "tutor-003", name: "Amit Gupta", email: "amit.g@email.com", message: "Chemistry tutor needed for class 12 boards.", status: "confirmed", created_at: daysAgo(5) },
  { id: "tbk-004", tutor_id: "tutor-004", name: "Sunita Reddy", email: "sunita.r@email.com", message: "English speaking and writing improvement for my daughter.", status: "pending", created_at: daysAgo(2) },
  { id: "tbk-005", tutor_id: "tutor-005", name: "Vikram Patel", email: "vikram.p@email.com", message: "Python programming classes for my son entering class 11.", status: "confirmed", created_at: daysAgo(4) },
];

// ─── Tuition Enquiries ───
export const DUMMY_TUITION_ENQUIRIES = [
  { id: "tenq-001", parent_name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@email.com", subject: "Mathematics", student_class: "10", area: "Noida Sector 62", budget: "₹5,000-8,000/month", message: "Looking for a good maths tutor for board exam preparation.", status: "new", created_at: daysAgo(1) },
  { id: "tenq-002", parent_name: "Priya Sharma", phone: "9876543211", email: "priya@email.com", subject: "Physics + Chemistry", student_class: "12", area: "South Delhi", budget: "₹10,000-15,000/month", message: "Need coaching for JEE Mains preparation.", status: "contacted", created_at: daysAgo(3) },
  { id: "tenq-003", parent_name: "Amit Verma", phone: "9876543212", email: "amit@email.com", subject: "English", student_class: "5", area: "Dwarka", budget: "₹3,000-5,000/month", message: "My child needs help with English reading and writing.", status: "new", created_at: daysAgo(2) },
  { id: "tenq-004", parent_name: "Neha Joshi", phone: "9876543213", email: "neha@email.com", subject: "Computer Science", student_class: "11", area: "Gurgaon", budget: "₹8,000-12,000/month", message: "Looking for Python and Java programming classes.", status: "converted", created_at: daysAgo(7) },
];

// ─── QR Orders ───
export const DUMMY_QR_ORDERS = [
  { id: "qr-001", school_id: "school-001", order_type: "standard_standee", shipping_address: "Delhi Public School, Mathura Road, New Delhi - 110003", contact_name: "Admin Office", contact_phone: "011-24379000", status: "delivered", tracking_number: "DTDC12345", user_id: null, created_at: daysAgo(30), updated_at: daysAgo(25) },
  { id: "qr-002", school_id: "school-002", order_type: "premium_poster", shipping_address: "Modern School, Barakhamba Road, New Delhi - 110001", contact_name: "Reception Desk", contact_phone: "011-23311066", status: "shipped", tracking_number: "DTDC12346", user_id: null, created_at: daysAgo(10), updated_at: daysAgo(7) },
  { id: "qr-003", school_id: "school-004", order_type: "standard_standee", shipping_address: "Ryan International, Sector 40, Noida - 201303", contact_name: "Office Manager", contact_phone: "0120-4567890", status: "processing", tracking_number: null, user_id: null, created_at: daysAgo(3), updated_at: daysAgo(3) },
  { id: "qr-004", school_id: "school-005", order_type: "premium_poster", shipping_address: "The Heritage School, Sector 62, Gurgaon - 122011", contact_name: "Marketing Head", contact_phone: "0124-4567890", status: "pending", tracking_number: null, user_id: null, created_at: daysAgo(1), updated_at: daysAgo(1) },
];

// ─── Tuition Batches ───
export const DUMMY_BATCHES = [
  { id: "batch-001", tutor_id: "tutor-001", batch_name: "JEE Maths Batch A", subject: "Mathematics", schedule: "Mon, Wed, Fri 4-6 PM", max_students: 15, current_students: 12, fee_per_month: 8000, is_active: true, created_at: daysAgo(60), updated_at: now },
  { id: "batch-002", tutor_id: "tutor-001", batch_name: "Board Maths Class 10", subject: "Mathematics", schedule: "Tue, Thu, Sat 5-7 PM", max_students: 20, current_students: 18, fee_per_month: 5000, is_active: true, created_at: daysAgo(45), updated_at: now },
  { id: "batch-003", tutor_id: "tutor-002", batch_name: "NEET Physics Crash", subject: "Physics", schedule: "Daily 3-5 PM", max_students: 25, current_students: 22, fee_per_month: 10000, is_active: true, created_at: daysAgo(30), updated_at: now },
  { id: "batch-004", tutor_id: "tutor-003", batch_name: "Organic Chemistry", subject: "Chemistry", schedule: "Mon, Wed, Fri 6-8 PM", max_students: 12, current_students: 10, fee_per_month: 7000, is_active: true, created_at: daysAgo(40), updated_at: now },
  { id: "batch-005", tutor_id: "tutor-005", batch_name: "Python Programming", subject: "Computer Science", schedule: "Sat, Sun 10 AM-12 PM", max_students: 10, current_students: 8, fee_per_month: 6000, is_active: true, created_at: daysAgo(20), updated_at: now },
];

// ─── Attendance Records (ERP) ───
export const DUMMY_ATTENDANCE = [
  { id: "att-001", school_id: "school-001", person_name: "Arjun Patel", person_type: "student", attendance_date: today, status: "present", class_name: "6A", remarks: null, created_at: now },
  { id: "att-002", school_id: "school-001", person_name: "Aaradhya Singh", person_type: "student", attendance_date: today, status: "present", class_name: "3B", remarks: null, created_at: now },
  { id: "att-003", school_id: "school-001", person_name: "Rohan Gupta", person_type: "student", attendance_date: today, status: "absent", class_name: "9A", remarks: "Sick leave", created_at: now },
  { id: "att-004", school_id: "school-001", person_name: "Kavya Reddy", person_type: "student", attendance_date: today, status: "present", class_name: "1A", remarks: null, created_at: now },
  { id: "att-005", school_id: "school-001", person_name: "Ishaan Kumar", person_type: "student", attendance_date: today, status: "late", class_name: "11A", remarks: "Came 15 min late", created_at: now },
  { id: "att-006", school_id: "school-001", person_name: "Priya Sharma", person_type: "teacher", attendance_date: today, status: "present", class_name: null, remarks: null, created_at: now },
  { id: "att-007", school_id: "school-001", person_name: "Dr. Anil Verma", person_type: "teacher", attendance_date: today, status: "present", class_name: null, remarks: null, created_at: now },
  { id: "att-008", school_id: "school-001", person_name: "Sneha Kapoor", person_type: "teacher", attendance_date: today, status: "absent", class_name: null, remarks: "Medical leave", created_at: now },
];

// ─── Fee Records (ERP) ───
export const DUMMY_FEE_RECORDS = [
  { id: "fee-001", school_id: "school-001", person_name: "Arjun Patel", person_type: "student", amount: 30000, fee_type: "Tuition Fee", status: "paid", due_date: daysAgo(15).split("T")[0], paid_date: daysAgo(12).split("T")[0], remarks: "Q1 Fee", created_at: daysAgo(15) },
  { id: "fee-002", school_id: "school-001", person_name: "Aaradhya Singh", person_type: "student", amount: 30000, fee_type: "Tuition Fee", status: "paid", due_date: daysAgo(15).split("T")[0], paid_date: daysAgo(10).split("T")[0], remarks: "Q1 Fee", created_at: daysAgo(15) },
  { id: "fee-003", school_id: "school-001", person_name: "Rohan Gupta", person_type: "student", amount: 30000, fee_type: "Tuition Fee", status: "overdue", due_date: daysAgo(15).split("T")[0], paid_date: null, remarks: "Q1 Fee - Reminder sent", created_at: daysAgo(15) },
  { id: "fee-004", school_id: "school-001", person_name: "Kavya Reddy", person_type: "student", amount: 15000, fee_type: "Transport Fee", status: "paid", due_date: daysAgo(20).split("T")[0], paid_date: daysAgo(18).split("T")[0], remarks: "Semester 1", created_at: daysAgo(20) },
  { id: "fee-005", school_id: "school-001", person_name: "Ishaan Kumar", person_type: "student", amount: 30000, fee_type: "Tuition Fee", status: "pending", due_date: daysFromNow(5), paid_date: null, remarks: "Q2 Fee", created_at: daysAgo(2) },
  { id: "fee-006", school_id: "school-001", person_name: "Arjun Patel", person_type: "student", amount: 5000, fee_type: "Lab Fee", status: "paid", due_date: daysAgo(30).split("T")[0], paid_date: daysAgo(28).split("T")[0], remarks: "Annual lab charges", created_at: daysAgo(30) },
];

// ─── Homework Notes (ERP) ───
export const DUMMY_HOMEWORK = [
  { id: "hw-001", school_id: "school-001", title: "Chapter 5 - Linear Equations", description: "Complete exercises 5.1 to 5.4 from NCERT textbook. Show all steps clearly.", subject: "Mathematics", class_name: "9A", doc_type: "homework", file_url: null, created_by: "Priya Sharma", created_at: daysAgo(1) },
  { id: "hw-002", school_id: "school-001", title: "Essay: My Role Model", description: "Write a 500-word essay about your role model. Include specific examples of their qualities that inspire you.", subject: "English", class_name: "6A", doc_type: "homework", file_url: null, created_by: "Sneha Kapoor", created_at: daysAgo(2) },
  { id: "hw-003", school_id: "school-001", title: "Science Lab Report - Photosynthesis", description: "Submit the lab report for the photosynthesis experiment conducted in class. Include observations, data table, and conclusion.", subject: "Science", class_name: "8B", doc_type: "homework", file_url: null, created_by: "Dr. Anil Verma", created_at: daysAgo(3) },
  { id: "hw-004", school_id: "school-001", title: "Class Notes: French Revolution", description: "Comprehensive notes covering the causes, events, and outcomes of the French Revolution.", subject: "History", class_name: "9A", doc_type: "notes", file_url: null, created_by: "Rahul Mehta", created_at: daysAgo(4) },
  { id: "hw-005", school_id: "school-001", title: "Practice Worksheet: Trigonometry", description: "Additional practice problems for trigonometric identities and applications.", subject: "Mathematics", class_name: "11A", doc_type: "worksheet", file_url: null, created_by: "Priya Sharma", created_at: daysAgo(5) },
];

// ─── Notifications ───
export const DUMMY_NOTIFICATIONS = [
  { id: "notif-001", user_id: "demo-parent-001", title: "Admission Approved", message: "Your child Arjun Patel's admission to Class 6A has been approved.", type: "admission", link: "/dashboard", is_read: false, created_at: daysAgo(1) },
  { id: "notif-002", user_id: "demo-parent-001", title: "Fee Reminder", message: "Q2 tuition fee of ₹30,000 is due in 5 days.", type: "fee", link: "/dashboard", is_read: false, created_at: daysAgo(2) },
  { id: "notif-003", user_id: "demo-parent-001", title: "New Homework Assigned", message: "Mathematics homework: Linear Equations exercises assigned for Class 9A.", type: "homework", link: "/dashboard", is_read: true, created_at: daysAgo(3) },
  { id: "notif-004", user_id: "demo-parent-001", title: "Event Reminder", message: "Annual Science Fair is happening in 15 days at DPS Campus.", type: "event", link: "/events", is_read: true, created_at: daysAgo(4) },
  { id: "notif-005", user_id: "demo-school-001", title: "New Admission Request", message: "Kavya Reddy has applied for Class 1 admission.", type: "admission", link: "/school-panel/admissions", is_read: false, created_at: daysAgo(1) },
  { id: "notif-006", user_id: "demo-school-001", title: "New Review", message: "Vikram Patel left a 5-star review for your school.", type: "review", link: "/school-panel/reviews", is_read: false, created_at: daysAgo(2) },
  { id: "notif-007", user_id: "demo-admin-001", title: "New School Registration", message: "Lotus Valley International has registered on the platform.", type: "school", link: "/admin/schools", is_read: false, created_at: daysAgo(1) },
  { id: "notif-008", user_id: "demo-admin-001", title: "QR Order Received", message: "New QR standee order from The Heritage School.", type: "order", link: "/admin/qr-orders", is_read: true, created_at: daysAgo(3) },
];

// ─── School Views (for analytics) ───
export const DUMMY_SCHOOL_VIEWS = Array.from({ length: 47 }, (_, i) => ({
  id: `view-${String(i + 1).padStart(3, "0")}`,
  school_id: "school-001",
  viewed_at: daysAgo(Math.floor(Math.random() * 30)),
  viewer_ip: null,
}));

// ─── Admission Forms (for plans) ───
export const DUMMY_ADMISSION_FORMS = [
  { id: "aform-001", school_id: "school-001", form_name: "General Admission 2025-26", is_active: true, custom_fields: [{ label: "Previous School", type: "text" }, { label: "Sibling at DPS?", type: "checkbox" }], created_at: daysAgo(30), updated_at: now },
  { id: "aform-002", school_id: "school-001", form_name: "Late Admission Form", is_active: true, custom_fields: [{ label: "Reason for Late Application", type: "textarea" }], created_at: daysAgo(15), updated_at: now },
];

// ─── Demo school for School Panel ───
export const DEMO_SCHOOL_OWNERSHIP = {
  user_id: DEMO_USERS.school.id,
  school_id: "school-001",
  role: "owner",
  schools: DUMMY_SCHOOLS[0],
};

// Helper to get dummy data count for a table
export function getDummyCount(table: string): number {
  const counts: Record<string, number> = {
    schools: DUMMY_SCHOOLS.length,
    events: DUMMY_EVENTS.length,
    jobs: DUMMY_JOBS.length,
    tutors: DUMMY_TUTORS.length,
    news: DUMMY_NEWS.length,
    admissions: DUMMY_ADMISSIONS.length,
    reviews: DUMMY_REVIEWS.length,
    job_applications: DUMMY_JOB_APPLICATIONS.length,
    tutor_bookings: DUMMY_TUTOR_BOOKINGS.length,
    tuition_enquiries: DUMMY_TUITION_ENQUIRIES.length,
    qr_orders: DUMMY_QR_ORDERS.length,
    tuition_batches: DUMMY_BATCHES.length,
    attendance_records: DUMMY_ATTENDANCE.length,
    fee_records: DUMMY_FEE_RECORDS.length,
    homework_notes: DUMMY_HOMEWORK.length,
    notifications: DUMMY_NOTIFICATIONS.length,
    school_views: DUMMY_SCHOOL_VIEWS.length,
  };
  return counts[table] ?? 0;
}

// Helper to get all dummy data by table name
export function getDummyTableData(table: string): unknown[] {
  const map: Record<string, unknown[]> = {
    schools: DUMMY_SCHOOLS,
    events: DUMMY_EVENTS,
    jobs: DUMMY_JOBS,
    tutors: DUMMY_TUTORS,
    news: DUMMY_NEWS,
    admissions: DUMMY_ADMISSIONS,
    reviews: DUMMY_REVIEWS,
    job_applications: DUMMY_JOB_APPLICATIONS,
    tutor_bookings: DUMMY_TUTOR_BOOKINGS,
    tuition_enquiries: DUMMY_TUITION_ENQUIRIES,
    qr_orders: DUMMY_QR_ORDERS,
    tuition_batches: DUMMY_BATCHES,
    attendance_records: DUMMY_ATTENDANCE,
    fee_records: DUMMY_FEE_RECORDS,
    homework_notes: DUMMY_HOMEWORK,
    notifications: DUMMY_NOTIFICATIONS,
    school_views: DUMMY_SCHOOL_VIEWS,
  };
  return map[table] ?? [];
}
