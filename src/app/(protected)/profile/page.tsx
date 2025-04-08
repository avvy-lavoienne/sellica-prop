"use client";

import { useEffect, useState } from "react";

interface User {
  nik: string;
  name: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const cookies = document.cookie.split("; ");
        const userIdCookie = cookies.find((row) => row.startsWith("userId="));
        const userId = userIdCookie ? userIdCookie.split("=")[1] : null;

        if (!userId) {
          throw new Error("User ID tidak ditemukan. Silakan login kembali.");
        }

        const response = await fetch(`/api/user?userId=${userId}`);
        const text = await response.text();
        console.log("Respons dari /api/user:", text);

        const data = JSON.parse(text);

        if (!response.ok) {
          throw new Error(data.error || "Gagal mengambil data pengguna.");
        }

        setUser(data.user);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">Error</h1>
          <p className="mt-4 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">Memuat...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Profil Pengguna</h1>
        <p className="mt-4 text-gray-600">Ini adalah halaman profil Anda.</p>
        <div className="mt-6">
          <p className="text-gray-700">
            <strong>NIK:</strong> {user.nik}
          </p>
          <p className="text-gray-700">
            <strong>Nama:</strong> {user.name}
          </p>
        </div>
      </div>
    </div>
  );
}