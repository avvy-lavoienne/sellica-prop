"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";

// Lazy load ChartDashboard
const ChartDashboard = dynamic(() => import("@/components/dashboard/ChartDashboard"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full"></div>
  ),
});

interface Stats {
  totalPengajuan: number;
  disetujui: number;
  ditolak: number;
  menunggu: number;
}

export default function DashboardPage({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("User");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkSession = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        setError("Sesi tidak ditemukan. Silakan login kembali.");
        router.push("/");
        return;
      }

      const user = session.user;
      if (user) {
        setUsername(user.user_metadata?.username || user.email?.split("@")[0] || "User");
      } else {
        throw new Error("Pengguna tidak ditemukan dalam sesi.");
      }

      // Ambil data statistik dari Supabase (contoh tabel "pengajuan")
      const { data: pengajuanData, error: pengajuanError } = await supabase
        .from("pengajuan")
        .select("status");

      if (pengajuanError) {
        throw new Error("Gagal mengambil data statistik: " + pengajuanError.message);
      }

      const totalPengajuan = pengajuanData.length;
      const disetujui = pengajuanData.filter((item: any) => item.status === "disetujui").length;
      const ditolak = pengajuanData.filter((item: any) => item.status === "ditolak").length;
      const menunggu = pengajuanData.filter((item: any) => item.status === "menunggu").length;

      setStats({ totalPengajuan, disetujui, ditolak, menunggu });
    } catch (err: any) {
      console.error("Error checking session or fetching stats:", err);
      setError(err.message || "Gagal memuat data pengguna. Silakan coba lagi.");
      router.push("/");
    } finally {
      setIsLoadingStats(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isClient) return;
    checkSession();
  }, [isClient, checkSession]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={checkSession}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Hello, {username}!
        </h2>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => router.push("/salah-rekam")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Ajukan Baru
        </button>
        <button
          onClick={() => router.push("/salah-rekam?mode=rekap")}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Lihat Rekap
        </button>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {isLoadingStats ? (
          <>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Pengajuan</h3>
              <p className="text-2xl font-bold text-indigo-600">{stats?.totalPengajuan ?? 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Pengajuan Disetujui</h3>
              <p className="text-2xl font-bold text-green-600">{stats?.disetujui ?? 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Pengajuan Ditolak</h3>
              <p className="text-2xl font-bold text-red-600">{stats?.ditolak ?? 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Menunggu Persetujuan</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats?.menunggu ?? 0}</p>
            </div>
          </>
        )}
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ChartDashboard />
      </div>
    </main>
  );
}