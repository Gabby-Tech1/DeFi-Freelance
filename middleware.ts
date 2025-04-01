import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes
const protectedRoutes = ['/dashboard', '/messages', '/escrow', '/contracts']

export function middleware(request: NextRequest) {
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Get auth session from headers/cookies
    const hasSession = request.cookies.get('icp_session') || request.cookies.get('wallet_session')

    if (!hasSession) {
      // Redirect to auth page if not authenticated
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/messages/:path*', '/escrow/:path*', '/contracts/:path*']
}
