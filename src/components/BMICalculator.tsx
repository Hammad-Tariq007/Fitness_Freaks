
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBMIRecommendations } from '@/utils/bmiRecommendations';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  recommendations?: string[];
  explanation?: string;
}

interface BMICalculatorProps {
  onRecommendations?: (goals: string[], explanation: string) => void;
}

export const BMICalculator: React.FC<BMICalculatorProps> = ({ onRecommendations }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-yellow-600';
    } else {
      category = 'Obese';
      categoryColor = 'text-red-600';
    }

    const bmiResult: BMIResult = {
      bmi: Math.round(bmi * 10) / 10,
      category,
      categoryColor,
    };

    setResult(bmiResult);

    // Get local BMI-based recommendations
    const recommendations = getBMIRecommendations(bmiResult.bmi, goal);
    onRecommendations?.(recommendations.recommendedGoals, recommendations.explanation);

    setIsCalculating(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          BMI Calculator & Nutrition Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age (optional)</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Fitness Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Select your fitness goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose weight">Lose Weight</SelectItem>
              <SelectItem value="build muscle">Build Muscle</SelectItem>
              <SelectItem value="maintain weight">Maintain Weight</SelectItem>
              <SelectItem value="improve health">Improve Overall Health</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={calculateBMI} 
          className="w-full" 
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
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Your BMI: {result.bmi}</h3>
                <p className={`text-lg font-semibold ${result.categoryColor}`}>
                  {result.category}
                </p>
                {goal && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="w-4 h-4" />
                    <span>Goal: {goal}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
