import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
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

// Admin
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminSchools from "@/pages/admin/AdminSchools";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminJobs from "@/pages/admin/AdminJobs";
import AdminTutors from "@/pages/admin/AdminTutors";
import AdminNews from "@/pages/admin/AdminNews";
import AdminAdmissions from "@/pages/admin/AdminAdmissions";
import AdminJobApps from "@/pages/admin/AdminJobApps";
import AdminTutorBookings from "@/pages/admin/AdminTutorBookings";
import AdminTuitionEnquiries from "@/pages/admin/AdminTuitionEnquiries";
import AdminQrOrders from "@/pages/admin/AdminQrOrders";
import AdminBatches from "@/pages/admin/AdminBatches";

// School Panel
import SchoolPanelLayout from "@/pages/school-panel/SchoolPanelLayout";
import SPDashboard from "@/pages/school-panel/SPDashboard";
import SPAdmissions from "@/pages/school-panel/SPAdmissions";
import SPGallery from "@/pages/school-panel/SPGallery";
import SPAnalytics from "@/pages/school-panel/SPAnalytics";
import SPReviews from "@/pages/school-panel/SPReviews";
import SPEvents from "@/pages/school-panel/SPEvents";
import SPJobs from "@/pages/school-panel/SPJobs";
import SPErp from "@/pages/school-panel/SPErp";
import SPQrOrders from "@/pages/school-panel/SPQrOrders";
import SPProfile from "@/pages/school-panel/SPProfile";

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
  const isErp = location.pathname.startsWith("/erp");

  return (
    <>
      <ScrollToTop />
      {!isAdmin && !isSchoolPanel && !isErp && <Navbar />}
      <div className={!isErp ? "min-h-[80vh] flex flex-col" : ""}>
        <div className="flex-grow">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/schools" replace />} />
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
        <Route path="/auth" element={<AuthPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="schools" element={<AdminSchools />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="tutors" element={<AdminTutors />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="admissions" element={<AdminAdmissions />} />
          <Route path="job-applications" element={<AdminJobApps />} />
          <Route path="tutor-bookings" element={<AdminTutorBookings />} />
          <Route path="tuition-enquiries" element={<AdminTuitionEnquiries />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="qr-orders" element={<AdminQrOrders />} />
          <Route path="batches" element={<AdminBatches />} />
        </Route>

        {/* School Panel routes */}
        <Route path="/school-panel" element={<SchoolPanelLayout />}>
          <Route index element={<SPDashboard />} />
          <Route path="profile" element={<SPProfile />} />
          <Route path="admissions" element={<SPAdmissions />} />
          <Route path="gallery" element={<SPGallery />} />
          <Route path="analytics" element={<SPAnalytics />} />
          <Route path="reviews" element={<SPReviews />} />
          <Route path="events" element={<SPEvents />} />
          <Route path="jobs" element={<SPJobs />} />
          <Route path="erp" element={<SPErp />} />
          <Route path="qr-orders" element={<SPQrOrders />} />
        </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      {!isAdmin && !isSchoolPanel && !isErp && <Footer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
