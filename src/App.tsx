import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LandingPage } from "./pages/LandingPage";
import { StudentLogin } from "./pages/StudentLogin";
import { AdminLogin } from "./pages/AdminLogin";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AIAssistant } from "./pages/AIAssistant";
import { Resources } from "./pages/Resources";
import { ResourcesHub } from "./pages/ResourcesHub";
import { SelfCare } from "./pages/SelfCare";
import { SelfCareHub } from "./pages/SelfCareHub";
import { BookSession } from "./pages/BookSession";
import { ScreeningTests } from "./pages/ScreeningTests";
import { Results } from "./pages/Results";
import { StudentRequests } from "./pages/StudentRequests";
import { Alerts } from "./pages/Alerts";
import { MoodCheckin } from "./pages/MoodCheckin";
import { Journal } from "./pages/Journal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student-dashboard/ai" element={<AIAssistant />} />
            <Route path="/student-dashboard/resources" element={<Resources />} />
            <Route path="/student-dashboard/resources-hub" element={<ResourcesHub />} />
            <Route path="/self-care-hub" element={<SelfCareHub />} />
            <Route path="/self-care" element={<SelfCare />} />
            <Route path="/student-dashboard/booking" element={<BookSession />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/resources" element={<Resources />} />
            <Route path="/admin-dashboard/screening" element={<ScreeningTests />} />
            <Route path="/admin-dashboard/results" element={<Results />} />
            <Route path="/admin-dashboard/requests" element={<StudentRequests />} />
            <Route path="/admin-dashboard/alerts" element={<Alerts />} />
            <Route path="/mood-checkin" element={<MoodCheckin />} />
            <Route path="/journal" element={<Journal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
