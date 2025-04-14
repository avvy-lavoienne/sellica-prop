"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileActions from "@/components/profile/ProfileActions";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{
    name: string;
    nip: string;
    position: string;
    avatar_url: string | null;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    position: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          toast.error("Sesi tidak ditemukan. Silakan login kembali.");
          router.push("/");
          return;
        }

        setUser(session.user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, nip, position, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          if (profileError.code === "PGRST116") {
            const newProfile = {
              id: session.user.id,
              name: session.user.email?.split("@")[0] || "User",
              nip: "",
              position: "",
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
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast.error(error.message || "Gagal memuat profil. Silakan coba lagi.");
        router.push("/");
      }
    };

    fetchUserData();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.name || "",
      nip: profile?.nip || "",
      position: profile?.position || "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSave = async () => {
    if (!user || !profile) {
      toast.error("Data pengguna tidak ditemukan. Silakan coba lagi.");
      return;
    }

    if (!formData.name.trim() || !formData.position.trim()) {
      toast.error("Nama dan Jabatan tidak boleh kosong!");
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
        console.log("Generated fileName:", fileName);

        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (avatarFile.size > maxSizeInBytes) {
          throw new Error(`Ukuran file terlalu besar, maksimal ${maxSizeInMB} MB`);
        }

        // Cek status autentikasi sebelum operasi storage
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error("Sesi autentikasi tidak valid. Silakan login kembali.");
        }

        // Cek dan hapus avatar lama berdasarkan user.id
        const { data: existingFiles, error: listError } = await supabase.storage
          .from("avatars")
          .list("", { limit: 100 });

        if (listError) throw new Error(`Gagal memeriksa file avatar lama: ${listError.message}`);
        console.log("Existing files before deletion:", existingFiles);

        const filesToDelete = existingFiles
          ?.filter((file) => file.name.startsWith(user.id + "."))
          .map((file) => file.name) || [];

        if (filesToDelete.length > 0) {
          const { data: deleteData, error: deleteError } = await supabase.storage
            .from("avatars")
            .remove(filesToDelete);

          if (deleteError) {
            console.error("Delete error details:", deleteError);
            throw new Error(`Gagal menghapus avatar lama: ${deleteError.message}`);
          }
          console.log("Files deleted:", deleteData);
        } else {
          console.log("No existing files found to delete for user:", user.id);
        }

        // Verifikasi bahwa file lama sudah terhapus
        const { data: postDeleteFiles, error: postDeleteError } = await supabase.storage
          .from("avatars")
          .list("", { limit: 100 });

        if (postDeleteError) throw new Error(`Gagal memverifikasi penghapusan: ${postDeleteError.message}`);
        console.log("Files after deletion:", postDeleteFiles);

        const fileStillExists = postDeleteFiles?.some((file) => file.name === fileName);
        if (fileStillExists) {
          throw new Error("File lama gagal dihapus dari storage.");
        }

        // Unggah avatar baru
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          throw new Error(`Gagal mengunggah foto: ${uploadError.message}`);
        }
        console.log("Upload successful:", uploadData);

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        if (!publicUrlData.publicUrl) throw new Error("Gagal mendapatkan URL foto profil.");

        // Tambahkan query string unik untuk mencegah caching
        avatarUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
        console.log("New avatar URL:", avatarUrl);

        // Verifikasi bahwa file baru benar-benar ada
        const { data: verifyFiles, error: verifyError } = await supabase.storage
          .from("avatars")
          .list("", { limit: 100 });

        if (verifyError) throw new Error(`Gagal memverifikasi file: ${verifyError.message}`);

        const uploadedFileExists = verifyFiles?.some((file) => file.name === fileName);
        if (!uploadedFileExists) {
          throw new Error("File baru gagal diunggah ke storage.");
        }
        console.log("Verified files in storage:", verifyFiles);

        // Verifikasi bahwa URL baru dapat diakses
        try {
          const response = await fetch(avatarUrl);
          if (!response.ok) throw new Error("URL avatar baru tidak dapat diakses.");
          console.log("Avatar URL verification successful:", avatarUrl);
        } catch (fetchError) {
          console.error("Fetch error details:", fetchError);
          throw new Error("Gagal memverifikasi URL avatar baru.");
        }
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: formData.name.trim(),
          nip: formData.nip.trim(),
          position: formData.position.trim(),
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
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
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