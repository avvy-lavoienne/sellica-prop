import React from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface FormData {
  nik_adjudicate: string;
  nama_adjudicate: string;
  nik_pengaju: string;
  nama_pengaju: string;
  jenis_eksepsi: string;
  tanggal_pengajuan: string;
}

interface AdjudicateRecordFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function AdjudicateRecordForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
}: AdjudicateRecordFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "nik_adjudicate" && value && !/^\d{0,16}$/.test(value)) {
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
        <h2 className="text-lg font-semibold text-gray-800">Data Adjudicate</h2>
        <div>
          <label className={labelClasses}>
            NIK Adjudicate <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik_adjudicate"
            value={formData.nik_adjudicate}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK Adjudicate"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Nama Adjudicate <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_adjudicate"
            value={formData.nama_adjudicate}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Nama Adjudicate"
          />
        </div>
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
            Jenis Eksepsi <span className="text-red-500">*</span>
          </label>
          <select
            name="jenis_eksepsi"
            value={formData.jenis_eksepsi}
            onChange={handleInputChange}
            className={selectClasses}
            required
            aria-label="Jenis Eksepsi"
          >
            <option value="" disabled>Pilih Jenis Eksepsi</option>
            <option value="eksepsi sidik jari">Eksepsi Sidik Jari</option>
            <option value="eksepsi iris mata">Eksepsi Iris Mata</option>
            <option value="eksepsi total">Eksepsi Total</option>
          </select>
        </div>
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
            aria-label="Tanggal Pengajuan"
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