import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";

// Handler untuk GET /api/user
export async function GET(request: Request) {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db("sellica");
    
    // Ambil userId dari query parameter (atau dari cookie/session di masa depan)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId diperlukan." },
        { status: 400 }
      );
    }

    // Cari pengguna berdasarkan userId
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: { nik: user.nik, name: user.name } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat mengambil data pengguna." },
      { status: 500 }
    );
  }
}