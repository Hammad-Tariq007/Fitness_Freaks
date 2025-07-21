
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Target, Save } from 'lucide-react';

interface Goal {
  daily_calorie_goal: number;
  weekly_workout_goal: number;
  weight_goal?: number;
  goal_type: string;
  target_date?: string;
  macros_protein?: number;
  macros_carbs?: number;
  macros_fat?: number;
}

interface GoalSettingModalProps {
  onGoalSaved: () => void;
  existingGoal?: Goal;
}

export const GoalSettingModal: React.FC<GoalSettingModalProps> = ({ onGoalSaved, existingGoal }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Goal>({
    daily_calorie_goal: 2000,
    weekly_workout_goal: 4,
    weight_goal: undefined,
    goal_type: 'maintain',
    target_date: '',
    macros_protein: 0,
    macros_carbs: 0,
    macros_fat: 0,
  });

  useEffect(() => {
    if (existingGoal) {
      setFormData({
        daily_calorie_goal: existingGoal.daily_calorie_goal,
        weekly_workout_goal: existingGoal.weekly_workout_goal,
        weight_goal: existingGoal.weight_goal,
        goal_type: existingGoal.goal_type,
        target_date: existingGoal.target_date,
        macros_protein: existingGoal.macros_protein || 0,
        macros_carbs: existingGoal.macros_carbs || 0,
        macros_fat: existingGoal.macros_fat || 0,
      });
    }
  }, [existingGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const goalData = {
        user_id: user.id,
        ...formData,
        target_date: formData.target_date || null,
        weight_goal: formData.weight_goal || null,
      };

      let result;
      if (existingGoal) {
        result = await supabase
          .from('user_goals')
          .update(goalData)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
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

      setOpen(false);
      onGoalSaved();
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

  const handleInputChange = (field: keyof Goal, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          {existingGoal ? 'Update Goals' : 'Set Goals'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {existingGoal ? 'Update Your Fitness Goals' : 'Set Your Fitness Goals'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="daily_calorie_goal">Daily Calorie Goal</Label>
              <Input
                id="daily_calorie_goal"
                type="number"
                min="1000"
                max="5000"
                value={formData.daily_calorie_goal}
                onChange={(e) => handleInputChange('daily_calorie_goal', parseInt(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="weekly_workout_goal">Weekly Workout Goal</Label>
              <Input
                id="weekly_workout_goal"
                type="number"
                min="1"
                max="14"
                value={formData.weekly_workout_goal}
                onChange={(e) => handleInputChange('weekly_workout_goal', parseInt(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="goal_type">Goal Type</Label>
              <Select 
                value={formData.goal_type} 
                onValueChange={(value) => handleInputChange('goal_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="gain_weight">Gain Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="build_muscle">Build Muscle</SelectItem>
                  <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight_goal">Target Weight (kg, optional)</Label>
              <Input
                id="weight_goal"
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={formData.weight_goal || ''}
                onChange={(e) => handleInputChange('weight_goal', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>

            <div>
              <Label htmlFor="target_date">Target Date (optional)</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => handleInputChange('target_date', e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold">Macronutrient Goals (optional)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="macros_protein">Protein (g)</Label>
                <Input
                  id="macros_protein"
                  type="number"
                  min="0"
                  value={formData.macros_protein}
                  onChange={(e) => handleInputChange('macros_protein', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="macros_carbs">Carbs (g)</Label>
                <Input
                  id="macros_carbs"
                  type="number"
                  min="0"
                  value={formData.macros_carbs}
                  onChange={(e) => handleInputChange('macros_carbs', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="macros_fat">Fat (g)</Label>
                <Input
                  id="macros_fat"
                  type="number"
                  min="0"
                  value={formData.macros_fat}
                  onChange={(e) => handleInputChange('macros_fat', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Goals'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
