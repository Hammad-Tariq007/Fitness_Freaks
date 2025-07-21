
import React from 'react';
import { motion } from 'framer-motion';
import { GoalSettingForm } from './GoalSettingForm';
import { DailyProgressForm } from './DailyProgressForm';
import { ProgressAnalytics } from './ProgressAnalytics';

export const ProgressTracker: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">📈 Progress Tracker</h2>
        <p className="text-gray-400">Set goals, track progress, and achieve your fitness dreams</p>
      </div>

      {/* Goals and Daily Progress Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalSettingForm />
        <DailyProgressForm />
      </div>

      {/* Analytics Dashboard */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Your Progress Analytics</h3>
        <ProgressAnalytics />
      </div>
    </motion.div>
  );
};
