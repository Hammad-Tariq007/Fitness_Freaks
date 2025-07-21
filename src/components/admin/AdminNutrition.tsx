
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Utensils, Plus, Edit, Trash2, Search } from "lucide-react";
import { NutritionFormModal } from "./NutritionFormModal";
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

export const AdminNutrition = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: nutritionPlans, isLoading, error } = useQuery({
    queryKey: ["admin-nutrition"],
    queryFn: async () => {
      console.log("Fetching nutrition plans from Supabase...");
      const { data, error } = await supabase
        .from("nutrition_plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching nutrition plans:", error);
        throw error;
      }
      
      console.log("Fetched nutrition plans:", data);
      return data;
    },
  });

  // Set up real-time subscription for nutrition plans
  useEffect(() => {
    const channel = supabase
      .channel('admin-nutrition-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nutrition_plans'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["admin-nutrition"] });
          queryClient.invalidateQueries({ queryKey: ["nutrition-plans"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const deleteMutation = useMutation({
    mutationFn: async (planId: string) => {
      console.log("Deleting nutrition plan:", planId);
      
      // First delete any saved nutrition plan references
      await supabase
        .from("saved_nutrition_plans")
        .delete()
        .eq("nutrition_plan_id", planId);
      
      // Then delete the nutrition plan itself
      const { error } = await supabase
        .from("nutrition_plans")
        .delete()
        .eq("id", planId);
      if (error) {
        console.error("Error deleting nutrition plan:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-nutrition"] });
      queryClient.invalidateQueries({ queryKey: ["nutrition-plans"] });
      toast.success("Nutrition plan deleted successfully");
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
      toast.error("Failed to delete nutrition plan");
    },
  });

  const handleEdit = (plan: any) => {
    console.log("Editing nutrition plan:", plan);
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleDelete = (planId: string) => {
    deleteMutation.mutate(planId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const filteredPlans = nutritionPlans?.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Plans Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
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
          <CardTitle>Nutrition Plans Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">
            Error loading nutrition plans: {error.message}
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
            Nutrition Plans Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage nutrition plans and meal guides
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Plan
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search nutrition plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            All Nutrition Plans ({filteredPlans?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPlans && filteredPlans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{plan.goal}</Badge>
                    </TableCell>
                    <TableCell>{plan.calories} kcal</TableCell>
                    <TableCell>
                      {new Date(plan.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Nutrition Plan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{plan.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(plan.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No nutrition plans found matching your search." : "No nutrition plans found. Create your first nutrition plan to get started."}
            </div>
          )}
        </CardContent>
      </Card>

      <NutritionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        plan={editingPlan}
      />
    </div>
  );
};
