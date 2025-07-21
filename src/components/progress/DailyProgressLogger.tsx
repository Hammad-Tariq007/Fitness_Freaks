
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Save, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyLog {
  id?: string;
  date: string;
  calories_consumed: number;
  workouts_completed: number;
  current_weight?: number;
  water_intake: number;
  notes?: string;
}

interface DailyProgressLoggerProps {
  onProgressSaved: () => void;
}

export const DailyProgressLogger: React.FC<DailyProgressLoggerProps> = ({ onProgressSaved }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<DailyLog>({
    date: today,
    calories_consumed: 0,
    workouts_completed: 0,
    current_weight: undefined,
    water_intake: 0,
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchTodayLog();
    }
  }, [user]);

  const fetchTodayLog = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_progress_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTodayLog(data);
        setFormData({
          id: data.id,
          date: data.date,
          calories_consumed: data.calories_consumed || 0,
          workouts_completed: data.workouts_completed || 0,
          current_weight: data.current_weight || undefined,
          water_intake: data.water_intake || 0,
          notes: data.notes || ''
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching today's log",
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
      const logData = {
        user_id: user.id,
        date: today,
        calories_consumed: formData.calories_consumed || 0,
        workouts_completed: formData.workouts_completed || 0,
        current_weight: formData.current_weight || null,
        water_intake: formData.water_intake || 0,
        notes: formData.notes?.trim() || null,
      };

      let result;
      if (todayLog) {
        result = await supabase
          .from('user_progress_logs')
          .update(logData)
          .eq('id', todayLog.id);
      } else {
        result = await supabase
          .from('user_progress_logs')
          .insert([logData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Progress logged successfully!",
        description: "Your daily progress has been saved.",
      });

      await fetchTodayLog();
      onProgressSaved();
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

  const handleInputChange = (field: keyof DailyLog, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Progress Log
            <span className="text-sm font-normal text-muted-foreground">
              ({new Date().toLocaleDateString()})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories_consumed">Calories Consumed</Label>
                <Input
                  id="calories_consumed"
                  type="number"
                  min="0"
                  max="10000"
                  value={formData.calories_consumed}
                  onChange={(e) => handleInputChange('calories_consumed', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="workouts_completed">Workouts Completed</Label>
                <Input
                  id="workouts_completed"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.workouts_completed}
                  onChange={(e) => handleInputChange('workouts_completed', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="current_weight">Current Weight (kg, optional)</Label>
                <Input
                  id="current_weight"
                  type="number"
                  step="0.1"
                  min="30"
                  max="200"
                  value={formData.current_weight || ''}
                  onChange={(e) => handleInputChange('current_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="75.0"
                />
              </div>

              <div>
                <Label htmlFor="water_intake">Water Intake (ml)</Label>
                <Input
                  id="water_intake"
                  type="number"
                  min="0"
                  max="10000"
                  value={formData.water_intake}
                  onChange={(e) => handleInputChange('water_intake', parseInt(e.target.value) || 0)}
                  placeholder="2000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="How are you feeling? Any observations about your progress..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : todayLog ? 'Update Progress' : 'Log Progress'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
