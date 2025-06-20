import { NextRequest, NextResponse } from 'next/server';
import {
  isAuthRoute,
  isProtectedRoute,
  isPublicRoute,
} from './src/lib/auth-utils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Get authentication token from cookies (Firebase sets this automatically)
  const authToken =
    request.cookies.get('__session') ||
    request.cookies.get('firebase-auth-token');

  // For development/testing, we'll also check for a custom auth header
  const authHeader = request.headers.get('authorization');

  // Simple check for authentication (in a real app, you'd verify the JWT)
  const isAuthenticated = !!(authToken?.value || authHeader);

  // Use utility functions to check route types
  const isPublic = isPublicRoute(pathname);
  const isAuth = isAuthRoute(pathname);
  const isProtected = isProtectedRoute(pathname);

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Allow access to public routes
    if (isPublic) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    console.log(
      `🔒 Redirecting unauthenticated user from ${pathname} to /login`
    );
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname); // Save intended destination
    return NextResponse.redirect(url);
  }

  // Handle authenticated users
  if (isAuthenticated) {
    // Allow access to auth routes (like onboarding)
    if (isAuth) {
      return NextResponse.next();
    }

    // For protected routes, we need to check onboarding status
    if (isProtected) {
      // In a real implementation, you'd decode the JWT to check onboarding status
      // For now, we'll let the client-side AuthGuard handle this validation
      // The middleware focuses on authentication, while client-side handles onboarding
      return NextResponse.next();
    }

    // Allow access to public routes for authenticated users
    if (isPublic) {
      return NextResponse.next();
    }
  }

  // Default: allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
