"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
  <div className="flex min-h-screen bg-gray-100 p-0">
    <Sidebar
      isSidebarCollapsed={isSidebarCollapsed}
      setIsSidebarCollapsed={setIsSidebarCollapsed}
    />
    <main
      className={`flex-1 md:pt-6 pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? "md:ml-16" : "flex-1 md:pl-20 md:pt-6 pt-16 transition-all duration-300 "
      }`}
    >
      {children}
    </main>
  </div>
);
}