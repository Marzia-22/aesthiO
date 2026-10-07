"use client";

import { UploadModal } from "@/components/posts/upload-modal";
import { MobileNav } from "@/components/layout/mobile-nav";

export function DashboardClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <UploadModal />
      <MobileNav />
    </>
  );
}
