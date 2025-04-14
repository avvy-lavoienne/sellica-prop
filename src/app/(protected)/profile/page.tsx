"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

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

  // Ambil data pengguna dan profil saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Cek sesi pengguna
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          toast.error("Sesi tidak ditemukan. Silakan login kembali.");
          router.push("/");
          return;
        }

        setUser(session.user);

        // Ambil data profil dari tabel profiles
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, nip, position, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          if (profileError.code === "PGRST116") {
            // Profil belum ada, buat profil baru dengan data default
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: session.user.id,
                name: session.user.email?.split("@")[0] || "User",
                nip: "",
                position: "",
                avatar_url: null,
              });

            if (insertError) throw insertError;

            // Ambil ulang data profil
            const { data: newProfileData } = await supabase
              .from("profiles")
              .select("name, nip, position, avatar_url")
              .eq("id", session.user.id)
              .single();

            setProfile(newProfileData);
            setFormData({
              name: newProfileData.name,
              nip: newProfileData.nip,
              position: newProfileData.position,
            });
          } else {
            throw profileError;
          }
        } else {
          setProfile(profileData);
          setFormData({
            name: profileData.name,
            nip: profileData.nip,
            position: profileData.position,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Gagal memuat profil. Silakan coba lagi.");
        router.push("/");
      }
    };

    fetchUserData();
  }, [router]);

  // Handler untuk upload foto profil
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handler untuk menyimpan perubahan
  const handleSave = async () => {
    if (!user || !profile) return;

    setLoading(true);

    try {
      let avatarUrl = profile.avatar_url;

      // Jika ada file avatar baru, upload ke Supabase Storage
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        // Dapatkan URL publik untuk file yang diunggah
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = publicUrlData.publicUrl;
      }

      // Update data profil di tabel profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          nip: formData.nip,
          position: formData.position,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Update state profil
      setProfile({
        ...profile,
        name: formData.name,
        nip: formData.nip,
        position: formData.position,
        avatar_url: avatarUrl,
      });

      toast.success("Profil berhasil diperbarui!");
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Gagal menyimpan perubahan. Silakan coba lagi.");
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
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Profil Pengguna
        </h1>

        {/* Foto Profil */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src={
                avatarPreview ||
                profile.avatar_url ||
                "/images/default-avatar.png"
              }
              alt="Foto Profil"
              width={120}
              height={120}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <span>📷</span>
              </label>
            )}
          </div>
        </div>

        {/* Data Pengguna */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              NIP
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nip}
                onChange={(e) =>
                  setFormData({ ...formData, nip: e.target.value })
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.nip || "-"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jabatan
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            ) : (
              <p className="mt-1 text-gray-900">{profile.position || "-"}</p>
            )}
          </div>
        </div>

        {/* Tombol Edit/Save */}
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
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: profile.name,
                    nip: profile.nip,
                    position: profile.position,
                  });
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }}
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