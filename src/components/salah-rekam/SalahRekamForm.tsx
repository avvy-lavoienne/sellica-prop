import { toast } from "react-toastify";

interface FormData {
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
}

interface SalahRekamFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SalahRekamForm({
  formData,
  setFormData,
  onSubmit,
  loading,
}: SalahRekamFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pisahkan class Tailwind ke dalam variabel
  const formClasses = "space-y-4";
  const labelClasses = "block text-sm font-medium text-gray-700";
  const inputClasses = "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const readonlyInputClasses = "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm";
  const buttonWrapperClasses = "flex justify-center";
  const baseButtonClasses = "px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";
  const buttonLoadingClasses = "bg-indigo-400 cursor-not-allowed";
  const buttonNormalClasses = "bg-indigo-600 hover:bg-indigo-700";

  return (
    <form onSubmit={onSubmit} className={formClasses}>
      <div>
        <label className={labelClasses}>
          NIK Salah Rekam
        </label>
        <input
          type="text"
          name="nik_salah_rekam"
          value={formData.nik_salah_rekam}
          onChange={handleInputChange}
          className={inputClasses}
          placeholder="Masukkan 16 angka"
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          Nama Salah Rekam
        </label>
        <input
          type="text"
          name="nama_salah_rekam"
          value={formData.nama_salah_rekam}
          onChange={handleInputChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          NIK Pemilik Biometric
        </label>
        <input
          type="text"
          name="nik_pemilik_biometric"
          value={formData.nik_pemilik_biometric}
          onChange={handleInputChange}
          className={inputClasses}
          placeholder="Masukkan 16 angka"
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          Nama Pemilik Biometric
        </label>
        <input
          type="text"
          name="nama_pemilik_biometric"
          value={formData.nama_pemilik_biometric}
          onChange={handleInputChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          NIK Pemilik Foto
        </label>
        <input
          type="text"
          name="nik_pemilik_foto"
          value={formData.nik_pemilik_foto}
          onChange={handleInputChange}
          className={inputClasses}
          placeholder="Masukkan 16 angka"
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          Nama Pemilik Foto
        </label>
        <input
          type="text"
          name="nama_pemilik_foto"
          value={formData.nama_pemilik_foto}
          onChange={handleInputChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          NIK Petugas Rekam
        </label>
        <input
          type="text"
          name="nik_petugas_rekam"
          value={formData.nik_petugas_rekam}
          onChange={handleInputChange}
          className={inputClasses}
          placeholder="Masukkan 16 angka"
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          Nama Petugas Rekam
        </label>
        <input
          type="text"
          name="nama_petugas_rekam"
          value={formData.nama_petugas_rekam}
          onChange={handleInputChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>
          NIK Pengaju
        </label>
        <input
          type="text"
          name="nik_pengaju"
          value={formData.nik_pengaju}
          className={readonlyInputClasses}
          readOnly
        />
      </div>

      <div>
        <label className={labelClasses}>
          Nama Pengaju
        </label>
        <input
          type="text"
          name="nama_pengaju"
          value={formData.nama_pengaju}
          className={readonlyInputClasses}
          readOnly
        />
      </div>

      <div>
        <label className={labelClasses}>
          Tanggal Perekaman
        </label>
        <input
          type="date"
          name="tanggal_perekaman"
          value={formData.tanggal_perekaman}
          onChange={handleInputChange}
          className={inputClasses}
          required
        />
      </div>

      <div className={buttonWrapperClasses}>
        <button
          type="submit"
          disabled={loading}
          className={`${baseButtonClasses} ${loading ? buttonLoadingClasses : buttonNormalClasses}`}
        >
          {loading ? "Mengajukan..." : "Ajukan"}
        </button>
      </div>
    </form>
  );
}