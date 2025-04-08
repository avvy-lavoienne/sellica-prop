import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

  console.log("Middleware - Path:", request.nextUrl.pathname);
  console.log("Middleware - isLoggedIn:", isLoggedIn);

  // Daftar rute yang dilindungi
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/pengaduan-bulanan",
    "/aktivitas-user",
    "/data-rekam",
    '/data-rekam/duplicate-operator',
    '/data-rekam/salah-rekam',
    '/data-rekam/adjudicate',
    '/data-rekam/pengajuan-bulanan',
    '/aktivitas-user/pengaduan-bulanan',
    '/aktivitas-user/aktivitas-siak',
    '/aktivitas-user/dokumentasi',
  ];

  // Lindungi rute yang ada di protectedRoutes
  if (
    !isLoggedIn &&
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    console.log("Middleware - Redirecting to / because user is not logged in");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/pengaduan-bulanan/:path*",
    "/aktivitas-user/:path*",
    "/data-rekam/:path*",
  ],
};