// "use client";

// import { useState, useEffect } from "react";
// import TextField from "@mui/material/TextField";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import Button from "@mui/material/Button";
// import InputLabel from "@mui/material/InputLabel";
// import FormControl from "@mui/material/FormControl";
// import CircularProgress from "@mui/material/CircularProgress";
// import { motion } from "framer-motion";

// interface FormData {
//   nik_pengajuan: string;
//   nama_pengajuan: string;
//   alasan_pengajuan: string;
//   alasan_lainnya: string;
//   tanggal_pengajuan: string;
//   estimasi_tanggal_rekam_ulang: string;
// }

// interface PengajuanBulananFormProps {
//   formData: FormData;
//   setFormData: (data: FormData) => void;
//   onSubmit: () => void;
//   onCancel: () => void;
//   loading: boolean;
//   userRole: string;
//   isEditing: boolean;
// }

// export default function PengajuanBulananForm({
//   formData,
//   setFormData,
//   onSubmit,
//   onCancel,
//   loading,
//   userRole,
//   isEditing,
// }: PengajuanBulananFormProps) {
//   const alasanOptions = [
//     { value: "MISSING BIOMETRIC EXCEPTION", label: "Missing Biometric Exception" },
//     { value: "NIK TANPA BIOMETRIC FINGERS", label: "NIK Tanpa Biometric Fingers" },
//     { value: "DUPLICATE DENGAN ORANG LAIN", label: "Duplicate dengan Orang Lain" },
//     {
//       value: "DUPLICATE DENGAN NIK TANPA DATA REKAM",
//       label: "Duplicate dengan NIK Tanpa Data Rekam",
//     },
//     { value: "ONE TO MANY", label: "One to Many" },
//     { value: "LAINNYA", label: "Lainnya" },
//   ];

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name as keyof FormData]: value as string });
//   };

//   return (
//     <div className="p-6 bg-gray-50 rounded-lg">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         {isEditing ? "Edit Pengajuan" : "Ajukan Pengajuan Baru"}
//       </h2>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           onSubmit();
//         }}
//         className="space-y-4"
//       >
//         <TextField
//           label="NIK Pengajuan"
//           name="nik_pengajuan"
//           value={formData.nik_pengajuan}
//           onChange={handleChange}
//           fullWidth
//           required
//           inputProps={{ maxLength: 16, pattern: "\\d{16}" }}
//           placeholder="Masukkan 16 digit NIK"
//           size="small"
//           aria-label="NIK Pengajuan"
//         />
//         <TextField
//           label="Nama Pengajuan"
//           name="nama_pengajuan"
//           value={formData.nama_pengajuan}
//           onChange={handleChange}
//           fullWidth
//           required
//           placeholder="Masukkan nama lengkap"
//           size="small"
//           aria-label="Nama Pengajuan"
//         />
//         <FormControl fullWidth required size="small">
//           <InputLabel id="alasan-pengajuan-label">Alasan Pengajuan</InputLabel>
//           <Select
//             labelId="alasan-pengajuan-label"
//             name="alasan_pengajuan"
//             value={formData.alasan_pengajuan}
//             onChange={handleChange}
//             label="Alasan Pengajuan"
//             aria-label="Pilih alasan pengajuan"
//           >
//             <MenuItem value="" disabled>
//               Pilih alasan
//             </MenuItem>
//             {alasanOptions.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         {formData.alasan_pengajuan === "LAINNYA" && (
//           <TextField
//             label="Alasan Lainnya"
//             name="alasan_lainnya"
//             value={formData.alasan_lainnya}
//             onChange={handleChange}
//             fullWidth
//             required
//             placeholder="Masukkan alasan lainnya"
//             size="small"
//             aria-label="Alasan Lainnya"
//           />
//         )}
//         <TextField
//           label="Tanggal Pengajuan"
//           name="tanggal_pengajuan"
//           type="date"
//           value={formData.tanggal_pengajuan}
//           onChange={handleChange}
//           fullWidth
//           required
//           InputProps={{ readOnly: true }}
//           size="small"
//           aria-label="Tanggal Pengajuan"
//         />
//         {userRole === "admin" && (
//           <TextField
//             label="Estimasi Tanggal Rekam Ulang"
//             name="estimasi_tanggal_rekam_ulang"
//             type="date"
//             value={formData.estimasi_tanggal_rekam_ulang}
//             onChange={handleChange}
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             size="small"
//             aria-label="Estimasi Tanggal Rekam Ulang"
//           />
//         )}
//         <div className="flex space-x-4">
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={loading}
//               sx={{ textTransform: "none", borderRadius: "8px", padding: "8px 16px" }}
//               aria-label={isEditing ? "Simpan perubahan" : "Ajukan pengajuan"}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : isEditing ? "Simpan" : "Ajukan"}
//             </Button>
//           </motion.div>
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={onCancel}
//               sx={{ textTransform: "none", borderRadius: "8px", padding: "8px 16px" }}
//               aria-label="Batal"
//             >
//               Batal
//             </Button>
//           </motion.div>
//         </div>
//       </form>
//     </div>
//   );
// }