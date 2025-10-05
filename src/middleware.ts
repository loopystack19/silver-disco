import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow access to auth pages if not authenticated
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token) {
      // Redirect to appropriate dashboard if already authenticated
      return NextResponse.redirect(new URL(`/dashboard/${token.role}s`, request.url));
    }
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based routing
    const role = token.role as string;
    
    // Handle generic /dashboard route
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(`/dashboard/${role}s`, request.url));
    }

    // Check if user is accessing their correct role dashboard
    if (pathname.startsWith('/dashboard/farmers') && role !== 'farmer') {
      return NextResponse.redirect(new URL(`/dashboard/${role}s`, request.url));
    }
    if (pathname.startsWith('/dashboard/students') && role !== 'student') {
      return NextResponse.redirect(new URL(`/dashboard/${role}s`, request.url));
    }
    if (pathname.startsWith('/dashboard/buyers') && role !== 'buyer') {
      return NextResponse.redirect(new URL(`/dashboard/${role}s`, request.url));
    }
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${role}s`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
