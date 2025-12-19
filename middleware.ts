import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

    // If user is not authenticated and trying to access protected routes
    if (!isAuth && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard/hires', req.url));
    }

    // Role-based access control for specific routes
    if (isAuth && req.nextUrl.pathname.startsWith('/dashboard')) {
      const userRole = token.role as string;

      // Admin only routes
      if (req.nextUrl.pathname.includes('/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/hires', req.url));
      }

      // HR only routes for creating hires
      if (req.nextUrl.pathname.includes('/hires/new') && !['ADMIN', 'HR'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard/hires', req.url));
      }

      // Department users can only see their department's tasks
      if (req.nextUrl.pathname.includes('/tasks') && userRole === 'DEPARTMENT') {
        // Additional department filtering can be implemented in the page component
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages and API auth routes
        if (req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register') ||
            req.nextUrl.pathname.startsWith('/api/auth')) {
          return true;
        }

        // For dashboard routes, require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }

        // Allow access to public routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/api/auth/:path*'
  ]
};
