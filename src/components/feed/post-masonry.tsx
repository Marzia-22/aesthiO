"use client";

import { PostCard } from "@/components/feed/post-card";
import { mapPostToCardProps, PostWithProfile } from "@/lib/posts";

interface PostMasonryProps {
  posts: PostWithProfile[];
  currentUserId?: string | null;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  isSample?: boolean;
}

export function PostMasonry({
  posts,
  currentUserId,
  emptyMessage = "No posts yet",
  emptyAction,
  isSample = false,
}: PostMasonryProps) {
  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div>
          <p className="text-lg font-medium text-neutral-900 mb-2">
            {emptyMessage}
          </p>
          {emptyAction}
        </div>
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid">
          <PostCard {...mapPostToCardProps(post, currentUserId)} isSample={isSample} />
        </div>
      ))}
    </div>
  );
}

export function PostMasonrySkeleton() {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="break-inside-avoid rounded-2xl bg-neutral-100 border border-neutral-200 animate-pulse aspect-square"
        />
      ))}
    </div>
  );
}
