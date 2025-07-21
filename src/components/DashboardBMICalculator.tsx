
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Target, Zap, Clock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SaveWorkoutButton } from '@/components/SaveWorkoutButton';
import { SaveNutritionPlanButton } from '@/components/SaveNutritionPlanButton';
import { Badge } from '@/components/ui/badge';
import { BMIChart } from '@/components/BMIChart';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
}

interface Workout {
  id: string;
  title: string;
  image_url: string;
  category: string;
  duration: string;
  description: string;
  level: string;
  tags: string[];
}

interface NutritionPlan {
  id: string;
  title: string;
  image_url: string;
  calories: number;
  description: string;
  goal: string;
  macros: any;
}

export const DashboardBMICalculator: React.FC = () => {
  const { user, profile } = useAuth();
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [goal, setGoal] = useState(profile?.goal || '');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Fetch recommended workouts based on BMI and goal
  const { data: recommendedWorkouts, isLoading: isLoadingWorkouts } = useQuery({
    queryKey: ['recommendedWorkouts', result?.bmi, goal],
    queryFn: async () => {
      if (!result) return [];
      
      let workoutQuery = supabase.from('workouts').select('*');
      
      // Filter based on BMI and goal
      if (result.bmi < 18.5 || goal === 'gain_muscle') {
        // Focus on strength and muscle building
        workoutQuery = workoutQuery.or('category.eq.Strength,tags.cs.{strength}');
      } else if (result.bmi >= 25 || goal === 'lose_weight') {
        // Focus on cardio and HIIT
        workoutQuery = workoutQuery.or('category.eq.HIIT,category.eq.Cardio,tags.cs.{cardio}');
      } else {
        // Balanced workouts for maintenance
        workoutQuery = workoutQuery.or('category.eq.Core,category.eq.Flexibility,tags.cs.{full body}');
      }
      
      const { data, error } = await workoutQuery.limit(4);
      if (error) throw error;
      return data as Workout[];
    },
    enabled: !!result,
  });

  // Fetch recommended nutrition plans based on BMI
  const { data: recommendedNutritionPlans, isLoading: isLoadingNutrition } = useQuery({
    queryKey: ['recommendedNutritionPlans', result?.bmi, goal],
    queryFn: async () => {
      if (!result) return [];
      
      let nutritionGoal = '';
      if (result.bmi < 18.5 || goal === 'gain_muscle') {
        nutritionGoal = 'bulking';
      } else if (result.bmi >= 25 || goal === 'lose_weight') {
        nutritionGoal = 'cutting';
      } else {
        nutritionGoal = 'maintenance';
      }
      
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('goal', nutritionGoal)
        .limit(3);
      
      if (error) throw error;
      return data as NutritionPlan[];
    },
    enabled: !!result,
  });

  const calculateBMI = async () => {
    if (!height || !weight) return;

    setIsCalculating(true);

    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmi = weightInKg / (heightInM * heightInM);

    let category = '';
    let categoryColor = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-blue-600';
    } else if (bmi < 25) {
      category = 'Normal weight';
      categoryColor = 'text-green-600';
    } else {
      category = 'Overweight';
      categoryColor = 'text-red-600';
    }

    const bmiResult: BMIResult = {
      bmi: Math.round(bmi * 10) / 10,
      category,
      categoryColor,
    };

    setResult(bmiResult);
    setIsCalculating(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* BMI Calculator */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="w-5 h-5" />
            BMI Calculator & Personal Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-gray-300">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-gray-300">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-gray-300">Fitness Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateBMI} 
            className="w-full bg-white text-black hover:bg-gray-200" 
            disabled={!height || !weight || isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate BMI & Get Recommendations'}
          </Button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* BMI Chart */}
                <BMIChart 
                  bmi={result.bmi}
                  category={result.category}
                  categoryColor={result.categoryColor}
                />
                
                {/* BMI Info */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">BMI Analysis</h3>
                      <div className={`text-lg font-medium ${result.categoryColor}`}>
                        {result.category}
                      </div>
                    </div>
                    
                    {goal && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <Target className="w-4 h-4" />
                        <span>Goal: {goal.replace('_', ' ')}</span>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-400 text-center">
                      Based on your BMI and goals, we've curated personalized workout and nutrition recommendations below.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Recommended Workouts */}
      {result && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">💪 Recommended Workouts for You</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingWorkouts ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg h-48 animate-pulse" />
                ))}
              </div>
            ) : recommendedWorkouts && recommendedWorkouts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {recommendedWorkouts.map((workout) => (
                  <motion.div
                    key={workout.id}
                    className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 hover:border-gray-500 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <img
                        src={workout.image_url}
                        alt={workout.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={getLevelColor(workout.level)}>
                          {workout.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {workout.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {workout.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {workout.duration}
                        </div>
                        <span>{workout.category}</span>
                      </div>
                      
                      <SaveWorkoutButton workoutId={workout.id} variant="default" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No matching workouts found. Try updating your goal.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommended Nutrition Plans */}
      {result && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">🥗 Personalized Nutrition Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingNutrition ? (
              <div className="grid md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg h-48 animate-pulse" />
                ))}
              </div>
            ) : recommendedNutritionPlans && recommendedNutritionPlans.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {recommendedNutritionPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 hover:border-gray-500 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <img
                        src={plan.image_url}
                        alt={plan.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary">{plan.goal}</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {plan.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {plan.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {plan.calories} cal
                        </div>
                      </div>
                      
                      <SaveNutritionPlanButton nutritionPlanId={plan.id} variant="default" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No matching nutrition plans found. Try updating your goal.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
