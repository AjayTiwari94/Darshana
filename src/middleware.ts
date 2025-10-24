import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/',
  '/dashboard',
  '/profile',
  '/tickets',
  '/admin',
  '/settings',
  '/monuments',
  '/stories',
  '/virtual-visits',
  '/treasure-hunt',
  '/ar-vr',
  '/education',
  '/travel',
  '/group-tours',
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/about',
  '/contact',
  '/help',
  '/faq',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) || 
                         pathname.startsWith('/_next') || 
                         pathname.startsWith('/api') ||
                         pathname.includes('.')

  // If it's a public route or static file, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // If trying to access a protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}

