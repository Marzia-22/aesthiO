import type { PostWithProfile } from "@/lib/posts";

/** Development-only editorial examples. They are not Supabase records or retailer listings. */
const entries = [
  ["chrome-after-dark", "https://images.unsplash.com/photo-1674833482676-2094bc3d8499?auto=format&fit=crop&w=1200&q=85", "Black layers, silver hardware, and a little after-hours volume.", "mika.moves", "Mika Noor", 842, 186],
  ["quiet-linen", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85", "A soft old-money summer uniform: cream, texture, restraint.", "elan.studio", "Elan Park", 624, 143],
  ["silver-in-detail", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85", "The kind of silver that makes an everyday look feel intentional.", "goldenhour.archive", "Rhea Sen", 1260, 307],
  ["pink-desk", "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1200&q=85", "Pink plastic, tiny chrome details, and a desk that refuses to be quiet.", "pixelwarmth", "Nico Vale", 918, 221],
  ["off-duty-denim", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85", "Wide denim, a clean tank, the right amount of lived-in.", "sora.edits", "Sora Liu", 711, 119],
  ["red-room", "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85", "A warm room is built in layers: wood, paper, light, and one impossible color.", "formandfeeling", "Aanya Mehta", 1540, 412],
  ["gothic-lace", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85", "Gothic but considered: ink black, sheer texture, sharp boots.", "duskclub", "Jules Hart", 996, 250],
  ["sneaker-study", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85", "One bright shoe can hold an entire quiet outfit together.", "sole.notes", "Dev Arora", 486, 84],
  ["blue-hour-beauty", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85", "Glossy skin, a blue note, nothing extra.", "mira.makes", "Mira Kapoor", 1108, 290],
  ["tailored-casual", "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85", "An easy black blazer fixes the weekday uniform.", "properly.relaxed", "Ari James", 655, 138],
  ["sunlit-shelf", "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85", "A small corner for big references, soft light, and slow mornings.", "roomservice", "Anika Bose", 792, 201],
  ["city-uniform", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85", "A clean silhouette for days that begin in a café and end anywhere.", "kept.simple", "Noah Roy", 587, 105],
] as const;

export const SAMPLE_POSTS: PostWithProfile[] = entries.map(([id, image_url, caption, username, full_name, likes_count, saves_count], index) => ({
  id,
  image_url,
  caption,
  likes_count,
  saves_count,
  user_id: `sample-${username}`,
  created_at: new Date(Date.now() - index * 3_600_000).toISOString(),
  profiles: { id: `sample-${username}`, username, full_name, avatar_url: null },
  post_likes: [],
  post_saves: [],
}));
