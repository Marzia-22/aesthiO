import { SupabaseClient } from "@supabase/supabase-js";

export const POST_SELECT = `
  *,
  profiles (
    id,
    username,
    full_name,
    avatar_url
  ),
  post_likes ( user_id ),
  post_saves ( user_id )
`;

export interface PostWithProfile {
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
  post_likes?: Array<{ user_id: string }>;
  post_saves?: Array<{ user_id: string }>;
}

export async function fetchPosts(
  supabase: SupabaseClient,
  options?: { userId?: string; limit?: number }
) {
  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false });

  if (options?.userId) {
    query = query.eq("user_id", options.userId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  return query;
}

export function mapPostToCardProps(
  post: PostWithProfile,
  currentUserId?: string | null
) {
  return {
    id: post.id,
    imageUrl: post.image_url,
    caption: post.caption || "",
    likesCount: post.likes_count,
    savesCount: post.saves_count,
    user: {
      id: post.user_id,
      username: post.profiles?.username || "Unknown",
      fullName: post.profiles?.full_name || "Unknown",
      avatarUrl: post.profiles?.avatar_url || undefined,
    },
    isLiked:
      post.post_likes?.some((like) => like.user_id === currentUserId) ?? false,
    isSaved:
      post.post_saves?.some((save) => save.user_id === currentUserId) ?? false,
    currentUserId: currentUserId || undefined,
  };
}
