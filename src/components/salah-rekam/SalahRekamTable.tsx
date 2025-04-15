import ActionButtons from "@/components/ActionButton";

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
}

interface SalahRekamTableProps {
  rekapData: SalahRekamData[];
  onEdit: (data: SalahRekamData) => void;
  onDelete: (id: string) => void;
}

export default function SalahRekamTable({ rekapData, onEdit, onDelete }: SalahRekamTableProps) {
  const wrapperDivClasses = "overflow-x-auto px-4 py-6";
  const tableClasses = "min-w-full border-collapse border border-gray-300";
  const headerRowClasses = "bg-gray-100";
  const headerCellClasses = "border border-gray-300 px-6 py-4 text-left text-base font-semibold text-gray-700";
  const bodyRowClasses = "hover:bg-gray-50 h-14";
  const bodyCellClasses = "border border-gray-300 px-6 py-4 text-base";
  const emptyCellClasses = "border border-gray-300 px-6 py-4 text-center text-base";

  return (
    <div className={wrapperDivClasses}>
      <table className={tableClasses}>
        <thead>
          <tr className={headerRowClasses}>
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
          {rekapData.length > 0 ? (
            rekapData.map((data) => (
              <tr key={data.id} className={bodyRowClasses}>
                <td className={bodyCellClasses}>{data.nik_salah_rekam}</td>
                <td className={bodyCellClasses}>{data.nama_salah_rekam}</td>
                <td className={bodyCellClasses}>{data.nik_pemilik_biometric}</td>
                <td className={bodyCellClasses}>{data.nama_pemilik_biometric}</td>
                <td className={bodyCellClasses}>{data.nik_pemilik_foto}</td>
                <td className={bodyCellClasses}>{data.nama_pemilik_foto}</td>
                <td className={bodyCellClasses}>{data.nik_petugas_rekam}</td>
                <td className={bodyCellClasses}>{data.nama_petugas_rekam}</td>
                <td className={bodyCellClasses}>{data.nik_pengaju}</td>
                <td className={bodyCellClasses}>{data.nama_pengaju}</td>
                <td className={bodyCellClasses}>
                  {new Date(data.tanggal_perekaman).toLocaleDateString("id-ID", {
                    timeZone: "Asia/Jakarta",
                  })}
                </td>
                <td className={bodyCellClasses}>
                  {new Date(data.created_at).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                  })}
                </td>
                <td className={bodyCellClasses}>
                  <ActionButtons
                    onEdit={() => onEdit(data)}
                    onDelete={() => onDelete(data.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={13} className={emptyCellClasses}>
                Belum ada data yang diajukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}