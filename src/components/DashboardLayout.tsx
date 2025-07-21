
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BarChart3, Heart, Dumbbell, Lightbulb, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProgressTracker } from './ProgressTracker';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('progress');

  const handleBackToHome = () => {
    navigate('/');
  };

  const dashboardSections = [
    { id: 'progress', label: 'Progress Tracker', icon: BarChart3 },
    { id: 'nutrition', label: 'Saved Nutrition', icon: Heart },
    { id: 'workouts', label: 'Saved Workouts', icon: Dumbbell },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">FF</span>
            </div>
            <span className="text-xl font-bold text-white">FitnessFreaks</span>
          </div>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={handleBackToHome}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {profile?.name}! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              Track your progress and achieve your fitness goals
            </p>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-800 border border-gray-700 mb-8">
              {dashboardSections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger 
                    key={section.id}
                    value={section.id}
                    className="flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="progress" className="mt-0">
              <ProgressTracker />
            </TabsContent>

            <TabsContent value="nutrition" className="mt-0">
              {children}
            </TabsContent>

            <TabsContent value="workouts" className="mt-0">
              {children}
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">AI Recommendations</h3>
                  <p className="text-gray-400 mb-6">
                    Get personalized workout and nutrition recommendations based on your progress
                  </p>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">Account Settings</h3>
                  <p className="text-gray-400 mb-6">
                    Manage your profile, preferences, and account settings
                  </p>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};
