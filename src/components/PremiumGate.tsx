
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface PremiumGateProps {
  feature: string;
  description?: string;
  benefits?: string[];
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ 
  feature, 
  description = "This feature requires a Pro subscription",
  benefits = [
    "Unlimited access to all workouts",
    "AI-powered recommendations", 
    "Advanced progress tracking",
    "Priority support"
  ]
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-2 border-purple-200 dark:border-purple-600 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold">
              Unlock {feature}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {description}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <Star className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/pricing')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
              
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
