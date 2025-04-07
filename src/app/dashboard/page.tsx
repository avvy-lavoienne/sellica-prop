"use client"; // Tambahkan "use client" karena kita akan menggunakan useRouter

import { useRouter } from "next/navigation";
import Header from "@/components/header";

export default function Dashboard() {
  const router = useRouter();

 const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/");
    } catch (error) {
      console.error("Error saat logout:", error);
      router.push("/");
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Selamat Datang!</h1>
        <p className="mt-4 text-gray-600">Ini adalah halaman dashboard Anda.</p>
      </div>
    </div>
    </div>
    
  );
}