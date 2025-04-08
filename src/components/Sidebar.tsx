"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, ChevronRightIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

interface SubCategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  subCategories: SubCategory[];
}

const categories: Category[] = [
  {
    name: "Aktivitas User",
    subCategories: [
      { name: "Pengaduan Bulanan", href: "/aktivitas-user/pengaduan-bulanan" },
      { name: "Aktivitas SIAK", href: "/aktivitas-user/aktivitas-siak" },
      { name: "Dokumentasi", href: "/aktivitas-user/dokumentasi" },
    ],
  },
  {
    name: "Data Rekam KTP",
    subCategories: [
      { name: "Duplicate Operator Rekam", href: "/data-rekam/duplicate-operator" },
      { name: "Kesalahan Perekaman", href: "/data-rekam/salah-rekam" },
      { name: "Adjudicate Record", href: "/data-rekam/adjudicate" },
      { name: "Pengajuan Bulanan", href: "/data-rekam/pengajuan-bulanan" },
    ],
  },
];

export default function Sidebar() {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleCategory = (categoryName: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

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
    <>
      {/* Tombol Toggle untuk Layar Kecil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 flex flex-col transform transition-transform duration-300 md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:w-64 md:h-screen z-40`}
      >
        {/* Judul Sidebar */}
        <div className="text-2xl font-bold mb-6">Sellica</div>

        {/* Navigasi Utama */}
        <nav className="flex-1">
          <ul>
            <li className="mb-2">
              <Link
                href="/dashboard"
                className="block p-2 rounded hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/profile"
                className="block p-2 rounded hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                Profile
              </Link>
            </li>

            {/* Kategori dan Sub-Kategori */}
            {categories.map((category) => (
              <li key={category.name} className="mb-2">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="flex items-center w-full p-2 rounded hover:bg-gray-700 focus:outline-none"
                >
                  {openCategories.includes(category.name) ? (
                    <ChevronDownIcon className="w-5 h-5 mr-2" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 mr-2" />
                  )}
                  {category.name}
                </button>
                {openCategories.includes(category.name) && (
                  <ul className="ml-6 mt-1">
                    {category.subCategories.map((subCategory) => (
                      <li key={subCategory.name}>
                        <Link
                          href={subCategory.href}
                          className="block p-2 rounded hover:bg-gray-700"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          {subCategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Overlay untuk Layar Kecil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}