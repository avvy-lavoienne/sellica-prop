import { NextResponse } from "next/server";
import { loginUser } from "@/services/userService";
import { User } from "@/types/user";

export async function POST(request: Request) {
  try {
    const { nik, password } = await request.json();

    if (!nik || !password) {
      return NextResponse.json(
        { error: "NIK dan password diperlukan." },
        { status: 400 }
      );
    }

    if (typeof nik !== "string" || nik.length !== 16 || !/^\d+$/.test(nik)) {
      return NextResponse.json(
        { error: "NIK harus berupa 16 digit angka." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password harus minimal 8 karakter." },
        { status: 400 }
      );
    }

    const user: User = await loginUser(nik, password);

    const response = NextResponse.json(
      { message: "Login berhasil", user: { id: user._id.toString(), nik: user.nik } },
      { status: 200 }
    );

    response.cookies.set("isLoggedIn", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    response.cookies.set("userId", user._id.toString(), {
      httpOnly: false, // Hapus httpOnly agar bisa diakses di sisi klien
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    console.error("Error saat login:", error.message);
    const status = error.message.includes("NIK atau password salah") ? 401 : 500;
    const errorMessage =
      status === 401 ? "NIK atau password salah." : "Terjadi kesalahan server saat login.";

    return NextResponse.json({ error: errorMessage }, { status });
  }
}