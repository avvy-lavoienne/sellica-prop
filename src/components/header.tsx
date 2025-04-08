import VyuLogo from "@/assets/images/vyu-logo.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
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
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Navigasi di sebelah kiri */}
      <div className="w-1/3 flex items-center space-x-4">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
          Dashboard
        </Link>
        <Link href="/profile" className="text-gray-600 hover:text-gray-800">
          Profile
        </Link>
      </div>

      {/* Logo di tengah */}
      <div className="w-1/3 flex justify-center">
        <img src={VyuLogo.src} alt="Vyu Logo" className="h-10 w-auto" />
      </div>

      {/* Tombol Logout di sebelah kanan */}
      <div className="w-1/3 flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </header>
  );
}