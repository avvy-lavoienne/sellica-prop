"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChartDashboard from "@/components/dashboard/ChartDashboard";

export default function DashboardPage({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("User"); // Default username

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Cek apakah user sudah login
    const isLoggedIn = document.cookie.includes("isLoggedIn=true");
    if (!isLoggedIn) {
      router.push("/");
      return;
    }

    // Ambil username dari cookie
    const cookieUsername = document.cookie
      .split("; ")
      .find(row => row.startsWith("username="))
      ?.split("=")[1];
    if (cookieUsername) {
      setUsername(cookieUsername);
    }
  }, [router, isClient]);

  const handleLogout = () => {
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  return (
    <main>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Hello, {username}!
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <ChartDashboard />
      </div>
    </main>
  );
}