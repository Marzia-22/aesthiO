"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { fetchPosts, PostWithProfile } from "@/lib/posts";
import { PostMasonry, PostMasonrySkeleton } from "@/components/feed/post-masonry";
import { useUploadModal } from "@/store/upload-modal";
import { SAMPLE_POSTS } from "@/lib/sample-posts";

export default function FeedPage() {
  const supabase = createClient();
  const refreshNonce = useUploadModal((s) => s.refreshNonce);
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [usingSamples, setUsingSamples] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data, error } = await fetchPosts(supabase, { limit: 20 });

      if (!error && data && data.length > 0) {
        setPosts(data as PostWithProfile[]);
        setUsingSamples(false);
      } else if (process.env.NODE_ENV === "development") {
        setPosts(SAMPLE_POSTS);
        setUsingSamples(true);
      }

      setLoading(false);
    };

    loadPosts();
  }, [refreshNonce]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">
          Your feed
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Curated for your aesthetic
        </p>
        {usingSamples && <p className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">Editorial sample feed · connect Supabase posts to replace it</p>}
      </div>

      {loading ? (
        <PostMasonrySkeleton />
      ) : posts.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-center">
          <div>
            <p className="text-lg font-medium text-neutral-900 mb-2">
              No posts yet
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Follow creators or explore to discover new aesthetics
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/explore"
                className="inline-block px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Explore
              </Link>
              <button
                onClick={() => useUploadModal.getState().open()}
                className="inline-block px-6 py-2.5 border border-neutral-200 text-neutral-900 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors"
              >
                + Post
              </button>
            </div>
          </div>
        </div>
      ) : (
        <PostMasonry posts={posts} currentUserId={currentUserId} isSample={usingSamples} />
      )}
    </motion.div>
  );
}
