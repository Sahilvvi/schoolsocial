import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/context/ThemeContext";

// Pages
import Login from "@/pages/auth/Login";
import Landing from "@/pages/public/Landing";
import SchoolsPage from "@/pages/public/SchoolsPage";
import AboutPage from "@/pages/public/AboutPage";
import ContactPage from "@/pages/public/ContactPage";
import Discovery from "@/pages/public/Discovery";
import SchoolProfile from "@/pages/public/SchoolProfile";
import SchoolRegister from "@/pages/public/SchoolRegister";
import AdmissionForm from "@/pages/public/AdmissionForm";
import SchoolBlog from "@/pages/public/SchoolBlog";
import SchoolComparison from "@/pages/public/SchoolComparison";
import PublicEvents from "@/pages/public/PublicEvents";
import PublicJobs from "@/pages/public/Jobs";
import Syllabus from "@/pages/school-admin/Syllabus";
import CareerDashboard from "@/pages/career/CareerDashboard";

import SuperAdminDashboard from "@/pages/super-admin/Dashboard";
import SuperAdminSchools from "@/pages/super-admin/Schools";
import SuperAdminUsers from "@/pages/super-admin/Users";
import SuperAdminRevenue from "@/pages/super-admin/Revenue";
import SuperAdminReviews from "@/pages/super-admin/Reviews";
import SuperAdminSettings from "@/pages/super-admin/Settings";

import SchoolAdminDashboard from "@/pages/school-admin/SchoolAdmin";
import StudentsList from "@/pages/school-admin/Students";
import TeachersList from "@/pages/school-admin/Teachers";
import ClassesList from "@/pages/school-admin/Classes";
import AttendanceList from "@/pages/school-admin/Attendance";
import FeesList from "@/pages/school-admin/Fees";
import NoticesList from "@/pages/school-admin/Notices";
import EventsList from "@/pages/school-admin/Events";
import HiringList from "@/pages/school-admin/Hiring";
import Leaves from "@/pages/school-admin/Leaves";
import AdminMessages from "@/pages/school-admin/AdminMessages";
import AIAssistant from "@/pages/school-admin/AIAssistant";
import EditProfile from "@/pages/school-admin/EditProfile";
import Timetable from "@/pages/school-admin/Timetable";
import Exams from "@/pages/school-admin/Exams";
import Announcements from "@/pages/school-admin/Announcements";
import StudentPromotion from "@/pages/school-admin/StudentPromotion";
import Gallery from "@/pages/school-admin/Gallery";
import ReportCards from "@/pages/school-admin/ReportCards";
import QRScanner from "@/pages/school-admin/QRScanner";
import AttendanceReports from "@/pages/school-admin/AttendanceReports";
import AuditLogs from "@/pages/super-admin/AuditLogs";
import SupportTickets from "@/pages/super-admin/SupportTickets";
import PlatformAnnouncements from "@/pages/super-admin/PlatformAnnouncements";
import Subscriptions from "@/pages/super-admin/Subscriptions";

import Library from "@/pages/school-admin/Library";
import Transport from "@/pages/school-admin/Transport";
import Payroll from "@/pages/school-admin/Payroll";
import PTM from "@/pages/school-admin/PTM";
import Discipline from "@/pages/school-admin/Discipline";
import StudyMaterials from "@/pages/school-admin/StudyMaterials";
import FeeStructure from "@/pages/school-admin/FeeStructure";
import AdmissionInquiries from "@/pages/school-admin/AdmissionInquiries";
import Blog from "@/pages/school-admin/Blog";
import HealthPage from "@/pages/school-admin/Health";
import HomeworkAdmin from "@/pages/school-admin/HomeworkAdmin";
import FinancialReports from "@/pages/school-admin/FinancialReports";
import SupportHelp from "@/pages/school-admin/SupportHelp";
import CalendarView from "@/pages/school-admin/CalendarView";

import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import ParentDashboard from "@/pages/parent/ParentDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";
import Leaderboard from "@/pages/public/Leaderboard";
import NotFound from "@/pages/not-found";

// Global Fetch Interceptor for JWT Auth
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const token = localStorage.getItem('myschool_token');
  if (token) {
    const merged = new Headers(init?.headers);
    merged.set('Authorization', `Bearer ${token}`);
    init = { ...(init || {}), headers: merged };
  }
  return originalFetch(input, init);
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } }
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    setTimeout(() => setLocation("/login"), 0);
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/schools-info" component={SchoolsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />

      {/* Public Routes */}
      <Route path="/schools" component={Discovery} />
      <Route path="/schools/leaderboard" component={Leaderboard} />
      <Route path="/schools/register" component={SchoolRegister} />
      <Route path="/schools/compare" component={SchoolComparison} />
      <Route path="/schools/:slug/admission" component={AdmissionForm} />
      <Route path="/schools/:slug/blog" component={SchoolBlog} />
      <Route path="/schools/:slug" component={SchoolProfile} />
      <Route path="/events" component={PublicEvents} />
      <Route path="/jobs" component={PublicJobs} />
      <Route path="/career" component={CareerDashboard} />

      {/* Super Admin Routes */}
      <Route path="/super-admin" component={() => <ProtectedRoute component={SuperAdminDashboard} />} />
      <Route path="/super-admin/schools" component={() => <ProtectedRoute component={SuperAdminSchools} />} />
      <Route path="/super-admin/users" component={() => <ProtectedRoute component={SuperAdminUsers} />} />
      <Route path="/super-admin/revenue" component={() => <ProtectedRoute component={SuperAdminRevenue} />} />
      <Route path="/super-admin/reviews" component={() => <ProtectedRoute component={SuperAdminReviews} />} />
      <Route path="/super-admin/settings" component={() => <ProtectedRoute component={SuperAdminSettings} />} />
      <Route path="/super-admin/audit-logs" component={() => <ProtectedRoute component={AuditLogs} />} />
      <Route path="/super-admin/support-tickets" component={() => <ProtectedRoute component={SupportTickets} />} />
      <Route path="/super-admin/announcements" component={() => <ProtectedRoute component={PlatformAnnouncements} />} />
      <Route path="/super-admin/subscriptions" component={() => <ProtectedRoute component={Subscriptions} />} />

      {/* School Admin Routes */}
      <Route path="/school-admin" component={() => <ProtectedRoute component={SchoolAdminDashboard} />} />
      <Route path="/school-admin/students" component={() => <ProtectedRoute component={StudentsList} />} />
      <Route path="/school-admin/teachers" component={() => <ProtectedRoute component={TeachersList} />} />
      <Route path="/school-admin/classes" component={() => <ProtectedRoute component={ClassesList} />} />
      <Route path="/school-admin/attendance" component={() => <ProtectedRoute component={AttendanceList} />} />
      <Route path="/school-admin/fees" component={() => <ProtectedRoute component={FeesList} />} />
      <Route path="/school-admin/notices" component={() => <ProtectedRoute component={NoticesList} />} />
      <Route path="/school-admin/events" component={() => <ProtectedRoute component={EventsList} />} />
      <Route path="/school-admin/hiring" component={() => <ProtectedRoute component={HiringList} />} />
      <Route path="/school-admin/leaves" component={() => <ProtectedRoute component={Leaves} />} />
      <Route path="/school-admin/messages" component={() => <ProtectedRoute component={AdminMessages} />} />
      <Route path="/school-admin/ai" component={() => <ProtectedRoute component={AIAssistant} />} />
      <Route path="/school-admin/profile" component={() => <ProtectedRoute component={EditProfile} />} />
      <Route path="/school-admin/timetable" component={() => <ProtectedRoute component={Timetable} />} />
      <Route path="/school-admin/exams" component={() => <ProtectedRoute component={Exams} />} />
      <Route path="/school-admin/announcements" component={() => <ProtectedRoute component={Announcements} />} />
      <Route path="/school-admin/promote" component={() => <ProtectedRoute component={StudentPromotion} />} />
      <Route path="/school-admin/gallery" component={() => <ProtectedRoute component={Gallery} />} />
      <Route path="/school-admin/report-cards" component={() => <ProtectedRoute component={ReportCards} />} />
      <Route path="/school-admin/qr-scan" component={() => <ProtectedRoute component={QRScanner} />} />
      <Route path="/school-admin/attendance-reports" component={() => <ProtectedRoute component={AttendanceReports} />} />
      <Route path="/school-admin/library" component={() => <ProtectedRoute component={Library} />} />
      <Route path="/school-admin/transport" component={() => <ProtectedRoute component={Transport} />} />
      <Route path="/school-admin/payroll" component={() => <ProtectedRoute component={Payroll} />} />
      <Route path="/school-admin/ptm" component={() => <ProtectedRoute component={PTM} />} />
      <Route path="/school-admin/discipline" component={() => <ProtectedRoute component={Discipline} />} />
      <Route path="/school-admin/study-materials" component={() => <ProtectedRoute component={StudyMaterials} />} />
      <Route path="/school-admin/syllabus" component={() => <ProtectedRoute component={Syllabus} />} />
      <Route path="/school-admin/fee-structure" component={() => <ProtectedRoute component={FeeStructure} />} />
      <Route path="/school-admin/admission-inquiries" component={() => <ProtectedRoute component={AdmissionInquiries} />} />
      <Route path="/school-admin/blog" component={() => <ProtectedRoute component={Blog} />} />
      <Route path="/school-admin/health" component={() => <ProtectedRoute component={HealthPage} />} />
      <Route path="/school-admin/homework" component={() => <ProtectedRoute component={HomeworkAdmin} />} />
      <Route path="/school-admin/financial-reports" component={() => <ProtectedRoute component={FinancialReports} />} />
      <Route path="/school-admin/calendar" component={() => <ProtectedRoute component={CalendarView} />} />
      <Route path="/school-admin/support" component={() => <ProtectedRoute component={SupportHelp} />} />

      {/* Role dashboards */}
      <Route path="/teacher" component={() => <ProtectedRoute component={TeacherDashboard} />} />
      <Route path="/teacher/:tab" component={() => <ProtectedRoute component={TeacherDashboard} />} />
      <Route path="/parent" component={() => <ProtectedRoute component={ParentDashboard} />} />
      <Route path="/parent/:tab" component={() => <ProtectedRoute component={ParentDashboard} />} />
      <Route path="/student" component={() => <ProtectedRoute component={StudentDashboard} />} />
      <Route path="/student/:tab" component={() => <ProtectedRoute component={StudentDashboard} />} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
