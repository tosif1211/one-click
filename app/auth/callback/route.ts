import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/agent/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors (user cancelled, etc.)
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    const errorUrl = new URL('/auth/auth-code-error', origin);
    errorUrl.searchParams.set('error', error);
    if (errorDescription) {
      errorUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const supabase = await createClient();

    try {
      // Exchange code for session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        throw exchangeError;
      }

      if (!data.session || !data.user) {
        throw new Error('No session or user returned from code exchange');
      }

      // Create or update agent profile
      try {
        const { data: existingAgent } = await supabase.from('agents').select('id').eq('user_id', data.user.id).single();

        if (!existingAgent) {
          const { error: profileError } = await supabase.from('agents').insert({
            user_id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email!,
            phone: data.user.user_metadata?.phone || '',
            status: 'pending',
          });

          if (profileError && profileError.code !== '23505') {
            console.error('Profile creation error:', profileError);
            // Don't fail the auth flow for profile errors
          }
        }
      } catch (profileError) {
        console.error('Profile setup error:', profileError);
        // Continue with auth flow even if profile setup fails
      }

      // Successful authentication - redirect to intended destination
      const redirectUrl = new URL(next, origin);

      // Ensure we don't redirect to auth pages after successful login
      const authPages = ['/'];
      if (authPages.some((page) => redirectUrl.pathname.startsWith(page))) {
        redirectUrl.pathname = '/agent/dashboard';
      }

      return NextResponse.redirect(redirectUrl);
    } catch (error: any) {
      console.error('Auth callback error:', error);

      // Redirect to error page with details
      const errorUrl = new URL('/auth/auth-code-error', origin);
      errorUrl.searchParams.set('error', 'server_error');
      errorUrl.searchParams.set('error_description', error.message || 'Authentication failed. Please try again.');
      return NextResponse.redirect(errorUrl);
    }
  }

  // No code parameter - invalid callback
  console.error('No code parameter in auth callback');
  const errorUrl = new URL('/auth/auth-code-error', origin);
  errorUrl.searchParams.set('error', 'invalid_request');
  errorUrl.searchParams.set('error_description', 'Missing authorization code.');
  return NextResponse.redirect(errorUrl);
}
