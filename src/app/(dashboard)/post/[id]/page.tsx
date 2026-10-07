"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Post {
  id: string;
  image_url: string;
  caption: string | null;
  likes_count: number;
  saves_count: number;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const supabase = createClient();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [saving, setSaving] = useState(false);

useEffect(() => {
  const fetchPost = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    // Fetch post - simpler query
    const { data: postData, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    console.log("Post data:", postData);
    console.log("Error:", error);

    if (!postData) {
      console.log("No post found for ID:", postId);
      setLoading(false);
      return;
    }

    setPost(postData);
    setLikeCount(postData.likes_count);
    setSaveCount(postData.saves_count);

    if (user) {
      const { data: likeData } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      const { data: saveData } = await supabase
        .from("post_saves")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      setLiked(!!likeData);
      setSaved(!!saveData);
    }

    setLoading(false);
  };

  fetchPost();
}, [postId]);

  const handleLike = async () => {
    if (!currentUserId) return;
    setLiking(true);

    if (liked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: currentUserId,
      });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    setLiking(false);
  };

  const handleSave = async () => {
    if (!currentUserId) return;
    setSaving(true);

    if (saved) {
      await supabase
        .from("post_saves")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);
      setSaved(false);
      setSaveCount((prev) => prev - 1);
    } else {
      await supabase.from("post_saves").insert({
        post_id: postId,
        user_id: currentUserId,
      });
      setSaved(true);
      setSaveCount((prev) => prev + 1);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="animate-fade-in h-96 bg-neutral-100 rounded-2xl" />
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 mb-4">Post not found</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-neutral-100 rounded-2xl overflow-hidden">
          <img
            src={post.image_url}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          {/* User info */}
          <div className="border-b border-neutral-100 pb-6">
            <Link href={`/profile/${post.profiles?.username}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-lg font-semibold text-neutral-600">
                  {post.profiles?.full_name?.charAt(0) || post.profiles?.username?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">
                    {post.profiles?.username || "Unknown"}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {post.profiles?.full_name || ""}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Caption */}
          {post.caption && (
            <div>
              <p className="text-neutral-700 leading-relaxed">{post.caption}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 py-6">
            <div>
              <p className="text-2xl font-semibold text-neutral-900">
                {likeCount}
              </p>
              <p className="text-sm text-neutral-500">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-neutral-900">
                {saveCount}
              </p>
              <p className="text-sm text-neutral-500">Saves</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleLike}
              disabled={liking || !currentUserId}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                liked
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "border border-neutral-200 text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              {liking ? "..." : liked ? "♥ Liked" : "♡ Like"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !currentUserId}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                saved
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "border border-neutral-200 text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              {saving ? "..." : saved ? "◆ Saved" : "◇ Save"}
            </button>
          </div>

          {/* Timestamp */}
          <p className="text-xs text-neutral-400">
            Posted {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}