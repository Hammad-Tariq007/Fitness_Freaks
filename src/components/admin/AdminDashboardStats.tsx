import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Dumbbell, Utensils, BookOpen, MessageSquare } from "lucide-react";

export const AdminDashboardStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin stats...");

      // Get user profile count (all users)
      const { count: totalUsers, error: usersError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true });

      if (usersError) {
        console.error("Error fetching user_profiles count:", usersError);
        throw usersError;
      }

      // Calculate date 30 days ago for recent signups filter
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      // Format as ISO string without ms
      const cutoffIso = cutoffDate.toISOString();

      // Get count of user_profiles created in the last 30 days
      const { count: recentSignups, error: recentSignupsError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", cutoffIso);

      if (recentSignupsError) {
        console.error("Error fetching recent signups:", recentSignupsError);
        throw recentSignupsError;
      }

      const { count: adminUsers, error: adminError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");

      if (adminError) throw adminError;

      const { count: workoutCount, error: workoutError } = await supabase
        .from("workouts")
        .select("*", { count: "exact", head: true });

      if (workoutError) throw workoutError;

      const { count: nutritionCount, error: nutritionError } = await supabase
        .from("nutrition_plans")
        .select("*", { count: "exact", head: true });

      if (nutritionError) throw nutritionError;

      const { count: blogCount, error: blogError } = await supabase
        .from("blogs")
        .select("*", { count: "exact", head: true })
        .not("published_at", "is", null);

      if (blogError) throw blogError;

      const { count: communityCount, error: communityError } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true });

      if (communityError) throw communityError;

      return {
        totalUsers: totalUsers || 0,
        recentSignups: recentSignups || 0,
        adminUsers: adminUsers || 0,
        totalWorkouts: workoutCount || 0,
        totalNutritionPlans: nutritionCount || 0,
        publishedBlogs: blogCount || 0,
        totalCommunityPosts: communityCount || 0,
      };
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading dashboard stats. Please check the console for details.</p>
      </div>
    );
  }

  // Use real data from Supabase for Total Users & Recent Signups
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registered users",
      color: "text-blue-600"
    },
    {
      title: "Recent Signups",
      value: stats?.recentSignups ?? 0,
      icon: UserPlus,
      description: "Last 30 days",
      color: "text-green-600"
    },
    {
      title: "Workouts",
      value: stats?.totalWorkouts || 0,
      icon: Dumbbell,
      description: "Total workout plans",
      color: "text-purple-600"
    },
    {
      title: "Nutrition Plans",
      value: stats?.totalNutritionPlans || 0,
      icon: Utensils,
      description: "Available plans",
      color: "text-orange-600"
    },
    {
      title: "Published Blogs",
      value: stats?.publishedBlogs || 0,
      icon: BookOpen,
      description: "Live articles",
      color: "text-indigo-600"
    },
    {
      title: "Community Posts",
      value: stats?.totalCommunityPosts || 0,
      icon: MessageSquare,
      description: "User posts",
      color: "text-pink-600"
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Overview of your fitness platform
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow border-l-4 border-l-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
