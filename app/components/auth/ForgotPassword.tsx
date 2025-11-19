'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { resetPassword } from '@/lib/auth';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);

    try {
      const result = await resetPassword(data.email);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setSentEmail(data.email);
      setEmailSent(true);
      toast.success('Password reset email sent!');
      reset();
    } catch (error: any) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (emailSent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-slate-900/50 border-2 border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-2">Check Your Email</h1>
            <p className="text-slate-400 text-center text-sm mb-6">
              We've sent a password reset link to your email address
            </p>

            {/* Email Display */}
            <div className="text-center mb-6">
              <p className="text-sm text-slate-400 mb-2">We sent a reset link to:</p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <p className="font-semibold text-white break-all">{sentEmail}</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Next Steps:
              </h4>
              <ol className="text-sm text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-semibold">1.</span>
                  <span>Check your email inbox</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-semibold">2.</span>
                  <span>Click the reset password link</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-semibold">3.</span>
                  <span>Create a new password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-semibold">4.</span>
                  <span>Sign in with your new password</span>
                </li>
              </ol>
            </div>

            {/* Resend */}
            <div className="text-center mb-6">
              <p className="text-sm text-slate-500 mb-2">Didn't receive the email?</p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setSentEmail('');
                }}
                className="text-sm text-orange-500 hover:text-orange-400 font-semibold underline transition-colors"
              >
                Try again
              </button>
            </div>

            {/* Back Button */}
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
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-slate-900/50 border-2 border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-pink-500 mx-auto mb-6 shadow-xl">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
          <p className="text-slate-400 text-center text-sm mb-8">
            Enter your email and we'll send you a link to reset your password
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  {...register('email')}
                  disabled={loading}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-orange-500/50'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative px-6 py-3 rounded-xl font-semibold overflow-hidden shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 transition-transform duration-200 hover:scale-105" />
              <div className="relative flex items-center justify-center gap-2 text-white">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </div>
            </button>

            {/* Back Link */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
  