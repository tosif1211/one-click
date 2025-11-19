'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const getErrorMessage = (error: string | null, description: string | null) => {
    switch (error) {
      case 'access_denied':
        return 'Authentication was cancelled. You can try signing in again.';
      case 'server_error':
        return description || 'A server error occurred during authentication.';
      case 'invalid_request':
        return description || 'Invalid authentication request.';
      case 'temporarily_unavailable':
        return 'Authentication service is temporarily unavailable. Please try again later.';
      default:
        return description || 'An unexpected error occurred during authentication.';
    }
  };

  const errorMessage = getErrorMessage(error, errorDescription);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-slate-900/50 border-2 border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          {/* Error Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 border-2 border-red-500 rounded-full mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2 text-white">Authentication Error</h1>

          {/* Error Message */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">{errorMessage}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Link>

            <Link
              href="/contact-us"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold border-2 border-slate-700 text-white hover:border-slate-600 transition-all"
            >
              Contact Support
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Need help?{' '}
            <Link href="/contact-us" className="text-orange-500 hover:text-orange-400 underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
