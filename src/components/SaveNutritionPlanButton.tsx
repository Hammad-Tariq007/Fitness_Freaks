
import React from 'react';
import { Heart, Loader2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedNutritionPlans } from '@/hooks/useSavedNutritionPlans';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SaveNutritionPlanButtonProps {
  nutritionPlanId: string;
  variant?: 'default' | 'compact';
}

export const SaveNutritionPlanButton: React.FC<SaveNutritionPlanButtonProps> = ({ 
  nutritionPlanId, 
  variant = 'default' 
}) => {
  const { user } = useAuth();
  const { isNutritionPlanSaved, saveNutritionPlan, removeNutritionPlan, isSaving, isRemoving } = useSavedNutritionPlans();
  const { canSaveContent } = useFeatureAccess();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isSaved = isNutritionPlanSaved(nutritionPlanId);
  const isLoading = isSaving || isRemoving;

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save nutrition plans to your dashboard.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!canSaveContent()) {
      toast({
        title: "Pro Feature",
        description: "Upgrade to Pro to save unlimited nutrition plans to your dashboard.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

    if (isSaved) {
      removeNutritionPlan(nutritionPlanId);
    } else {
      saveNutritionPlan(nutritionPlanId);
    }
  };

  if (variant === 'compact') {
    const button = (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className={`p-2 ${isSaved ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : canSaveContent() ? (
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        ) : (
          <Crown className="w-4 h-4 text-purple-500" />
        )}
      </Button>
    );

    if (!canSaveContent()) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent>
              <p>Pro Feature - Upgrade to save plans</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  }

  return (
    <Button
      variant={isSaved ? "secondary" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : canSaveContent() ? (
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
      ) : (
        <Crown className="w-4 h-4 text-purple-500" />
      )}
      {canSaveContent() ? (isSaved ? 'Saved ✓' : 'Save Plan') : 'Pro Feature'}
    </Button>
  );
};
