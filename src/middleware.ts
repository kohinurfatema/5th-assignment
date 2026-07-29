import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/auth/login', '/auth/register', '/properties'];
const TENANT_PATHS = ['/dashboard/tenant'];
const LANDLORD_PATHS = ['/dashboard/landlord'];
const ADMIN_PATHS = ['/dashboard/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/properties'));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token) {
    if (pathname.startsWith('/auth')) {
      const redirect = role === 'ADMIN' ? '/dashboard/admin'
        : role === 'LANDLORD' ? '/dashboard/landlord'
        : '/dashboard/tenant';
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    if (TENANT_PATHS.some((p) => pathname.startsWith(p)) && role !== 'TENANT') {
      return NextResponse.redirect(new URL('/dashboard/' + role?.toLowerCase(), request.url));
    }
    if (LANDLORD_PATHS.some((p) => pathname.startsWith(p)) && role !== 'LANDLORD') {
      return NextResponse.redirect(new URL('/dashboard/' + role?.toLowerCase(), request.url));
    }
    if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/' + role?.toLowerCase(), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
