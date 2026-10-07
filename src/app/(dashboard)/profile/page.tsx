"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PostCard } from "@/components/feed/post-card";
import { Bookmark, Grid2X2, Plus, Sparkles } from "lucide-react";

const STARTER_COLLECTIONS = [
  { name: "After dark", count: 14, tone: "bg-[#272225] text-white" },
  { name: "Warm minimal", count: 9, tone: "bg-[#E9DFC9] text-neutral-900" },
  { name: "Silver notes", count: 22, tone: "bg-[#DDE0E2] text-neutral-900" },
];

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

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setCurrentUserId(user.id);

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        setProfile({
          id: user.id,
          username: typeof user.user_metadata.username === "string" ? user.user_metadata.username : user.email?.split("@")[0] || "aesthio member",
          full_name: typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : "Aesthio member",
          avatar_url: null,
          bio: "Building a visual vocabulary, one saved reference at a time.",
        });
      }

      // Get user's posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (postsData) {
        setPosts(postsData);
      }

      // Get followers count
      const { count: followersCount } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("following_id", user.id);

      // Get following count
      const { count: followingCount } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("follower_id", user.id);

      if (followersCount !== null) setFollowers(followersCount);
      if (followingCount !== null) setFollowing(followingCount);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="h-48 bg-neutral-100 rounded-2xl animate-pulse mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center text-2xl font-semibold text-neutral-600 flex-shrink-0">
            {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || "U"}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-neutral-900">
              {profile?.username || "Unknown"}
            </h1>
            <p className="text-neutral-500 mt-1">{profile?.full_name}</p>
            {profile?.bio && (
              <p className="text-sm text-neutral-600 mt-3 max-w-md">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
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

            {/* Edit button */}
            <button className="mt-6 px-6 py-2 border border-neutral-200 text-neutral-900 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors">
              Edit profile
            </button>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <div className="flex items-end justify-between mb-4"><div><p className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-400">Your point of view</p><h2 className="mt-1 text-lg font-semibold text-neutral-900">Collections</h2></div><button className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900"><Plus className="w-4 h-4" /> New collection</button></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{STARTER_COLLECTIONS.map((collection) => <button key={collection.name} className={`${collection.tone} min-h-32 rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5`}><Bookmark className="w-4 h-4 opacity-70" /><p className="mt-8 text-sm font-semibold">{collection.name}</p><p className="mt-1 text-xs opacity-70">{collection.count} inspirations</p></button>)}</div>
        <p className="mt-3 text-xs text-neutral-400">Starter collection ideas are local UI prompts; saved collections need a Supabase collection table to persist.</p>
      </section>

      {/* Posts */}
      <div>
        <div className="flex items-center gap-2 mb-4"><Grid2X2 className="w-4 h-4 text-neutral-500" /><h2 className="text-lg font-semibold text-neutral-900">Posts</h2></div>
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white/50 text-center py-12 px-6">
            <Sparkles className="mx-auto w-5 h-5 text-neutral-400" />
            <p className="mt-3 font-medium text-neutral-800">Your first visual chapter starts here.</p>
            <p className="mt-1 text-sm text-neutral-500">Post an outfit, room, beauty look, or anything worth returning to.</p>
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
                    username: profile?.username || "Unknown",
                    fullName: profile?.full_name || "Unknown",
                    avatarUrl: profile?.avatar_url || undefined,
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
