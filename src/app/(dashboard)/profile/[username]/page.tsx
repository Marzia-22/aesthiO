"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PostCard } from "@/components/feed/post-card";
import { useParams } from "next/navigation";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
}

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
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // Get profile by username
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (!profileData) {
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Get user's posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", profileData.id)
        .order("created_at", { ascending: false });

      if (postsData) setPosts(postsData);

      // Get followers count
      const { count: followersCount } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("following_id", profileData.id);

      // Get following count
      const { count: followingCount } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("follower_id", profileData.id);

      if (followersCount !== null) setFollowers(followersCount);
      if (followingCount !== null) setFollowing(followingCount);

      // Check if current user follows this user
      if (user) {
        const { data: followData } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", user.id)
          .eq("following_id", profileData.id)
          .single();

        setIsFollowing(!!followData);
      }

      setLoading(false);
    };

    fetchData();
  }, [username]);

  const handleFollow = async () => {
    if (!currentUserId || !profile) return;
    setFollowLoading(true);

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profile.id);
      setIsFollowing(false);
      setFollowers((prev) => prev - 1);
    } else {
      await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: profile.id,
      });
      setIsFollowing(true);
      setFollowers((prev) => prev + 1);
    }

    setFollowLoading(false);
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="h-48 bg-neutral-100 rounded-2xl animate-pulse mb-6" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center text-2xl font-semibold text-neutral-600 flex-shrink-0">
            {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-neutral-900">
              {profile.username}
            </h1>
            <p className="text-neutral-500 mt-1">{profile.full_name}</p>
            {profile.bio && (
              <p className="text-sm text-neutral-600 mt-3 max-w-md">{profile.bio}</p>
            )}

            <div className="flex gap-6 mt-6">
              <div>
                <p className="text-sm font-medium text-neutral-900">{posts.length}</p>
                <p className="text-xs text-neutral-500">Posts</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{followers}</p>
                <p className="text-xs text-neutral-500">Followers</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{following}</p>
                <p className="text-xs text-neutral-500">Following</p>
              </div>
            </div>

            {/* Follow button */}
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`mt-6 px-6 py-2 text-sm font-medium rounded-xl transition-all ${
                isFollowing
                  ? "border border-neutral-200 text-neutral-900 hover:bg-neutral-50"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">No posts yet</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="break-inside-avoid">
                <PostCard
                  id={post.id}
                  imageUrl={post.image_url}
                  caption={post.caption || ""}
                  likesCount={post.likes_count}
                  savesCount={post.saves_count}
                  user={{
                    id: post.user_id,
                    username: profile.username,
                    fullName: profile.full_name,
                    avatarUrl: profile.avatar_url || undefined,
                  }}
                  currentUserId={currentUserId || undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}