
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { LogOut, ArrowLeft } from 'lucide-react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { ProgressTrackerSection } from '@/components/dashboard/ProgressTrackerSection';
import { SavedWorkoutsSection } from '@/components/dashboard/SavedWorkoutsSection';
import { NutritionPlansSection } from '@/components/dashboard/NutritionPlansSection';
import { AICoachSection } from '@/components/dashboard/AICoachSection';
import { SubscriptionSection } from '@/components/dashboard/SubscriptionSection';
import { ProfileSection } from '@/components/dashboard/ProfileSection';
import { ReportsSection } from '@/components/dashboard/ReportsSection';

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('progress');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'progress':
        return <ProgressTrackerSection />;
      case 'workouts':
        return <SavedWorkoutsSection />;
      case 'nutrition':
        return <NutritionPlansSection />;
      case 'ai-coach':
        return <AICoachSection />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'reports':
        return <ReportsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <ProgressTrackerSection />;
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {profile.name}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">Track your fitness journey and achieve your goals</p>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleBackToHome}
                className="transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-background">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            {renderActiveSection()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
