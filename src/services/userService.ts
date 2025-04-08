import clientPromise from "@/lib/mongodb";
import { User } from "@/types/user";
import bcrypt from "bcryptjs";

export async function loginUser(nik: string, password: string): Promise<User> {
  const client = await clientPromise;
  const db = client.db("sellica");

  // Cari pengguna berdasarkan NIK
  const user = await db.collection<User>("users").findOne({ nik });

  if (!user) {
    throw new Error("NIK atau password salah.");
  }

  // Verifikasi password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("NIK atau password salah.");
  }

  return user;
}

export async function registerUser(nik: string, name: string, password: string): Promise<User> {
  const client = await clientPromise;
  const db = client.db("sellica");

  // Hash password sebelum menyimpan
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan pengguna baru
  const result = await db.collection<User>("users").insertOne({
    nik,
    name,
    password: hashedPassword,
  } as User);

  return {
    _id: result.insertedId,
    nik,
    name,
    password: hashedPassword,
  };
}