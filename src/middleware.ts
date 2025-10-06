import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Helper function to get dashboard URL based on role
  const getDashboardUrl = (role: string) => {
    switch (role) {
      case 'farmer':
        return '/dashboard/farmers';
      case 'student':
        return '/dashboard/students';
      case 'learner':
        return '/dashboard/learners';
      case 'buyer':
        return '/dashboard/buyers';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/buyers';
    }
  };

  // Allow access to auth pages if not authenticated
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token) {
      // Redirect to appropriate dashboard if already authenticated
      return NextResponse.redirect(new URL(getDashboardUrl(token.role as string), request.url));
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
      return NextResponse.redirect(new URL(getDashboardUrl(role), request.url));
    }

    // Check if user is accessing their correct role dashboard
    const isAccessingCorrectDashboard = 
      (pathname.startsWith('/dashboard/farmers') && role === 'farmer') ||
      (pathname.startsWith('/dashboard/students') && role === 'student') ||
      (pathname.startsWith('/dashboard/learners') && role === 'learner') ||
      (pathname.startsWith('/dashboard/buyers') && role === 'buyer') ||
      (pathname.startsWith('/dashboard/admin') && role === 'admin');

    if (!isAccessingCorrectDashboard) {
      // Redirect to correct dashboard for user's role
      return NextResponse.redirect(new URL(getDashboardUrl(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
