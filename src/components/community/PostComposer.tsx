import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Image as ImageIcon, Smile } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { linkifyText } from "./utils";

interface PostComposerProps {
  profile: any;
  onPostCreated: () => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({ profile, onPostCreated }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  // For emoji, simple quick insert
  const emojiList = ["🔥", "🏋️‍♂️", "💪", "😄", "🥦", "🏆"];

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${profile.user_id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("community-images").upload(fileName, file);
    if (error) {
      toast.error("Error uploading image");
      return null;
    }
    const { data } = supabase.storage.from("community-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePost = async () => {
    if (!text.trim()) {
      toast.error("Please write something before posting.");
      return;
    }
    setIsSubmitting(true);

    // Ensure user_id is correct (try both profile.user_id and profile.id)
    const user_id = profile?.user_id || profile?.id;
    if (!user_id) {
      toast.error("User not correctly loaded. Please reload the page.");
      setIsSubmitting(false);
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        setIsSubmitting(false);
        return;
      }
    }

    const postData = {
      user_id,
      text,
      image_url: imageUrl,
      tags,
    };

    // Log for troubleshooting
    console.log("Inserting post:", postData);

    const { error } = await supabase.from("community_posts").insert(postData);
    setIsSubmitting(false);
    if (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post: " + (error.message || error.details || "Unknown error"));
      return;
    }
    setText("");
    setImageFile(null);
    setImagePreview("");
    setTags([]);
    onPostCreated();
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl mb-8 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-3">
          <Avatar className="w-12 h-12">
            {profile?.profile_image_url ? (
              <AvatarImage src={profile.profile_image_url} alt={profile.name} />
            ) : (
              <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium">
                {profile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{profile?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Share something inspiring for the community...</p>
          </div>
        </div>
        <Textarea
          placeholder="What's your fitness win today? Share your progress, tips, or ask for motivation..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="mb-4 min-h-[100px] border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
        />

        {imagePreview && (
          <div className="relative mb-4">
            <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover rounded-xl border" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 text-white"
              onClick={() => {
                setImageFile(null); setImagePreview("");
              }}
            >
              Remove
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Add tags (comma separated)"
            value={tags.join(",")}
            onChange={e => setTags(e.target.value.split(",").map(v => v.trim()).filter(v => v))}
            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs w-60"
          />
        </div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {tags.map(tag => (
            <Badge key={tag} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <label htmlFor="image-upload" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                Add Photo
              </label>
            </Button>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <div className="flex gap-1 ml-2">
              {emojiList.map((emj, idx) => (
                <Button key={idx} size="icon" variant="ghost" onClick={() => setText(text + emj)}>
                  <span className="text-xl">{emj}</span>
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handlePost} disabled={isSubmitting || !text.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            {isSubmitting ? "Posting..." : "Share Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
