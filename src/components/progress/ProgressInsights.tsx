
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Target, TrendingUp, Flame, Trophy, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressSummary {
  todayCalories: number;
  todayWorkouts: number;
  weeklyWorkouts: number;
  calorieGoal: number;
  workoutGoal: number;
  streak: number;
  weeklyCalorieAvg: number;
}

interface ProgressInsightsProps {
  refreshTrigger: number;
}

export const ProgressInsights: React.FC<ProgressInsightsProps> = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    if (user) {
      fetchProgressSummary();
    }
  }, [user, refreshTrigger]);

  const fetchProgressSummary = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 6);

      // Fetch today's progress
      const { data: todayData } = await supabase
        .from('user_progress_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      // Fetch this week's progress
      const { data: weekData } = await supabase
        .from('user_progress_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart.toISOString().split('T')[0])
        .order('date', { ascending: true });

      // Fetch goals
      const { data: goalsData } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Calculate streak
      const { data: allData } = await supabase
        .from('user_progress_logs')
        .select('date, workouts_completed')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      const goals = goalsData?.[0];
      const weeklyWorkouts = weekData?.reduce((sum, day) => sum + (day.workouts_completed || 0), 0) || 0;
      const weeklyCalorieAvg = weekData?.length ? 
        weekData.reduce((sum, day) => sum + (day.calories_consumed || 0), 0) / weekData.length : 0;

      // Calculate streak
      let streak = 0;
      if (allData) {
        for (const day of allData) {
          if ((day.workouts_completed || 0) > 0) {
            streak++;
          } else {
            break;
          }
        }
      }

      setSummary({
        todayCalories: todayData?.calories_consumed || 0,
        todayWorkouts: todayData?.workouts_completed || 0,
        weeklyWorkouts,
        calorieGoal: goals?.daily_calorie_goal || 2000,
        workoutGoal: goals?.weekly_workout_goal || 4,
        streak,
        weeklyCalorieAvg,
      });
    } catch (error) {
      console.error('Error fetching progress summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const calorieProgress = Math.min((summary.todayCalories / summary.calorieGoal) * 100, 100);
  const workoutProgress = Math.min((summary.weeklyWorkouts / summary.workoutGoal) * 100, 100);
  const remainingCalories = Math.max(summary.calorieGoal - summary.todayCalories, 0);
  const remainingWorkouts = Math.max(summary.workoutGoal - summary.weeklyWorkouts, 0);

  const getMotivationalMessage = () => {
    if (workoutProgress >= 100) return "🎉 Weekly goal achieved! Amazing work!";
    if (workoutProgress >= 80) return "💪 You're almost there! Keep pushing!";
    if (calorieProgress >= 90 && calorieProgress <= 110) return "🔥 Perfect calorie balance today!";
    if (summary.streak >= 7) return "🏆 Incredible streak! You're unstoppable!";
    if (summary.streak >= 3) return "⚡ Great consistency! Keep it up!";
    return "🚀 Every step counts - you've got this!";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "text-green-600";
    if (progress >= 70) return "text-yellow-600";
    return "text-blue-600";
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Calories</p>
                  <p className="text-3xl font-bold">{summary.todayCalories}</p>
                  <p className="text-sm text-muted-foreground">Goal: {summary.calorieGoal}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Flame className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Progress value={calorieProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {remainingCalories > 0 ? `${remainingCalories} calories remaining` : "Goal reached!"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weekly Workouts</p>
                  <p className="text-3xl font-bold">{summary.weeklyWorkouts}/{summary.workoutGoal}</p>
                  <p className="text-sm text-muted-foreground">{Math.round(workoutProgress)}% complete</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Progress value={workoutProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {remainingWorkouts > 0 ? `${remainingWorkouts} workouts to go` : "Weekly goal achieved!"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <p className="text-3xl font-bold">{summary.streak}</p>
                  <p className="text-sm text-muted-foreground">
                    {summary.streak === 1 ? "day" : "days"}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Badge variant={summary.streak >= 7 ? "default" : "secondary"} className="mt-2">
                {summary.streak >= 7 ? "🔥 On Fire!" : "💪 Building Momentum"}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weekly Avg Calories</p>
                  <p className="text-3xl font-bold">{Math.round(summary.weeklyCalorieAvg)}</p>
                  <p className="text-sm text-muted-foreground">per day</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {summary.weeklyCalorieAvg > summary.calorieGoal * 1.1 ? (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                <p className="text-xs text-muted-foreground">
                  {summary.weeklyCalorieAvg > summary.calorieGoal * 1.1 
                    ? "Above target" 
                    : "Within target"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">{getMotivationalMessage()}</h3>
            <p className="text-muted-foreground">
              {workoutProgress >= 100 
                ? "You've smashed your weekly workout goal! Time to celebrate and plan for next week."
                : `You're ${Math.round(workoutProgress)}% towards your weekly goal. Every workout brings you closer!`}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
