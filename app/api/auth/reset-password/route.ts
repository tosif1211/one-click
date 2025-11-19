// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, code } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required', success: false }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long', success: false },
        { status: 400 }
      );
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return NextResponse.json(
        {
          error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
          success: false,
        },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        {
          error: 'Invalid reset request. Missing verification code.',
          success: false,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    interface VerificationMethod {
      name: string;
      execute: () => Promise<any>;
    }

    const verificationMethods: VerificationMethod[] = [
      {
        name: 'exchangeCodeForSession',
        execute: () => supabase.auth.exchangeCodeForSession(code),
      },
      {
        name: 'verifyOtp_token_hash',
        execute: () =>
          supabase.auth.verifyOtp({
            token_hash: code,
            type: 'recovery',
          }),
      },
    ];

    let verifyResult: { data: any; error: any } = { data: null, error: null };
    let methodUsed = '';

    for (const method of verificationMethods) {
      try {
        const result = await method.execute();

        if (!result.error && (result.data?.user || result.data?.session?.user)) {
          verifyResult = result;
          methodUsed = method.name;
          break;
        }
      } catch (err) {
        continue;
      }
    }

    if (verifyResult.error || !verifyResult.data) {
      const errorMessage = verifyResult.error?.message?.toLowerCase() || '';

      if (errorMessage.includes('expired') || errorMessage.includes('token has expired')) {
        return NextResponse.json(
          {
            error: 'Your reset link has expired. Reset links are valid for 1 hour. Please request a new one.',
            errorType: 'expired',
            success: false,
          },
          { status: 400 }
        );
      }

      if (errorMessage.includes('already been used') || errorMessage.includes('invalid')) {
        return NextResponse.json(
          {
            error: 'This reset link is invalid or has already been used. Please request a new password reset.',
            errorType: 'used',
            success: false,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'Invalid or expired reset code. Please request a new password reset.',
          errorType: 'invalid',
          success: false,
        },
        { status: 400 }
      );
    }

    const user = verifyResult.data.user || verifyResult.data.session?.user;

    if (!user) {
      return NextResponse.json(
        {
          error: 'Failed to verify reset code. Please request a new password reset.',
          success: false,
        },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      return NextResponse.json(
        {
          error: updateError.message || 'Failed to update password',
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Password updated successfully',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
