import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DashboardClientShell } from "@/components/layout/dashboard-client-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Sidebar />
      <Topbar />
      <main className="ml-0 md:ml-56 pt-16 min-h-screen">
        <div className="p-4 pb-24 md:p-6 md:pb-6">
          <DashboardClientShell>{children}</DashboardClientShell>
        </div>
      </main>
    </div>
  );
}
