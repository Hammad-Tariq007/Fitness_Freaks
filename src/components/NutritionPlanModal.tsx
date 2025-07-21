
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SaveNutritionPlanButton } from './SaveNutritionPlanButton';

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
}

interface NutritionPlanModalProps {
  plan: NutritionPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionPlanModal: React.FC<NutritionPlanModalProps> = ({
  plan,
  isOpen,
  onClose,
}) => {
  if (!plan) return null;

  const totalMacros = plan.macros.protein + plan.macros.carbs + plan.macros.fat;
  const proteinPercentage = Math.round((plan.macros.protein / totalMacros) * 100);
  const carbsPercentage = Math.round((plan.macros.carbs / totalMacros) * 100);
  const fatPercentage = Math.round((plan.macros.fat / totalMacros) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{plan.title}</span>
            <SaveNutritionPlanButton nutritionPlanId={plan.id} variant="compact" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={plan.image_url}
              alt={plan.title}
              className="w-full md:w-64 h-48 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{plan.goal}</Badge>
                <span className="text-lg font-semibold">{plan.calories} calories/day</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Macro Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>{plan.macros.protein}g ({proteinPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${proteinPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Carbs</span>
                    <span>{plan.macros.carbs}g ({carbsPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${carbsPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fat</span>
                    <span>{plan.macros.fat}g ({fatPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${fatPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Meals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.meals.map((meal: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">{meal.meal}</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {meal.foods.map((food: string, foodIndex: number) => (
                          <li key={foodIndex}>• {food}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
