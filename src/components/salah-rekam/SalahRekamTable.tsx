import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import ActionButtons from "@/components/ActionButton";
import Switch from "@mui/material/Switch";

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
  userRole: string; // Terima role pengguna
}

export default function SalahRekamTable({ rekapData, onEdit, onDelete, userRole }: SalahRekamTableProps) {
  const [data, setData] = useState(rekapData); // State lokal untuk data tabel

  const handleToggleChange = async (id: string, currentStatus: boolean) => {
    // Hanya izinkan admin atau superuser mengubah toggle
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

      // Update state lokal agar UI langsung berubah
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

  return (
    <div className={wrapperDivClasses}>
      <table className={tableClasses}>
        <thead>
          <tr className={headerRowClasses}>
            <th className={headerCellClasses}>Status</th> {/* Kolom baru */}
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
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className={bodyRowClasses}>
                <td className={bodyCellClasses}>
                  <Switch
                    checked={item.is_ready_to_record}
                    onChange={() => handleToggleChange(item.id, item.is_ready_to_record)}
                    disabled={!["admin", "superuser"].includes(userRole)} // Nonaktifkan untuk non-admin
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#16a34a", // Hijau saat checked (siap rekam)
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#16a34a", // Track hijau saat checked
                      },
                      "& .MuiSwitch-switchBase": {
                        color: "#dc2626", // Merah saat unchecked (belum siap)
                      },
                      "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                        backgroundColor: "#dc2626", // Track merah saat unchecked
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
                Belum ada data yang diajukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}