import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import ActionButtons from "@/components/ActionButton";
import Switch from "@mui/material/Switch";
import Pagination from "@mui/material/Pagination";

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

interface SalahRekamTableProps {
  rekapData: SalahRekamData[];
  onEdit: (data: SalahRekamData) => void;
  onDelete: (id: string) => void;
  userRole: string;
}

export default function SalahRekamTable({ rekapData, onEdit, onDelete, userRole }: SalahRekamTableProps) {
  const [data, setData] = useState(rekapData); // State lokal untuk data tabel
  const [filteredData, setFilteredData] = useState(rekapData); // Data setelah difilter
  const [searchQuery, setSearchQuery] = useState(""); // State untuk search query
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman saat ini
  const rowsPerPage = 5; // Jumlah baris per halaman

  // Update data lokal saat rekapData berubah
  useEffect(() => {
    setData(rekapData);
    setFilteredData(rekapData);
    setCurrentPage(1); // Reset ke halaman 1 saat data berubah
  }, [rekapData]);

  // Handle search filter
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        typeof value === "string" && value.toLowerCase().includes(lowerCaseQuery)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  }, [searchQuery, data]);

  // Handle pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleToggleChange = async (id: string, currentStatus: boolean) => {
    if (!["admin", "superuser"].includes(userRole)) {
      toast.error("Hanya admin atau superuser yang dapat mengubah status.");
      return;
    }

    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from("salah_rekam")
        .update({ is_ready_to_record: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        throw new Error(`Gagal mengubah status: ${error.message}`);
      }

      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, is_ready_to_record: newStatus } : item
        )
      );
      toast.success("Status berhasil diubah!");
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Gagal mengubah status. Silakan coba lagi.");
    }
  };

  const wrapperDivClasses = "overflow-x-auto px-4 py-6";
  const tableClasses = "min-w-full max-w-4xl border-collapse border border-gray-300";
  const headerRowClasses = "bg-gray-100";
  const headerCellClasses = "border border-gray-300 px-2 py-4 text-left text-xs font-medium text-gray-700";
  const bodyRowClasses = "hover:bg-gray-50 h-14";
  const bodyCellClasses = "border border-gray-300 px-2 py-4 text-xs";
  const emptyCellClasses = "border border-gray-300 px-2 py-4 text-center text-xs";
  const searchBoxClasses = "mb-4 w-full max-w-md mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400";

  return (
    <div className={wrapperDivClasses}>
      {/* Searchbox */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Cari data (NIK, Nama, dll.)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={searchBoxClasses}
        />
      </div>

      {/* Tabel */}
      <table className={tableClasses}>
        <thead>
          <tr className={headerRowClasses}>
            <th className={headerCellClasses}>Status</th>
            <th className={headerCellClasses}>NIK Salah Rekam</th>
            <th className={headerCellClasses}>Nama Salah Rekam</th>
            <th className={headerCellClasses}>NIK Pemilik Biometric</th>
            <th className={headerCellClasses}>Nama Pemilik Biometric</th>
            <th className={headerCellClasses}>NIK Pemilik Foto</th>
            <th className={headerCellClasses}>Nama Pemilik Foto</th>
            <th className={headerCellClasses}>NIK Petugas Rekam</th>
            <th className={headerCellClasses}>Nama Petugas Rekam</th>
            <th className={headerCellClasses}>NIK Pengaju</th>
            <th className={headerCellClasses}>Nama Pengaju</th>
            <th className={headerCellClasses}>Tanggal Perekaman</th>
            <th className={headerCellClasses}>Tanggal Pengajuan</th>
            <th className={headerCellClasses}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <tr key={item.id} className={bodyRowClasses}>
                <td className={bodyCellClasses}>
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
                </td>
                <td className={bodyCellClasses}>{item.nik_salah_rekam}</td>
                <td className={bodyCellClasses}>{item.nama_salah_rekam}</td>
                <td className={bodyCellClasses}>{item.nik_pemilik_biometric}</td>
                <td className={bodyCellClasses}>{item.nama_pemilik_biometric}</td>
                <td className={bodyCellClasses}>{item.nik_pemilik_foto}</td>
                <td className={bodyCellClasses}>{item.nama_pemilik_foto}</td>
                <td className={bodyCellClasses}>{item.nik_petugas_rekam}</td>
                <td className={bodyCellClasses}>{item.nama_petugas_rekam}</td>
                <td className={bodyCellClasses}>{item.nik_pengaju}</td>
                <td className={bodyCellClasses}>{item.nama_pengaju}</td>
                <td className={bodyCellClasses}>
                  {new Date(item.tanggal_perekaman).toLocaleDateString("id-ID", {
                    timeZone: "Asia/Jakarta",
                  })}
                </td>
                <td className={bodyCellClasses}>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })
                    : "Tanggal tidak tersedia"}
                </td>
                <td className={bodyCellClasses}>
                  <ActionButtons
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={14} className={emptyCellClasses}>
                Tidak ada data yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#4f46e5", // indigo-600
                fontSize: "0.875rem",
              },
              "& .Mui-selected": {
                backgroundColor: "#4f46e5 !important",
                color: "white",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#e0e7ff", // indigo-100
              },
            }}
          />
        </div>
      )}
    </div>
  );
}