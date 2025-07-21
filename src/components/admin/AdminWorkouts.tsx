import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dumbbell, Plus, Edit, Trash2, Search, RefreshCw, ExternalLink } from "lucide-react";
import { WorkoutFormModal } from "./WorkoutFormModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const AdminWorkouts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: workouts, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-workouts"],
    queryFn: async () => {
      console.log("Fetching workouts from Supabase...");
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching workouts:", error);
        throw error;
      }
      
      console.log("Fetched workouts:", data);
      return data;
    },
  });

  // Set up real-time subscription for workouts
  useEffect(() => {
    console.log("Setting up real-time subscription for workouts...");
    const channel = supabase
      .channel('admin-workouts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workouts'
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          queryClient.invalidateQueries({ queryKey: ["admin-workouts"] });
          queryClient.invalidateQueries({ queryKey: ["workouts"] });
          queryClient.invalidateQueries({ queryKey: ["workouts-preview"] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscription...");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const deleteMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      console.log("Deleting workout:", workoutId);
      
      // First delete any saved workout references
      await supabase
        .from("saved_workouts")
        .delete()
        .eq("workout_id", workoutId);
      
      // Then delete the workout itself
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId);
        
      if (error) {
        console.error("Error deleting workout:", error);
        throw error;
      }
      
      console.log("Workout deleted successfully");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts-preview"] });
      toast.success("Workout deleted successfully");
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
      toast.error("Failed to delete workout");
    },
  });

  const handleEdit = (workout: any) => {
    console.log("Editing workout:", workout);
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    console.log("Creating new workout");
    setEditingWorkout(null);
    setIsModalOpen(true);
  };

  const handleDelete = (workoutId: string) => {
    console.log("Initiating delete for workout:", workoutId);
    deleteMutation.mutate(workoutId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkout(null);
  };

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refetch();
    toast.success("Workouts refreshed");
  };

  const filteredWorkouts = workouts?.filter(workout =>
    workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Workouts Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Workouts Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="font-medium">Error loading workouts</p>
            <p className="text-sm mt-1">{error.message}</p>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Workouts Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage workout plans and exercises with real-time updates
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Workout
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search workouts by title, category, or level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            All Workouts ({filteredWorkouts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWorkouts && filteredWorkouts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>YouTube URL</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkouts.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {workout.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{workout.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(workout.level)}>
                          {workout.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{workout.duration}</TableCell>
                      <TableCell className="max-w-[150px]">
                        {workout.youtube_url ? (
                          <a 
                            href={workout.youtube_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            YouTube
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No URL</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        {workout.tags && workout.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {workout.tags.slice(0, 2).map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {workout.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{workout.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No tags</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(workout.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(workout)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{workout.title}"? 
                                  This action cannot be undone and will also remove it from all users' saved workouts.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(workout.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {searchTerm ? "No workouts found" : "No workouts yet"}
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Create your first workout to get started"
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate} className="flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Create First Workout
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <WorkoutFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        workout={editingWorkout}
      />
    </div>
  );
};
