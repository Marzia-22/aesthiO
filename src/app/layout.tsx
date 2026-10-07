import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "aesthiO",
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