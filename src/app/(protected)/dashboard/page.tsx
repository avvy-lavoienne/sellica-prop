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
  pengajuan: number; // is_ready_to_record = false
  selesai: number; // is_ready_to_record = true
}

interface DashboardStats {
  duplicateOperator: Stats;
  salahRekam: Stats;
  adjudicateRecord: Stats;
  pengajuanBulanan: Stats;
}

export default function DashboardPage({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState("User"); // Ganti username jadi name
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
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

      // Ambil data profil untuk nama
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error("Gagal mengambil data profil: " + profileError.message);
      }

      setName(profileData.name || "User");

      // Ambil data statistik dari empat tabel
      const [
        duplicateOperatorResponse,
        salahRekamResponse,
        adjudicateRecordResponse,
        pengajuanBulananResponse,
      ] = await Promise.all([
        supabase.from("duplicate_operator").select("is_ready_to_record"),
        supabase.from("salah_rekam").select("is_ready_to_record"),
        supabase.from("adjudicate_record").select("is_ready_to_record"),
        supabase.from("pengajuan_bulanan").select("is_ready_to_record"),
      ]);

      if (duplicateOperatorResponse.error) {
        throw new Error("Gagal mengambil data statistik duplicate operator: " + duplicateOperatorResponse.error.message);
      }
      if (salahRekamResponse.error) {
        throw new Error("Gagal mengambil data statistik salah rekam: " + salahRekamResponse.error.message);
      }
      if (adjudicateRecordResponse.error) {
        throw new Error("Gagal mengambil data statistik adjudicate record: " + adjudicateRecordResponse.error.message);
      }
      if (pengajuanBulananResponse.error) {
        throw new Error("Gagal mengambil data statistik pengajuan bulanan: " + pengajuanBulananResponse.error.message);
      }

      const duplicateOperatorData = duplicateOperatorResponse.data;
      const salahRekamData = salahRekamResponse.data;
      const adjudicateRecordData = adjudicateRecordResponse.data;
      const pengajuanBulananData = pengajuanBulananResponse.data;

      const duplicateOperatorStats: Stats = {
        pengajuan: duplicateOperatorData.filter((item: any) => item.is_ready_to_record === false).length,
        selesai: duplicateOperatorData.filter((item: any) => item.is_ready_to_record === true).length,
      };

      const salahRekamStats: Stats = {
        pengajuan: salahRekamData.filter((item: any) => item.is_ready_to_record === false).length,
        selesai: salahRekamData.filter((item: any) => item.is_ready_to_record === true).length,
      };

      const adjudicateRecordStats: Stats = {
        pengajuan: adjudicateRecordData.filter((item: any) => item.is_ready_to_record === false).length,
        selesai: adjudicateRecordData.filter((item: any) => item.is_ready_to_record === true).length,
      };

      const pengajuanBulananStats: Stats = {
        pengajuan: pengajuanBulananData.filter((item: any) => item.is_ready_to_record === false).length,
        selesai: pengajuanBulananData.filter((item: any) => item.is_ready_to_record === true).length,
      };

      setStats({
        duplicateOperator: duplicateOperatorStats,
        salahRekam: salahRekamStats,
        adjudicateRecord: adjudicateRecordStats,
        pengajuanBulanan: pengajuanBulananStats,
      });
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
          Hello, {name}!
        </h2>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => router.push("/data-rekam/duplicate-operator")}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Duplicate Operator
        </button>
        <button
          onClick={() => router.push("/data-rekam/salah-rekam")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Salah Rekam
        </button>
        <button
          onClick={() => router.push("/data-rekam/adjudicate")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Adjudicate Record
        </button>
        <button
          onClick={() => router.push("/data-rekam/pengajuan-bulanan")}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          Pengajuan Bulanan
        </button>
      </div>

      {/* Statistik Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoadingStats ? (
          <>
            <div className="bg-gray-200 p-4 rounded-lg shadow-md animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg shadow-md animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg shadow-md animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg shadow-md animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Duplicate Operator</h3>
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <p className="text-xl font-bold text-orange-600">
                  Pengajuan: {stats?.duplicateOperator.pengajuan ?? 0}
                </p>
                <p className="text-xl font-bold text-green-600">
                  Selesai: {stats?.duplicateOperator.selesai ?? 0}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Salah Rekam</h3>
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <p className="text-xl font-bold text-orange-600">
                  Pengajuan: {stats?.salahRekam.pengajuan ?? 0}
                </p>
                <p className="text-xl font-bold text-green-600">
                  Selesai: {stats?.salahRekam.selesai ?? 0}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Adjudicate Record</h3>
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <p className="text-xl font-bold text-orange-600">
                  Pengajuan: {stats?.adjudicateRecord.pengajuan ?? 0}
                </p>
                <p className="text-xl font-bold text-green-600">
                  Selesai: {stats?.adjudicateRecord.selesai ?? 0}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Pengajuan Bulanan</h3>
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <p className="text-xl font-bold text-orange-600">
                  Pengajuan: {stats?.pengajuanBulanan.pengajuan ?? 0}
                </p>
                <p className="text-xl font-bold text-green-600">
                  Selesai: {stats?.pengajuanBulanan.selesai ?? 0}
                </p>
              </div>
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