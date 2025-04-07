import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
  response.cookies.set("isLoggedIn", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // Hapus cookie
  });

  return response;
}