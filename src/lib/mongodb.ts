import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ambil connection string dari environment variable
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Cek apakah kita sedang di environment development atau production
if (process.env.NODE_ENV === "development") {
  // Di development, gunakan global variable untuk menghindari koneksi berulang
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri!, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // Di production, buat koneksi baru
  client = new MongoClient(uri!, options);
  clientPromise = client.connect();
}

export default clientPromise;