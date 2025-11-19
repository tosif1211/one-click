'use server';

import { createClient } from '@/lib/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signInWithEmail({ email, password }: { email: string; password: string }) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Email login error:', error);

      // Handle specific error types
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password. Please try again.' };
      }

      if (error.message.includes('Email not confirmed')) {
        return { error: 'Please check your email and click the verification link.' };
      }

      if (error.message.includes('Too many requests')) {
        return { error: 'Too many login attempts. Please try again in a few minutes.' };
      }

      return { error: error.message };
    }

    if (!data.session) {
      return { error: 'Login failed. Please try again.' };
    }

    // Check if agent profile exists
    const { data: existingAgent } = await supabase
      .from('agents')
      .select('id')
      .eq('user_id', data.session.user.id)
      .single();

    // Create agent profile if doesn't exist
    if (!existingAgent) {
      try {
        await supabase.from('agents').insert({
          user_id: data.session.user.id,
          name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || 'User',
          email: data.session.user.email!,
          phone: data.session.user.user_metadata?.phone || '',
          status: 'pending',
        });
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    revalidatePath('/', 'layout');
    return { success: 'Login successful' };
  } catch (error: any) {
    console.error('Server login error:', error);
    return { error: 'Authentication failed. Please try again.' };
  }
}

export async function signUpWithEmail({
  email,
  password,
  name,
  phone,
}: {
  email: string;
  password: string;
  name: string;
  phone: string;
}) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      },
    });

    if (error) {
      console.error('Signup error:', error);

      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        return { error: 'An account with this email already exists. Please try logging in.' };
      }

      if (error.message.includes('Password should be at least')) {
        return { error: 'Password is too weak. Please choose a stronger password.' };
      }

      return { error: error.message };
    }

    // Check if user already exists (email confirmation disabled scenario)
    if (data?.user?.identities?.length === 0) {
      return { error: 'An account with this email already exists. Please try logging in.' };
    }

    return { success: 'Please check your email to verify your account' };
  } catch (error: any) {
    console.error('Server signup error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}
export async function resetPassword(email: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return { error: 'Failed to send reset email. Please try again.' };
    }

    return { success: 'Reset email sent' };
  } catch (error: any) {
    console.error('Server reset password error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();

    await supabase.auth.signOut({ scope: 'local' });

    revalidatePath('/', 'layout');
  } catch (error: any) {
    if (!error.digest?.includes('NEXT_REDIRECT')) {
      console.error('Sign out error:', error);
    }
  }

  redirect('/');
}
