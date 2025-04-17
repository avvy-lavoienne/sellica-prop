// "use client";

// import { supabase } from "@/lib/supabaseClient";
// import { useState, useEffect, useCallback } from "react";
// import { toast } from "react-toastify";
// import { AnimatePresence, motion } from "framer-motion";
// import PengajuanBulananHeader from "@/components/pengajuan-bulanan/PengajuanBulananHeader";
// import PengajuanBulananActions from "@/components/pengajuan-bulanan/PengajuanBulananActions";
// import PengajuanBulananForm from "@/components/pengajuan-bulanan/PengajuanBulananForm";
// import PengajuanBulananTable from "@/components/pengajuan-bulanan/PengajuanBulananTable";

// enum ActiveMode {
//   None = "none",
//   Form = "form",
//   Table = "table",
// }

// interface PengajuanBulananData {
//   id: string;
//   user_id: string;
//   nik_pengajuan: string;
//   nama_pengajuan: string;
//   alasan_pengajuan: string;
//   tanggal_pengajuan: string;
//   estimasi_tanggal_rekam_ulang: string | null;
//   is_ready_to_record: boolean;
//   created_at: string;
// }

// interface FormData {
//   nik_pengajuan: string;
//   nama_pengajuan: string;
//   alasan_pengajuan: string;
//   alasan_lainnya: string;
//   tanggal_pengajuan: string;
//   estimasi_tanggal_rekam_ulang: string;
// }

// export default function PengajuanBulananPage() {
//   const { user, profile } = useUser();
//   const [showForm, setShowForm] = useState(false);
//   const [showTable, setShowTable] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     nik_pengajuan: "",
//     nama_pengajuan: "",
//     alasan_pengajuan: "",
//     alasan_lainnya: "",
//     tanggal_pengajuan: new Date().toISOString().split("T")[0],
//     estimasi_tanggal_rekam_ulang: "",
//   });
//   const [rekapData, setRekapData] = useState<PengajuanBulananData[]>([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isTableLoading, setIsTableLoading] = useState(false);
//   const userRole = profile?.role ?? "user";

//   // State untuk pengurutan
//   const [sortBy, setSortBy] = useState<"tanggal_pengajuan" | "is_ready_to_record">("tanggal_pengajuan");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

//   const fetchRekapData = useCallback(
//     async (page: number = 1, searchQuery: string = "") => {
//       if (!user) {
//         toast.error("Pengguna tidak ditemukan. Silakan login kembali.");
//         return { totalCount: 0 };
//       }

//       try {
//         setIsTableLoading(true);
//         const rowsPerPage = 5;
//         const start = (page - 1) * rowsPerPage;
//         const end = start + rowsPerPage - 1;

//         let query = supabase
//           .from("pengajuan_bulanan")
//           .select("*", { count: "exact" })
//           .eq("user_id", user.id)
//           .order(sortBy, { ascending: sortOrder === "asc" })
//           .range(start, end);

//         if (searchQuery) {
//           query = query.or(
//             `nik_pengajuan.ilike.%${searchQuery}%,nama_pengajuan.ilike.%${searchQuery}%`
//           );
//         }

//         const { data, error, count } = await query;
//         if (error) throw new Error(`Gagal mengambil data rekap: ${error.message}`);

//         setRekapData(data || []);
//         return { totalCount: count || 0 };
//       } catch (error: any) {
//         console.error("Error fetching rekap data:", error);
//         toast.error(error.message || "Gagal memuat data rekap. Silakan coba lagi.");
//         return { totalCount: 0 };
//       } finally {
//         setIsTableLoading(false);
//       }
//     },
//     [user, sortBy, sortOrder]
//   );

//   useEffect(() => {
//     if (showTable) {
//       fetchRekapData(currentPage, searchQuery).then(({ totalCount }) =>
//         setTotalCount(totalCount)
//       );
//     }
//   }, [currentPage, showTable, searchQuery, sortBy, sortOrder, fetchRekapData]);

//   const handleSort = (column: "tanggal_pengajuan" | "is_ready_to_record") => {
//     if (sortBy === column) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortOrder("desc");
//     }
//     setCurrentPage(1);
//   };

//   const handleSubmit = async () => {
//     if (
//       !formData.nik_pengajuan ||
//       !formData.nama_pengajuan ||
//       !formData.alasan_pengajuan ||
//       (formData.alasan_pengajuan === "LAINNYA" && !formData.alasan_lainnya)
//     ) {
//       toast.error("Semua kolom wajib diisi.");
//       return;
//     }

//     if (!/^\d{16}$/.test(formData.nik_pengajuan)) {
//       toast.error("NIK Pengajuan harus 16 digit angka.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const finalAlasan =
//         formData.alasan_pengajuan === "LAINNYA"
//           ? formData.alasan_lainnya
//           : formData.alasan_pengajuan;

//       if (isEditing && editId) {
//         const updateData: Partial<PengajuanBulananData> = {
//           nik_pengajuan: formData.nik_pengajuan,
//           nama_pengajuan: formData.nama_pengajuan,
//           alasan_pengajuan: finalAlasan,
//           tanggal_pengajuan: formData.tanggal_pengajuan,
//         };

//         if (userRole === "admin" && formData.estimasi_tanggal_rekam_ulang) {
//           updateData.estimasi_tanggal_rekam_ulang = formData.estimasi_tanggal_rekam_ulang;
//         }

//         const { error } = await supabase
//           .from("pengajuan_bulanan")
//           .update(updateData)
//           .eq("id", editId)
//           .eq("user_id", user?.id);

//         if (error) throw new Error(`Gagal memperbarui data: ${error.message}`);

//         toast.success("Data berhasil diperbarui!");
//       } else {
//         const { error } = await supabase.from("pengajuan_bulanan").insert({
//           user_id: user?.id,
//           nik_pengajuan: formData.nik_pengajuan,
//           nama_pengajuan: formData.nama_pengajuan,
//           alasan_pengajuan: finalAlasan,
//           tanggal_pengajuan: formData.tanggal_pengajuan,
//           estimasi_tanggal_rekam_ulang:
//             userRole === "admin" && formData.estimasi_tanggal_rekam_ulang
//               ? formData.estimasi_tanggal_rekam_ulang
//               : null,
//         });

//         if (error) throw new Error(`Gagal mengajukan data: ${error.message}`);

//         toast.success("Data berhasil diajukan!");
//       }

//       setShowForm(false);
//       setShowTable(true);
//       setFormData({
//         nik_pengajuan: "",
//         nama_pengajuan: "",
//         alasan_pengajuan: "",
//         alasan_lainnya: "",
//         tanggal_pengajuan: new Date().toISOString().split("T")[0],
//         estimasi_tanggal_rekam_ulang: "",
//       });
//       setIsEditing(false);
//       setEditId(null);

//       const { totalCount } = await fetchRekapData(currentPage, searchQuery);
//       setTotalCount(totalCount);
//     } catch (error: any) {
//       console.error("Error submitting form:", error);
//       toast.error(error.message || "Gagal memproses data. Silakan coba lagi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setShowTable(false);
//     setFormData({
//       nik_pengajuan: "",
//       nama_pengajuan: "",
//       alasan_pengajuan: "",
//       alasan_lainnya: "",
//       tanggal_pengajuan: new Date().toISOString().split("T")[0],
//       estimasi_tanggal_rekam_ulang: "",
//     });
//     setIsEditing(false);
//     setEditId(null);
//   };

//   const handleSearch = async (query: string) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//     const { totalCount } = await fetchRekapData(1, query);
//     setTotalCount(totalCount);
//   };

//   const handleRefresh = async () => {
//     setSearchQuery("");
//     setCurrentPage(1);
//     const { totalCount } = await fetchRekapData(1, "");
//     setTotalCount(totalCount);
//   };

//   const handleEdit = (data: PengajuanBulananData) => {
//     setFormData({
//       nik_pengajuan: data.nik_pengajuan,
//       nama_pengajuan: data.nama_pengajuan,
//       alasan_pengajuan: [
//         "MISSING BIOMETRIC EXCEPTION",
//         "NIK TANPA BIOMETRIC FINGERS",
//         "DUPLICATE DENGAN ORANG LAIN",
//         "DUPLICATE DENGAN NIK TANPA DATA REKAM",
//         "ONE TO MANY",
//       ].includes(data.alasan_pengajuan)
//         ? data.alasan_pengajuan
//         : "LAINNYA",
//       alasan_lainnya: [
//         "MISSING BIOMETRIC EXCEPTION",
//         "NIK TANPA BIOMETRIC FINGERS",
//         "DUPLICATE DENGAN ORANG LAIN",
//         "DUPLICATE DENGAN NIK TANPA DATA REKAM",
//         "ONE TO MANY",
//       ].includes(data.alasan_pengajuan)
//         ? ""
//         : data.alasan_pengajuan,
//       tanggal_pengajuan: data.tanggal_pengajuan,
//       estimasi_tanggal_rekam_ulang: data.estimasi_tanggal_rekam_ulang || "",
//     });
//     setIsEditing(true);
//     setEditId(data.id);
//     setShowForm(true);
//     setShowTable(false);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       const { error } = await supabase
//         .from("pengajuan_bulanan")
//         .delete()
//         .eq("id", id)
//         .eq("user_id", user?.id);

//       if (error) throw new Error(`Gagal menghapus data: ${error.message}`);

//       toast.success("Data berhasil dihapus!");
//       const { totalCount } = await fetchRekapData(currentPage, searchQuery);
//       setTotalCount(totalCount);

//       if (rekapData.length === 1 && currentPage > 1) {
//         setCurrentPage(currentPage - 1);
//       }
//     } catch (error: any) {
//       console.error("Error deleting data:", error);
//       toast.error(error.message || "Gagal menghapus data. Silakan coba lagi.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//         <PengajuanBulananHeader />
//         <PengajuanBulananActions
//           onAjukan={() => {
//             setShowForm(true);
//             setShowTable(false);
//             setIsEditing(false);
//             setEditId(null);
//             setFormData({
//               nik_pengajuan: "",
//               nama_pengajuan: "",
//               alasan_pengajuan: "",
//               alasan_lainnya: "",
//               tanggal_pengajuan: new Date().toISOString().split("T")[0],
//               estimasi_tanggal_rekam_ulang: "",
//             });
//           }}
//           onRekapitulasi={async () => {
//             setShowTable(true);
//             setShowForm(false);
//             const { totalCount } = await fetchRekapData(currentPage, searchQuery);
//             setTotalCount(totalCount);
//           }}
//           activeMode={showForm ? ActiveMode.Form : showTable ? ActiveMode.Table : ActiveMode.None}
//         />
//         <AnimatePresence mode="wait">
//           {showForm && (
//             <motion.div
//               key="form"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <PengajuanBulananForm
//                 formData={formData}
//                 setFormData={setFormData}
//                 onSubmit={handleSubmit}
//                 onCancel={handleCancel}
//                 loading={loading}
//                 userRole={userRole}
//                 isEditing={isEditing}
//               />
//             </motion.div>
//           )}
//           {showTable && (
//             <motion.div
//               key="table"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <PengajuanBulananTable
//                 rekapData={rekapData}
//                 totalCount={totalCount}
//                 currentPage={currentPage}
//                 onPageChange={async (page: number) => {
//                   setCurrentPage(page);
//                   const { totalCount } = await fetchRekapData(page, searchQuery);
//                   setTotalCount(totalCount);
//                 }}
//                 onSearch={handleSearch}
//                 onRefresh={handleRefresh}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 userRole={userRole}
//                 isTableLoading={isTableLoading}
//                 sortBy={sortBy}
//                 sortOrder={sortOrder}
//                 onSort={handleSort}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }