import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if it's an admin, login, or onboarding route (could be prefixed by locale)
  const isAdminRoute = /^\/(en|ar|fr|es)\/admin/.test(pathname) || pathname.startsWith('/admin');
  const isLoginRoute = /^\/(en|ar|fr|es)\/login/.test(pathname) || pathname.startsWith('/login');
  const isOnboardingRoute = /^\/(en|ar|fr|es)\/onboarding/.test(pathname) || pathname.startsWith('/onboarding');
  
  let token = null;
  const isProtectedRoute = isAdminRoute || isLoginRoute || isOnboardingRoute;

  if (isProtectedRoute) {
    // Try both secure and insecure cookie names in case Vercel NEXTAUTH_URL is misconfigured
    token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, cookieName: '__Secure-next-auth.session-token' });
    if (!token) {
      token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, cookieName: 'next-auth.session-token' });
    }
    // Fallback to default NextAuth behavior
    if (!token) {
      token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    }
  }  
  const localeMatch = pathname.match(/^\/(en|ar|fr|es)/);
  const localePrefix = localeMatch ? localeMatch[0] : `/${routing.defaultLocale}`;

  // Protect Admin routes
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
    }
    if (token.role !== 'SELLER' && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`${localePrefix}/onboarding`, request.url)); // Redirect basic users to onboarding
    }
  }

  // Protect Onboarding routes
  if (isOnboardingRoute) {
    if (!token) {
      return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
    }
    if (token.role === 'SELLER' || token.role === 'ADMIN') {
      return NextResponse.redirect(new URL(`${localePrefix}/admin`, request.url)); // Redirect sellers away from onboarding
    }
  }

  // Redirect authenticated users away from the login page
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL(`${localePrefix}/`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they contain a dot, e.g. `favicon.ico`
  // - … if they start with `_next`
  // - … if they start with `api`
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
