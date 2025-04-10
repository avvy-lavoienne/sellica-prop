"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; nik: string } | null>(null);
  const [error, setError] = useState("");

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split("; ");
    console.log("Cookies di dashboard:", document.cookie); // Logging cookies
    const userIdCookie = cookies.find((cookie) => cookie.startsWith("userId="));
    return userIdCookie ? userIdCookie.split("=")[1] : null;
  };

  useEffect(() => {
    const isLoggedIn = document.cookie.includes("isLoggedIn=true");
    console.log("isLoggedIn:", isLoggedIn); // Logging status isLoggedIn
    if (!isLoggedIn) {
      console.log("Redirect ke login: isLoggedIn tidak ditemukan");
      router.push("/");
      return;
    }

    const userId = getUserIdFromCookie();
    console.log("userId dari cookie:", userId); // Logging userId
    if (!userId) {
      console.log("Redirect ke login: userId tidak ditemukan");
      router.push("/");
      return;
    }

    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Respons dari /api/user/[id]:", data); // Logging respons API
        if (data.error) {
          setError(data.error);
          console.log("Redirect ke login: Error dari API -", data.error);
          router.push("/"); // Redirect ke login jika gagal mengambil data
        } else {
          setUser({ id: userId, nik: data.nik });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err); // Logging error fetch
        setError("Gagal mengambil data pengguna.");
        console.log("Redirect ke login: Fetch gagal");
        router.push("/"); // Redirect ke login jika fetch gagal
      });
  }, [router]);

  const handleLogout = () => {
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  if (!user && !error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  if (error || !user) {
    return null; // Tidak menampilkan apa pun karena sudah redirect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Sellica</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Selamat Datang!</h2>
          <p className="text-gray-600 mb-2">
            NIK Anda: <span className="font-medium">{user.nik}</span>
          </p>
          <p className="text-gray-600">
            Ini adalah dashboard Sellica. Anda dapat melihat data atau mengelola akun Anda di sini.
          </p>
        </div>
      </main>
    </div>
  );
}