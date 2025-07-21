
import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { SubscriptionManager } from '@/components/SubscriptionManager';

export const SubscriptionSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Crown className="w-10 h-10 text-primary" />
          Subscription & Billing
        </h2>
        <p className="text-xl text-muted-foreground">Manage your subscription and billing preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <SubscriptionManager />
      </motion.div>
    </div>
  );
};
