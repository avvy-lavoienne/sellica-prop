import React from "react";
import { toast } from "react-toastify";

interface FormData {
  nik_duplicate: string;
  nama_duplicate: string;
  nik_operator: string;
  nama_operator: string;
  nik_pengaju: string;
  nama_pengaju: string;
  tanggal_perekaman: string;
}

interface DuplicateOperatorFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DuplicateOperatorForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
}: DuplicateOperatorFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["nik_duplicate", "nik_operator"].includes(name) && value && !/^\d{0,16}$/.test(value)) {
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
        <h2 className="text-lg font-semibold text-gray-800">Data Duplikat</h2>
        <div>
          <label className={labelClasses}>
            NIK Duplikat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik_duplicate"
            value={formData.nik_duplicate}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK Duplikat"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Nama Duplikat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_duplicate"
            value={formData.nama_duplicate}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Nama Duplikat"
          />
        </div>
      </div>

      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Operator</h2>
        <div>
          <label className={labelClasses}>
            NIK Operator <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik_operator"
            value={formData.nik_operator}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK Operator"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Nama Operator <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_operator"
            value={formData.nama_operator}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Nama Operator"
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
        <h2 className="text-lg font-semibold text-gray-800">Tanggal Perekaman</h2>
        <div>
          <label className={labelClasses}>
            Tanggal Perekaman <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="tanggal_perekaman"
            value={formData.tanggal_perekaman}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Tanggal Perekaman"
          />
        </div>
      </div>

      <div className={buttonWrapperClasses}>
        <button
          type="submit"
          disabled={loading}
          className={submitButtonClasses}
        >
          {loading ? "Mengajukan..." : "Ajukan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={cancelButtonClasses}
        >
          Batal
        </button>
      </div>
    </form>
  );
}