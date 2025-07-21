
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog?: any;
}

// Helper function to generate slug from title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const BlogFormModal = ({ isOpen, onClose, blog }: BlogFormModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    author_name: "",
    cover_image_url: "",
    published: false,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const queryClient = useQueryClient();

  // Reset and populate form when modal opens/closes or blog changes
  useEffect(() => {
    if (isOpen) {
      if (blog) {
        const blogData = {
          title: blog.title || "",
          content: blog.content || "",
          excerpt: blog.excerpt || "",
          category: blog.category || "",
          author_name: blog.author_name || "",
          cover_image_url: blog.cover_image_url || "",
          published: !!blog.published_at,
        };
        setFormData(blogData);
        setInitialData(blogData);
      } else {
        const emptyData = {
          title: "",
          content: "",
          excerpt: "",
          category: "",
          author_name: "",
          cover_image_url: "",
          published: false,
        };
        setFormData(emptyData);
        setInitialData(emptyData);
      }
      setHasChanges(false);
    }
  }, [isOpen, blog]);

  // Check for changes
  useEffect(() => {
    if (initialData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(initialData);
      setHasChanges(changed);
    }
  }, [formData, initialData]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log("Submitting blog data:", data);
      
      const slug = generateSlug(data.title);
      const blogData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        author_name: data.author_name,
        cover_image_url: data.cover_image_url,
        slug: slug,
        published_at: data.published ? new Date().toISOString() : null,
      };

      console.log("Processed blog data:", blogData);

      if (blog) {
        console.log("Updating blog:", blog.id);
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", blog.id);
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
      } else {
        console.log("Creating new blog");
        const { error } = await supabase
          .from("blogs")
          .insert(blogData);
        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success(blog ? "Blog post updated successfully" : "Blog post created successfully");
      onClose();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to save blog post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    // Basic validation
    if (!formData.title || !formData.content || !formData.category || !formData.author_name || !formData.cover_image_url) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    mutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
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
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author_name">Author Name *</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => handleInputChange("author_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cover_image_url">Cover Image URL *</Label>
              <Input
                id="cover_image_url"
                value={formData.cover_image_url}
                onChange={(e) => handleInputChange("cover_image_url", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              rows={2}
              placeholder="Brief description of the blog post..."
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={12}
              placeholder="Write your blog content here... (HTML/Markdown supported)"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleInputChange("published", !!checked)}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending || (!hasChanges && blog)}
            >
              {mutation.isPending ? "Saving..." : blog ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
