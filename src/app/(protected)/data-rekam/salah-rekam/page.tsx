"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import SalahRekamHeader from "@/components/salah-rekam/SalahRekamHeader";
import SalahRekamActions from "@/components/salah-rekam/SalahRekamActions";
import SalahRekamForm from "@/components/salah-rekam/SalahRekamForm";
import SalahRekamTable from "@/components/salah-rekam/SalahRekamTable";

interface SalahRekamData {
  id: string;
  nik_salah_rekam: string;
  nama_salah_rekam: string;
  nik_pemilik_biometric: string;
  nama_pemilik_biometric: string;
  nik_pemilik_foto: string;
  nama_pemilik_foto: string;
  nik_petugas_rekam: string;
  nama_petugas_rekam: string;
  nik_pengaju: string;
  nama_pengaju: string;
  tanggal_perekaman: string;
  created_at: string;
  is_ready_to_record: boolean;
}

export default function SalahRekamPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // Tambah state untuk role
  const [showForm, setShowForm] = useState(false);
  const [showRekap, setShowRekap] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<SalahRekamData | null>(null);
  const [formData, setFormData] = useState({
    nik_salah_rekam: "",
    nama_salah_rekam: "",
    nik_pemilik_biometric: "",
    nama_pemilik_biometric: "",
    nik_pemilik_foto: "",
    nama_pemilik_foto: "",
    nik_petugas_rekam: "",
    nama_petugas_rekam: "",
    nik_pengaju: "",
    nama_pengaju: "",
    tanggal_perekaman: "",
  });
  const [rekapData, setRekapData] = useState<SalahRekamData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.error("Session error:", sessionError);
          toast.error("Sesi tidak ditemukan. Silakan login kembali.");
          router.push("/");
          return;
        }

        console.log("Authenticated user ID:", session.user.id);
        setUser(session.user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, nik, role") // Ambil role
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          throw new Error(`Gagal mengambil profil: ${profileError.message}`);
        }

        if (!profileData.nik || !validateNIK(profileData.nik)) {
          toast.error("NIK Anda di profil tidak valid. Harap perbarui profil Anda terlebih dahulu.");
          router.push("/profile");
          return;
        }

        setUserRole(profileData.role || "user"); // Simpan role pengguna
        setFormData((prev) => ({
          ...prev,
          nik_pengaju: profileData.nik || "",
          nama_pengaju: profileData.name || "",
        }));
      } catch (error: any) {
        console.error("Error fetching user:", error);
        toast.error(error.message || "Gagal memuat data pengguna. Silakan coba lagi.");
        router.push("/");
      }
    };

    fetchUserData();
  }, [router]);

  const validateNIK = (nik: string) => {
    return nik.length === 16 && /^\d{16}$/.test(nik);
  };

  const fetchRekapData = async () => {
    if (!user) {
      console.error("No user found for fetching rekap data");
      toast.error("Pengguna tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      console.log("Fetching rekap data for user_id:", user.id);
      const { data, error } = await supabase
        .from("salah_rekam")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch rekap error:", error);
        throw new Error(`Gagal mengambil data rekap: ${error.message}`);
      }

      console.log("Fetched rekap data:", data);
      const updatedData = data.map(item => ({
        ...item,
        created_at: item.created_at || new Date().toISOString(),
      }));
      setRekapData(updatedData || []);
    } catch (error: any) {
      console.error("Error fetching rekap data:", error);
      toast.error(error.message || "Gagal mengambil data rekap. Silakan coba lagi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("No user logged in");
      toast.error("Pengguna tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (!validateNIK(formData.nik_salah_rekam)) {
      toast.error("NIK Salah Rekam harus 16 angka!");
      return;
    }
    if (!formData.nama_salah_rekam.trim()) {
      toast.error("Nama Salah Rekam tidak boleh kosong!");
      return;
    }
    if (!validateNIK(formData.nik_pemilik_biometric)) {
      toast.error("NIK Pemilik Biometric harus 16 angka!");
      return;
    }
    if (!formData.nama_pemilik_biometric.trim()) {
      toast.error("Nama Pemilik Biometric tidak boleh kosong!");
      return;
    }
    if (!validateNIK(formData.nik_pemilik_foto)) {
      toast.error("NIK Pemilik Foto harus 16 angka!");
      return;
    }
    if (!formData.nama_pemilik_foto.trim()) {
      toast.error("Nama Pemilik Foto tidak boleh kosong!");
      return;
    }
    if (!validateNIK(formData.nik_petugas_rekam)) {
      toast.error("NIK Petugas Rekam harus 16 angka!");
      return;
    }
    if (!formData.nama_petugas_rekam.trim()) {
      toast.error("Nama Petugas Rekam tidak boleh kosong!");
      return;
    }
    if (!validateNIK(formData.nik_pengaju)) {
      toast.error("NIK Pengaju harus 16 angka!");
      return;
    }
    if (!formData.nama_pengaju.trim()) {
      toast.error("Nama Pengaju tidak boleh kosong!");
      return;
    }
    if (!formData.tanggal_perekaman) {
      toast.error("Tanggal Perekaman tidak boleh kosong!");
      return;
    }

    setLoading(true);

    try {
      if (isEditing && editData) {
        console.log("Updating data with ID:", editData.id, "for user_id:", user.id, "with data:", formData);

        const { data: existingData, error: fetchError } = await supabase
          .from("salah_rekam")
          .select("id, user_id")
          .eq("id", editData.id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error checking data existence:", fetchError);
          throw new Error(`Gagal memeriksa data: ${fetchError.message}`);
        }

        if (!existingData) {
          console.error("Data not found for ID:", editData.id, "and user_id:", user.id);
          throw new Error("Data tidak ditemukan atau Anda tidak memiliki akses.");
        }

        const { data, error } = await supabase
          .from("salah_rekam")
          .update({
            nik_salah_rekam: formData.nik_salah_rekam,
            nama_salah_rekam: formData.nama_salah_rekam.trim(),
            nik_pemilik_biometric: formData.nik_pemilik_biometric,
            nama_pemilik_biometric: formData.nama_pemilik_biometric.trim(),
            nik_pemilik_foto: formData.nik_pemilik_foto,
            nama_pemilik_foto: formData.nama_pemilik_foto.trim(),
            nik_petugas_rekam: formData.nik_petugas_rekam,
            nama_petugas_rekam: formData.nama_petugas_rekam.trim(),
            nik_pengaju: formData.nik_pengaju,
            nama_pengaju: formData.nama_pengaju.trim(),
            tanggal_perekaman: formData.tanggal_perekaman,
          })
          .eq("id", editData.id)
          .eq("user_id", user.id)
          .select()
          .maybeSingle();

        if (error) {
          console.error("Update error:", error);
          throw new Error(`Gagal mengedit data: ${error.message}`);
        }

        if (!data) {
          console.error("No rows updated for ID:", editData.id);
          throw new Error("Data tidak ditemukan atau tidak dapat diedit.");
        }

        toast.success("Data berhasil diedit!");
      } else {
        console.log("Inserting new data:", formData);
        const { data, error } = await supabase.from("salah_rekam").insert({
          user_id: user.id,
          nik_salah_rekam: formData.nik_salah_rekam,
          nama_salah_rekam: formData.nama_salah_rekam.trim(),
          nik_pemilik_biometric: formData.nik_pemilik_biometric,
          nama_pemilik_biometric: formData.nama_pemilik_biometric.trim(),
          nik_pemilik_foto: formData.nik_pemilik_foto,
          nama_pemilik_foto: formData.nama_pemilik_foto.trim(),
          nik_petugas_rekam: formData.nik_petugas_rekam,
          nama_petugas_rekam: formData.nama_petugas_rekam.trim(),
          nik_pengaju: formData.nik_pengaju,
          nama_pengaju: formData.nama_pengaju.trim(),
          tanggal_perekaman: formData.tanggal_perekaman,
          is_ready_to_record: false, // Set default saat insert
        }).select().single();

        if (error) {
          console.error("Insert error:", error);
          throw new Error(`Gagal mengajukan data: ${error.message}`);
        }

        toast.success("Data berhasil diajukan!");
      }

      setShowForm(false);
      setIsEditing(false);
      setEditData(null);
      setFormData({
        nik_salah_rekam: "",
        nama_salah_rekam: "",
        nik_pemilik_biometric: "",
        nama_pemilik_biometric: "",
        nik_pemilik_foto: "",
        nama_pemilik_foto: "",
        nik_petugas_rekam: "",
        nama_petugas_rekam: "",
        nik_pengaju: formData.nik_pengaju,
        nama_pengaju: formData.nama_pengaju,
        tanggal_perekaman: "",
      });

      if (showRekap) {
        await fetchRekapData();
      }
    } catch (error: any) {
      console.error("Error submitting data:", error);
      toast.error(error.message || "Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (data: SalahRekamData) => {
    console.log("handleEdit called with data:", data);
    setIsEditing(true);
    setEditData(data);
    setFormData({
      nik_salah_rekam: data.nik_salah_rekam,
      nama_salah_rekam: data.nama_salah_rekam,
      nik_pemilik_biometric: data.nik_pemilik_biometric,
      nama_pemilik_biometric: data.nama_pemilik_biometric,
      nik_pemilik_foto: data.nik_pemilik_foto,
      nama_pemilik_foto: data.nama_pemilik_foto,
      nik_petugas_rekam: data.nik_petugas_rekam,
      nama_petugas_rekam: data.nama_petugas_rekam,
      nik_pengaju: data.nik_pengaju,
      nama_pengaju: data.nama_pengaju,
      tanggal_perekaman: data.tanggal_perekaman,
    });
    setShowForm(true);
    setShowRekap(false);
  };

  const handleDelete = async (id: string) => {
    console.log("handleDelete called with id:", id, "and user_id:", user?.id);
    if (!id) {
      console.error("Invalid ID provided for deletion");
      toast.error("ID tidak valid. Silakan coba lagi.");
      return;
    }

    if (!user) {
      console.error("No user logged in");
      toast.error("Pengguna tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menghapus pengajuan ini?")) return;

    try {
      const { data: existingData, error: fetchError } = await supabase
        .from("salah_rekam")
        .select("id, user_id")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking data existence:", fetchError);
        throw new Error(`Gagal memeriksa data: ${fetchError.message}`);
      }

      if (!existingData) {
        console.error("Data not found for ID:", id, "and user_id:", user.id);
        throw new Error("Data tidak ditemukan atau Anda tidak memiliki akses.");
      }

      const { data, error } = await supabase
        .from("salah_rekam")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Delete error:", error);
        throw new Error(`Gagal menghapus data: ${error.message}`);
      }

      if (!data) {
        console.error("No rows deleted for ID:", id);
        throw new Error("Data tidak ditemukan atau tidak dapat dihapus.");
      }

      toast.success("Pengajuan berhasil dihapus!");
      await fetchRekapData();
    } catch (error: any) {
      console.error("Error deleting data:", error);
      toast.error(error.message || "Gagal menghapus data. Silakan coba lagi.");
    }
  };

  const handleRekapitulasi = async () => {
    setShowRekap(true);
    setShowForm(false);
    await fetchRekapData();
  };

  if (!user || userRole === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  const outerDivClasses = "min-h-screen bg-gray-100 py-10";
  const innerDivClasses = "max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg";

  console.log("Passing handleEdit to SalahRekamTable:", handleEdit);
  console.log("Passing handleDelete to SalahRekamTable:", handleDelete);

  return (
    <div className={outerDivClasses}>
      <div className={innerDivClasses}>
        <SalahRekamHeader />
        <SalahRekamActions
          onAjukan={() => {
            setShowForm(true);
            setShowRekap(false);
            setIsEditing(false);
            setEditData(null);
            setFormData({
              nik_salah_rekam: "",
              nama_salah_rekam: "",
              nik_pemilik_biometric: "",
              nama_pemilik_biometric: "",
              nik_pemilik_foto: "",
              nama_pemilik_foto: "",
              nik_petugas_rekam: "",
              nama_petugas_rekam: "",
              nik_pengaju: formData.nik_pengaju,
              nama_pengaju: formData.nama_pengaju,
              tanggal_perekaman: "",
            });
          }}
          onRekapitulasi={handleRekapitulasi}
        />
        {showForm && (
          <SalahRekamForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            isEditing={isEditing}
          />
        )}
        {showRekap && (
          <SalahRekamTable
            rekapData={rekapData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            userRole={userRole} // Teruskan role ke SalahRekamTable
          />
        )}
      </div>
    </div>
  );
}