import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, TrendingUp, Dumbbell, Heart, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';

export const ReportsSection: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const generateReport = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      // Fetch user data for the report
      const [goalsResult, progressResult, workoutsResult, nutritionResult] = await Promise.all([
        supabase.from('user_goals').select('*').eq('user_id', user.id).single(),
        supabase.from('user_progress_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(30),
        supabase.from('saved_workouts').select('workout_id, workouts(title, category, duration)').eq('user_id', user.id),
        supabase.from('saved_nutrition_plans').select('nutrition_plan_id, nutrition_plans(title, calories, goal)').eq('user_id', user.id)
      ]);

      const data = {
        goals: goalsResult.data,
        progress: progressResult.data || [],
        workouts: workoutsResult.data || [],
        nutrition: nutritionResult.data || []
      };

      setReportData(data);
      setReportGenerated(true);

      toast({
        title: "Report Generated",
        description: "Your personalized fitness report is ready for download!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!reportData || !profile) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Add branded header
    doc.setFillColor(139, 69, 197);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('FitnessFreaks', margin, 25);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Personal Fitness Report', margin, 35);

    // Reset text color and add user info section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Fitness Journey Report', margin, 60);

    // User info box
    doc.setDrawColor(139, 69, 197);
    doc.setLineWidth(0.5);
    doc.rect(margin, 70, pageWidth - 2 * margin, 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${profile.name}`, margin + 10, 85);
    doc.text(`Report Generated: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, margin + 10, 95);

    let yPosition = 120;

    // Goals section
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 60, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 69, 197);
    doc.text('Fitness Goals', margin + 10, yPosition + 10);
    yPosition += 20;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    if (reportData.goals) {
      doc.text(`Daily Calorie Goal: ${reportData.goals.daily_calorie_goal || 'Not set'} cal`, margin + 15, yPosition);
      yPosition += 8;
      doc.text(`Weekly Workout Goal: ${reportData.goals.weekly_workout_goal || 'Not set'} sessions`, margin + 15, yPosition);
      yPosition += 8;
      doc.text(`Target Weight: ${reportData.goals.target_weight || 'Not set'} kg`, margin + 15, yPosition);
      yPosition += 8;
      doc.text(`Goal Type: ${reportData.goals.goal_type || 'General fitness'}`, margin + 15, yPosition);
    } else {
      doc.text('No specific goals set yet. Consider setting up your fitness goals!', margin + 15, yPosition);
    }
    yPosition += 25;

    // Progress section
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 70, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('Recent Progress', margin + 10, yPosition + 15);
    yPosition += 25;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    if (reportData.progress.length > 0) {
      const recentProgress = reportData.progress.slice(0, 5);

      const totalCalories = recentProgress.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);
      const avgCalories = Math.round(totalCalories / recentProgress.length);
      const totalWorkouts = recentProgress.reduce((sum, entry) => sum + (entry.workouts_completed || 0), 0);

      doc.text(`Last ${recentProgress.length} days summary:`, margin + 15, yPosition);
      yPosition += 10;
      doc.text(`• Average daily calories: ${avgCalories} cal`, margin + 20, yPosition);
      yPosition += 8;
      doc.text(`• Total workouts completed: ${totalWorkouts}`, margin + 20, yPosition);
      yPosition += 8;
      doc.text(`• Most recent weight: ${recentProgress[0]?.current_weight || 'Not recorded'} kg`, margin + 20, yPosition);
    } else {
      doc.text('Start logging your progress to see insights here!', margin + 15, yPosition);
    }
    yPosition += 35;

    // New page if needed
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 30;
    }

    // Saved workouts section
    doc.setFillColor(254, 243, 199);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 158, 11);
    doc.text('Saved Workouts', margin + 10, yPosition + 15);
    yPosition += 25;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    if (reportData.workouts.length > 0) {
      doc.text(`You have saved ${reportData.workouts.length} workout(s):`, margin + 15, yPosition);
      yPosition += 10;
      reportData.workouts.slice(0, 3).forEach((workout: any, index: number) => {
        if (workout.workouts) {
          doc.text(`${index + 1}. ${workout.workouts.title} (${workout.workouts.duration})`, margin + 20, yPosition);
          yPosition += 8;
        }
      });
      if (reportData.workouts.length > 3) {
        doc.text(`... and ${reportData.workouts.length - 3} more`, margin + 20, yPosition);
      }
    } else {
      doc.text('No saved workouts yet. Explore our workout library!', margin + 15, yPosition);
    }
    yPosition += 25;

    // Nutrition plans section
    doc.setFillColor(252, 231, 243);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 50, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(236, 72, 153);
    doc.text('Nutrition Plans', margin + 10, yPosition + 15);
    yPosition += 25;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    if (reportData.nutrition.length > 0) {
      doc.text(`You have saved ${reportData.nutrition.length} nutrition plan(s):`, margin + 15, yPosition);
      yPosition += 10;
      reportData.nutrition.slice(0, 2).forEach((plan: any, index: number) => {
        if (plan.nutrition_plans) {
          doc.text(`${index + 1}. ${plan.nutrition_plans.title} (${plan.nutrition_plans.calories} cal)`, margin + 20, yPosition);
          yPosition += 8;
        }
      });
    } else {
      doc.text('No saved nutrition plans yet. Check out our meal plans!', margin + 15, yPosition);
    }

    // Footer
    const footerY = pageHeight - 25;
    doc.setFillColor(139, 69, 197);
    doc.rect(0, footerY - 5, pageWidth, 30, 'F');

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by FitnessFreaks - Your Personal Fitness Journey', margin, footerY + 5);
    doc.text(`Report ID: FF-${Date.now()}`, pageWidth - margin - 50, footerY + 5);

    // Download the PDF
    doc.save(`FitnessFreaks-Report-${profile.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);

    toast({
      title: "Download Complete",
      description: "Your fitness report has been downloaded successfully!",
    });
  };

  const downloadCSV = () => {
    if (!reportData || !profile) return;

    const csvData = [
      ['FitnessFreaks Personal Report'],
      [`Generated for: ${profile.name}`],
      [`Date: ${new Date().toLocaleDateString()}`],
      [''],
      ['=== GOALS ==='],
      ['Metric', 'Value'],
      ['Daily Calorie Goal', reportData.goals?.daily_calorie_goal || 'Not set'],
      ['Weekly Workout Goal', reportData.goals?.weekly_workout_goal || 'Not set'],
      ['Target Weight', reportData.goals?.target_weight || 'Not set'],
      ['Goal Type', reportData.goals?.goal_type || 'Not set'],
      [''],
      ['=== RECENT PROGRESS ==='],
      ['Date', 'Calories Consumed', 'Workouts Completed', 'Current Weight', 'Water Intake'],
      ...reportData.progress.slice(0, 10).map((entry: any) => [
        entry.date,
        entry.calories_consumed || 0,
        entry.workouts_completed || 0,
        entry.current_weight || 'Not recorded',
        entry.water_intake || 0
      ]),
      [''],
      ['=== SAVED WORKOUTS ==='],
      ['Workout Title', 'Category', 'Duration'],
      ...reportData.workouts.map((workout: any) => [
        workout.workouts?.title || 'Unknown',
        workout.workouts?.category || 'Unknown',
        workout.workouts?.duration || 'Unknown'
      ]),
      [''],
      ['=== NUTRITION PLANS ==='],
      ['Plan Title', 'Calories', 'Goal'],
      ...reportData.nutrition.map((plan: any) => [
        plan.nutrition_plans?.title || 'Unknown',
        plan.nutrition_plans?.calories || 'Unknown',
        plan.nutrition_plans?.goal || 'Unknown'
      ]),
    ];

    const csvContent = csvData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `FitnessFreaks-Data-${profile.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Downloaded",
      description: "Your fitness data has been exported successfully!",
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <FileText className="w-10 h-10 text-primary" />
          Fitness Reports
        </h2>
        <p className="text-xl text-muted-foreground">Generate comprehensive reports of your fitness journey</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <TrendingUp className="w-7 h-7 text-primary" />
              Personal Fitness Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200 dark:border-blue-800">
                <TrendingUp className="w-10 h-10 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">Goals & achievements</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl border border-green-200 dark:border-green-800">
                <Dumbbell className="w-10 h-10 text-green-600" />
                <div>
                  <h3 className="font-semibold text-lg">Workout History</h3>
                  <p className="text-sm text-muted-foreground">Saved routines</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 rounded-xl border border-orange-200 dark:border-orange-800">
                <Heart className="w-10 h-10 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-lg">Nutrition Plans</h3>
                  <p className="text-sm text-muted-foreground">Meal tracking</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              {!reportGenerated ? (
                <div className="space-y-4">
                  <Button 
                    onClick={generateReport}
                    disabled={isGenerating}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    ) : (
                      <FileText className="w-6 h-6 mr-3" />
                    )}
                    {isGenerating ? 'Generating Report...' : 'Generate Report'}
                  </Button>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Your report will include progress charts, workout history, nutrition plans, and goal achievements.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl border border-green-200 dark:border-green-800">
                    <p className="text-green-700 dark:text-green-300 font-medium text-lg">
                      ✅ Report generated successfully!
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                      Your personalized fitness report is ready for download
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button 
                      onClick={downloadPDF}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF Report
                    </Button>
                    
                    <Button 
                      onClick={downloadCSV}
                      variant="outline"
                      size="lg"
                      className="px-6 py-3 rounded-xl border-2 hover:bg-accent transition-all duration-200"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export CSV Data
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        setReportGenerated(false);
                        setReportData(null);
                      }}
                      variant="ghost"
                      size="lg"
                      className="px-6 py-3 rounded-xl hover:bg-accent transition-all duration-200"
                    >
                      Generate New Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
