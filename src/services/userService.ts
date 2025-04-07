import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

interface User {
  nik: string;
  password: string;
}

export async function registerUser(nik: string, password: string) {
  const client = await clientPromise;
  const db = client.db("sellica"); // Nama database

  // Cek apakah NIK sudah terdaftar
  const existingUser = await db.collection("users").findOne({ nik });
  if (existingUser) {
    throw new Error("NIK sudah terdaftar.");
  }

  // Hash password sebelum disimpan
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan pengguna baru ke database
  const result = await db.collection("users").insertOne({
    nik,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return result;
}

export async function loginUser(nik: string, password: string) {
  const client = await clientPromise;
  const db = client.db("sellica");

  // Cari pengguna berdasarkan NIK
  const user = await db.collection("users").findOne({ nik });
  if (!user) {
    throw new Error("NIK atau password salah.");
  }

  // Verifikasi password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("NIK atau password salah.");
  }

  return { nik: user.nik };
}