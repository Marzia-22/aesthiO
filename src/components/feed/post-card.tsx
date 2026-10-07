"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PostCardProps {
  id: string;
  imageUrl: string;
  caption?: string;
  likesCount: number;
  savesCount: number;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  currentUserId?: string;
  isSample?: boolean;
}

export function PostCard({
  id,
  imageUrl,
  caption,
  likesCount,
  savesCount,
  user,
  isLiked = false,
  isSaved = false,
  currentUserId,
  isSample = false,
}: PostCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [saveCount, setSaveCount] = useState(savesCount);
  const [liking, setLiking] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId || isSample) return;
    setLiking(true);

    if (liked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", currentUserId);
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      await supabase.from("post_likes").insert({
        post_id: id,
        user_id: currentUserId,
      });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    setLiking(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId || isSample) return;
    setSaving(true);

    if (saved) {
      await supabase
        .from("post_saves")
        .delete()
        .eq("post_id", id)
        .eq("user_id", currentUserId);
      setSaved(false);
      setSaveCount((prev) => prev - 1);
    } else {
      await supabase.from("post_saves").insert({
        post_id: id,
        user_id: currentUserId,
      });
      setSaved(true);
      setSaveCount((prev) => prev + 1);
    }
    setSaving(false);
  };

  const openPost = () => router.push(isSample ? "/explore" : `/post/${id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openPost}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPost();
        }
      }}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-neutral-100 bg-white hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative w-full bg-neutral-100 overflow-hidden aspect-square">
        <img
          src={imageUrl}
          alt={caption || "Post"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
          <div className="flex gap-3 w-full">
            <button
              onClick={handleLike}
              disabled={liking || !currentUserId || isSample}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                liked
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-neutral-900 hover:bg-white"
              )}
            >
              <span>♥</span>
              {likeCount}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !currentUserId || isSample}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                saved
                  ? "bg-blue-500 text-white"
                  : "bg-white/80 text-neutral-900 hover:bg-white"
              )}
            >
              <span>◆</span>
              {saveCount}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col gap-2">
        {/* User — separate link, not nested inside another anchor */}
        <Link
          href={`/profile/${user.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600 flex-shrink-0">
            {user.fullName?.charAt(0) || user.username?.charAt(0) || "U"}
          </div>
          <span className="text-xs font-medium text-neutral-900 truncate">
            {user.username || "Unknown"}
          </span>
        </Link>

        {/* Caption */}
        {caption && (
          <p className="text-xs text-neutral-600 line-clamp-2">{caption}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1 border-t border-neutral-100">
          <span>{likeCount} likes</span>
          <span>{saveCount} saves</span>
        </div>
      </div>
    </div>
  );
}
