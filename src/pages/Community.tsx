
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Users, TrendingUp, Clock, Hash } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PostComposer } from "@/components/community/PostComposer";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";

const Community = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [userProfileMap, setUserProfileMap] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Fetch all posts and involved user profiles
  const fetchPostsAndUsers = async () => {
    setIsLoading(true);
    const { data: postsData, error: postsError } = await supabase
      .from('community_posts')
      .select(`
        *,
        post_likes(*),
        community_comments(*)
      `)
      .order('created_at', { ascending: false });

    const postUserIds = Array.from(new Set([
      ...(postsData?.map(p => p.user_id) || []),
      ...(postsData?.flatMap(p => p.community_comments?.map((c: any) => c.user_id) || []) ?? [])
    ]));
    const { data: profilesData } = await supabase
      .from('user_profiles')
      .select('*')
      .in('user_id', postUserIds);

    const profileMap = new Map();
    profilesData?.forEach((p: any) => profileMap.set(p.user_id, p));
    setUserProfileMap(profileMap);

    let sorted = postsData || [];
    if (sortBy === "popular") {
      sorted = sorted.sort((a, b) =>
        (b.post_likes?.length || 0) - (a.post_likes?.length || 0)
      );
    }
    setPosts(sorted);
    setIsLoading(false);
  };

  // Real-time refresh
  useEffect(() => {
    fetchPostsAndUsers();
    const channel = supabase
      .channel('community-posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, fetchPostsAndUsers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_comments' }, fetchPostsAndUsers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, fetchPostsAndUsers)
      .subscribe();
    // FIX: Do not make this async!
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sortBy]);

  // On submit/refresh
  const handlePostRefresh = () => fetchPostsAndUsers();

  // Unique tags for filter controls
  const allTags: string[] = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  // Filter + search logic
  const filteredPosts = posts.filter((post) => {
    const profile = userProfileMap.get(post.user_id);
    const name = profile?.name || "";
    if (
      (searchTerm.trim() === "" ||
        post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (!filterTag || (post.tags || []).includes(filterTag))
    ) {
      return true;
    }
    return false;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="container mx-auto px-2 sm:px-6 py-14 max-w-3xl"
      >
        {/* Hero, sort/search */}
        <div className="md:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Fitness Community
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Public Community</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span>Tags</span>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-0 flex gap-2">
            <Button
              variant={sortBy === "newest" ? "default" : "outline"}
              onClick={() => setSortBy("newest")}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" /> Newest
            </Button>
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              onClick={() => setSortBy("popular")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" /> Popular
            </Button>
          </div>
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant={!filterTag ? "default" : "outline"} onClick={() => setFilterTag(null)} className="cursor-pointer">
              All tags
            </Badge>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={filterTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Search bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search posts or users…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* New Post Composer */}
        <PostComposer profile={profile} onPostCreated={handlePostRefresh} />

        {/* Post Feed */}
        <div className="space-y-8">
          <AnimatePresence>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-14 text-center text-gray-400 bg-white dark:bg-gray-900 border rounded-2xl shadow">
                No posts found. Why not start the conversation?
              </div>
            ) : (
              filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 32 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                >
                  <CommunityPostCard
                    post={post}
                    currentUser={profile}
                    userProfileMap={userProfileMap}
                    onPostUpdated={handlePostRefresh}
                    onPostDeleted={handlePostRefresh}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Community;
