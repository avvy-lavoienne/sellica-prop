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
  formData: FormData | undefined; // Izinkan formData menjadi undefined
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  isEditing: any;
}

export default function SalahRekamForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
}: SalahRekamFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pisahkan class Tailwind ke dalam variabel
  const formClasses = "space-y-6";
  const sectionClasses = "space-y-4 p-4 bg-gray-50 rounded-lg shadow-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";
  const inputClasses = "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const readonlyInputClasses = "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm";
  const buttonWrapperClasses = "flex justify-center space-x-4";
  const baseButtonClasses = "px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
  const submitButtonClasses = `${baseButtonClasses} ${
    loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
  }`;
  const cancelButtonClasses = `${baseButtonClasses} bg-gray-500 hover:bg-gray-600 focus:ring-gray-500`;

  // Jika formData undefined, tampilkan pesan error atau fallback
  if (!formData) {
    return <div className="text-red-500">Error: Data form tidak tersedia.</div>;
  }

  return (
    <form onSubmit={onSubmit} className={formClasses}>
      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Data Salah Rekam</h2>
        <div>
          <label className={labelClasses}>
            NIK Salah Rekam <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik_salah_rekam"
            value={formData.nik_salah_rekam ?? ""}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK Salah Rekam"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Nama Salah Rekam <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_salah_rekam"
            value={formData.nama_salah_rekam ?? ""}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Nama Salah Rekam"
          />
        </div>
      </div>

      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Pemilik Biometric</h2>
        <div>
          <label className={labelClasses}>
            NIK Pemilik Biometric <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik_pemilik_biometric"
            value={formData.nik_pemilik_biometric ?? ""}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK Pemilik Biometric"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Nama Pemilik Biometric <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_pemilik_biometric"
            value={formData.nama_pemilik_biometric ?? ""}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Nama Pemilik Biometric"
          />
        </div>
      </div>

      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Pemilik Foto</h2>
        <div>
          <label className={labelClasses}>
            NIK Pemilik Foto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik_pemilik_foto"
            value={formData.nik_pemilik_foto ?? ""}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK Pemilik Foto"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Nama Pemilik Foto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_pemilik_foto"
            value={formData.nama_pemilik_foto ?? ""}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Nama Pemilik Foto"
          />
        </div>
      </div>

      <div className={sectionClasses}>
        <h2 className="text-lg font-semibold text-gray-800">Petugas Rekam</h2>
        <div>
          <label className={labelClasses}>
            NIK Petugas Rekam <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik_petugas_rekam"
            value={formData.nik_petugas_rekam ?? ""}
            onChange={handleInputChange}
            className={inputClasses}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK Petugas Rekam"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Nama Petugas Rekam <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_petugas_rekam"
            value={formData.nama_petugas_rekam ?? ""}
            onChange={handleInputChange}
            className={inputClasses}
            required
            aria-label="Nama Petugas Rekam"
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
            value={formData.nik_pengaju ?? ""}
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
            value={formData.nama_pengaju ?? ""}
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
            value={formData.tanggal_perekaman ?? ""}
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