
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { GoalSettingModal } from '@/components/progress/GoalSettingModal';
import { DailyProgressLogger } from '@/components/progress/DailyProgressLogger';
import { ProgressCharts } from '@/components/progress/ProgressCharts';
import { ProgressInsights } from '@/components/progress/ProgressInsights';

export const ProgressTrackerSection: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-primary" />
            Progress Tracker
          </h2>
          <p className="text-xl text-muted-foreground">
            Set goals, track daily progress, and visualize your fitness journey
          </p>
        </div>
        
        <GoalSettingModal onGoalSaved={handleDataUpdate} />
      </motion.div>

      {/* Progress Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProgressInsights refreshTrigger={refreshTrigger} />
      </motion.div>

      {/* Daily Progress Logger and Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Daily Logger */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-1"
        >
          <DailyProgressLogger onProgressSaved={handleDataUpdate} />
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          <ProgressCharts refreshTrigger={refreshTrigger} />
        </motion.div>
      </div>
    </div>
  );
};
