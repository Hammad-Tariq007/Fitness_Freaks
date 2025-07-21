
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyProgress {
  id: string;
  date: string;
  calories_intake: number;
  workouts_completed: number;
  note?: string;
}

export const DailyProgressForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);
  
  const [formData, setFormData] = useState({
    calories_intake: 0,
    workouts_completed: 0,
    note: ''
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      fetchTodayProgress();
    }
  }, [user]);

  const fetchTodayProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTodayProgress(data);
        setFormData({
          calories_intake: data.calories_intake || 0,
          workouts_completed: data.workouts_completed || 0,
          note: data.note || ''
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching today's progress",
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
      const progressData = {
        user_id: user.id,
        date: today,
        calories_intake: parseInt(formData.calories_intake.toString()) || 0,
        workouts_completed: parseInt(formData.workouts_completed.toString()) || 0,
        note: formData.note.trim() || null,
      };

      let result;
      if (todayProgress) {
        result = await supabase
          .from('user_progress')
          .update(progressData)
          .eq('id', todayProgress.id);
      } else {
        result = await supabase
          .from('user_progress')
          .insert([progressData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Progress logged successfully!",
        description: "Your daily progress has been updated.",
      });

      // Refresh the data
      await fetchTodayProgress();
    } catch (error: any) {
      toast({
        title: "Error saving progress",
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Progress ({new Date().toLocaleDateString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="calories_intake" className="text-gray-300">
                Calories Consumed Today
              </Label>
              <Input
                id="calories_intake"
                type="number"
                min="0"
                max="10000"
                value={formData.calories_intake}
                onChange={(e) => handleInputChange('calories_intake', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="workouts_completed" className="text-gray-300">
                Workouts Completed Today
              </Label>
              <Input
                id="workouts_completed"
                type="number"
                min="0"
                max="10"
                value={formData.workouts_completed}
                onChange={(e) => handleInputChange('workouts_completed', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="note" className="text-gray-300">
                Notes (Optional)
              </Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="How are you feeling? Any observations?"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : todayProgress ? 'Update Progress' : 'Log Progress'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
