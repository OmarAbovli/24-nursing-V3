
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { TranslationProvider } from "@/hooks/use-translation";

// Pages
import HomePage from "./pages/HomePage";
import RoleSelection from "./pages/RoleSelection";
import Terms from "./pages/Terms";
import NotFoundPage from "./pages/NotFoundPage";

// Patient Pages
import AuthForm from "./components/AuthForm";
import PatientDashboard from "./pages/patient/PatientDashboard";
import ServiceRequestForm from "./pages/patient/ServiceRequestForm";
import TrackRequest from "./pages/patient/TrackRequest";
import OnlineSupport from "./pages/patient/OnlineSupport";
import CompleteProfile from "./pages/patient/CompleteProfile";
import Profile from "./pages/patient/Profile";
import AskMedicalQuestion from "./pages/patient/AskMedicalQuestion";
import MyQuestions from "./pages/patient/MyQuestions";

// Nurse Pages
import NurseRegisterInfo from "./pages/nurse/NurseRegisterInfo";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import ServiceSummary from "./pages/nurse/ServiceSummary";
import NurseProfile from "./pages/nurse/NurseProfile";
import AnswerQuestion from "./pages/nurse/AnswerQuestion";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDetail from "./pages/admin/UserDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Home and shared routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Patient Routes */}
              <Route path="/patient/login" element={<AuthForm type="login" userType="patient" />} />
              <Route path="/patient/register" element={<AuthForm type="register" userType="patient" />} />
              <Route path="/patient/complete-profile" element={<CompleteProfile />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/request-service" element={<ServiceRequestForm />} />
              <Route path="/patient/track-request" element={<TrackRequest />} />
              <Route path="/patient/online-support" element={<OnlineSupport />} />
              <Route path="/patient/profile" element={<Profile />} />
              <Route path="/patient/ask-question" element={<AskMedicalQuestion />} />
              <Route path="/patient/my-questions" element={<MyQuestions />} />
              
              {/* Nurse Routes (renamed to Medical Cadres in UI) */}
              <Route path="/nurse/login" element={<AuthForm type="login" userType="nurse" />} />
              <Route path="/nurse/register" element={<AuthForm type="register" userType="nurse" />} />
              <Route path="/nurse/register-info" element={<NurseRegisterInfo />} />
              <Route path="/nurse/dashboard" element={<NurseDashboard />} />
              <Route path="/nurse/service-summary" element={<ServiceSummary />} />
              <Route path="/nurse/profile" element={<NurseProfile />} />
              <Route path="/nurse/answer-question/:questionId" element={<AnswerQuestion />} />
              
              {/* Admin Routes - removed login route */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/user/:userId" element={<UserDetail />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
