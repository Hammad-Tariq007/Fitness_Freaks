
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

interface WorkoutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout?: any;
}

export const WorkoutFormModal = ({ isOpen, onClose, workout }: WorkoutFormModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner", // Always default to lowercase
    duration: "",
    image_url: "",
    video_url: "",
    youtube_url: "",
    tags: "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const queryClient = useQueryClient();

  // Reset and populate form when modal opens/closes or workout changes
  useEffect(() => {
    if (isOpen) {
      if (workout) {
        const workoutData = {
          title: workout.title || "",
          description: workout.description || "",
          category: workout.category || "",
          level: workout.level ? workout.level.toLowerCase() : "beginner", // Ensure lowercase
          duration: workout.duration || "",
          image_url: workout.image_url || "",
          video_url: workout.video_url || "",
          youtube_url: workout.youtube_url || "",
          tags: workout.tags ? workout.tags.join(", ") : "",
        };
        setFormData(workoutData);
        setInitialData(workoutData);
      } else {
        const emptyData = {
          title: "",
          description: "",
          category: "",
          level: "beginner", // Always default to lowercase
          duration: "",
          image_url: "",
          video_url: "",
          youtube_url: "",
          tags: "",
        };
        setFormData(emptyData);
        setInitialData(emptyData);
      }
      setHasChanges(false);
    }
  }, [isOpen, workout]);

  // Check for changes
  useEffect(() => {
    if (initialData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(initialData);
      setHasChanges(changed);
    }
  }, [formData, initialData]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log("Submitting workout data:", data);
      
      try {
        const workoutData = {
          title: data.title.trim(),
          description: data.description.trim(),
          category: data.category.trim(),
          level: data.level.toLowerCase(), // ENSURE lowercase before saving
          duration: data.duration.trim(),
          image_url: data.image_url.trim(),
          video_url: data.video_url.trim() || null,
          youtube_url: data.youtube_url.trim() || null,
          tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
        };

        console.log("Processed workout data (level should be lowercase):", workoutData);

        if (workout) {
          console.log("Updating workout:", workout.id);
          const { error } = await supabase
            .from("workouts")
            .update(workoutData)
            .eq("id", workout.id);
          if (error) {
            console.error("Update error:", error);
            throw error;
          }
        } else {
          console.log("Creating new workout");
          const { error } = await supabase
            .from("workouts")
            .insert(workoutData);
          if (error) {
            console.error("Insert error:", error);
            throw error;
          }
        }
      } catch (error) {
        console.error("Processing error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workouts-preview"] });
      toast.success(workout ? "Workout updated successfully" : "Workout created successfully");
      onClose();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(`Failed to save workout: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("Level value:", formData.level, "Type:", typeof formData.level);
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim() || !formData.duration.trim() || !formData.image_url.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate level is one of the allowed values
    const allowedLevels = ['beginner', 'intermediate', 'advanced'];
    if (!allowedLevels.includes(formData.level.toLowerCase())) {
      toast.error("Invalid level selected. Please choose beginner, intermediate, or advanced.");
      return;
    }
    
    mutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    // Ensure level is always lowercase
    if (field === 'level') {
      value = value.toLowerCase();
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{workout ? "Edit Workout" : "Create New Workout"}</DialogTitle>
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
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="e.g., HIIT, Strength, Yoga"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Level *</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="e.g., 30 min, 45 min"
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
            <Label htmlFor="image_url">Image URL *</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="youtube_url">YouTube URL (Recommended)</Label>
            <Input
              id="youtube_url"
              value={formData.youtube_url}
              onChange={(e) => handleInputChange("youtube_url", e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Primary video link that opens in a new tab when users click "Start Workout"
            </p>
          </div>

          <div>
            <Label htmlFor="video_url">Video URL (Alternative)</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => handleInputChange("video_url", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Alternative video link for embedded player (if different from YouTube URL)
            </p>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="HIIT, Tabata, Intense, Quick"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending || (!hasChanges && workout)}
            >
              {mutation.isPending ? "Saving..." : workout ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
