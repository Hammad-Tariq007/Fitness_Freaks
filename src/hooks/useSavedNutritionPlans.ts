
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SavedNutritionPlan {
  id: string;
  nutrition_plan_id: string;
  created_at: string;
}

export const useSavedNutritionPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's saved nutrition plans
  const { data: savedNutritionPlans, isLoading } = useQuery({
    queryKey: ['savedNutritionPlans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_nutrition_plans')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as SavedNutritionPlan[];
    },
    enabled: !!user,
  });

  // Save nutrition plan mutation
  const saveNutritionPlanMutation = useMutation({
    mutationFn: async (nutritionPlanId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('saved_nutrition_plans')
        .insert({
          user_id: user.id,
          nutrition_plan_id: nutritionPlanId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedNutritionPlans'] });
      toast({
        title: "Nutrition plan saved!",
        description: "You can find it in your dashboard.",
      });
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate')) {
        toast({
          title: "Already saved",
          description: "This nutrition plan is already in your dashboard.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error saving nutrition plan",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Remove nutrition plan mutation
  const removeNutritionPlanMutation = useMutation({
    mutationFn: async (nutritionPlanId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('saved_nutrition_plans')
        .delete()
        .eq('user_id', user.id)
        .eq('nutrition_plan_id', nutritionPlanId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedNutritionPlans'] });
      toast({
        title: "Nutrition plan removed",
        description: "Plan removed from your dashboard.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing nutrition plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if a nutrition plan is saved
  const isNutritionPlanSaved = (nutritionPlanId: string) => {
    return savedNutritionPlans?.some(saved => saved.nutrition_plan_id === nutritionPlanId) || false;
  };

  return {
    savedNutritionPlans,
    isLoading,
    saveNutritionPlan: saveNutritionPlanMutation.mutate,
    removeNutritionPlan: removeNutritionPlanMutation.mutate,
    isNutritionPlanSaved,
    isSaving: saveNutritionPlanMutation.isPending,
    isRemoving: removeNutritionPlanMutation.isPending,
  };
};
