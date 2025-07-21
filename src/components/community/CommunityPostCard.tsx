import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Smile, ThumbsUp, ThumbsDown, MessageSquare, Trash2, Edit3, Tag as TagIcon } from "lucide-react";
import { formatTimeAgo, linkifyText } from "./utils";
import { CommunityCommentSection } from "./CommunityCommentSection";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import clsx from "clsx";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface CommunityPostCardProps {
  post: any;
  currentUser: any;
  userProfileMap: Map<string, any>;
  onPostUpdated: () => void;
  onPostDeleted: () => void;
  // For animation
  style?: React.CSSProperties;
  className?: string;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  currentUser,
  userProfileMap,
  onPostUpdated,
  onPostDeleted,
  style,
  className,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.text);
  const [editTags, setEditTags] = useState(post.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const profile = userProfileMap.get(post.user_id);
  const userName = profile?.name || "Unknown";
  const userAvatar = profile?.profile_image_url;

  // Like logic
  const liked = post.post_likes?.some((like: any) => like.user_id === currentUser.user_id || like.user_id === currentUser.id);

  const canEdit = post.user_id === currentUser.user_id || post.user_id === currentUser.id || profile?.role === "admin" || currentUser.role === "admin";

  const handleLike = async () => {
    if (!currentUser) return;
    // Use proper Supabase UID for like
    const user_id =
      typeof currentUser?.user_id === "string"
        ? currentUser.user_id
        : typeof currentUser?.id === "string"
          ? currentUser.id
          : null;
    if (!user_id) {
      toast.error("Could not detect your user id for liking. Please re-login.");
      return;
    }
    const existingLike = post.post_likes?.find((l: any) => l.user_id === user_id);
    if (existingLike) {
      await supabase.from("post_likes").delete().eq("id", existingLike.id);
    } else {
      const { error } = await supabase.from("post_likes").insert({
        post_id: post.id,
        user_id,
      });
      if (error) {
        toast.error("Failed to like post");
        return;
      }
    }
    onPostUpdated();
  };

  const handleDelete = async () => {
    if (!canEdit) return;
    setIsDeleting(true);
    const { error } = await supabase.from("community_posts").delete().eq("id", post.id);
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    if (error) {
      toast.error("Failed to delete post");
      return;
    }
    onPostDeleted();
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.from("community_posts").update({
      text: editContent,
      edited_at: new Date().toISOString(),
      tags: editTags,
    }).eq("id", post.id);
    setIsSaving(false);
    if (error) {
      toast.error("Failed to update post");
      return;
    }
    setIsEditing(false);
    onPostUpdated();
  };

  // For demo, tags are just text[] but you can integrate with a tag suggestion system
  const renderTags = () => (
    (post.tags || []).length > 0 && (
      <div className="flex gap-2 mt-1 flex-wrap">
        {post.tags.map((tag: string, idx: number) => (
          <Badge key={idx} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 text-xs">
            <TagIcon className="inline mr-1 w-3 h-3" /> {tag}
          </Badge>
        ))}
      </div>
    )
  );

  return (
    <Card
      className={clsx(
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl mb-6 transition-all duration-200",
        className,
      )}
      style={style}
    >
      <CardContent className="p-6">
        {/* Header: Avatar, Name, Time, Tags */}
        <div className="flex items-start gap-4 mb-3">
          <Avatar className="w-12 h-12 ring ring-blue-500/30">
            {userAvatar ? (
              <AvatarImage src={userAvatar} alt={userName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200 font-medium">
                {userName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white">{userName}</div>
            <div className="flex gap-2 items-center text-xs mt-1 text-gray-400 dark:text-gray-400">
              <span>{formatTimeAgo(post.created_at)}</span>
              {post.edited_at && <span>(edited)</span>}
            </div>
            {renderTags()}
          </div>
          {canEdit && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="text-blue-500" onClick={() => setIsEditing((v) => !v)}>
                <Edit3 className="w-4 h-4" />
              </Button>
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    aria-label="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-background border rounded-xl p-7 shadow-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold text-destructive">Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this post? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="bg-muted hover:bg-muted/80 border-none rounded-lg px-6 py-2 text-base font-medium"
                      disabled={isDeleting}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2 text-base font-medium"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Deleting...
                        </span>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Post Content */}
        {!isEditing ? (
          <>
            <div className="mb-4 prose dark:prose-invert text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: linkifyText(post.text) }} />
            {post.image_url && (
              <div className="mb-3">
                <img src={post.image_url} alt="Post visual" className="w-full max-h-80 object-cover rounded-xl border" />
              </div>
            )}
          </>
        ) : (
          <div className="mb-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 mb-2"
              rows={3}
            />
            <div className="flex gap-2 items-center mb-2">
              <span className="text-xs text-gray-400">Tags:</span>
              <input
                type="text"
                value={editTags.join(",")}
                onChange={(e) => setEditTags(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder="progress, advice, transformation"
                className="w-60 px-2 rounded bg-gray-100 dark:bg-gray-700 text-xs"
              />
            </div>
            <Button size="sm" onClick={handleEditSave} disabled={isSaving} className="mr-2">
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Reactions & Actions */}
        <div className="flex items-center gap-6 border-t border-b py-3 border-gray-100 dark:border-gray-700 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={clsx(
              "flex items-center gap-2 transition-all duration-200",
              liked ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            )}
          >
            <Heart className={liked ? "w-4 h-4 fill-current" : "w-4 h-4"} />
            <span className="font-medium">{post.post_likes?.length || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">{post.community_comments?.length || 0}</span>
          </Button>
        </div>

        {/* Comments */}
        <CommunityCommentSection
          postId={post.id}
          open={showComments}
          userProfileMap={userProfileMap}
          currentUser={currentUser}
        />
      </CardContent>
    </Card>
  );
};
