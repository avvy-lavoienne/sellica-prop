"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VyuLogo from "@/assets/images/vyu-logo.svg";
import { ArrowPathIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validasi password dan ulangi password
    if (password !== confirmPassword) {
      setError("Password dan ulangi password tidak cocok.");
      setIsLoading(false);
      return;
    }

    // Validasi panjang password
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      // Daftar pengguna baru menggunakan Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast.success("Pendaftaran berhasil! Mengarahkan ke halaman login...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err: any) {
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src={VyuLogo.src} width={32} height={32} alt="Vyu Logo" className="h-12 w-auto" />
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 p-2 bg-red-100 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Masukkan email"
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
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Ulangi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ulangi password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showConfirmPassword ? (
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
                Sedang mendaftar...
              </>
            ) : (
              "Daftar"
            )}
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