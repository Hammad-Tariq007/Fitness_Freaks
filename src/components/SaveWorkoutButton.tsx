
import React from 'react';
import { Heart, Loader2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedWorkouts } from '@/hooks/useSavedWorkouts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SaveWorkoutButtonProps {
  workoutId: string;
  variant?: 'default' | 'compact';
}

export const SaveWorkoutButton: React.FC<SaveWorkoutButtonProps> = ({ 
  workoutId, 
  variant = 'default' 
}) => {
  const { user } = useAuth();
  const { isWorkoutSaved, saveWorkout, removeWorkout, isSaving, isRemoving } = useSavedWorkouts();
  const { canSaveContent } = useFeatureAccess();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isSaved = isWorkoutSaved(workoutId);
  const isLoading = isSaving || isRemoving;

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save workouts to your dashboard.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!canSaveContent()) {
      toast({
        title: "Pro Feature",
        description: "Upgrade to Pro to save unlimited workouts to your dashboard.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

    if (isSaved) {
      removeWorkout(workoutId);
    } else {
      saveWorkout(workoutId);
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
              <p>Pro Feature - Upgrade to save workouts</p>
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
      {canSaveContent() ? (isSaved ? 'Saved ✓' : 'Save Workout') : 'Pro Feature'}
    </Button>
  );
};
