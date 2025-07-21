import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, BarChart3, Tag, Users, Dumbbell, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { SaveWorkoutButton } from '@/components/SaveWorkoutButton';
import { WorkoutVideoModal } from '@/components/WorkoutVideoModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Exercise {
  name: string;
  description?: string;
  duration?: string;
  sets?: string;
  reps?: string;
  rest?: string;
  type?: string;
}

interface Workout {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: string;
  level: string;
  category: string;
  tags: string[];
  video_url?: string;
  youtube_url?: string;
}

const WorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const { data: workout, isLoading, error } = useQuery({
    queryKey: ['workout', id],
    queryFn: async () => {
      if (!id) throw new Error('No workout ID provided');
      
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Workout;
    },
    enabled: !!id,
  });

  // Enhanced exercise data based on workout category and level
  const generateExercises = (workout: Workout): Exercise[] => {
    const exercises: { [key: string]: Exercise[] } = {
      'Strength': [
        { name: 'Warm-up', description: 'Dynamic stretching and light cardio', duration: '5 minutes' },
        { name: 'Compound Movements', description: 'Multi-joint exercises targeting major muscle groups', sets: '4', reps: '8-12', rest: '2-3 minutes' },
        { name: 'Isolation Work', description: 'Single-joint exercises for muscle refinement', sets: '3', reps: '10-15', rest: '60-90 seconds' },
        { name: 'Core Finisher', description: 'Targeted abdominal and stability work', sets: '3', reps: '15-20', rest: '45 seconds' },
        { name: 'Cool Down', description: 'Static stretching and recovery', duration: '5-10 minutes' }
      ],
      'Cardio': [
        { name: 'Warm-up', description: 'Gradual heart rate elevation', duration: '5 minutes' },
        { name: 'Main Cardio Block', description: 'Sustained cardiovascular exercise', duration: '20-35 minutes' },
        { name: 'Interval Training', description: 'High-intensity bursts with recovery', sets: '6-8', duration: '1-2 minutes', rest: '30-60 seconds' },
        { name: 'Cool Down', description: 'Gradual heart rate reduction', duration: '5-10 minutes' }
      ],
      'HIIT': [
        { name: 'Dynamic Warm-up', description: 'Movement preparation', duration: '3-5 minutes' },
        { name: 'High Intensity Intervals', description: 'Maximum effort exercises', duration: '20-45 seconds', rest: '10-20 seconds' },
        { name: 'Active Recovery', description: 'Low-intensity movement between rounds', duration: '60-90 seconds' },
        { name: 'Finisher Circuit', description: 'Final push to exhaustion', sets: '2-3', duration: '30 seconds', rest: '15 seconds' },
        { name: 'Recovery Stretch', description: 'Static stretching and breathing', duration: '5 minutes' }
      ],
      'Yoga': [
        { name: 'Centering', description: 'Breathing and mindfulness practice', duration: '3-5 minutes', type: 'Meditation' },
        { name: 'Sun Salutation', description: 'Flowing warm-up sequence', duration: '8-10 minutes', type: 'Flow' },
        { name: 'Standing Poses', description: 'Strength and balance poses', duration: '15-20 minutes', type: 'Strength' },
        { name: 'Seated/Floor Work', description: 'Hip openers and twists', duration: '15-20 minutes', type: 'Flexibility' },
        { name: 'Savasana', description: 'Final relaxation pose', duration: '5-10 minutes', type: 'Relaxation' }
      ],
      'Flexibility': [
        { name: 'Gentle Movement', description: 'Joint mobility and activation', duration: '5 minutes' },
        { name: 'Upper Body Stretches', description: 'Neck, shoulders, and arm stretches', duration: '8-10 minutes' },
        { name: 'Lower Body Stretches', description: 'Hip, leg, and back stretches', duration: '10-12 minutes' },
        { name: 'Full Body Flow', description: 'Integrated stretching sequence', duration: '5-8 minutes' },
        { name: 'Relaxation', description: 'Breathing and mindfulness', duration: '3-5 minutes' }
      ]
    };

    return exercises[workout.category] || exercises['Strength'];
  };

  const handleStartWorkout = () => {
    const workoutUrl = workout?.youtube_url || workout?.video_url;
    if (workoutUrl) {
      // Open YouTube video in new tab
      window.open(workoutUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWatchVideo = () => {
    if (workout?.video_url) {
      setIsVideoModalOpen(true);
    } else {
      handleStartWorkout();
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-32"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Workout Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The workout you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/workouts')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workouts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const exercises = generateExercises(workout);
  const hasVideoUrl = workout?.youtube_url || workout?.video_url;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-6 py-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/workouts')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workouts
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={workout.image_url}
                alt={workout.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <Badge className={getLevelColor(workout.level)}>
                  {workout.level}
                </Badge>
              </div>
              {hasVideoUrl && (
                <div className="absolute bottom-6 right-6">
                  <Button
                    onClick={handleWatchVideo}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Video
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
              {workout.title}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{workout.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">{workout.category}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Dumbbell className="w-5 h-5" />
                <span className="font-medium">{workout.level}</span>
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {workout.description}
            </p>

            {workout.tags && workout.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-black dark:text-white">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {workout.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleStartWorkout}
                size="lg"
                className="flex-1 transition-all duration-300 hover:scale-105"
                disabled={!hasVideoUrl}
                aria-label="Start workout on YouTube"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Workout
                {hasVideoUrl && <ExternalLink className="w-4 h-4 ml-2" />}
              </Button>
              <SaveWorkoutButton workoutId={workout.id} />
            </div>
          </motion.div>
        </div>

        {/* Exercise List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8">Workout Structure</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  {exercise.name}
                </h3>
                {exercise.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {exercise.description}
                  </p>
                )}
                <div className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  {exercise.duration && (
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{exercise.duration}</span>
                    </div>
                  )}
                  {exercise.sets && (
                    <div className="flex justify-between">
                      <span>Sets:</span>
                      <span className="font-medium">{exercise.sets}</span>
                    </div>
                  )}
                  {exercise.reps && (
                    <div className="flex justify-between">
                      <span>Reps:</span>
                      <span className="font-medium">{exercise.reps}</span>
                    </div>
                  )}
                  {exercise.rest && (
                    <div className="flex justify-between">
                      <span>Rest:</span>
                      <span className="font-medium">{exercise.rest}</span>
                    </div>
                  )}
                  {exercise.type && (
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{exercise.type}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {workout.video_url && (
        <WorkoutVideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={workout.video_url}
          workoutTitle={workout.title}
        />
      )}
    </div>
  );
};

export default WorkoutDetail;
