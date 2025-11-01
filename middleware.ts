import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TODO: SECURITY WARNING - Replace with environment variables in production
// For production, use: process.env.ADMIN_USERNAME and process.env.ADMIN_PASSWORD
// In production, set these in your hosting platform (Vercel, Netlify, etc.)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'men'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'well'

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return false
  }

  try {
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Only protect /api/posts routes with Basic Auth
  // /admin is now handled client-side with localStorage
  if (request.nextUrl.pathname.startsWith('/api/posts')) {
    const isAuthenticated = checkAuth(request)
    
    if (!isAuthenticated) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/posts/:path*'],
}

