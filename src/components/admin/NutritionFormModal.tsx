
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NutritionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: any;
}

export const NutritionFormModal = ({ isOpen, onClose, plan }: NutritionFormModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "maintain",
    calories: "",
    image_url: "",
    meals: '[]',
    macros: '{}',
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const queryClient = useQueryClient();

  // Reset and populate form when modal opens/closes or plan changes
  useEffect(() => {
    if (isOpen) {
      if (plan) {
        const planData = {
          title: plan.title || "",
          description: plan.description || "",
          goal: plan.goal || "maintain",
          calories: plan.calories?.toString() || "",
          image_url: plan.image_url || "",
          meals: plan.meals ? JSON.stringify(plan.meals, null, 2) : '[]',
          macros: plan.macros ? JSON.stringify(plan.macros, null, 2) : '{}',
        };
        setFormData(planData);
        setInitialData(planData);
      } else {
        const emptyData = {
          title: "",
          description: "",
          goal: "maintain",
          calories: "",
          image_url: "",
          meals: '[]',
          macros: '{}',
        };
        setFormData(emptyData);
        setInitialData(emptyData);
      }
      setHasChanges(false);
    }
  }, [isOpen, plan]);

  // Check for changes
  useEffect(() => {
    if (initialData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(initialData);
      setHasChanges(changed);
    }
  }, [formData, initialData]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log("Submitting nutrition plan data:", data);
      
      try {
        const nutritionData = {
          title: data.title,
          description: data.description,
          goal: data.goal,
          calories: parseInt(data.calories),
          image_url: data.image_url,
          meals: JSON.parse(data.meals),
          macros: JSON.parse(data.macros),
        };

        console.log("Parsed nutrition data:", nutritionData);

        if (plan) {
          console.log("Updating nutrition plan:", plan.id);
          const { error } = await supabase
            .from("nutrition_plans")
            .update(nutritionData)
            .eq("id", plan.id);
          if (error) {
            console.error("Update error:", error);
            throw error;
          }
        } else {
          console.log("Creating new nutrition plan");
          const { error } = await supabase
            .from("nutrition_plans")
            .insert(nutritionData);
          if (error) {
            console.error("Insert error:", error);
            throw error;
          }
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON format in meals or macros");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-nutrition"] });
      queryClient.invalidateQueries({ queryKey: ["nutrition-plans"] });
      toast.success(plan ? "Nutrition plan updated successfully" : "Nutrition plan created successfully");
      onClose();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(`Failed to save nutrition plan: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.calories || !formData.image_url) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate JSON format
    try {
      JSON.parse(formData.meals);
      JSON.parse(formData.macros);
    } catch (error) {
      toast.error("Invalid JSON format in meals or macros");
      return;
    }
    
    if (isNaN(parseInt(formData.calories))) {
      toast.error("Calories must be a valid number");
      return;
    }
    
    mutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Nutrition Plan" : "Create New Nutrition Plan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="goal">Goal *</Label>
              <Select value={formData.goal} onValueChange={(value) => handleInputChange("goal", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="gain_weight">Gain Weight</SelectItem>
                  <SelectItem value="maintain">Maintain</SelectItem>
                  <SelectItem value="build_muscle">Build Muscle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories">Calories *</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => handleInputChange("calories", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="meals">Meals (JSON format)</Label>
            <Textarea
              id="meals"
              value={formData.meals}
              onChange={(e) => handleInputChange("meals", e.target.value)}
              rows={8}
              placeholder='[{"name": "Breakfast", "foods": ["Oatmeal", "Banana"]}]'
              className="font-mono"
            />
          </div>

          <div>
            <Label htmlFor="macros">Macros (JSON format)</Label>
            <Textarea
              id="macros"
              value={formData.macros}
              onChange={(e) => handleInputChange("macros", e.target.value)}
              rows={4}
              placeholder='{"protein": 150, "carbs": 200, "fat": 70}'
              className="font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending || (!hasChanges && plan)}
            >
              {mutation.isPending ? "Saving..." : plan ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
