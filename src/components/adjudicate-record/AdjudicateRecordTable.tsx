import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import ActionButtons from "@/components/ActionButton";
import Switch from "@mui/material/Switch";
import Pagination from "@mui/material/Pagination";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";

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

interface AdjudicateRecordTableProps {
  rekapData: AdjudicateRecordData[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onEdit: (data: AdjudicateRecordData) => void;
  onDelete: (id: string) => void;
  userRole: string;
  isTableLoading: boolean;
}

export default function AdjudicateRecordTable({
  rekapData,
  totalCount,
  currentPage,
  onPageChange,
  onSearch,
  onRefresh,
  onEdit,
  onDelete,
  userRole,
  isTableLoading,
}: AdjudicateRecordTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editedDates, setEditedDates] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (searchQuery === "") return;

    const timeout = setTimeout(() => {
      onSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, onSearch]);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleToggleChange = async (id: string, currentStatus: boolean) => {
    if (!["admin", "superuser"].includes(userRole)) {
      toast.error("Hanya admin atau superuser yang dapat mengubah status.");
      return;
    }

    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from("adjudicate_record")
        .update({ is_ready_to_record: newStatus })
        .eq("id", id);

      if (error) throw new Error(`Gagal mengubah status: ${error.message}`);

      toast.success("Status berhasil diubah!");
      onRefresh();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Gagal mengubah status. Silakan coba lagi.");
    }
  };

  const handleDateChange = (id: string, value: string) => {
    setEditedDates((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveDate = async (id: string) => {
    if (!["admin", "superuser"].includes(userRole)) {
      toast.error("Hanya admin atau superuser yang dapat mengubah tanggal.");
      return;
    }

    const newDate = editedDates[id];
    if (!newDate) {
      toast.error("Tanggal tidak boleh kosong!");
      return;
    }

    setSaving((prev) => ({ ...prev, [id]: true }));

    try {
      const { error } = await supabase
        .from("adjudicate_record")
        .update({ estimasi_tanggal_perekaman: newDate })
        .eq("id", id);

      if (error) throw new Error(`Gagal menyimpan tanggal: ${error.message}`);

      toast.success("Tanggal berhasil disimpan!");
      onRefresh();
      setEditedDates((prev) => {
        const newDates = { ...prev };
        delete newDates[id];
        return newDates;
      });
    } catch (error: any) {
      console.error("Error saving date:", error);
      toast.error(error.message || "Gagal menyimpan tanggal. Silakan coba lagi.");
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toString() !== "Invalid Date"
      ? date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Tanggal tidak valid";
  };

  const wrapperDivClasses = "overflow-x-auto px-4 py-6";
  const tableClasses = "min-w-full max-w-4xl border-collapse border border-gray-300";
  const headerRowClasses = "bg-gray-100";
  const headerCellClasses = "border border-gray-300 px-2 py-4 text-left text-xs font-medium text-gray-700";
  const bodyRowClasses = "hover:bg-gray-50 h-14";
  const bodyCellClasses = "border border-gray-300 px-2 py-4 text-xs";
  const emptyCellClasses = "border border-gray-300 px-2 py-4 text-center text-xs";
  const searchBoxClasses = "w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400";
  const skeletonRowClasses = "h-14 bg-gray-200 animate-pulse rounded-md";
  const skeletonCellClasses = "border border-gray-300 px-2 py-4";
  const inputClasses =
    "w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs";

  const SkeletonTable = () => (
    <table className={tableClasses}>
      <thead>
        <tr className={headerRowClasses}>
          <th className={headerCellClasses}>No</th>
          <th className={headerCellClasses}>Tanggal Pengajuan</th>
          <th className={headerCellClasses}>NIK Adjudicate</th>
          <th className={headerCellClasses}>Nama Adjudicate</th>
          <th className="hidden md:table-cell border border-gray-300 px-2 py-4 text-left text-xs font-medium text-gray-700">Jenis Eksepsi</th>
          <th className="hidden md:table-cell border border-gray-300 px-2 py-4 text-left text-xs font-medium text-gray-700">Estimasi Tanggal Perekaman</th>
          <th className={headerCellClasses}>Status</th>
          <th className={headerCellClasses}>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={`skeleton-${index}`} className={bodyRowClasses}>
            <td className={skeletonCellClasses}>
              <div className={`${skeletonRowClasses} h-4 w-8 mx-auto`}></div>
            </td>
            <td className={skeletonCellClasses}>
              <div className={`${skeletonRowClasses} h-4 w-24`}></div>
            </td>
            <td className={skeletonCellClasses}>
              <div className={`${skeletonRowClasses} h-4 w-32`}></div>
            </td>
            <td className={skeletonCellClasses}>
              <div className={`${skeletonRowClasses} h-4 w-40`}></div>
            </td>
            <td className="hidden md:table-cell border border-gray-300 px-2 py-4">
              <div className={`${skeletonRowClasses} h-4 w-32`}></div>
            </td>
            <td className="hidden md:table-cell border border-gray-300 px-2 py-4">
              <div className={`${skeletonRowClasses} h-4 w-24`}></div>
            </td>
            <td className={skeletonCellClasses}>
              <div className={`${skeletonRowClasses} h-6 w-12 mx-auto`}></div>
            </td>
            <td className={skeletonCellClasses}>
              <div className={`${skeletonRowClasses} h-6 w-20 mx-auto`}></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={wrapperDivClasses}>
      <div className="flex justify-center mb-6 space-x-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari data (NIK, Nama)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={searchBoxClasses}
            aria-label="Cari data di tabel"
            disabled={isTableLoading}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Hapus pencarian"
              disabled={isTableLoading}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={onRefresh}
          className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isTableLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          aria-label="Refresh data"
          tabIndex={0}
          disabled={isTableLoading}
        >
          {isTableLoading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto">
        {isTableLoading ? (
          <SkeletonTable />
        ) : rekapData.length === 0 ? (
          <table className={tableClasses}>
            <thead>
              <tr className={headerRowClasses}>
                <th className={headerCellClasses}>No</th>
                <th className={headerCellClasses}>Tanggal Pengajuan</th>
                <th className={headerCellClasses}>NIK Adjudicate</th>
                <th className={headerCellClasses}>Nama Adjudicate</th>
                <th className="hidden md:table-cell border border-gray-300 px-2 py-4 text-left text-xs font-medium text-gray-700">Jenis Eksepsi</th>
                <th className="hidden md:table-cell border border-gray-300 px-2 py-4 text-left text-xs font-medium text-gray-700">Estimasi Tanggal Perekaman</th>
                <th className={headerCellClasses}>Status</th>
                <th className={headerCellClasses}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr key="empty-row">
                <td colSpan={8} className={emptyCellClasses}>
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className={tableClasses}>
            <thead>
              <tr className={headerRowClasses}>
                <th className={headerCellClasses}>No</th>
                <th className={headerCellClasses}>Tanggal Pengajuan</th>
                <th className={headerCellClasses}>NIK Adjudicate</th>
                <th className={headerCellClasses}>Nama Adjudicate</th>
                <th className="hidden md:table-cell border border-gray-300 px-2 py-4 text-left text-xs font-medium text-gray-700">Jenis Eksepsi</th>
                <th className="hidden md:table-cell border border-gray-300 px-2 py-4 text-left text-xs font-medium text-gray-700">Estimasi Tanggal Perekaman</th>
                <th className={headerCellClasses}>Status</th>
                <th className={headerCellClasses}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rekapData.map((item, index) => {
                const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;
                const isExpanded = expandedRow === item.id;
                const currentDate = editedDates[item.id] || item.estimasi_tanggal_perekaman || "";
                return (
                  <React.Fragment key={item.id}>
                    <tr className={bodyRowClasses}>
                      <td className={bodyCellClasses}>{rowNumber}</td>
                      <td className={bodyCellClasses}>{formatDate(item.tanggal_pengajuan)}</td>
                      <td className={bodyCellClasses}>{item.nik_adjudicate || "-"}</td>
                      <td className={bodyCellClasses}>{item.nama_adjudicate || "-"}</td>
                      <td className="hidden md:table-cell border border-gray-300 px-2 py-4 text-xs">
                        {item.jenis_eksepsi || "-"}
                      </td>
                      <td className="hidden md:table-cell border border-gray-300 px-2 py-4 text-xs">
                        {["admin", "superuser"].includes(userRole) ? (
                          <input
                            type="date"
                            value={currentDate}
                            onChange={(e) => handleDateChange(item.id, e.target.value)}
                            className={inputClasses}
                            aria-label="Estimasi Tanggal Perekaman"
                          />
                        ) : (
                          formatDate(item.estimasi_tanggal_perekaman)
                        )}
                      </td>
                      <td className={bodyCellClasses}>
                        <Tooltip
                          title={
                            item.is_ready_to_record
                              ? "Status: Siap Direkam"
                              : "Status: Belum Siap Direkam"
                          }
                          arrow
                        >
                          <span>
                            <Switch
                              checked={item.is_ready_to_record}
                              onChange={() => handleToggleChange(item.id, item.is_ready_to_record)}
                              disabled={!["admin", "superuser"].includes(userRole)}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#16a34a",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#16a34a",
                                },
                                "& .MuiSwitch-switchBase": {
                                  color: "#dc2626",
                                },
                                "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                                  backgroundColor: "#dc2626",
                                },
                              }}
                            />
                          </span>
                        </Tooltip>
                      </td>
                      <td className={bodyCellClasses}>
                        <div className="flex space-x-2">
                          <ActionButtons
                            onEdit={() => onEdit(item)}
                            onDelete={() => onDelete(item.id)}
                            onDetail={() => setExpandedRow(isExpanded ? null : item.id)}
                            showDetailButton={true}
                            isDetailOpen={isExpanded}
                          />
                          {["admin", "superuser"].includes(userRole) && (
                            <Tooltip title="Simpan Tanggal" arrow>
                              <span>
                                <IconButton
                                  onClick={() => handleSaveDate(item.id)}
                                  disabled={saving[item.id] || !editedDates[item.id]}
                                  sx={{
                                    color: saving[item.id] ? "#9ca3af" : "#4f46e5",
                                    "&:hover": {
                                      color: saving[item.id] ? "#9ca3af" : "#4338ca",
                                    },
                                  }}
                                  aria-label="Simpan tanggal estimasi"
                                >
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <motion.tr
                        key={`detail-${item.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={8} className="border border-gray-300 px-2 py-4 text-xs">
                          <div className="p-4 bg-gray-50 rounded-md">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Detail Data</h3>
                            <p><strong>NIK Pengaju:</strong> {item.nik_pengaju || "-"}</p>
                            <p><strong>Nama Pengaju:</strong> {item.nama_pengaju || "-"}</p>
                            <p><strong>Jenis Eksepsi:</strong> {item.jenis_eksepsi || "-"}</p>
                            <p>
                              <strong>Tanggal Pengajuan:</strong> {formatDate(item.tanggal_pengajuan)}
                            </p>
                            <p>
                              <strong>Estimasi Tanggal Perekaman:</strong>{" "}
                              {formatDate(item.estimasi_tanggal_perekaman)}
                            </p>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && !isTableLoading && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => onPageChange(value)}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#4f46e5",
                fontSize: "0.875rem",
              },
              "& .Mui-selected": {
                backgroundColor: "#4f46e5 !important",
                color: "white",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#e0e7ff",
              },
            }}
          />
          <p className="ml-4 text-sm text-gray-600">
            Menampilkan {Math.min(rekapData.length, rowsPerPage)} dari {totalCount} data
          </p>
        </div>
      )}
    </div>
  );
}