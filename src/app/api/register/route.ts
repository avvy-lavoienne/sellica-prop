import { NextResponse } from "next/server";
import { registerUser } from "@/services/userService";

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

    if (!/^\d{16}$/.test(nik)) {
      return NextResponse.json(
        { error: "NIK harus terdiri dari 16 angka." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password harus minimal 6 karakter." },
        { status: 400 }
      );
    }

    // Call the registerUser service to create a new user
    await registerUser(nik, password);

    return NextResponse.json(
      { message: "Registrasi berhasil! Silakan login." },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat registrasi." },
      { status: 400 }
    );
  }
}