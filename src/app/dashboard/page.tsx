"use client"; // Tambahkan "use client" karena kita akan menggunakan useRouter

import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus cookie saat logout
    document.cookie = "isLoggedIn=; path=/; max-age=0";
    router.push("/");
  };

  // // Untuk sementara, kita masih menggunakan useEffect sebagai fallback
  // // Ini akan dihapus setelah middleware diterapkan
  // useEffect(() => {
  //   const isLoggedIn = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("isLoggedIn="))
  //     ?.split("=")[1];
  //   if (!isLoggedIn) {
  //     router.push("/");
  //   }
  // }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Konten Dashboard */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">Selamat Datang!</h1>
          <p className="mt-4 text-gray-600">Ini adalah halaman dashboard Anda.</p>
        </div>
      </div>
    </div>
  );
}