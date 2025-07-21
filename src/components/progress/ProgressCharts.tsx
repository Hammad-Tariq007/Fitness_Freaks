
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressData {
  date: string;
  calories_consumed: number;
  workouts_completed: number;
  current_weight?: number;
  water_intake: number;
}

interface Goal {
  daily_calorie_goal: number;
  weekly_workout_goal: number;
  weight_goal?: number;
  macros_protein?: number;
  macros_carbs?: number;
  macros_fat?: number;
}

interface ProgressChartsProps {
  refreshTrigger: number;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [goals, setGoals] = useState<Goal | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, refreshTrigger]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch last 30 days of progress
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 29);

      const [progressResult, goalsResult] = await Promise.all([
        supabase
          .from('user_progress_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])
          .order('date', { ascending: true }),
        
        supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
      ]);

      if (progressResult.error) throw progressResult.error;
      if (goalsResult.error) throw goalsResult.error;

      setProgressData(progressResult.data || []);
      setGoals(goalsResult.data?.[0] || null);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    calories: {
      label: 'Calories',
      color: 'hsl(var(--primary))',
    },
    workouts: {
      label: 'Workouts',
      color: 'hsl(217, 91%, 60%)',
    },
    weight: {
      label: 'Weight',
      color: 'hsl(142, 76%, 36%)',
    },
    water: {
      label: 'Water',
      color: 'hsl(196, 94%, 67%)',
    },
  };

  const macroData = goals && (goals.macros_protein || goals.macros_carbs || goals.macros_fat) ? [
    { name: 'Protein', value: goals.macros_protein || 0, color: '#3B82F6' },
    { name: 'Carbs', value: goals.macros_carbs || 0, color: '#10B981' },
    { name: 'Fat', value: goals.macros_fat || 0, color: '#F59E0B' },
  ].filter(item => item.value > 0) : [];

  const recentWorkouts = progressData.slice(-7);
  const totalWeeklyWorkouts = recentWorkouts.reduce((sum, day) => sum + (day.workouts_completed || 0), 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (progressData.length === 0) {
    return (
      <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-8 text-center">
          <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Progress Data Yet</h3>
          <p className="text-muted-foreground">
            Start logging your daily progress to see your fitness journey visualized here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calories Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              Calorie Intake Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Line 
                  type="monotone" 
                  dataKey="calories_consumed" 
                  stroke="var(--color-calories)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-calories)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "var(--color-calories)", strokeWidth: 2 }}
                  animationDuration={1500}
                />
                {goals && (
                  <Line 
                    type="monotone" 
                    dataKey={() => goals.daily_calorie_goal}
                    stroke="var(--color-calories)"
                    strokeDasharray="8 4"
                    strokeOpacity={0.6}
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                <ChartTooltip content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm border border-border/50" />} />
              </LineChart>
            </ChartContainer>
            {goals && (
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                <div className="w-3 h-0.5 bg-primary rounded opacity-60"></div>
                Daily goal: {goals.daily_calorie_goal} calories
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Workouts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Weekly Workout Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={recentWorkouts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en', { weekday: 'short' })}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Bar 
                  dataKey="workouts_completed" 
                  fill="var(--color-workouts)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1200}
                />
                <ChartTooltip content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm border border-border/50" />} />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                This week: {totalWeeklyWorkouts} workouts
              </span>
              {goals && (
                <span className="text-muted-foreground">
                  Goal: {goals.weekly_workout_goal} workouts
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weight Progress */}
      {progressData.some(d => d.current_weight) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Weight Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={progressData.filter(d => d.current_weight)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Line 
                    type="monotone" 
                    dataKey="current_weight" 
                    stroke="var(--color-weight)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-weight)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "var(--color-weight)", strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                  {goals?.weight_goal && (
                    <Line 
                      type="monotone" 
                      dataKey={() => goals.weight_goal}
                      stroke="var(--color-weight)"
                      strokeDasharray="8 4"
                      strokeOpacity={0.6}
                      strokeWidth={2}
                      dot={false}
                    />
                  )}
                  <ChartTooltip content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm border border-border/50" />} />
                </LineChart>
              </ChartContainer>
              {goals?.weight_goal && (
                <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-green-600 rounded opacity-60"></div>
                  Target weight: {goals.weight_goal} kg
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Macro Distribution */}
      {macroData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChartIcon className="w-5 h-5 text-orange-500" />
                Macronutrient Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1200}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm border border-border/50" />} />
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center gap-6 mt-4">
                {macroData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium">
                      {entry.name}: {entry.value}g
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
