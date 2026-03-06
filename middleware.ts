import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Define protected routes and their required plans
    const protectedRoutes: Record<string, string> = {
      '/dashboard': 'free',
      '/insights': 'free',
    };

    // Check if the current path requires a specific plan
    const requiredPlan = Object.entries(protectedRoutes).find(([route]) => 
      path.startsWith(route)
    )?.[1];

    if (requiredPlan && token) {
      const userPlan = token.subscriptionPlan || 'free';
      const userStatus = token.subscriptionStatus || 'inactive';

      // Define plan hierarchy
      const planHierarchy = {
        'free': 0,
        'basic': 1,
        'pro': 2,
      };

      const userLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
      const requiredLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0;

      // Check if user has access
      if (userLevel < requiredLevel || userStatus !== 'active') {
        // Redirect to upgrade page
        const upgradeUrl = new URL('/pricing', req.url);
        upgradeUrl.searchParams.set('redirect', path);
        upgradeUrl.searchParams.set('requiredPlan', requiredPlan);
        
        return NextResponse.redirect(upgradeUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/insights/:path*',
    '/api/user/:path*',
    '/api/goals/:path*',
    '/api/analytics/:path*',
  ],
};