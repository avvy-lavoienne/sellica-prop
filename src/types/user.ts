import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId; // ID dari MongoDB
  nik: string;
  name?: string; // Opsional, jika ada
  password: string; // Password yang di-hash
}