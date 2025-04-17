import Image from "next/image";
import Compressor from "compressorjs";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";

interface ProfileAvatarProps {
  avatarPreview: string | null;
  avatarUrl: string | null;
  isEditing: boolean;
  onAvatarChange: (compressedFile: File, previewUrl: string) => void;
}

export default function ProfileAvatar({
  avatarPreview,
  avatarUrl,
  isEditing,
  onAvatarChange,
}: ProfileAvatarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInMB = 2;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error(`Ukuran file terlalu besar, maksimal ${maxSizeInMB} MB`);
        return;
      }

      new Compressor(file, {
        quality: 0.8,
        maxWidth: 300,
        maxHeight: 300,
        success(compressedResult) {
          const compressedFile = new File([compressedResult], file.name, {
            type: compressedResult.type,
            lastModified: Date.now(),
          });
          const previewUrl = URL.createObjectURL(compressedFile);
          onAvatarChange(compressedFile, previewUrl);
        },
        error(err) {
          console.error("Compression error:", err);
          toast.error("Gagal mengompresi gambar. Silakan coba lagi.");
        },
      });
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        {avatarPreview || avatarUrl ? (
          <Image
            src={avatarPreview || (avatarUrl as string)}
            alt="Foto Profil"
            width={120}
            height={120}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            unoptimized
            priority
            onError={(e) => {
              e.currentTarget.src = "/images/default-avatar.png";
            }}
          />
        ) : (
          <Image
            src="/images/default-avatar.png"
            alt="Foto Profil Default"
            width={120}
            height={120}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
        )}
        {isEditing && (
          <Tooltip title="Unggah Foto Profil">
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleChange}
              />
              <span>📷</span>
            </label>
          </Tooltip>
        )}
      </div>
    </div>
  );
}