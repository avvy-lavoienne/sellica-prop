"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileActions from "@/components/profile/ProfileActions";

// Lazy load ProfileAvatar
const ProfileAvatar = dynamic(() => import("@/components/profile/ProfileAvatar"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center mb-6">
      <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
    </div>
  ),
});

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{
    name: string;
    nip: string;
    position: string;
    nik: string;
    avatar_url: string | null;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    position: "",
    nik: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsFetchingProfile(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          toast.error("Sesi tidak ditemukan. Silakan login kembali.");
          router.push("/");
          return;
        }

        setUser(session.user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, nip, position, nik, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          if (profileError.code === "PGRST116") {
            const newProfile = {
              id: session.user.id,
              name: session.user.email?.split("@")[0] || "User",
              nip: "",
              position: "",
              nik: "",
              avatar_url: null,
            };

            const { error: insertError } = await supabase
              .from("profiles")
              .insert(newProfile);

            if (insertError) throw new Error(`Gagal membuat profil baru: ${insertError.message}`);

            setProfile(newProfile);
            setFormData({
              name: newProfile.name,
              nip: newProfile.nip,
              position: newProfile.position,
              nik: newProfile.nik,
            });
          } else {
            throw new Error(`Gagal mengambil profil: ${profileError.message}`);
          }
        } else {
          setProfile(profileData);
          setFormData({
            name: profileData.name,
            nip: profileData.nip,
            position: profileData.position,
            nik: profileData.nik || "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast.error(error.message || "Gagal memuat profil. Silakan coba lagi.");
        router.push("/");
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleAvatarChange = useCallback((compressedFile: File, previewUrl: string) => {
    setAvatarFile(compressedFile);
    setAvatarPreview(previewUrl);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setFormData({
      name: profile?.name || "",
      nip: profile?.nip || "",
      position: profile?.position || "",
      nik: profile?.nik || "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  }, [profile]);

  const handleSave = useCallback(async () => {
    if (!user || !profile) {
      toast.error("Data pengguna tidak ditemukan. Silakan coba lagi.");
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = profile.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop()?.toLowerCase();
        if (!fileExt || !["jpg", "jpeg", "png"].includes(fileExt)) {
          throw new Error("Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.");
        }

        const fileName = `${user.id}.${fileExt}`;
        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (avatarFile.size > maxSizeInBytes) {
          throw new Error(`Ukuran file terlalu besar, maksimal ${maxSizeInMB} MB`);
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error("Sesi autentikasi tidak valid. Silakan login kembali.");
        }

        const { data: existingFiles, error: listError } = await supabase.storage
          .from("avatars")
          .list("", { limit: 100 });

        if (listError) throw new Error(`Gagal memeriksa file avatar lama: ${listError.message}`);

        const filesToDelete = existingFiles
          ?.filter((file) => file.name.startsWith(user.id + "."))
          .map((file) => file.name) || [];

        if (filesToDelete.length > 0) {
          const { error: deleteError } = await supabase.storage
            .from("avatars")
            .remove(filesToDelete);

          if (deleteError) throw new Error(`Gagal menghapus avatar lama: ${deleteError.message}`);
        }

        const { data: postDeleteFiles, error: postDeleteError } = await supabase.storage
          .from("avatars")
          .list("", { limit: 100 });

        if (postDeleteError) throw new Error(`Gagal memverifikasi penghapusan: ${postDeleteError.message}`);

        const fileStillExists = postDeleteFiles?.some((file) => file.name === fileName);
        if (fileStillExists) {
          throw new Error("File lama gagal dihapus dari storage.");
        }

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) throw new Error(`Gagal mengunggah foto: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        if (!publicUrlData.publicUrl) throw new Error("Gagal mendapatkan URL foto profil.");

        avatarUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: formData.name.trim(),
          nip: formData.nip.trim(),
          position: formData.position.trim(),
          nik: formData.nik.trim(),
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw new Error(`Gagal memperbarui profil: ${updateError.message}`);

      setProfile({
        ...profile,
        name: formData.name.trim(),
        nip: formData.nip.trim(),
        position: formData.position.trim(),
        nik: formData.nik.trim(),
        avatar_url: avatarUrl,
      });

      toast.success("Profil berhasil diperbarui!");
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [user, profile, formData, avatarFile, router]);

  if (isFetchingProfile || !user || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <ProfileHeader />
        <ProfileAvatar
          avatarPreview={avatarPreview}
          avatarUrl={profile.avatar_url}
          isEditing={isEditing}
          onAvatarChange={handleAvatarChange}
        />
        <ProfileForm
          isEditing={isEditing}
          formData={formData}
          setFormData={setFormData}
          profile={profile}
        />
        <ProfileActions
          isEditing={isEditing}
          loading={loading}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}