"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PostCard } from "@/components/feed/post-card";

interface Post {
  id: string;
  image_url: string;
  caption: string | null;
  likes_count: number;
  saves_count: number;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
  post_likes?: Array<{ user_id: string }>;
  post_saves?: Array<{ user_id: string }>;
}

export default function ExplorePage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
  const fetchPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setPosts(data as unknown as Post[]);
    }
    setLoading(false);
  };

  fetchPosts();
}, []);

  const visiblePosts = useMemo(() => {
    if (!query) return posts;
    return posts.filter((post) => [post.caption, post.profiles?.username, post.profiles?.full_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query));
  }, [posts, query]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-3xl font-semibold tracking-tight mb-8">Explore</h1>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="break-inside-avoid rounded-2xl bg-neutral-100 border border-neutral-200 animate-pulse aspect-square"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Explore
        </h1>
        <p className="text-neutral-500 mt-1">
          {query ? `Results for “${searchParams.get("q")}”` : "Discover new aesthetics and creators"}
        </p>
      </div>

      {visiblePosts.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-center">
          <div>
            <p className="text-lg font-medium text-neutral-900 mb-2">
              {query ? "No matching inspirations yet" : "No posts to explore yet"}
            </p>
            <p className="text-sm text-neutral-500">
              Be the first to share your aesthetic
            </p>
          </div>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {visiblePosts.map((post) => {
            const isLiked = post.post_likes?.some(
              (like) => like.user_id === currentUserId
            );
            const isSaved = post.post_saves?.some(
              (save) => save.user_id === currentUserId
            );

            return (
              <div key={post.id} className="break-inside-avoid">
                <PostCard
                  id={post.id}
                  imageUrl={post.image_url}
                  caption={post.caption || ""}
                  likesCount={post.likes_count}
                  savesCount={post.saves_count}
                  user={{
                    id: post.user_id,
                    username: post.profiles?.username || "Unknown",
                    fullName: post.profiles?.full_name || "Unknown",
                    avatarUrl: post.profiles?.avatar_url || undefined,
                  }}
                  isLiked={isLiked}
                  isSaved={isSaved}
                  currentUserId={currentUserId || undefined}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
