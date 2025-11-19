import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Public pages that authenticated users should NOT access
  const PUBLIC_PAGES = ['/', '/terms-of-service', '/privacy-policy', '/contact-us'];
  const AUTH_PAGES = ['/auth/forgot-password', '/auth/reset-password'];

  const path = request.nextUrl.pathname;

  // If user is authenticated
  if (isAuthenticated) {
    // Redirect away from public pages and auth pages to dashboard
    if (PUBLIC_PAGES.includes(path) || AUTH_PAGES.includes(path)) {
      const url = request.nextUrl.clone();
      url.pathname = '/agent/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // If user is NOT authenticated
  if (!isAuthenticated) {
    // Protect /agent/* routes
    if (path.startsWith('/agent')) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('next', path);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
