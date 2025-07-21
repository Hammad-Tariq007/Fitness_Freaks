
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Apple, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  meals: any[];
}

export const NutritionPreview = () => {
  const { data: nutritionPlans, isLoading } = useQuery({
    queryKey: ['nutrition-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(plan => ({
        id: plan.id,
        title: plan.title,
        description: plan.description,
        image_url: plan.image_url,
        goal: plan.goal,
        calories: plan.calories,
        macros: typeof plan.macros === 'object' && plan.macros !== null 
          ? plan.macros as { protein: number; carbs: number; fat: number; }
          : { protein: 0, carbs: 0, fat: 0 },
        meals: Array.isArray(plan.meals) ? plan.meals : []
      })) as NutritionPlan[];
    },
  });

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
      <section className="py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Nutrition That's Simple
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            AI-crafted meal plans that fit your lifestyle, dietary preferences, and fitness goals. No more guessing what to eat.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {nutritionPlans?.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                <div className="relative overflow-hidden">
                  <motion.img
                    src={plan.image_url}
                    alt={plan.title}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {plan.meals.length} Meals
                    </span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    {plan.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {plan.description}
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-black dark:text-white">{plan.calories}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">cal/day</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-black dark:text-white">{plan.macros.protein}g</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Protein</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-black dark:text-white">{plan.macros.carbs}g</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Carbs</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-black dark:text-white">{plan.macros.fat}g</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Fat</div>
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/nutrition/${plan.id}`}>
                    <Button className="w-full rounded-xl font-semibold hover:scale-105 transition-transform duration-200">
                      View Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link to="/nutrition">
            <Button 
              size="lg" 
              variant="outline"
              className="px-12 py-6 text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <Apple className="mr-3 w-5 h-5" />
              View All Plans
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
