// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const supabase = await createClient();

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const redirectUrl = `${origin}/reset-password`;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message || 'Failed to send reset email' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Password reset email sent successfully',
      success: true,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
