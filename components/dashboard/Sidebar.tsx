"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Users, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({ orgId }: { orgId: string }) {
  const pathname = usePathname();

  const links = [
    { href: `/dashboard/${orgId}`, label: "Overview", icon: LayoutDashboard },
    { href: `/dashboard/${orgId}/assessments`, label: "Assessments", icon: FileText },
    { href: `/dashboard/${orgId}/customers`, label: "Customers", icon: Users },
    { href: `/dashboard/${orgId}/settings`, label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black text-white p-6 flex flex-col justify-between">
      <div>
        <div className="mb-10 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">S</div>
            <span className="text-xl font-bold tracking-tight">SlickSolutions</span>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div className={`relative px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}>
                    {isActive && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-blue-600 rounded-xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <link.icon className="w-5 h-5 relative z-10" />
                    <span className="font-medium relative z-10">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <button className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 transition-colors">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign Out</span>
      </button>
    </aside>
  );
}
