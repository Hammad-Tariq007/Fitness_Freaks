import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Target, Flame, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserGoal {
  daily_calorie_goal: number;
  weekly_workout_goal: number;
  weight_goal?: number;
}

interface ProgressData {
  date: string;
  calories_consumed: number;
  workouts_completed: number;
}

export const ProgressAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userGoals, setUserGoals] = useState<UserGoal | null>(null);
  const [todayProgress, setTodayProgress] = useState<ProgressData | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<ProgressData[]>([]);
  const [weeklyWorkoutCount, setWeeklyWorkoutCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchUserGoals(),
        fetchTodayProgress(),
        fetchWeeklyProgress()
      ]);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGoals = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    if (data && data.length > 0) {
      setUserGoals(data[0]);
    }
  };

  const fetchTodayProgress = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Try user_progress_logs first (new table)
    let { data, error } = await supabase
      .from('user_progress_logs')
      .select('date, calories_consumed, workouts_completed')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    // Fallback to user_progress if not found
    if (error && error.code === 'PGRST116') {
      const fallbackResult = await supabase
        .from('user_progress')
        .select('date, calories_intake, workouts_completed')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      
      if (fallbackResult.data) {
        setTodayProgress({
          date: fallbackResult.data.date,
          calories_consumed: fallbackResult.data.calories_intake || 0,
          workouts_completed: fallbackResult.data.workouts_completed || 0
        });
      }
      return;
    }

    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      setTodayProgress({
        date: data.date,
        calories_consumed: data.calories_consumed || 0,
        workouts_completed: data.workouts_completed || 0
      });
    }
  };

  const fetchWeeklyProgress = async () => {
    if (!user) return;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    // Try user_progress_logs first
    let { data, error } = await supabase
      .from('user_progress_logs')
      .select('date, calories_consumed, workouts_completed')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Fallback to user_progress if no data
    if (!data || data.length === 0) {
      const fallbackResult = await supabase
        .from('user_progress')
        .select('date, calories_intake, workouts_completed')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (fallbackResult.data) {
        const progressData = fallbackResult.data.map(item => ({
          date: item.date,
          calories_consumed: item.calories_intake || 0,
          workouts_completed: item.workouts_completed || 0
        }));
        
        setWeeklyProgress(progressData);
        const totalWorkouts = progressData.reduce((sum, day) => sum + (day.workouts_completed || 0), 0);
        setWeeklyWorkoutCount(totalWorkouts);
      }
      return;
    }

    if (error) throw error;
    if (data) {
      const progressData = data.map(item => ({
        date: item.date,
        calories_consumed: item.calories_consumed || 0,
        workouts_completed: item.workouts_completed || 0
      }));
      
      setWeeklyProgress(progressData);
      const totalWorkouts = progressData.reduce((sum, day) => sum + (day.workouts_completed || 0), 0);
      setWeeklyWorkoutCount(totalWorkouts);
    }
  };

  const chartConfig = {
    calories: {
      label: 'Calories',
      color: '#F59E0B',
    },
    workouts: {
      label: 'Workouts',
      color: '#10B981',
    },
  };

  const getCalorieProgress = () => {
    if (!userGoals || !todayProgress) return 0;
    return Math.min((todayProgress.calories_consumed / userGoals.daily_calorie_goal) * 100, 100);
  };

  const getWorkoutProgress = () => {
    if (!userGoals) return 0;
    return Math.min((weeklyWorkoutCount / userGoals.weekly_workout_goal) * 100, 100);
  };

  const getRemainingCalories = () => {
    if (!userGoals || !todayProgress) return userGoals?.daily_calorie_goal || 0;
    return Math.max(userGoals.daily_calorie_goal - todayProgress.calories_consumed, 0);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!userGoals) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Goals Set</h3>
          <p className="text-muted-foreground">Set your fitness goals to start tracking progress</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Daily Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600 dark:text-orange-400">
                    {todayProgress?.calories_consumed || 0} / {userGoals.daily_calorie_goal}
                  </span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {Math.round(getCalorieProgress())}%
                  </span>
                </div>
                <Progress 
                  value={getCalorieProgress()} 
                  className="h-3"
                />
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {getRemainingCalories()} calories remaining
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Weekly Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    {weeklyWorkoutCount} / {userGoals.weekly_workout_goal}
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {Math.round(getWorkoutProgress())}%
                  </span>
                </div>
                <Progress 
                  value={getWorkoutProgress()} 
                  className="h-3"
                />
                <p className="text-xs text-green-600 dark:text-green-400">
                  {Math.max(userGoals.weekly_workout_goal - weeklyWorkoutCount, 0)} workouts to go
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Trend Chart */}
      {weeklyProgress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                7-Day Progress Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={weeklyProgress}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { weekday: 'short' })}
                  />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="calories_consumed" 
                    stroke="var(--color-calories)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-calories)", strokeWidth: 2, r: 4 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">
              {getWorkoutProgress() >= 100 ? "🎉 Weekly Goal Achieved!" : 
               getWorkoutProgress() >= 70 ? "💪 You're almost there!" : 
               "🚀 Keep pushing forward!"}
            </h3>
            <p className="text-muted-foreground">
              {getWorkoutProgress() >= 100 ? 
                "Congratulations! You've reached your weekly workout goal." :
                `You're ${Math.round(getWorkoutProgress())}% towards your weekly goal. Every workout counts!`}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
