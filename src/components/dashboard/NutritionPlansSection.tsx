import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Heart, Eye, Trash2, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSavedNutritionPlans } from '@/hooks/useSavedNutritionPlans';

export const NutritionPlansSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { removeNutritionPlan, isRemoving } = useSavedNutritionPlans();

  const { data: savedNutritionPlans, isLoading } = useQuery({
    queryKey: ['savedNutritionPlansWithDetails', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_nutrition_plans')
        .select(`
          *,
          nutrition_plans:nutrition_plan_id (
            id,
            title,
            image_url,
            goal,
            calories,
            description,
            macros
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const formatGoal = (goal: string) => {
    switch (goal) {
      case 'lose_weight':
        return 'Lose Weight';
      case 'gain_muscle':
        return 'Gain Muscle';
      case 'maintain':
        return 'Maintain';
      default:
        return goal;
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'lose_weight':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'gain_muscle':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'maintain':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleViewNutritionPlan = (nutritionPlanId: string) => {
    navigate(`/nutrition/${nutritionPlanId}`);
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-muted rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Heart className="w-10 h-10 text-primary" />
          Nutrition Plans
        </h2>
        <p className="text-xl text-muted-foreground">Your saved meal plans and nutrition guides</p>
      </motion.div>

      {savedNutritionPlans && savedNutritionPlans.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedNutritionPlans.map((savedPlan: any, index: number) => (
            <motion.div
              key={savedPlan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border border-border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={savedPlan.nutrition_plans.image_url}
                    alt={savedPlan.nutrition_plans.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getGoalColor(savedPlan.nutrition_plans.goal)}>
                      {formatGoal(savedPlan.nutrition_plans.goal)}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {savedPlan.nutrition_plans.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {savedPlan.nutrition_plans.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {savedPlan.nutrition_plans.calories} cal
                    </div>
                    {savedPlan.nutrition_plans.macros && (
                      <div className="text-xs">
                        P: {savedPlan.nutrition_plans.macros.protein || 0}g
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewNutritionPlan(savedPlan.nutrition_plans.id)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeNutritionPlan(savedPlan.nutrition_plans.id)}
                      disabled={isRemoving}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Card className="border border-border bg-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🥗</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Nutrition Plans Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start exploring our nutrition plans and save your favorites!
              </p>
              <Button onClick={() => navigate('/nutrition')}>
                Browse Nutrition Plans
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
