import Image from "next/image";
import VyuLogo from "@/assets/images/vyu-logo.svg";

export default function ProfileHeader() {
  return (
    <>
      <div className="flex justify-center mb-6">
        <Image
          src={VyuLogo.src}
          alt="VYU Logo"
          width={0}
          height={0}
          sizes="100vw"
          className="w-32 md:w-40 h-auto object-contain"
          priority
        />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        Profil Pengguna
      </h1>
    </>
  );
}