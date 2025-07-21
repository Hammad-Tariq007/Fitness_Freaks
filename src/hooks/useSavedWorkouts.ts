
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SavedWorkout {
  id: string;
  workout_id: string;
  created_at: string;
}

export const useSavedWorkouts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's saved workouts
  const { data: savedWorkouts, isLoading } = useQuery({
    queryKey: ['savedWorkouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_workouts')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as SavedWorkout[];
    },
    enabled: !!user,
  });

  // Save workout mutation
  const saveWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('saved_workouts')
        .insert({
          user_id: user.id,
          workout_id: workoutId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWorkouts'] });
      toast({
        title: "Workout saved!",
        description: "You can find it in your dashboard.",
      });
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate')) {
        toast({
          title: "Already saved",
          description: "This workout is already in your dashboard.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error saving workout",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Remove workout mutation
  const removeWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('saved_workouts')
        .delete()
        .eq('user_id', user.id)
        .eq('workout_id', workoutId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWorkouts'] });
      queryClient.invalidateQueries({ queryKey: ['savedWorkoutsWithDetails'] });
      toast({
        title: "Workout removed",
        description: "Workout removed from your dashboard.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing workout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if a workout is saved
  const isWorkoutSaved = (workoutId: string) => {
    return savedWorkouts?.some(saved => saved.workout_id === workoutId) || false;
  };

  return {
    savedWorkouts,
    isLoading,
    saveWorkout: saveWorkoutMutation.mutate,
    removeWorkout: removeWorkoutMutation.mutate,
    isWorkoutSaved,
    isSaving: saveWorkoutMutation.isPending,
    isRemoving: removeWorkoutMutation.isPending,
  };
};
