"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import VyuLogo from "@/assets/images/vyu-logo.svg";

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

        <div className="flex justify-center mb-6">
          <div className="relative">
            {avatarPreview || profile.avatar_url ? (
              <Image
                src={avatarPreview || (profile.avatar_url as string)}
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
                  onChange={handleAvatarChange}
                />
                <span>📷</span>
              </label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NIP</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.nip || "-"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jabatan</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.position || "-"}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-6 py-2 rounded-md text-white ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
