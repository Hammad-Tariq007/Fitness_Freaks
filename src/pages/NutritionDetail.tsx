
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Clock, Target, Zap, Users, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { SaveNutritionPlanButton } from '@/components/SaveNutritionPlanButton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NutritionPlan {
  id: string;
  title: string;
  description: string;
  image_url: string;
  goal: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Array<{
    name: string;
    calories: number;
    description: string;
    foods: string[];
  }>;
}

const NutritionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: nutritionPlan, isLoading, error } = useQuery({
    queryKey: ['nutrition-plan', id],
    queryFn: async () => {
      if (!id) throw new Error('No nutrition plan ID provided');
      
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        goal: data.goal,
        calories: data.calories,
        macros: typeof data.macros === 'object' && data.macros !== null 
          ? data.macros as { protein: number; carbs: number; fat: number; }
          : { protein: 0, carbs: 0, fat: 0 },
        meals: Array.isArray(data.meals) ? data.meals : []
      } as NutritionPlan;
    },
    enabled: !!id,
  });

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'cutting':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'bulking':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getGoalDisplayName = (goal: string) => {
    switch (goal) {
      case 'cutting':
        return 'Lose Fat';
      case 'bulking':
        return 'Gain Muscle';
      case 'maintenance':
        return 'Maintain';
      default:
        return goal.charAt(0).toUpperCase() + goal.slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-32"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !nutritionPlan) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Nutrition Plan Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The nutrition plan you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/nutrition')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Nutrition Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalMacros = nutritionPlan.macros.protein + nutritionPlan.macros.carbs + nutritionPlan.macros.fat;
  const proteinPercentage = Math.round((nutritionPlan.macros.protein / totalMacros) * 100);
  const carbsPercentage = Math.round((nutritionPlan.macros.carbs / totalMacros) * 100);
  const fatPercentage = Math.round((nutritionPlan.macros.fat / totalMacros) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-6 py-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/nutrition')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Nutrition Plans
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={nutritionPlan.image_url}
                alt={nutritionPlan.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <Badge className={getGoalColor(nutritionPlan.goal)}>
                  {getGoalDisplayName(nutritionPlan.goal)}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
              {nutritionPlan.title}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Zap className="w-5 h-5" />
                <span className="font-medium">{nutritionPlan.calories} cal/day</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Target className="w-5 h-5" />
                <span className="font-medium">{getGoalDisplayName(nutritionPlan.goal)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Apple className="w-5 h-5" />
                <span className="font-medium">{nutritionPlan.meals.length} meals</span>
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {nutritionPlan.description}
            </p>

            {/* Macro Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">Daily Macros</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{nutritionPlan.macros.protein}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Protein ({proteinPercentage}%)</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{nutritionPlan.macros.carbs}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Carbs ({carbsPercentage}%)</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{nutritionPlan.macros.fat}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fat ({fatPercentage}%)</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <SaveNutritionPlanButton nutritionPlanId={nutritionPlan.id} />
            </div>
          </motion.div>
        </div>

        {/* Meals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8">Daily Meal Plan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nutritionPlan.meals.map((meal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-black dark:text-white">
                        {meal.name}
                      </span>
                      <Badge variant="secondary">{meal.calories} cal</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {meal.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-black dark:text-white">Foods:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {meal.foods.map((food, foodIndex) => (
                          <li key={foodIndex} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NutritionDetail;
