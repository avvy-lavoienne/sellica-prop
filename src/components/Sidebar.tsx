"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

interface SubCategory {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Category {
  name: string;
  subCategories: SubCategory[];
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

const categories: Category[] = [
  {
    name: "Aktivitas User",
    icon: ChartBarIcon,
    subCategories: [
      { name: "Pengaduan Bulanan", href: "/aktivitas-user/pengaduan-bulanan", icon: ChatBubbleLeftRightIcon },
      { name: "Aktivitas SIAK", href: "/aktivitas-user/aktivitas-siak", icon: ChartBarIcon },
      { name: "Dokumentasi", href: "/aktivitas-user/dokumentasi", icon: DocumentTextIcon },
    ],
  },
  {
    name: "Data Rekam KTP",
    icon: UsersIcon,
    subCategories: [
      { name: "Duplicate Operator Rekam", href: "/data-rekam/duplicate-operator", icon: UsersIcon },
      { name: "Kesalahan Perekaman", href: "/data-rekam/salah-rekam", icon: ExclamationTriangleIcon },
      { name: "Adjudicate Record", href: "/data-rekam/adjudicate", icon: ScaleIcon },
      { name: "Pengajuan Bulanan", href: "/data-rekam/pengajuan-bulanan", icon: DocumentPlusIcon },
    ],
  },
];

export default function Sidebar({ isSidebarCollapsed, setIsSidebarCollapsed }: SidebarProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleCategory = (categoryName: string) => {
    if (isSidebarCollapsed) return;
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

      {/* Tombol Toggle Permanen untuk Collapse Sidebar */}
      <button
        className={`fixed top-4 z-50 p-2 bg-gray-800 text-white rounded transition-all duration-300 ${
          isSidebarCollapsed ? "left-20" : "left-[calc(16rem+1rem)] md:left-[calc(16rem+1rem)]"
        }`}
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {isSidebarCollapsed ? (
          <ChevronRightIcon className="w-6 h-6" />
        ) : (
          <ChevronLeftIcon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        } bg-gray-800 text-white p-4 flex flex-col transform transition-all duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:h-screen z-40`}
      >
        {/* Judul Sidebar */}
        <div className="mb-6 flex items-center justify-center">
          {isSidebarCollapsed ? (
            <Image
              src="/images/logo-pemda.jpeg"
              alt="Logo Pemda"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover" // Perbesar logo saat collapsed
            />
          ) : (
            <div className="flex items-center">
              <Image
                src="/images/logo-pemda.jpeg"
                alt="Logo Pemda"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <span className="text-2xl font-bold">Sellica</span>
            </div>
          )}
        </div>

        {/* Navigasi Utama */}
        <nav className="flex-1">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Link
                  href={item.href}
                  className="flex items-center p-2 rounded hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon
                    className={`${
                      isSidebarCollapsed ? "w-8 h-8 mx-auto" : "w-5 h-5 mr-2"
                    }`} // Perbesar ikon saat collapsed
                  />
                  <span className={isSidebarCollapsed ? "hidden" : "block"}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}

            {/* Kategori dan Sub-Kategori */}
            {categories.map((category) => (
              <li key={category.name} className="mb-2">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="flex items-center w-full p-2 rounded hover:bg-gray-700 focus:outline-none"
                >
                  <category.icon
                    className={`${
                      isSidebarCollapsed ? "w-8 h-8 mx-auto" : "w-5 h-5 mr-2"
                    }`} // Perbesar ikon saat collapsed
                  />
                  <span className={isSidebarCollapsed ? "hidden" : "block"}>
                    {category.name}
                  </span>
                  {!isSidebarCollapsed &&
                    (openCategories.includes(category.name) ? (
                      <ChevronDownIcon className="w-5 h-5 ml-auto" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 ml-auto" />
                    ))}
                </button>
                {!isSidebarCollapsed && openCategories.includes(category.name) && (
                  <ul className="ml-6 mt-1">
                    {category.subCategories.map((subCategory) => (
                      <li key={subCategory.name}>
                        <Link
                          href={subCategory.href}
                          className="flex items-center p-2 rounded hover:bg-gray-700"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <subCategory.icon className="w-5 h-5 mr-2" />
                          <span>{subCategory.name}</span>
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
          className={`mt-auto p-2 rounded hover:bg-gray-700 flex items-center ${
            isSidebarCollapsed ? "justify-center" : "bg-red-600 text-white py-2 px-4 hover:bg-red-700"
          }`}
        >
          <XMarkIcon
            className={`${
              isSidebarCollapsed ? "w-8 h-8 mx-auto" : "w-5 h-5 mr-2"
            }`} // Perbesar ikon saat collapsed
          />
          <span className={isSidebarCollapsed ? "hidden" : "block"}>Logout</span>
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