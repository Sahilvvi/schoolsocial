import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchoolsPage from "@/pages/SchoolsPage";
import SchoolProfilePage from "@/pages/SchoolProfilePage";
import EventsPage from "@/pages/EventsPage";
import EventDetailPage from "@/pages/EventDetailPage";
import JobsPage from "@/pages/JobsPage";
import TutorsPage from "@/pages/TutorsPage";
import TutorDetailPage from "@/pages/TutorDetailPage";
import NewsPage from "@/pages/NewsPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import { ErpApp } from "@/erp/ErpApp";
import PlansPage from "@/pages/PlansPage";
import TuitionEnquiryPage from "@/pages/TuitionEnquiryPage";
import UploadSchoolPage from "@/pages/UploadSchoolPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import CompareSchoolsPage from "@/pages/CompareSchoolsPage";
import ParentDashboard from "@/pages/ParentDashboard";
import HomePage from "@/pages/HomePage";
import TeacherProfilePage from "@/pages/TeacherProfilePage";
import ScannerPage from "@/pages/ScannerPage";
import SchoolCommunityPage from "@/pages/SchoolCommunityPage";
import TuitionDashboard from "@/pages/TuitionDashboard";

// Dashboards (We'll update these in T002, routing stays same)
import TeacherPanelLayout from "@/pages/teacher-panel/TeacherPanelLayout";
import TPDashboard from "@/pages/teacher-panel/TPDashboard";
import TuitionPanelLayout from "@/pages/tuition-panel/TuitionPanelLayout";
import TuPDashboard from "@/pages/tuition-panel/TuPDashboard";
import ParentPanelLayout from "@/pages/parent-panel/ParentPanelLayout";
import PPDashboard from "@/pages/parent-panel/PPDashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SchoolPanelLayout from "@/pages/school-panel/SchoolPanelLayout";
import SPDashboard from "@/pages/school-panel/SPDashboard";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isSchoolPanel = location.pathname.startsWith("/school-panel");
  const isTeacherPanel = location.pathname.startsWith("/teacher-panel");
  const isTuitionPanel = location.pathname.startsWith("/tuition-panel");
  const isParentPanel = location.pathname.startsWith("/parent-panel");
  const isErp = location.pathname.startsWith("/erp");
  const isPanel = isAdmin || isSchoolPanel || isTeacherPanel || isTuitionPanel || isParentPanel;

  return (
    <>
      <ScrollToTop />
      {!isPanel && !isErp && <Navbar />}
      <div className={!isErp ? "min-h-[100dvh] flex flex-col" : ""}>
        <div className="flex-grow pt-16 lg:pt-20"> {/* Offset for sticky navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/school/:slug" element={<SchoolProfilePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/tutors" element={<TutorsPage />} />
            <Route path="/tutor/:id" element={<TutorDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/erp/*" element={<ErpApp />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/tuition-enquiry" element={<TuitionEnquiryPage />} />
            <Route path="/upload-school" element={<UploadSchoolPage />} />
            <Route path="/compare" element={<CompareSchoolsPage />} />
            <Route path="/dashboard" element={<ParentDashboard />} />
            <Route path="/tuition-dashboard" element={<TuitionDashboard />} />
            <Route path="/teacher-profile" element={<TeacherProfilePage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/community" element={<SchoolCommunityPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Dashboard stubs for routing completeness */}
            <Route path="/admin" element={<AdminLayout />}><Route index element={<AdminDashboard />} /></Route>
            <Route path="/school-panel" element={<SchoolPanelLayout />}><Route index element={<SPDashboard />} /></Route>
            <Route path="/teacher-panel" element={<TeacherPanelLayout />}><Route index element={<TPDashboard />} /></Route>
            <Route path="/tuition-panel" element={<TuitionPanelLayout />}><Route index element={<TuPDashboard />} /></Route>
            <Route path="/parent-panel" element={<ParentPanelLayout />}><Route index element={<PPDashboard />} /></Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      {!isPanel && !isErp && <Footer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;