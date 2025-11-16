'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-pink-500 mb-6 shadow-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Last Updated: November 17, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl">
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-orange-500 to-pink-500 rounded-full" />
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-400 leading-relaxed">
              By accessing and using OneClick's services, you accept and agree to be bound by the terms and provision of
              this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-orange-500 to-pink-500 rounded-full" />
              2. Agent Registration
            </h2>
            <div className="space-y-4 text-slate-400">
              <p className="leading-relaxed">As a OneClick Agent, you agree to:</p>
              <ul className="space-y-2 ml-6">
                {[
                  'Provide accurate and complete registration information',
                  'Maintain the security of your account credentials',
                  'Pay the ₹500 security deposit (refundable after 6 months)',
                  'Pass the mandatory 30-question certification exam',
                  'Comply with all applicable laws and regulations',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-orange-500 to-pink-500 rounded-full" />
              3. Commission Structure
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">OneClick operates on a multi-level commission system:</p>
            <ul className="space-y-2 ml-6 text-slate-400">
              {[
                'Level 1 (Direct Referrals): 60% commission',
                'Level 2 (Downline): 20% commission',
                'Level 3 (Sub-downline): 10% commission',
                'Performance bonuses for top 10 agents quarterly',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-orange-500 to-pink-500 rounded-full" />
              4. Prohibited Activities
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">Agents are strictly prohibited from:</p>
            <ul className="space-y-2 ml-6 text-slate-400">
              {[
                'Sharing account credentials with third parties',
                'Engaging in fraudulent or misleading practices',
                'Spamming or harassing potential users',
                'Manipulating commission structures',
                'Using automated bots or scripts',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-orange-500 to-pink-500 rounded-full" />
              5. Termination
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We reserve the right to terminate or suspend your agent account immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon
              termination, your right to use the service will immediately cease.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-orange-500 to-pink-500 rounded-full" />
              6. Changes to Terms
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try
              to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </div>

          {/* Contact */}
          <div className="pt-6 border-t border-slate-800">
            <p className="text-slate-400">
              If you have any questions about these Terms, please contact us at{' '}
              <Link href="/contact-us" className="text-orange-500 hover:text-orange-400 underline">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
