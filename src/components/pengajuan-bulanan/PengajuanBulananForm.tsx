import React from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { format } from "date-fns";

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

interface PengajuanBulananFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  userRole: string;
}

export default function PengajuanBulananForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
  userRole,
}: PengajuanBulananFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "nik_pengajuan_hapus" && value && !/^\d{0,16}$/.test(value)) {
      toast.error("NIK harus berupa angka dan maksimal 16 digit!");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formClasses = "space-y-6";
  const sectionClasses = "space-y-4 p-4 bg-gray-50 rounded-lg shadow-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";
  const inputClasses =
    "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const selectClasses =
    "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white";
  const readonlyInputClasses =
    "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm";
  const buttonWrapperClasses = "flex justify-center space-x-4";
  const baseButtonClasses =
    "px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
  const submitButtonClasses = `${baseButtonClasses} ${
    loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
  }`;
  const cancelButtonClasses = `${baseButtonClasses} bg-gray-500 hover:bg-gray-600 focus:ring-gray-500`;

  return (
    <form onSubmit={onSubmit} className={formClasses}>
      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Data Pengajuan Hapus</h2>
        <div>
          <label className={labelClasses}>
            NIK Pengajuan Hapus <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik_pengajuan_hapus"
            value={formData.nik_pengajuan_hapus}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK Pengajuan Hapus"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Nama Pengajuan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_pengajuan"
            value={formData.nama_pengajuan}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Nama Pengajuan"
          />
        </div>
      </div>

      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Alasan Pengajuan</h2>
        <div>
          <label className={labelClasses}>
            Alasan Pengajuan <span className="text-red-500">*</span>
          </label>
          <select
            name="alasan_pengajuan"
            value={formData.alasan_pengajuan}
            onChange={handleInputChange}
            className={selectClasses}
            required
            aria-label="Alasan Pengajuan"
          >
            <option value="" disabled>Pilih Alasan Pengajuan</option>
            <option value="MISSING BIOMETRIC EXCEPTION">Missing Biometric Exception</option>
            <option value="NIK TANPA BIOMETRIC FINGERS">NIK Tanpa Biometric Fingers</option>
            <option value="DUPLICATE DENGAN ORANG LAIN">Duplicate dengan Orang Lain</option>
            <option value="DUPLICATE DENGAN NIK TANPA DATA REKAM">Duplicate dengan NIK Tanpa Data Rekam</option>
            <option value="ONE TO MANY">One to Many</option>
            <option value="LAINNYA">Lainnya</option>
          </select>
        </div>
        {formData.alasan_pengajuan === "LAINNYA" && (
          <div>
            <label className={labelClasses}>
              Alasan Lainnya <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="alasan_lainnya"
              value={formData.alasan_lainnya}
              onChange={handleInputChange}
              className={inputClasses}
              required
              aria-label="Alasan Lainnya"
            />
          </div>
        )}
      </div>

      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Pengaju</h2>
        <div>
          <label className={labelClasses}>NIK Pengaju</label>
          <input
            type="text"
            name="nik_pengaju"
            value={formData.nik_pengaju}
            className={readonlyInputClasses}
            readOnly
            aria-label="NIK Pengaju"
          />
        </div>
        <div>
          <label className={labelClasses}>Nama Pengaju</label>
          <input
            type="text"
            name="nama_pengaju"
            value={formData.nama_pengaju}
            className={readonlyInputClasses}
            readOnly
            aria-label="Nama Pengaju"
          />
        </div>
      </div>

      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Detail Pengajuan</h2>
        <div>
          <label className={labelClasses}>
            Tanggal Pengajuan <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="tanggal_pengajuan"
            value={formData.tanggal_pengajuan}
            onChange={handleInputChange}
            className={inputClasses}
            required
            readOnly
            aria-label="Tanggal Pengajuan"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Estimasi Tanggal Perekaman Ulang
            {["admin", "superuser"].includes(userRole) && <span className="text-red-500">*</span>}
          </label>
          <input
            type="date"
            name="estimasi_tanggal_perekaman"
            value={formData.estimasi_tanggal_perekaman || ""}
            onChange={handleInputChange}
            className={["admin", "superuser"].includes(userRole) ? inputClasses : readonlyInputClasses}
            disabled={!["admin", "superuser"].includes(userRole)}
            required={["admin", "superuser"].includes(userRole)}
            aria-label="Estimasi Tanggal Perekaman Ulang"
          />
        </div>
      </div>

      <div className={buttonWrapperClasses}>
        <motion.button
          type="submit"
          disabled={loading}
          className={submitButtonClasses}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Mengajukan..." : "Ajukan"}
        </motion.button>
        <motion.button
          type="button"
          onClick={onCancel}
          className={cancelButtonClasses}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Batal
        </motion.button>
      </div>
    </form>
  );
}