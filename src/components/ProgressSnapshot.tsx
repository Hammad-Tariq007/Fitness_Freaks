
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Activity, Target, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for demonstration
const weeklyWorkouts = [
  { day: 'Mon', workouts: 1 },
  { day: 'Tue', workouts: 0 },
  { day: 'Wed', workouts: 1 },
  { day: 'Thu', workouts: 1 },
  { day: 'Fri', workouts: 0 },
  { day: 'Sat', workouts: 1 },
  { day: 'Sun', workouts: 0 },
];

const caloriesData = [
  { week: 'W1', burned: 1200, goal: 1500 },
  { week: 'W2', burned: 1400, goal: 1500 },
  { week: 'W3', burned: 1600, goal: 1500 },
  { week: 'W4', burned: 1350, goal: 1500 },
];

const chartConfig = {
  workouts: {
    label: 'Workouts',
    color: '#10B981',
  },
  burned: {
    label: 'Calories Burned',
    color: '#3B82F6',
  },
  goal: {
    label: 'Goal',
    color: '#F59E0B',
  },
};

export const ProgressSnapshot: React.FC = () => {
  const totalWorkoutsThisWeek = weeklyWorkouts.reduce((sum, day) => sum + day.workouts, 0);
  const weeklyGoal = 4;
  const progressPercentage = (totalWorkoutsThisWeek / weeklyGoal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Weekly Workout Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {totalWorkoutsThisWeek}/{weeklyGoal}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Workouts completed
            </p>
            <div className="mt-2 bg-green-200 dark:bg-green-800 rounded-full h-2">
              <div 
                className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Workout Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:col-span-2"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-24 w-full">
              <BarChart data={weeklyWorkouts}>
                <Bar 
                  dataKey="workouts" 
                  fill="var(--color-workouts)"
                  radius={[2, 2, 0, 0]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calories Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              1,350
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Burned this week
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+12% from last week</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-4"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Monthly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-32 w-full">
              <LineChart data={caloriesData}>
                <XAxis dataKey="week" />
                <Line 
                  type="monotone" 
                  dataKey="burned" 
                  stroke="var(--color-burned)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-burned)", strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  stroke="var(--color-goal)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "var(--color-goal)", strokeWidth: 2, r: 3 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
