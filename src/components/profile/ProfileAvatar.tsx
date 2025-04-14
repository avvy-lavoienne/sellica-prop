import Image from "next/image";

interface ProfileAvatarProps {
  avatarPreview: string | null;
  avatarUrl: string | null;
  isEditing: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileAvatar({
  avatarPreview,
  avatarUrl,
  isEditing,
  onAvatarChange,
}: ProfileAvatarProps) {
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
          <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={onAvatarChange}
            />
            <span>📷</span>
          </label>
        )}
      </div>
    </div>
  );
}