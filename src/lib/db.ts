import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sellica"; // Fallback jika env tidak ditemukan

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log("Menggunakan koneksi MongoDB yang sudah ada");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Menghubungkan ke MongoDB:", MONGODB_URI);
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Berhasil terhubung ke MongoDB");
      return mongoose;
    }).catch((error) => {
      console.error("Gagal terhubung ke MongoDB:", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;