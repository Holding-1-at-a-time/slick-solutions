"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Extract orgId from path (simple hack for now)
  const orgId = pathname?.split("/")[2] || "demo";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar orgId={orgId} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
