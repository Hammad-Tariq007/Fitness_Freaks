
import React from 'react';
import { Crown, Lock, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const PremiumDashboardGate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <Card className="rounded-2xl shadow-2xl border-2 border-purple-300 dark:border-purple-600 px-8 py-10 w-full max-w-md mx-auto animate-scale-in">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="font-bold text-xl text-center text-foreground mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5" /> Pro Feature
          </h2>
          <div className="text-muted-foreground mt-1 text-center mb-5">
            Upgrade to Pro to access your personalized dashboard and unlock the full FitnessFreaks experience.
          </div>
          <ul className="mb-6 w-full px-2 space-y-2">
            <li className="flex items-center text-purple-600 text-sm gap-2">
              <Star className="w-4 h-4" />
              Personalized Progress & Insights
            </li>
            <li className="flex items-center text-purple-600 text-sm gap-2">
              <Zap className="w-4 h-4" />
              Unlimited Workouts & Nutrition Plans
            </li>
            <li className="flex items-center text-purple-600 text-sm gap-2">
              <Crown className="w-4 h-4" />
              AI Assistance, Data Export, and more
            </li>
          </ul>
          <Button
            onClick={() => navigate('/pricing')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold text-base mb-2"
            size="lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Pro
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
};

