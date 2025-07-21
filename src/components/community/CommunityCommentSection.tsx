import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommunityCommentSectionProps {
  postId: string;
  open: boolean;
  userProfileMap: Map<string, any>;
  currentUser: any;
}

export const CommunityCommentSection: React.FC<CommunityCommentSectionProps> = ({
  postId,
  open,
  userProfileMap,
  currentUser
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  React.useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("community_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });
      setLoading(false);
      if (!error) setComments(data || []);
    };
    fetch();
  }, [open, postId, refreshToken]);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    // Use the Supabase Auth UID from currentUser.user_id (not .id)
    const user_id =
      typeof currentUser?.user_id === "string"
        ? currentUser.user_id
        : typeof currentUser?.id === "string"
          ? currentUser.id
          : null;
    if (!user_id) {
      toast.error("Could not detect your user id for commenting. Please re-login.");
      return;
    }
    const { error } = await supabase.from("community_comments").insert({
      post_id: postId,
      user_id,
      text: commentText.trim()
    });
    if (error) {
      toast.error("Failed to comment");
      return;
    }
    setCommentText("");
    setRefreshToken(v => v + 1);
  };

  return open ? (
    <div className="pt-3">
      <div className="flex items-center mb-4 gap-2">
        <Avatar className="w-8 h-8">
          {currentUser?.profile_image_url ? (
            <AvatarImage src={currentUser.profile_image_url} alt={currentUser.name} />
          ) : (
            <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm">
              {currentUser?.name?.charAt(0) || "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <Input
          placeholder="Write a comment..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          className="border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 text-sm"
          onKeyPress={e => e.key === "Enter" && handleComment()}
        />
        <Button size="sm" onClick={handleComment} disabled={!commentText.trim()} className="bg-blue-600 text-white px-3">
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="text-xs text-gray-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-xs text-gray-400">No comments yet.</div>
        ) : (
          comments.map((comment: any) => {
            const profile = userProfileMap.get(comment.user_id);
            const name = profile?.name || "Unknown";
            const avatar = profile?.profile_image_url;
            return (
              <div key={comment.id} className="flex items-start gap-3 animate-fade-in">
                <Avatar className="w-8 h-8">
                  {avatar ? (
                    <AvatarImage src={avatar} alt={name} />
                  ) : (
                    <AvatarFallback className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm">
                      {name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                    <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                      {name}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{comment.text}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-2">{formatTimeAgo(comment.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  ) : null;
};

// Helper
function formatTimeAgo(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
