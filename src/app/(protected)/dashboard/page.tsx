"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChartDashboard from "@/components/dashboard/ChartDashboard";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("User");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkSession = async () => {
      try {
        // Cek sesi menggunakan Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error("Session error:", sessionError);
          setError("Sesi tidak ditemukan. Silakan login kembali.");
          router.push("/");
          return;
        }

        // Ambil data pengguna dari sesi
        const user = session.user;
        if (user) {
          setUsername(user.user_metadata?.username || user.email || "User");
        } else {
          throw new Error("Pengguna tidak ditemukan dalam sesi.");
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setError("Gagal memuat data pengguna. Silakan coba lagi.");
        router.push("/");
      }
    };

    checkSession();
  }, [router, isClient]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main>
      <div className="mb-6 flex justify-between items-center">
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