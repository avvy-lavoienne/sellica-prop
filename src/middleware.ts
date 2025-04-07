import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ambil cookie isLoggedIn
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

  // Log untuk debugging
  console.log("Middleware - Path:", request.nextUrl.pathname);
  console.log("Middleware - isLoggedIn:", isLoggedIn);

  // Jika pengguna belum login dan mencoba mengakses dashboard, redirect ke login
  if (!isLoggedIn && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("Middleware - Redirecting to / because user is not logged in");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Tentukan rute yang akan diperiksa oleh middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};