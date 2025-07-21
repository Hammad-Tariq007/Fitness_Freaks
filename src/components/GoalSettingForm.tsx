
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Target, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserGoal {
  id: string;
  daily_calorie_goal: number;
  weekly_workout_goal: number;
  target_weight?: number;
}

export const GoalSettingForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingGoal, setExistingGoal] = useState<UserGoal | null>(null);
  
  const [formData, setFormData] = useState({
    daily_calorie_goal: 2000,
    weekly_workout_goal: 3,
    target_weight: ''
  });

  useEffect(() => {
    if (user) {
      fetchExistingGoals();
    }
  }, [user]);

  const fetchExistingGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const goal = data[0];
        setExistingGoal(goal);
        setFormData({
          daily_calorie_goal: goal.daily_calorie_goal,
          weekly_workout_goal: goal.weekly_workout_goal,
          target_weight: goal.target_weight?.toString() || ''
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching goals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const goalData = {
        user_id: user.id,
        daily_calorie_goal: parseInt(formData.daily_calorie_goal.toString()),
        weekly_workout_goal: parseInt(formData.weekly_workout_goal.toString()),
        target_weight: formData.target_weight ? parseInt(formData.target_weight) : null,
      };

      let result;
      if (existingGoal) {
        result = await supabase
          .from('user_goals')
          .update(goalData)
          .eq('id', existingGoal.id);
      } else {
        result = await supabase
          .from('user_goals')
          .insert([goalData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Goals saved successfully!",
        description: "Your fitness goals have been updated.",
      });

      // Refresh the data
      await fetchExistingGoals();
    } catch (error: any) {
      toast({
        title: "Error saving goals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-600 rounded w-1/4"></div>
            <div className="h-10 bg-gray-600 rounded"></div>
            <div className="h-10 bg-gray-600 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            {existingGoal ? 'Update Your Goals' : 'Set Your Fitness Goals'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="daily_calorie_goal" className="text-gray-300">
                Daily Calorie Goal
              </Label>
              <Input
                id="daily_calorie_goal"
                type="number"
                min="1000"
                max="5000"
                value={formData.daily_calorie_goal}
                onChange={(e) => handleInputChange('daily_calorie_goal', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="weekly_workout_goal" className="text-gray-300">
                Weekly Workout Goal
              </Label>
              <Input
                id="weekly_workout_goal"
                type="number"
                min="1"
                max="14"
                value={formData.weekly_workout_goal}
                onChange={(e) => handleInputChange('weekly_workout_goal', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="target_weight" className="text-gray-300">
                Target Weight (kg) - Optional
              </Label>
              <Input
                id="target_weight"
                type="number"
                min="30"
                max="200"
                value={formData.target_weight}
                onChange={(e) => handleInputChange('target_weight', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your target weight"
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : existingGoal ? 'Update Goals' : 'Set Goals'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
