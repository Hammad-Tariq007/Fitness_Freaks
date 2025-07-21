
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Lock, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  showUpgrade?: boolean;
  blurContent?: boolean;
  dimContent?: boolean;
}

export const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({
  children,
  feature,
  description = "This feature is part of the FitnessFreaks Pro Plan",
  showUpgrade = true,
  blurContent = false,
  dimContent = false,
}) => {
  const { hasPremiumAccess } = usePremiumAccess();
  const navigate = useNavigate();

  if (hasPremiumAccess) {
    return <>{children}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <div className="relative">
      {/* Gated content with effects */}
      <div className={`${blurContent ? 'blur-sm' : ''} ${dimContent ? 'opacity-30' : ''}`}>
        {children}
      </div>
      
      {/* Premium overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
      >
        <Card className="max-w-sm mx-4 border-2 border-purple-200 dark:border-purple-600 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Pro Feature
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {description}
            </p>
            
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Star className="w-3 h-3" />
                <span>Unlock {feature}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Zap className="w-3 h-3" />
                <span>Access all premium features</span>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="sm"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
