"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VyuLogo from "@/assets/images/vyu-logo.svg";
import { ArrowPathIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!/^\d{16}$/.test(nik)) {
      setError("NIK harus terdiri dari 16 angka.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nik, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setError(data.error || "Data yang dimasukkan tidak valid (400).");
        } else if (response.status === 401) {
          setError(data.error || "NIK atau password salah (401).");
        } else if (response.status === 500) {
          setError(data.error || "Terjadi kesalahan server (500).");
        } else {
          setError(data.error || `Login gagal (${response.status}).`);
        }
        setIsLoading(false);
        return;
      }

      toast.success("Login berhasil! Mengarahkan ke dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src={VyuLogo.src} alt="Vyu Logo" className="h-12 w-auto" />
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 p-2 bg-red-100 rounded-md">
            {error}
          </p>
        )}
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
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Masukkan password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
              isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                Sedang login...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}