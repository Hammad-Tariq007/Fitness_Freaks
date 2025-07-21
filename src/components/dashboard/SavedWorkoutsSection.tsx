
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Dumbbell, Play, Eye, Clock, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSavedWorkouts } from '@/hooks/useSavedWorkouts';

export const SavedWorkoutsSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { removeWorkout, isRemoving } = useSavedWorkouts();

  const { data: savedWorkouts, isLoading } = useQuery({
    queryKey: ['savedWorkoutsWithDetails', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_workouts')
        .select(`
          *,
          workouts:workout_id (
            id,
            title,
            image_url,
            category,
            duration,
            description,
            video_url,
            level,
            tags
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleViewWorkout = (workoutId: string) => {
    navigate(`/workouts/${workoutId}`);
  };

  const handleWatchVideo = (videoUrl: string | null) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-muted rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Dumbbell className="w-10 h-10 text-primary" />
          Saved Workouts
        </h2>
        <p className="text-xl text-muted-foreground">Your personalized workout collection</p>
      </motion.div>

      {savedWorkouts && savedWorkouts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedWorkouts.map((savedWorkout: any, index: number) => (
            <motion.div
              key={savedWorkout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border border-border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={savedWorkout.workouts.image_url}
                    alt={savedWorkout.workouts.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getLevelColor(savedWorkout.workouts.level)}>
                      {savedWorkout.workouts.level}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/80 text-foreground">
                      {savedWorkout.workouts.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {savedWorkout.workouts.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {savedWorkout.workouts.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {savedWorkout.workouts.duration}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewWorkout(savedWorkout.workouts.id)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {savedWorkout.workouts.video_url && (
                      <Button
                        size="sm"
                        onClick={() => handleWatchVideo(savedWorkout.workouts.video_url)}
                        className="flex-1"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Watch
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeWorkout(savedWorkout.workouts.id)}
                      disabled={isRemoving}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Card className="border border-border bg-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Saved Workouts Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start exploring our workout library and save your favorites!
              </p>
              <Button onClick={() => navigate('/workouts')}>
                Browse Workouts
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
