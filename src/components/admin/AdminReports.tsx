import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Users, Dumbbell, Utensils, BookOpen, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  updated_at?: string;
}

export const AdminReports = () => {
  const [timeRange, setTimeRange] = useState("30");

  const { data: reportData, isLoading, error } = useQuery({
    queryKey: ["admin-reports", timeRange],
    queryFn: async () => {
      console.log(`Fetching report data for ${timeRange} days...`);
      
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

      try {
        // Fetch real auth users for accurate count
        let totalUsers = 0;
        let recentSignups = 0;
        let authUsers: AuthUser[] = [];
        
        try {
          const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
          if (authError) throw authError;
          
          authUsers = (users || []) as AuthUser[];
          totalUsers = authUsers.length;
          recentSignups = authUsers.filter(u => new Date(u.created_at) >= daysAgo).length;
        } catch (authErr) {
          console.warn("Auth admin access failed, falling back to user_profiles:", authErr);
          // Fallback to user_profiles
          const { data: profiles, error: profilesError } = await supabase
            .from("user_profiles")
            .select("created_at, role");
          
          if (profilesError) throw profilesError;
          
          totalUsers = profiles?.length || 0;
          recentSignups = profiles?.filter(p => new Date(p.created_at) >= daysAgo).length || 0;
        }

        // Fetch user profiles for role analysis
        const { data: userProfiles, error: profilesError } = await supabase
          .from("user_profiles")
          .select("role, created_at, name, user_id");

        if (profilesError) {
          console.error("Profiles query error:", profilesError);
          throw profilesError;
        }

        // Fetch subscriptions
        const { data: subscriptions, error: subsError } = await supabase
          .from("subscriptions")
          .select("plan, is_active, created_at, user_id");

        if (subsError) {
          console.error("Subscriptions query error:", subsError);
          throw subsError;
        }

        // Calculate active/pro subscriptions (RESTORED, fix for TS errors)
        const activeSubscriptions = subscriptions?.filter(s => s.is_active).length || 0;
        const proSubscriptions = subscriptions?.filter(s => s.is_active && s.plan === 'pro').length || 0;

        // Fetch workouts
        const { data: workouts, error: workoutsError } = await supabase
          .from("workouts")
          .select("id, title, created_at");

        if (workoutsError) {
          console.error("Workouts query error:", workoutsError);
          throw workoutsError;
        }

        // Fetch saved workouts
        const { data: savedWorkouts, error: savedWorkoutsError } = await supabase
          .from("saved_workouts")
          .select(`
            workout_id, 
            created_at,
            workouts(title)
          `);

        if (savedWorkoutsError) {
          console.error("Saved workouts query error:", savedWorkoutsError);
          throw savedWorkoutsError;
        }

        // Fetch nutrition plans
        const { data: nutritionPlans, error: nutritionError } = await supabase
          .from("nutrition_plans")
          .select("id, title, created_at");

        if (nutritionError) {
          console.error("Nutrition plans query error:", nutritionError);
          throw nutritionError;
        }

        // Fetch saved nutrition plans
        const { data: savedNutrition, error: savedNutritionError } = await supabase
          .from("saved_nutrition_plans")
          .select(`
            nutrition_plan_id, 
            created_at,
            nutrition_plans(title)
          `);

        if (savedNutritionError) {
          console.error("Saved nutrition query error:", savedNutritionError);
          throw savedNutritionError;
        }

        // Fetch blogs
        const { data: blogs, error: blogsError } = await supabase
          .from("blogs")
          .select("id, title, created_at, published_at");

        if (blogsError) {
          console.error("Blogs query error:", blogsError);
          throw blogsError;
        }

        // Fetch community data
        const { data: communityPosts, error: communityError } = await supabase
          .from("community_posts")
          .select(`
            id, 
            user_id, 
            created_at,
            user_profiles(name)
          `);

        if (communityError) {
          console.error("Community posts query error:", communityError);
          throw communityError;
        }

        const { data: comments, error: commentsError } = await supabase
          .from("community_comments")
          .select("id, user_id, created_at");

        if (commentsError) {
          console.error("Comments query error:", commentsError);
          throw commentsError;
        }

        // Fetch user progress for activity analysis
        const { data: userProgress, error: progressError } = await supabase
          .from("user_progress")
          .select("user_id, calories_intake, workouts_completed, created_at");

        if (progressError) {
          console.error("User progress query error:", progressError);
          throw progressError;
        }

        // Process data
        const adminUsers = userProfiles?.filter(u => u.role === 'admin').length || 0;
        const regularUsers = totalUsers - adminUsers;

        // Subscription status calculation with validation
        let activeSubsSafe = Math.max(0, activeSubscriptions);
        let proSubsSafe = Math.max(0, proSubscriptions);
        // Active Basic can't be negative
        let activeBasic = Math.max(0, activeSubsSafe - proSubsSafe);
        let noSub = Math.max(0, totalUsers - activeSubsSafe);

        // Defensive: if math is off, log a warning
        if (activeBasic < 0 || proSubsSafe < 0 || noSub < 0) {
          console.warn("Pie chart subscription data - calculated a negative value! Math breakdown:", {
            totalUsers,
            activeSubsSafe,
            proSubsSafe,
            activeBasic,
            noSub,
            activeSubscriptions,
            proSubscriptions
          });
        }

        // Top saved workouts
        const workoutCounts = savedWorkouts?.reduce((acc: Record<string, number>, sw: any) => {
          const title = sw.workouts?.title || 'Unknown';
          acc[title] = (acc[title] || 0) + 1;
          return acc;
        }, {}) || {};

        const topWorkouts = Object.entries(workoutCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([title, count]) => ({ 
            title: title.length > 30 ? title.substring(0, 30) + '...' : title, 
            count: count as number 
          }));

        // Top nutrition plans
        const nutritionCounts = savedNutrition?.reduce((acc: Record<string, number>, sn: any) => {
          const title = sn.nutrition_plans?.title || 'Unknown';
          acc[title] = (acc[title] || 0) + 1;
          return acc;
        }, {}) || {};

        const topNutrition = Object.entries(nutritionCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([title, count]) => ({ 
            title: title.length > 30 ? title.substring(0, 30) + '...' : title, 
            count: count as number 
          }));

        // Top contributors
        const contributorCounts = communityPosts?.reduce((acc: Record<string, number>, post: any) => {
          const name = post.user_profiles?.name || 'Unknown User';
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {}) || {};

        const topContributors = Object.entries(contributorCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([name, posts]) => ({ name, posts: posts as number }));

        // Daily signups for chart (last 7 days) - create async function for this
        const getDailySignups = async () => {
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
          });

          return last7Days.map(date => {
            let count = 0;
            if (authUsers.length > 0) {
              count = authUsers.filter(u => u.created_at.startsWith(date)).length;
            } else {
              count = userProfiles?.filter(u => u.created_at.startsWith(date)).length || 0;
            }
            
            return { 
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
              signups: count 
            };
          });
        };

        const dailySignups = await getDailySignups();

        // Active users (users who logged progress in time range)
        const activeUsers = new Set(
          userProgress?.filter(p => new Date(p.created_at) >= daysAgo).map(p => p.user_id)
        ).size;

        // Average calories
        const recentProgress = userProgress?.filter(p => new Date(p.created_at) >= daysAgo && p.calories_intake > 0);
        const avgCalories = recentProgress?.length > 0 
          ? Math.round(recentProgress.reduce((sum, p) => sum + (p.calories_intake || 0), 0) / recentProgress.length)
          : 0;

        // Posts per day (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });

        const dailyPosts = last7Days.map(date => {
          const count = communityPosts?.filter(p => p.created_at.startsWith(date)).length || 0;
          return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            posts: count
          };
        });

        // update the subscriptionStatus chart definition to use theme-tailwind colors
        const subscriptionStatus = [
          { name: 'Active Pro', value: proSubsSafe, color: '#6366f1' },      // Tailwind primary (indigo-500)
          { name: 'Active Basic', value: activeBasic, color: '#06b6d4' },    // Tailwind accent (cyan-500)
          { name: 'No Subscription', value: noSub, color: '#64748b' }        // Tailwind muted (slate-500)
        ];

        // Debug: log for troubleshooting unexpected results
        console.log("Pie chart subscription data (validated):", subscriptionStatus);

        const reportData = {
          summary: {
            totalUsers,
            adminUsers,
            regularUsers,
            activeSubscriptions,
            proSubscriptions,
            recentSignups,
            activeUsers,
            avgCalories,
            totalWorkouts: workouts?.length || 0,
            totalNutritionPlans: nutritionPlans?.length || 0,
            totalBlogs: blogs?.filter(b => b.published_at).length || 0,
            totalCommunityPosts: communityPosts?.length || 0,
            totalComments: comments?.length || 0,
          },
          charts: {
            dailySignups,
            dailyPosts,
            topWorkouts,
            topNutrition,
            topContributors,
            userTypes: [
              { name: 'Regular Users', value: regularUsers, color: '#8884d8' },
              { name: 'Admin Users', value: adminUsers, color: '#82ca9d' }
            ],
            subscriptionStatus
          }
        };

        console.log("Report data generated successfully:", reportData);
        return reportData;
      } catch (err) {
        console.error("Error generating report:", err);
        throw err;
      }
    },
    refetchInterval: 30000,
    staleTime: 0,
  });

  // Improved PieChart label renderer
  const renderPieLabel = ({
    cx, cy, midAngle, outerRadius, name, value
  }) => {
    // Use extra padding for labels
    const RADIAN = Math.PI / 180;
    const labelRadius = outerRadius + 34;
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

    // Theme-aware label coloring
    const themeDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const labelColor = themeDark ? "#fff" : "#1e293b"; // slate-900

    // Only show label for nonzero slices
    if (!value || value <= 0) return null;
    return (
      <text
        x={x}
        y={y}
        fill={labelColor}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight={600}
        style={{
          textShadow: themeDark
            ? "0 1px 6px #334155, 0 -1px 2px #334155"
            : "0 1px 6px #fff, 0 -1px 2px #fff",
          paintOrder: "stroke"
        }}
      >{`${name}: ${value}`}</text>
    );
  };

  const generateCSV = () => {
    if (!reportData) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Total Users', reportData.summary.totalUsers.toString()],
      ['Admin Users', reportData.summary.adminUsers.toString()],
      ['Regular Users', reportData.summary.regularUsers.toString()],
      ['Active Subscriptions', reportData.summary.activeSubscriptions.toString()],
      ['Pro Subscriptions', reportData.summary.proSubscriptions.toString()],
      ['Recent Signups', reportData.summary.recentSignups.toString()],
      ['Active Users', reportData.summary.activeUsers.toString()],
      ['Average Calories', reportData.summary.avgCalories.toString()],
      ['Total Workouts', reportData.summary.totalWorkouts.toString()],
      ['Total Nutrition Plans', reportData.summary.totalNutritionPlans.toString()],
      ['Published Blogs', reportData.summary.totalBlogs.toString()],
      ['Community Posts', reportData.summary.totalCommunityPosts.toString()],
      ['Comments', reportData.summary.totalComments.toString()],
      ['', ''],
      ['Top Workouts', 'Saves'],
      ...reportData.charts.topWorkouts.map(w => [w.title, w.count.toString()]),
      ['', ''],
      ['Top Contributors', 'Posts'],
      ...reportData.charts.topContributors.map(c => [c.name, c.posts.toString()]),
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitnessFreaks_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generatePDF = async () => {
    if (!reportData) return;

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 18;

      // --- Branded Gradient Header ---
      const primary = [99, 102, 241]; // Tailwind indigo-500
      doc.setFillColor(primary[0], primary[1], primary[2]);
      doc.rect(0, 0, pageWidth, 42, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text("FitnessFreaks - Admin Analytics", margin, 20);

      doc.setFontSize(13);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Platform Report • ${new Date().toLocaleDateString()} • Last ${timeRange} days`,
        margin,
        34
      );

      // --- Drop shadow bar ---
      doc.setDrawColor(210, 220, 255);
      doc.setLineWidth(0.7);
      doc.line(margin, 43, pageWidth - margin, 43);

      let yPos = 54;

      // --- "Admin Report" Title/Subtitle in Modern Style
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(55, 48, 163);
      doc.text("Admin Performance Dashboard", margin, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12.5);
      doc.setTextColor(107, 114, 128);
      doc.text("A visual summary of FitnessFreaks platform activity & key analytics.", margin, yPos + 8);

      yPos += 18;

      // --- SUMMARY METRIC CARDS ---
      doc.setFillColor(243, 244, 246); // soft gray
      doc.roundedRect(margin, yPos, pageWidth - margin * 2, 45, 7, 7, 'F');
      doc.setTextColor(30, 41, 59);

      // Cards: 3x4 grid
      doc.setFontSize(11.5);
      const summaryItems = [
        { label: 'Total Users',       value: reportData.summary.totalUsers },
        { label: 'Admins',           value: reportData.summary.adminUsers },
        { label: 'Recent Signups',   value: reportData.summary.recentSignups },
        { label: 'Active Users',     value: reportData.summary.activeUsers },
        { label: 'Active Subs',      value: reportData.summary.activeSubscriptions },
        { label: 'Pro Subs',         value: reportData.summary.proSubscriptions },
        { label: 'Workouts',         value: reportData.summary.totalWorkouts },
        { label: 'Nutrition Plans',  value: reportData.summary.totalNutritionPlans },
        { label: 'Blogs',            value: reportData.summary.totalBlogs },
        { label: 'Posts',            value: reportData.summary.totalCommunityPosts },
        { label: 'Comments',         value: reportData.summary.totalComments },
        { label: 'Avg Calories',     value: reportData.summary.avgCalories },
      ];
      let col = 0, row = 0;
      for (let i = 0; i < summaryItems.length; i++) {
        const x = margin + 7 + col * 47;
        const y = yPos + 13 + row * 10;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text(String(summaryItems[i].value), x, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(summaryItems[i].label, x, y + 5.2);
        col++;
        if (col === 4) {
          col = 0; row++;
        }
      }
      yPos += 56;

      // --- Visual Dividing Line ---
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.8);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // --- Top Content Sections (Workouts/Nutrition) ---
      // Stunning section banners
      function sectionBanner(label: string, color: [number, number, number]) {
        doc.setFillColor(color[0], color[1], color[2], 38); // colored, but gentle
        doc.roundedRect(margin, yPos, pageWidth - margin * 2, 13, 3, 3, "F");
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13.7);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(label, margin + 5, yPos + 9.5);
        yPos += 19;
      }

      sectionBanner('Top Saved Workouts', [139, 92, 246]); // purple-500
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11.4);
      doc.setTextColor(30, 41, 59);

      if (reportData.charts.topWorkouts.length > 0) {
        reportData.charts.topWorkouts.forEach((w, i) => {
          doc.text(`${i + 1}. ${w.title} (${w.count} saves)`, margin + 14, yPos);
          yPos += 9;
        });
      } else {
        doc.text("No workouts data.", margin + 14, yPos);
        yPos += 9;
      }
      yPos += 7;

      sectionBanner('Top Saved Nutrition Plans', [16, 185, 129]); // teal-500
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11.4);
      doc.setTextColor(30, 41, 59);
      if (reportData.charts.topNutrition.length > 0) {
        reportData.charts.topNutrition.forEach((plan, i) => {
          doc.text(`${i + 1}. ${plan.title} (${plan.count} saves)`, margin + 14, yPos);
          yPos += 9;
        });
      } else {
        doc.text("No nutrition plans data.", margin + 14, yPos);
        yPos += 9;
      }
      yPos += 7;

      sectionBanner('Top Community Contributors', [245, 158, 11]); // amber-500
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11.4);
      doc.setTextColor(30, 41, 59);
      if (reportData.charts.topContributors.length > 0) {
        reportData.charts.topContributors.forEach((c, i) => {
          doc.text(`${i + 1}. ${c.name} (${c.posts} posts)`, margin + 14, yPos);
          yPos += 9;
        });
      } else {
        doc.text("No contributor data.", margin + 14, yPos);
        yPos += 9;
      }
      yPos += 5;

      // --- Another divider ---
      if (yPos > pageHeight - 47) {
        doc.addPage();
        yPos = 28;
      }
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.65);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // --- Pie & Bar chart context (textual, since we can't embed charts here) ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(99, 102, 241);
      doc.text("User & Subscription Overview", margin, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11.2);
      doc.setTextColor(30, 41, 59);
      yPos += 8;

      const userTypes = reportData.charts.userTypes.map(
        (ut: any) => `${ut.name}: ${ut.value}`
      ).join("   |   ");
      doc.text(userTypes, margin + 6, yPos);

      yPos += 7;

      const subscriptionStatus = reportData.charts.subscriptionStatus.map(
        (ss: any) => `${ss.name}: ${ss.value}`
      ).join("   |   ");
      doc.text(subscriptionStatus, margin + 6, yPos);

      yPos += 16;

      // --- Modern Footer ---
      doc.setFillColor(primary[0], primary[1], primary[2]);
      doc.rect(0, pageHeight - 24, pageWidth, 24, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.4);
      doc.text("Generated by FitnessFreaks • fitnessfreaks.app", margin, pageHeight - 10);

      doc.setFontSize(9.7);
      doc.text(`Report ID: AD-${Date.now()}`, pageWidth - margin - 54, pageHeight - 5);

      doc.save(`FitnessFreaks-Admin-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        </div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        </div>
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Error loading report data</p>
                <p className="text-sm mt-1">
                  There was an issue fetching the analytics data. Please check your database connection and try again.
                </p>
                <p className="text-xs mt-2 font-mono bg-red-100 dark:bg-red-900/40 p-2 rounded">
                  {error instanceof Error ? error.message : 'Unknown error occurred'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400">No report data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Platform analytics and performance insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={generatePDF}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalUsers}</div>
            <p className="text-xs text-gray-500">
              {reportData.summary.recentSignups} new in selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.activeSubscriptions}</div>
            <p className="text-xs text-gray-500">
              {reportData.summary.proSubscriptions} Pro subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Created</CardTitle>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.summary.totalWorkouts + reportData.summary.totalNutritionPlans + reportData.summary.totalBlogs}
            </div>
            <p className="text-xs text-gray-500">
              Workouts, nutrition plans & blogs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Community Activity</CardTitle>
            <MessageSquare className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.summary.totalCommunityPosts + reportData.summary.totalComments}
            </div>
            <p className="text-xs text-gray-500">
              Posts and comments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Signups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Signups (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={reportData.charts.dailySignups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="signups" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Posts Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Posts (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={reportData.charts.dailyPosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={reportData.charts.userTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {reportData.charts.userTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart margin={{ top: 18, bottom: 18 }}>
                <Pie
                  data={reportData.charts.subscriptionStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine
                  isAnimationActive={false}
                  label={renderPieLabel}
                >
                  {reportData.charts.subscriptionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Contributors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Community Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contributor</TableHead>
                <TableHead>Posts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.charts.topContributors.map((contributor, index) => (
                <TableRow key={index}>
                  <TableCell>{contributor.name}</TableCell>
                  <TableCell>{contributor.posts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
