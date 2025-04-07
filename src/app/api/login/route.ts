import { NextResponse } from "next/server";
import { loginUser } from "@/services/userService";

export async function POST(request: Request) {
  try {
    const { nik, password } = await request.json();

    // Validate NIK and password on the server side
    if (!nik || !password) {
      return NextResponse.json(
        { error: "NIK dan password diperlukan." },
        { status: 400 }
      );
    }

    // Call the loginUser service to authenticate
    const user = await loginUser(nik, password);

    // In a real app, you would generate a JWT token or set a session here
    return NextResponse.json({ message: "Login berhasil", user }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat login." },
      { status: 401 }
    );
  }
}