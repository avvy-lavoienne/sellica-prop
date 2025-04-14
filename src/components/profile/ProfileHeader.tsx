import Image from "next/image";
import VyuLogo from "@/assets/images/vyu-logo.svg";

export default function ProfileHeader() {
  return (
    <>
      <div className="flex justify-center mb-6">
        <Image
          src={VyuLogo.src}
          alt="VYU Logo"
          width={150}
          height={50}
          priority
          className="object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Profil Pengguna
      </h1>
    </>
  );
}