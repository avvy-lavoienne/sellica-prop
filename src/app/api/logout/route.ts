import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
  response.cookies.set("isLoggedIn", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("userId", "", {
    httpOnly: false, // Sesuaikan dengan pengaturan di login
    path: "/",
    maxAge: 0,
  });

  return response;
}