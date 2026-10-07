"use client";

import { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUploadModal } from "@/store/upload-modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function UploadModal() {
  const { isOpen, close, triggerRefresh } = useUploadModal();
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (uploading) return;
    resetForm();
    close();
  };

  const handleFileSelect = (selected: File | null) => {
    setError("");
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 10MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    handleFileSelect(dropped || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to post.");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(
          uploadError.message.includes("Bucket not found")
            ? 'Storage bucket "posts" not found. Create a public "posts" bucket in Supabase.'
            : uploadError.message
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(filePath);

      const { data: newPost, error: insertError } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          caption: caption.trim() || null,
          likes_count: 0,
          saves_count: 0,
        })
        .select("id")
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      resetForm();
      close();
      triggerRefresh();
      router.push(`/post/${newPost.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.2 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-[#FDFBF7] rounded-2xl border border-neutral-100 shadow-xl p-6 focus:outline-none"
              >
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-semibold text-[#111111]">
                    Create Post
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      disabled={uploading}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Drop zone / Preview */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => !preview && fileInputRef.current?.click()}
                  className={cn(
                    "relative rounded-xl border-2 border-dashed transition-colors mb-4 overflow-hidden",
                    preview
                      ? "border-neutral-200 cursor-default"
                      : "border-neutral-200 hover:border-neutral-400 cursor-pointer bg-white"
                  )}
                >
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-72 object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetForm();
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors text-xs"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                        <ImageIcon className="w-6 h-6 text-neutral-500" />
                      </div>
                      <p className="text-sm font-medium text-neutral-900 mb-1">
                        Drop your image here
                      </p>
                      <p className="text-xs text-neutral-500">
                        or click to browse · JPEG, PNG, WebP, GIF · max 10MB
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  className="hidden"
                  onChange={(e) =>
                    handleFileSelect(e.target.files?.[0] || null)
                  }
                />

                {/* Caption */}
                <div className="mb-4">
                  <label
                    htmlFor="caption"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    Caption{" "}
                    <span className="text-neutral-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe your aesthetic..."
                    rows={3}
                    maxLength={500}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-sm resize-none",
                      "border border-neutral-200 bg-white text-[#111111]",
                      "placeholder:text-neutral-400",
                      "focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400",
                      "transition-all duration-200"
                    )}
                  />
                  <p className="text-xs text-neutral-400 mt-1 text-right">
                    {caption.length}/500
                  </p>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading || !file}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all",
                    "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  )}
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Publish Post
                    </>
                  )}
                </button>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
