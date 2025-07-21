import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import Nutrition from "./pages/Nutrition";
import NutritionDetail from "./pages/NutritionDetail";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Help from "./pages/Help";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CookiePolicy from "./pages/CookiePolicy";
import Accessibility from "./pages/Accessibility";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Partnerships from "./pages/Partnerships";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PremiumRoute } from "./components/PremiumRoute";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { PremiumDashboardGate } from "@/components/PremiumDashboardGate";

const queryClient = new QueryClient();

function App() {
  // Custom hook, but we have to use a wrapper for the route
  const DashboardGate = () => {
    const { hasPremiumAccess, isAdmin, loading } = usePremiumAccess();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      );
    }

    if (!hasPremiumAccess && !isAdmin) {
      return <PremiumDashboardGate />;
    }

    // Authenticated + premium/admin, render dashboard
    return <Dashboard />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <TooltipProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/workouts" element={<Workouts />} />
                  <Route path="/workouts/:id" element={<WorkoutDetail />} />
                  <Route path="/nutrition" element={<Nutrition />} />
                  <Route path="/nutrition/:id" element={<NutritionDetail />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/press" element={<Press />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  {/* Lock down dashboard */}
                  <Route path="/dashboard" element={<DashboardGate />} />
                  <Route path="/admin" element={<PremiumRoute feature="Admin Panel" description="Access admin dashboard and management tools" />}>
                    <Route index element={<Admin />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <SonnerToaster />
              </TooltipProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
