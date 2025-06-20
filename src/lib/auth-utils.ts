import { User as FirebaseUser } from 'firebase/auth';

import { auth } from './firebase';

/**
 * Client-side authentication utilities
 */

export interface AuthSession {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  token: string | null;
}

/**
 * Set authentication cookie for server-side detection
 * This should be called after successful authentication on the client side
 */
export function setAuthCookie(token: string) {
  if (typeof window !== 'undefined') {
    // Set cookie that can be read by middleware
    document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; samesite=strict`;
  }
}

/**
 * Clear authentication cookie
 * This should be called after sign out
 */
export function clearAuthCookie() {
  if (typeof window !== 'undefined') {
    document.cookie =
      'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

/**
 * Client-side helper to sync auth state with cookies
 * This ensures middleware can detect authentication status
 */
export function syncAuthWithCookies() {
  if (typeof window === 'undefined') return;

  const user = auth.currentUser;

  if (user) {
    // Get the ID token and set it as a cookie
    user
      .getIdToken()
      .then(token => {
        setAuthCookie(token);
      })
      .catch(error => {
        console.error('Error getting ID token:', error);
      });
  } else {
    clearAuthCookie();
  }
}

/**
 * Check if a route should be protected based on pathname
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/communities',
    '/diary',
    '/agenda',
  ];

  return protectedRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if a route requires onboarding completion
 */
export function requiresOnboarding(pathname: string): boolean {
  const onboardingRequiredRoutes = [
    '/dashboard',
    '/communities',
    '/diary',
    '/agenda',
  ];

  return onboardingRequiredRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if a route is public (doesn't require authentication)
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ['/', '/login', '/signup', '/reset-password'];

  return publicRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if a route is an auth route (requires auth but not onboarding)
 */
export function isAuthRoute(pathname: string): boolean {
  const authRoutes = ['/onboarding'];

  return authRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );
}
