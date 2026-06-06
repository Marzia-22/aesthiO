import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "aesthio — AI-powered aesthetic discovery",
  description: "Discover fashion, design, and lifestyle content tailored to your vibe. Save inspirations, build moodboards, and shop what you love.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}