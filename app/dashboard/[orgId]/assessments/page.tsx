"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Filter, MoreHorizontal } from "lucide-react";

export default function AssessmentsPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params);
  
  // Fetch assessments from Convex
  const assessments = useQuery(api.assessments.listAssessments, { organizationId: orgId });

  if (!assessments) {
      return <div>Loading assessments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Assessments</h1>
            <p className="text-gray-500">Manage and review incoming vehicle assessments.</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg font-medium">
            New Assessment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
         <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Search by VIN, make, or model..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
         </div>
         <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
             </button>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Vehicle</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">VIN</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Status</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Estimate</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500">Date</th>
                    <th className="px-6 py-4 font-semibold text-sm text-gray-500"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {assessments.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No assessments found. Create one to get started.
                        </td>
                    </tr>
                ) : (
                    assessments.map((assessment) => (
                        <tr key={assessment._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-bold text-gray-900">{assessment.vehicleData?.year} {assessment.vehicleData?.make} {assessment.vehicleData?.model}</p>
                                    <p className="text-xs text-gray-500">{assessment.vehicleData?.type}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                {assessment.vehicleData?.vin || "N/A"}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${assessment.status === 'priced' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                `}>
                                    {assessment.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                                {assessment.pricing?.estimate ? `$${assessment.pricing.estimate}` : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(assessment._creationTime).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
