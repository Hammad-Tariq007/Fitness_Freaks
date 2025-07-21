
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { AIChatAssistant } from '@/components/AIChatAssistant';

export const AICoachSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Bot className="w-10 h-10 text-primary" />
          AI Fitness Coach
        </h2>
        <p className="text-xl text-muted-foreground">Get personalized fitness advice and recommendations</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border border-border bg-card">
          <CardContent className="p-0">
            <div className="h-[600px]">
              <AIChatAssistant />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
