"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VyuLogo from "@/assets/images/vyu-logo.svg";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi NIK harus 16 angka
    if (!/^\d{16}$/.test(nik)) {
      setError("NIK harus terdiri dari 16 angka.");
      return;
    }

    // Validasi password dan ulangi password
    if (password !== confirmPassword) {
      setError("Password dan ulangi password tidak cocok.");
      return;
    }

    // Validasi panjang password
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return;
    }

    try {
      // Kirim request ke API route
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nik, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat registrasi.");
      }

      setError("");
      alert(data.message);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src={VyuLogo.src} alt="Vyu Logo" className="h-12 w-auto" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nik"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Induk Kependudukan (NIK)
            </label>
            <input
              type="text"
              id="nik"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Masukkan NIK (16 angka)"
              maxLength={16}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Masukkan password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Ulangi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ulangi password"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Daftar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <a href="/" className="text-indigo-600 hover:underline">
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
}