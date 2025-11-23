'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Clock, RefreshCw, Loader2, ArrowLeft } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/^\S*$/, 'Password cannot contain spaces'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const urlError = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');

    if (urlError) {
      if (errorCode === 'otp_expired') {
        setError('Your reset link has expired. Reset links are only valid for 1 hour.');
        setErrorType('expired');
      } else if (urlError === 'access_denied') {
        setError('The reset link is invalid or has been used already.');
        setErrorType('invalid');
      } else {
        setError(`Reset failed: ${errorDescription || urlError}`);
        setErrorType('generic');
      }
      setIsValidating(false);
      return;
    }

    const code = searchParams.get('code');

    // Only check if code exists, don't validate type here
    if (!code) {
      setError('Invalid reset link. Please request a new password reset.');
      setErrorType('missing_params');
    }

    setIsValidating(false);
  }, [searchParams]);

  // Prevent spaces in password fields
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setValue('password', value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setValue('confirmPassword', value);
  };

  const onSubmit = async (data: ResetPasswordForm) => {
    const code = searchParams.get('code');

    if (!code) {
      toast.error('Invalid reset link');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: data.password,
          code: code,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      setSuccess(true);
      toast.success('Password reset successfully!');

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-slate-900/50 border-2 border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 border-2 border-red-500 rounded-full mx-auto mb-6">
              {errorType === 'expired' ? (
                <Clock className="w-8 h-8 text-red-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-500" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">
              {errorType === 'expired' ? 'Reset Link Expired' : 'Invalid Reset Link'}
            </h1>
            <p className="text-slate-400 text-center text-sm mb-6">{error}</p>

            {errorType === 'expired' && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Why did my link expire?</h4>
                    <p className="text-xs text-slate-400">Reset links expire after 1 hour for security reasons.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="/auth/forgot-password"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Request New Reset Link
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold border-2 border-slate-700 text-white hover:border-slate-600 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-slate-900/50 border-2 border-slate-800 rounded-3xl p-12 text-center backdrop-blur-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold mb-2">Password Reset!</h1>
            <p className="text-slate-400 mb-8">Your password has been updated successfully</p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-linear-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
              Continue to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-slate-900/50 border-2 border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-pink-500 mx-auto mb-6 shadow-xl">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
          <p className="text-slate-400 text-center text-sm mb-8">Create a new password for your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  onChange={handlePasswordChange}
                  placeholder="Min 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                    errors.password ? 'border-red-500' : 'border-slate-800 focus:border-orange-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-800 focus:border-orange-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative px-6 py-3 rounded-xl font-semibold overflow-hidden shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500" />
              <div className="relative flex items-center justify-center gap-2 text-white">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
