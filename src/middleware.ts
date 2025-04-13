import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Jika tidak ada sesi dan pengguna mencoba mengakses rute yang dilindungi, redirect ke /
  const protectedRoutes = ['/dashboard', '/aktivitas-user', '/data-rekam', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (!session && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

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

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/pengaduan-bulanan/:path*",
    "/aktivitas-user/:path*",
    "/data-rekam/:path*",
  ],
};