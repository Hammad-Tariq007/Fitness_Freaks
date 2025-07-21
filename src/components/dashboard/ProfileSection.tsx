
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { User, Settings, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DashboardBMICalculator } from '@/components/DashboardBMICalculator';

export const ProfileSection: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    gender: profile?.gender || '',
    height: profile?.height || 0,
    weight: profile?.weight || 0,
    goal: profile?.goal || '',
  });

  const formatGoal = (goal: string) => {
    switch (goal) {
      case 'lose_weight':
        return 'Lose Weight';
      case 'gain_muscle':
        return 'Gain Muscle';
      case 'maintain':
        return 'Maintain';
      default:
        return goal;
    }
  };

  const handleSave = async () => {
    if (!profile?.user_id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: formData.name,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          goal: formData.goal,
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved.",
      });
      
      setIsEditing(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <User className="w-10 h-10 text-primary" />
          Profile Settings
        </h2>
        <p className="text-xl text-muted-foreground">Manage your personal information and preferences</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="text-foreground font-medium">{profile?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Gender</p>
                      <p className="text-foreground font-medium capitalize">{profile?.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Height</p>
                      <p className="text-foreground font-medium">{profile?.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Weight</p>
                      <p className="text-foreground font-medium">{profile?.weight} kg</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fitness Goal</p>
                    <p className="text-foreground font-medium">{formatGoal(profile?.goal || '')}</p>
                  </div>

                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-input text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-foreground">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height" className="text-foreground">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                        className="bg-background border-input text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-foreground">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                        className="bg-background border-input text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goal" className="text-foreground">Fitness Goal</Label>
                    <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose_weight">Lose Weight</SelectItem>
                        <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                        <SelectItem value="maintain">Maintain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardBMICalculator />
        </motion.div>
      </div>
    </div>
  );
};
