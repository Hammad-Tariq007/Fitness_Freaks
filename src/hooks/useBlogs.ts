
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  author_name: string;
  cover_image_url: string;
  category: string;
  content: string;
  excerpt: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });
};

export const useBlog = (slug: string) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .not("published_at", "is", null)
        .single();

      if (error) throw error;
      return data as Blog;
    },
    enabled: !!slug,
  });
};
