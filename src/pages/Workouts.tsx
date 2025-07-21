
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/Header';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { SaveWorkoutButton } from '@/components/SaveWorkoutButton';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { PremiumFeatureGate } from '@/components/PremiumFeatureGate';

interface Workout {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url: string;
  video_url: string | null;
  duration: string;
  category: string;
  level: string;
  tags: string[];
}

const Workouts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const navigate = useNavigate();
  const { getWorkoutLimit, hasPremiumAccess } = useFeatureAccess();

  const { data: workouts, isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Workout[];
    },
  });

  const workoutLimit = getWorkoutLimit();
  
  // For free users, limit the total workouts first, then apply filters to that subset
  let availableWorkouts = workouts || [];
  if (!hasPremiumAccess && workoutLimit !== Infinity) {
    availableWorkouts = workouts?.slice(0, workoutLimit) || [];
  }

  // Apply filters to the available workouts
  const filteredWorkouts = availableWorkouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workout.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLevel = selectedLevel === 'all' || workout.level.toLowerCase() === selectedLevel.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // For premium users, show additional locked workouts if there are more
  const hasMoreWorkouts = hasPremiumAccess ? false : (workouts?.length || 0) > workoutLimit;

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const categories = ['all', 'strength', 'cardio', 'flexibility', 'hiit', 'yoga'];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-6 py-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6">
            Workout Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Discover expertly crafted workouts designed to help you reach your fitness goals
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            30+ Premium Workouts • All Fitness Levels • Expert Designed
          </p>
          
          {!hasPremiumAccess && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Free users can access {workoutLimit} workouts total</span>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Upgrade to Pro for unlimited access to our complete workout library
              </p>
            </div>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search workouts..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 min-w-[140px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 min-w-[120px]">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.slice(1).map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Workouts Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 group">
                    <div className="relative overflow-hidden">
                      <img
                        src={workout.image_url}
                        alt={workout.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3">
                        <Badge className={getLevelColor(workout.level)}>
                          {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          {workout.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <SaveWorkoutButton workoutId={workout.id} variant="compact" />
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {workout.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                        {workout.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {workout.category}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/workouts/${workout.id}`)}
                          className="flex-1"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Premium Gate for additional workouts */}
            {hasMoreWorkouts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-16"
              >
                <PremiumFeatureGate
                  feature="Unlimited Workouts"
                  description="Upgrade to Pro to access our complete library of expert-designed workouts"
                  showUpgrade={true}
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {workouts?.slice(workoutLimit, workoutLimit + 6).map((workout, index) => (
                      <Card key={workout.id} className="h-full opacity-50 pointer-events-none">
                        <div className="relative">
                          <img
                            src={workout.image_url}
                            alt={workout.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className={getLevelColor(workout.level)}>
                              {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="line-clamp-2">{workout.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                            {workout.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {workout.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {workout.category}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </PremiumFeatureGate>
              </motion.div>
            )}
          </>
        )}

        {/* No Results Message */}
        {!isLoading && filteredWorkouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No workouts found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search criteria or browse all workouts
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="mt-4"
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
