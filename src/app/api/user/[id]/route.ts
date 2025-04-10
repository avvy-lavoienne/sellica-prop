import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Mengambil data pengguna dengan ID:", params.id);

    // Validasi ID
    if (!ObjectId.isValid(params.id)) {
      console.log("ID tidak valid:", params.id);
      return NextResponse.json({ error: "ID pengguna tidak valid." }, { status: 400 });
    }

    // Hubungkan ke database
    const client = await clientPromise;
    const db = client.db("sellica");
    const usersCollection = db.collection("users");

    // Cari pengguna berdasarkan _id
    const user = await usersCollection.findOne(
      { _id: new ObjectId(params.id) },
      { projection: { nik: 1, _id: 0 } } // Hanya ambil field nik
    );

    console.log("Hasil pencarian pengguna:", user);

    if (!user) {
      console.log("Pengguna tidak ditemukan untuk ID:", params.id);
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ nik: user.nik }, { status: 200 });
  } catch (error: any) {
    console.error("Error saat mengambil data pengguna:", error.message);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}