import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/erp/hooks/use-auth";
import { ThemeProvider } from "@/erp/context/ThemeContext";

// Pages
import Login from "@/erp/pages/auth/Login";
import Landing from "@/erp/pages/public/Landing";
import SchoolsPage from "@/erp/pages/public/SchoolsPage";
import AboutPage from "@/erp/pages/public/AboutPage";
import ContactPage from "@/erp/pages/public/ContactPage";
import Discovery from "@/erp/pages/public/Discovery";
import SchoolProfile from "@/erp/pages/public/SchoolProfile";
import SchoolRegister from "@/erp/pages/public/SchoolRegister";
import AdmissionForm from "@/erp/pages/public/AdmissionForm";
import SchoolBlog from "@/erp/pages/public/SchoolBlog";
import SchoolComparison from "@/erp/pages/public/SchoolComparison";
import PublicEvents from "@/erp/pages/public/PublicEvents";
import PublicJobs from "@/erp/pages/public/Jobs";
import Syllabus from "@/erp/pages/school-admin/Syllabus";
import CareerDashboard from "@/erp/pages/career/CareerDashboard";

import SuperAdminDashboard from "@/erp/pages/super-admin/Dashboard";
import SuperAdminSchools from "@/erp/pages/super-admin/Schools";
import SuperAdminUsers from "@/erp/pages/super-admin/Users";
import SuperAdminRevenue from "@/erp/pages/super-admin/Revenue";
import SuperAdminReviews from "@/erp/pages/super-admin/Reviews";
import SuperAdminSettings from "@/erp/pages/super-admin/Settings";

import SchoolAdminDashboard from "@/erp/pages/school-admin/SchoolAdmin";
import StudentsList from "@/erp/pages/school-admin/Students";
import TeachersList from "@/erp/pages/school-admin/Teachers";
import ClassesList from "@/erp/pages/school-admin/Classes";
import AttendanceList from "@/erp/pages/school-admin/Attendance";
import FeesList from "@/erp/pages/school-admin/Fees";
import NoticesList from "@/erp/pages/school-admin/Notices";
import EventsList from "@/erp/pages/school-admin/Events";
import HiringList from "@/erp/pages/school-admin/Hiring";
import Leaves from "@/erp/pages/school-admin/Leaves";
import AdminMessages from "@/erp/pages/school-admin/AdminMessages";
import AIAssistant from "@/erp/pages/school-admin/AIAssistant";
import EditProfile from "@/erp/pages/school-admin/EditProfile";
import Timetable from "@/erp/pages/school-admin/Timetable";
import Exams from "@/erp/pages/school-admin/Exams";
import Announcements from "@/erp/pages/school-admin/Announcements";
import StudentPromotion from "@/erp/pages/school-admin/StudentPromotion";
import Gallery from "@/erp/pages/school-admin/Gallery";
import ReportCards from "@/erp/pages/school-admin/ReportCards";
import QRScanner from "@/erp/pages/school-admin/QRScanner";
import AttendanceReports from "@/erp/pages/school-admin/AttendanceReports";
import AuditLogs from "@/erp/pages/super-admin/AuditLogs";
import SupportTickets from "@/erp/pages/super-admin/SupportTickets";
import PlatformAnnouncements from "@/erp/pages/super-admin/PlatformAnnouncements";
import Subscriptions from "@/erp/pages/super-admin/Subscriptions";

import Library from "@/erp/pages/school-admin/Library";
import Transport from "@/erp/pages/school-admin/Transport";
import Payroll from "@/erp/pages/school-admin/Payroll";
import PTM from "@/erp/pages/school-admin/PTM";
import Discipline from "@/erp/pages/school-admin/Discipline";
import StudyMaterials from "@/erp/pages/school-admin/StudyMaterials";
import FeeStructure from "@/erp/pages/school-admin/FeeStructure";
import AdmissionInquiries from "@/erp/pages/school-admin/AdmissionInquiries";
import Blog from "@/erp/pages/school-admin/Blog";
import HealthPage from "@/erp/pages/school-admin/Health";
import HomeworkAdmin from "@/erp/pages/school-admin/HomeworkAdmin";
import FinancialReports from "@/erp/pages/school-admin/FinancialReports";
import SupportHelp from "@/erp/pages/school-admin/SupportHelp";
import CalendarView from "@/erp/pages/school-admin/CalendarView";

import TeacherDashboard from "@/erp/pages/teacher/TeacherDashboard";
import ParentDashboard from "@/erp/pages/parent/ParentDashboard";
import StudentDashboard from "@/erp/pages/student/StudentDashboard";
import Leaderboard from "@/erp/pages/public/Leaderboard";
import NotFound from "@/erp/pages/not-found";

// Global Fetch Interceptor for JWT Auth
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const token = localStorage.getItem('myschool_token');
  if (token) {
    const urlStr = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
    if (urlStr.startsWith('/api') || urlStr.includes('/api/')) {
      const merged = new Headers(init?.headers);
      if (!merged.has('Authorization')) {
        merged.set('Authorization', `Bearer ${token}`);
        init = { ...(init || {}), headers: merged };
      }
    }
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
      <Route path="/">
        {() => {
          const { user } = useAuth();
          if (user?.role === 'super_admin') return <Redirect to="/super-admin" />;
          if (user?.role === 'school_admin') return <Redirect to="/school-admin" />;
          return <Login />;
        }}
      </Route>
      <Route path="/login">
        {() => {
          const { user } = useAuth();
          if (user?.role === 'super_admin') return <Redirect to="/super-admin" />;
          if (user?.role === 'school_admin') return <Redirect to="/school-admin" />;
          return <Login />;
        }}
      </Route>
      
      {/* ERP Specific functional routes - Career & Leaderboard keep as is if unique */}
      <Route path="/schools/leaderboard" component={Leaderboard} />
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

export function ErpApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <WouterRouter base="/erp">
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

export default ErpApp;
