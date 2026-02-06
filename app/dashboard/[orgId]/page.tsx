"use client";

import { use } from "react";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { TrendingUp, Users, Car, DollarSign } from "lucide-react";

export default function DashboardOverview({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params);

  const stats = [
    { label: "Total Revenue", value: "$12,450", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
    { label: "Assessments", value: "145", change: "+8.2%", icon: FileTextIcon, color: "text-blue-600" },
    { label: "Active Customers", value: "89", change: "+5.1%", icon: Users, color: "text-purple-600" },
    { label: "Avg. Ticket", value: "$345", change: "+2.3%", icon: TrendingUp, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <div>
                     <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                     <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Revenue Trends</h3>
            <RevenueChart />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
             <div className="space-y-6">
                {[1,2,3,4,5].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Car className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">New Assessment Request</p>
                            <p className="text-xs text-gray-500">2 minutes ago • 2022 Tesla Model Y</p>
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
}

function FileTextIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    )
}
