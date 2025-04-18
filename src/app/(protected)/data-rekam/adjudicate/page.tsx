"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import AdjudicateRecordHeader from "@/components/adjudicate-record/AdjudicateRecordHeader";
import AdjudicateRecordActions from "@/components/adjudicate-record/AdjudicateRecordActions";
import AdjudicateRecordForm from "@/components/adjudicate-record/AdjudicateRecordForm";
import AdjudicateRecordTable from "@/components/adjudicate-record/AdjudicateRecordTable";
import { motion, AnimatePresence } from "framer-motion";

enum ActiveMode {
  Form = "form",
  Table = "table",
  None = "none",
}

interface FormData {
  nik_adjudicate: string;
  nama_adjudicate: string;
  nik_pengaju: string;
  nama_pengaju: string;
  jenis_eksepsi: string;
  tanggal_pengajuan: string;
}

interface AdjudicateRecordData {
  id: string;
  user_id: string;
  nik_adjudicate: string;
  nama_adjudicate: string;
  nik_pengaju: string;
  nama_pengaju: string;
  jenis_eksepsi: string;
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

export default function AdjudicateRecordPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nik_adjudicate: "",
    nama_adjudicate: "",
    nik_pengaju: "",
    nama_pengaju: "",
    jenis_eksepsi: "",
    tanggal_pengajuan: new Date().toISOString().split("T")[0],
  });
  const [rekapData, setRekapData] = useState<AdjudicateRecordData[]>([]);
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
        if (process.env.NODE_ENV === "development") {
          console.log("User ID:", session.user.id);
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, nik, position, role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw new Error(`Gagal mengambil profil: ${profileError.message}`);

        if (!profileData.nik || !/^\d{16}$/.test(profileData.nik)) {
          toast.error("NIK Anda di profil tidak valid. Harap perbarui profil Anda terlebih dahulu.");
          router.push("/profile");
          return;
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
          .from("adjudicate_record")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(start, end);

        if (userRole === "user") {
          query = query.eq("user_id", user.id);
        }

        if (searchQuery) {
          query = query.or(
            `nik_adjudicate.ilike.%${searchQuery}%,nama_adjudicate.ilike.%${searchQuery}%`
          );
        }

        const { data, error, count } = await query;
        if (error) throw new Error(`Gagal mengambil data rekap: ${error.message}`);

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
    if (!user || !profile) {
      toast.error("Data pengguna tidak ditemukan. Silakan coba lagi.");
      return;
    }

    setLoading(true);

    try {
      const requiredFields = ["nik_adjudicate", "nama_adjudicate", "jenis_eksepsi"];
      for (const field of requiredFields) {
        if (!formData[field as keyof FormData].trim()) {
          throw new Error("Semua kolom wajib diisi!");
        }
      }

      if (!/^\d{16}$/.test(formData.nik_adjudicate)) {
        throw new Error("NIK Adjudicate harus 16 digit!");
      }

      if (!["eksepsi sidik jari", "eksepsi iris mata", "eksepsi total"].includes(formData.jenis_eksepsi)) {
        throw new Error("Jenis Eksepsi tidak valid!");
      }

      const dataToSave = {
        user_id: user.id,
        nik_adjudicate: formData.nik_adjudicate.trim(),
        nama_adjudicate: formData.nama_adjudicate.trim(),
        nik_pengaju: formData.nik_pengaju,
        nama_pengaju: formData.nama_pengaju,
        jenis_eksepsi: formData.jenis_eksepsi,
        tanggal_pengajuan: formData.tanggal_pengajuan,
      };

      if (isEditing && editId) {
        const { data: existingData, error: fetchError } = await supabase
          .from("adjudicate_record")
          .select("id, user_id")
          .eq("id", editId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (fetchError) throw new Error(`Gagal memeriksa data: ${fetchError.message}`);
        if (!existingData) throw new Error("Data tidak ditemukan atau Anda tidak memiliki akses.");

        const { error } = await supabase
          .from("adjudicate_record")
          .update(dataToSave)
          .eq("id", editId)
          .eq("user_id", user.id);

        if (error) throw new Error(`Gagal memperbarui data: ${error.message}`);
        toast.success("Data berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("adjudicate_record").insert(dataToSave);
        if (error) throw new Error(`Gagal menyimpan data: ${error.message}`);
        toast.success("Data berhasil diajukan!");
      }

      setShowForm(false);
      setIsEditing(false);
      setEditId(null);
      setFormData({
        nik_adjudicate: "",
        nama_adjudicate: "",
        nik_pengaju: profile?.nik ?? "",
        nama_pengaju: profile?.name ?? "",
        jenis_eksepsi: "",
        tanggal_pengajuan: new Date().toISOString().split("T")[0],
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
      nik_adjudicate: "",
      nama_adjudicate: "",
      nik_pengaju: profile?.nik ?? "",
      nama_pengaju: profile?.name ?? "",
      jenis_eksepsi: "",
      tanggal_pengajuan: new Date().toISOString().split("T")[0],
    });
  };

  const handleEdit = (data: AdjudicateRecordData) => {
    setFormData({
      nik_adjudicate: data.nik_adjudicate,
      nama_adjudicate: data.nama_adjudicate,
      nik_pengaju: data.nik_pengaju,
      nama_pengaju: data.nama_pengaju,
      jenis_eksepsi: data.jenis_eksepsi,
      tanggal_pengajuan: data.tanggal_pengajuan,
    });
    setEditId(data.id);
    setIsEditing(true);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      toast.error("Pengguna tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menghapus pengajuan ini?")) return;

    try {
      const { data: existingData, error: fetchError } = await supabase
        .from("adjudicate_record")
        .select("id, user_id")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) throw new Error(`Gagal memeriksa data: ${fetchError.message}`);
      if (!existingData) throw new Error("Data tidak ditemukan atau Anda tidak memiliki akses.");

      const { error } = await supabase
        .from("adjudicate_record")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw new Error(`Gagal menghapus data: ${error.message}`);
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
        <AdjudicateRecordHeader />
        <AdjudicateRecordActions
          onAjukan={() => {
            setShowForm(true);
            setShowTable(false);
            setIsEditing(false);
            setEditId(null);
            setFormData({
              nik_adjudicate: "",
              nama_adjudicate: "",
              nik_pengaju: profile?.nik ?? "",
              nama_pengaju: profile?.name ?? "",
              jenis_eksepsi: "",
              tanggal_pengajuan: new Date().toISOString().split("T")[0],
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
              <AdjudicateRecordForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
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
              <AdjudicateRecordTable
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