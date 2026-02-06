"use client";

import { redirect } from "next/navigation";

export default function DashboardRootPage() {
    // In a real app, logic to find the user's first org would go here.
    // For now, redirect to a demo org.
    redirect("/dashboard/demo_org_123");
}
