
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { SaveNutritionPlanButton } from '@/components/SaveNutritionPlanButton';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, Clock, Target, Crown, Apple } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useToast } from '@/hooks/use-toast';
import { PremiumFeatureGate } from '@/components/PremiumFeatureGate';

interface NutritionPlan {
  id: string;
  title: string;
  image_url: string;
  goal: string;
  calories: number;
  meals: any[];
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  description: string;
  duration?: string;
  category: string;
}

const Nutrition = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('all');
  const navigate = useNavigate();
  const { hasPremiumAccess } = useFeatureAccess();
  const { toast } = useToast();

  const { data: nutritionPlans, isLoading } = useQuery({
    queryKey: ['nutritionPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(plan => ({
        id: plan.id,
        title: plan.title,
        image_url: plan.image_url,
        goal: plan.goal,
        calories: plan.calories,
        description: plan.description,
        meals: Array.isArray(plan.meals) ? plan.meals : [],
        macros: typeof plan.macros === 'object' && plan.macros !== null 
          ? plan.macros as { protein: number; carbs: number; fat: number; }
          : { protein: 0, carbs: 0, fat: 0 },
        duration: '7 days',
        category: plan.goal
      })) as NutritionPlan[];
    },
  });

  // Filter plans
  const filteredPlans = nutritionPlans?.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGoal = selectedGoal === 'all' || plan.goal.toLowerCase() === selectedGoal.toLowerCase();
    
    return matchesSearch && matchesGoal;
  }) || [];

  // Restrict free users to first 3 plans
  const nutritionLimit = hasPremiumAccess ? Infinity : 3;
  const displayedPlans = nutritionLimit === Infinity ? filteredPlans : filteredPlans.slice(0, nutritionLimit);
  const hasMorePlans = filteredPlans.length > nutritionLimit;

  const handleViewPlan = (planId: string, index: number) => {
    if (!hasPremiumAccess && index >= 3) {
      toast({
        title: "Upgrade to Pro",
        description: "Upgrade to access the full set of personalized nutrition plans.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }
    navigate(`/nutrition/${planId}`);
  };

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
        return 'Cutting';
      case 'bulking':
        return 'Bulking';
      case 'maintenance':
        return 'Maintenance';
      default:
        return goal.charAt(0).toUpperCase() + goal.slice(1);
    }
  };

  const goals = ['all', 'cutting', 'bulking', 'maintenance'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-6 py-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6">
            Nutrition Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Discover expertly crafted nutrition plans designed to help you reach your fitness goals
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            30+ Premium Plans • All Fitness Goals • Expert Designed
          </p>
          
          {!hasPremiumAccess && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Free users can view {nutritionLimit} nutrition plans</span>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Upgrade to Pro for unlimited access to our complete nutrition library
              </p>
            </div>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search nutrition plans..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <select
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:text-white min-w-[140px]"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
              >
                <option value="all">All Goals</option>
                {goals.slice(1).map(goal => (
                  <option key={goal} value={goal}>
                    {getGoalDisplayName(goal)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 group">
                    <div className="relative overflow-hidden">
                      <img
                        src={plan.image_url}
                        alt={plan.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3">
                        <Badge className={getGoalColor(plan.goal)}>
                          {getGoalDisplayName(plan.goal)}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          {plan.calories} cal
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <SaveNutritionPlanButton nutritionPlanId={plan.id} variant="compact" />
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {plan.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                        {plan.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {plan.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Apple className="w-4 h-4" />
                          {plan.meals.length} meals
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewPlan(plan.id, index)}
                          className="flex-1"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Premium Gate for additional plans */}
            {hasMorePlans && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-16"
              >
                <PremiumFeatureGate
                  feature="Unlimited Nutrition Plans"
                  description="Upgrade to Pro to access our complete library of expert-designed nutrition plans"
                  showUpgrade={true}
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPlans.slice(nutritionLimit, nutritionLimit + 6).map((plan, index) => (
                      <Card key={plan.id} className="h-full opacity-50 pointer-events-none">
                        <div className="relative">
                          <img
                            src={plan.image_url}
                            alt={plan.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className={getGoalColor(plan.goal)}>
                              {getGoalDisplayName(plan.goal)}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="line-clamp-2">{plan.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                            {plan.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {plan.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Apple className="w-4 h-4" />
                              {plan.meals.length} meals
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </PremiumFeatureGate>
              </motion.div>
            )}
          </>
        )}

        {/* No Results Message */}
        {!isLoading && filteredPlans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No nutrition plans found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search criteria or browse all plans
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedGoal('all');
              }}
              className="mt-4"
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
