"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { format } from "date-fns";
import PengajuanBulananHeader from "@/components/pengajuan-bulanan/PengajuanBulananHeader";
import PengajuanBulananActions from "@/components/pengajuan-bulanan/PengajuanBulananActions";
import PengajuanBulananForm from "@/components/pengajuan-bulanan/PengajuanBulananForm";
import PengajuanBulananTable from "@/components/pengajuan-bulanan/PengajuanBulananTable";
import { motion, AnimatePresence } from "framer-motion";

enum ActiveMode {
  Form = "form",
  Table = "table",
  None = "none",
}

interface FormData {
  nik_pengajuan_hapus: string;
  nama_pengajuan: string;
  alasan_pengajuan: string;
  alasan_lainnya: string;
  nik_pengaju: string;
  nama_pengaju: string;
  tanggal_pengajuan: string;
  estimasi_tanggal_perekaman?: string;
}

interface HapusDataRekamData {
  id: string;
  user_id: string;
  nik_pengajuan_hapus: string;
  nama_pengajuan: string;
  alasan_pengajuan: string;
  alasan_lainnya?: string;
  nik_pengaju: string;
  nama_pengaju: string;
  tanggal_pengajuan: string;
  estimasi_tanggal_perekaman?: string;
  created_at: string;
  is_ready_to_record: boolean;
}

interface User {
  id: string;
  email?: string;
}

interface Profile {
  name: string;
  nik: string;
  position: string;
  role: string;
}

export default function PengajuanBulananPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nik_pengajuan_hapus: "",
    nama_pengajuan: "",
    alasan_pengajuan: "",
    alasan_lainnya: "",
    nik_pengaju: "",
    nama_pengaju: "",
    tanggal_pengajuan: format(new Date(), "yyyy-MM-dd"),
    estimasi_tanggal_perekaman: "",
  });
  const [rekapData, setRekapData] = useState<HapusDataRekamData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>("user");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error("Sesi tidak ditemukan. Silakan login kembali.");
        }

        setUser(session.user);
        if (process.env.NODE_ENV === "development") {
          console.log("User ID:", session.user.id);
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, nik, position, role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw new Error(`Gagal mengambil profil: ${profileError.message || "Unknown error"}`);

        if (!profileData.nik || !/^\d{16}$/.test(profileData.nik)) {
          throw new Error("NIK Anda di profil tidak valid. Harap perbarui profil Anda terlebih dahulu.");
        }

        setProfile(profileData);
        setFormData((prev) => ({
          ...prev,
          nik_pengaju: profileData.nik,
          nama_pengaju: profileData.name,
        }));
        setUserRole(profileData.role || "user");
        if (process.env.NODE_ENV === "development") {
          console.log("Profile:", profileData);
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error(error.message || "Gagal memuat data pengguna. Silakan coba lagi.");
        router.push("/");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const fetchRekapData = useCallback(
    async (page: number = 1, searchQuery: string = "") => {
      if (!user) {
        toast.error("Pengguna tidak ditemukan. Silakan login kembali.");
        return { totalCount: 0 };
      }

      try {
        setIsTableLoading(true);
        const rowsPerPage = 5;
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage - 1;

        let query = supabase
          .from("pengajuan_bulanan")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(start, end);

        if (userRole !== "admin" && userRole !== "superuser") {
          query = query.eq("user_id", user.id);
        }

        if (searchQuery) {
          const sanitizedQuery = searchQuery.replace(/[%\\]/g, "");
          query = query.or(
            `nik_pengajuan_hapus.ilike.%${sanitizedQuery}%,nama_pengajuan.ilike.%${sanitizedQuery}%`
          );
        }

        const { data, error, count } = await query;
        if (error) throw new Error(`Gagal mengambil data rekap: ${error.message || "Unknown error"}`);

        setRekapData(data || []);
        return { totalCount: count || 0 };
      } catch (error: any) {
        console.error("Error fetching rekap data:", error);
        toast.error(error.message || "Gagal memuat data rekap. Silakan coba lagi.");
        return { totalCount: 0 };
      } finally {
        setIsTableLoading(false);
      }
    },
    [user, userRole]
  );

  useEffect(() => {
    if (showTable) {
      fetchRekapData(currentPage, searchQuery).then(({ totalCount }) =>
        setTotalCount(totalCount)
      );
    }
  }, [currentPage, showTable, searchQuery, fetchRekapData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requiredFields = ["nik_pengajuan_hapus", "nama_pengajuan", "alasan_pengajuan"];
      for (const field of requiredFields) {
        if (!formData[field as keyof FormData].trim()) {
          throw new Error("Semua kolom wajib diisi!");
        }
      }

      if (!/^\d{16}$/.test(formData.nik_pengajuan_hapus)) {
        throw new Error("NIK Pengajuan Hapus harus 16 digit!");
      }

      const validAlasan = [
        "MISSING BIOMETRIC EXCEPTION",
        "NIK TANPA BIOMETRIC FINGERS",
        "DUPLICATE DENGAN ORANG LAIN",
        "DUPLICATE DENGAN NIK TANPA DATA REKAM",
        "ONE TO MANY",
        "LAINNYA",
      ];
      if (!validAlasan.includes(formData.alasan_pengajuan)) {
        throw new Error("Alasan pengajuan tidak valid!");
      }

      if (formData.alasan_pengajuan === "LAINNYA" && !formData.alasan_lainnya.trim()) {
        throw new Error("Alasan lainnya wajib diisi jika memilih LAINNYA!");
      }

      const dataToSave = {
        user_id: user!.id,
        nik_pengajuan_hapus: formData.nik_pengajuan_hapus.trim(),
        nama_pengajuan: formData.nama_pengajuan.trim(),
        alasan_pengajuan: formData.alasan_pengajuan,
        alasan_lainnya: formData.alasan_pengajuan === "LAINNYA" ? formData.alasan_lainnya.trim() : null,
        nik_pengaju: formData.nik_pengaju,
        nama_pengaju: formData.nama_pengaju,
        tanggal_pengajuan: formData.tanggal_pengajuan,
        estimasi_tanggal_perekaman: formData.estimasi_tanggal_perekaman || null,
      };

      if (isEditing && editId) {
        const { data: existingData, error: fetchError } = await supabase
          .from("pengajuan_bulanan")
          .select("id, user_id")
          .eq("id", editId)
          .eq("user_id", user!.id)
          .maybeSingle();

        if (fetchError) throw new Error(`Gagal memeriksa data: ${fetchError.message || "Unknown error"}`);
        if (!existingData) throw new Error("Data tidak ditemukan atau Anda tidak memiliki akses.");

        const { error } = await supabase
          .from("pengajuan_bulanan")
          .update(dataToSave)
          .eq("id", editId)
          .eq("user_id", user!.id);

        if (error) throw new Error(`Gagal memperbarui data: ${error.message || "Unknown error"}`);
        toast.success("Data berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("pengajuan_bulanan").insert(dataToSave);
        if (error) throw new Error(`Gagal menyimpan data: ${error.message || "Unknown error"}`);
        toast.success("Data berhasil diajukan!");
      }

      setShowForm(false);
      setIsEditing(false);
      setEditId(null);
      setFormData({
        nik_pengajuan_hapus: "",
        nama_pengajuan: "",
        alasan_pengajuan: "",
        alasan_lainnya: "",
        nik_pengaju: profile!.nik,
        nama_pengaju: profile!.name,
        tanggal_pengajuan: format(new Date(), "yyyy-MM-dd"),
        estimasi_tanggal_perekaman: "",
      });

      if (showTable) {
        const { totalCount } = await fetchRekapData(currentPage, searchQuery);
        setTotalCount(totalCount);
      }
    } catch (error: any) {
      console.error("Error saving data:", error);
      toast.error(error.message || "Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({
      nik_pengajuan_hapus: "",
      nama_pengajuan: "",
      alasan_pengajuan: "",
      alasan_lainnya: "",
      nik_pengaju: profile?.nik ?? "",
      nama_pengaju: profile?.name ?? "",
      tanggal_pengajuan: format(new Date(), "yyyy-MM-dd"),
      estimasi_tanggal_perekaman: "",
    });
  };

  const handleEdit = (data: HapusDataRekamData) => {
    setFormData({
      nik_pengajuan_hapus: data.nik_pengajuan_hapus,
      nama_pengajuan: data.nama_pengajuan,
      alasan_pengajuan: data.alasan_pengajuan,
      alasan_lainnya: data.alasan_lainnya || "",
      nik_pengaju: data.nik_pengaju,
      nama_pengaju: data.nama_pengaju,
      tanggal_pengajuan: data.tanggal_pengajuan,
      estimasi_tanggal_perekaman: data.estimasi_tanggal_perekaman || "",
    });
    setEditId(data.id);
    setIsEditing(true);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengajuan ini?")) return;

    try {
      const { data: existingData, error: fetchError } = await supabase
        .from("pengajuan_bulanan")
        .select("id, user_id")
        .eq("id", id)
        .eq("user_id", user!.id)
        .maybeSingle();

      if (fetchError) throw new Error(`Gagal memeriksa data: ${fetchError.message || "Unknown error"}`);
      if (!existingData) throw new Error("Data tidak ditemukan atau Anda tidak memiliki akses.");

      const { error } = await supabase
        .from("pengajuan_bulanan")
        .delete()
        .eq("id", id)
        .eq("user_id", user!.id);

      if (error) throw new Error(`Gagal menghapus data: ${error.message || "Unknown error"}`);
      toast.success("Data berhasil dihapus!");
      const { totalCount } = await fetchRekapData(currentPage, searchQuery);
      setTotalCount(totalCount);
    } catch (error: any) {
      console.error("Error deleting data:", error);
      toast.error(error.message || "Gagal menghapus data. Silakan coba lagi.");
    }
  };

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      const { totalCount } = await fetchRekapData(1, query);
      setTotalCount(totalCount);
    },
    [fetchRekapData]
  );

  const handleRefresh = useCallback(
    async () => {
      setCurrentPage(1);
      setSearchQuery("");
      const { totalCount } = await fetchRekapData(1, "");
      setTotalCount(totalCount);
    },
    [fetchRekapData]
  );

  if (isInitialLoading) {
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

  if (!user || !profile) {
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
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <PengajuanBulananHeader />
        <PengajuanBulananActions
          onAjukan={() => {
            setShowForm(true);
            setShowTable(false);
            setIsEditing(false);
            setEditId(null);
            setFormData({
              nik_pengajuan_hapus: "",
              nama_pengajuan: "",
              alasan_pengajuan: "",
              alasan_lainnya: "",
              nik_pengaju: profile.nik,
              nama_pengaju: profile.name,
              tanggal_pengajuan: format(new Date(), "yyyy-MM-dd"),
              estimasi_tanggal_perekaman: "",
            });
          }}
          onRekapitulasi={async () => {
            setShowTable(true);
            setShowForm(false);
            const { totalCount } = await fetchRekapData(currentPage, searchQuery);
            setTotalCount(totalCount);
          }}
          activeMode={showForm ? ActiveMode.Form : showTable ? ActiveMode.Table : ActiveMode.None}
        />
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PengajuanBulananForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
                userRole={userRole}
              />
            </motion.div>
          )}
          {showTable && (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PengajuanBulananTable
                rekapData={rekapData}
                totalCount={totalCount}
                currentPage={currentPage}
                onPageChange={async (page: number) => {
                  setCurrentPage(page);
                  const { totalCount } = await fetchRekapData(page, searchQuery);
                  setTotalCount(totalCount);
                }}
                onSearch={handleSearch}
                onRefresh={handleRefresh}
                onEdit={handleEdit}
                onDelete={handleDelete}
                userRole={userRole}
                isTableLoading={isTableLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}