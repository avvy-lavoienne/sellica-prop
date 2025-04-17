import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileFormProps {
  isEditing: boolean;
  formData: {
    name: string;
    nip: string;
    position: string;
    nik: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    nip: string;
    position: string;
    nik: string;
  }>>;
  profile: {
    name: string;
    nip: string;
    position: string;
    nik: string;
    avatar_url: string | null;
  };
}

export default function ProfileForm({ isEditing, formData, setFormData, profile }: ProfileFormProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    if (name === "nik") {
      const isValidNIK = value.length === 16 && /^\d{16}$/.test(value);
      return isValidNIK || !value ? "" : "NIK harus 16 angka";
    }
    if (name === "name" || name === "position") {
      return value.trim() ? "" : `${name === "name" ? "Nama" : "Jabatan"} tidak boleh kosong`;
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const labelClasses = "block text-sm font-medium text-gray-700";
  const inputClasses = "mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const readonlyInputClasses = "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm";
  const errorInputClasses = "border-red-500";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isEditing ? "edit" : "view"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <label className={labelClasses}>
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`${isEditing ? inputClasses : readonlyInputClasses} ${errors.name ? errorInputClasses : "border-gray-300"}`}
            readOnly={!isEditing}
            required
            aria-label="Nama"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className={labelClasses}>NIP</label>
          <input
            type="text"
            name="nip"
            value={formData.nip}
            onChange={handleInputChange}
            className={isEditing ? inputClasses : readonlyInputClasses}
            readOnly={!isEditing}
            aria-label="NIP"
          />
        </div>

        <div>
          <label className={labelClasses}>
            Jabatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className={`${isEditing ? inputClasses : readonlyInputClasses} ${errors.position ? errorInputClasses : "border-gray-300"}`}
            readOnly={!isEditing}
            required
            aria-label="Jabatan"
          />
          {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
        </div>

        <div>
          <label className={labelClasses}>
            NIK <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nik"
            value={formData.nik}
            onChange={handleInputChange}
            className={`${isEditing ? inputClasses : readonlyInputClasses} ${errors.nik ? errorInputClasses : "border-gray-300"}`}
            readOnly={!isEditing}
            placeholder="Masukkan 16 angka"
            required
            aria-label="NIK"
          />
          {errors.nik && <p className="mt-1 text-sm text-red-600">{errors.nik}</p>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}