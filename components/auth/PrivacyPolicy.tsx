'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Bell } from 'lucide-react';

export default function PrivacyPolicy() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-500 to-emerald-500 mb-6 shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Last Updated: November 17, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl">
          {/* Introduction */}
          <div>
            <p className="text-slate-400 leading-relaxed">
              At OneClick, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our services.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-orange-500" />
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-slate-400">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Name, email address, phone number</li>
                  <li>Aadhaar and PAN details (for agent verification)</li>
                  <li>Bank account information (for commission payouts)</li>
                  <li>Location data (with your consent)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Usage Information</h3>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on platform</li>
                  <li>Transaction history and commission earnings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-orange-500" />
              2. How We Use Your Information
            </h2>
            <ul className="space-y-2 ml-6 text-slate-400 list-disc">
              <li>To create and manage your agent account</li>
              <li>To process commission payments</li>
              <li>To verify your identity and prevent fraud</li>
              <li>To send you important updates and notifications</li>
              <li>To improve our services and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-orange-500" />
              3. Data Security
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="space-y-2 ml-6 text-slate-400 list-disc">
              <li>256-bit SSL encryption for all data transmission</li>
              <li>Secure database storage with regular backups</li>
              <li>Two-factor authentication for account access</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Limited employee access to personal data</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Bell className="w-6 h-6 text-orange-500" />
              4. Information Sharing
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We do not sell or rent your personal information. We may share your data with:
            </p>
            <ul className="space-y-2 ml-6 text-slate-400 list-disc">
              <li>Service providers who assist in our operations</li>
              <li>Payment processors for commission disbursements</li>
              <li>Law enforcement when required by law</li>
              <li>Third parties with your explicit consent</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-green-500 to-emerald-500 rounded-full" />
              5. Your Rights
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">You have the right to:</p>
            <ul className="space-y-2 ml-6 text-slate-400 list-disc">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-green-500 to-emerald-500 rounded-full" />
              6. Cookies and Tracking
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We use cookies and similar tracking technologies to improve your experience. You can control cookie
              settings through your browser preferences. Note that disabling cookies may affect functionality.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-green-500 to-emerald-500 rounded-full" />
              7. Children's Privacy
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect
              information from children. If you believe a child has provided us with personal information, please
              contact us immediately.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-green-500 to-emerald-500 rounded-full" />
              8. Changes to Privacy Policy
            </h2>
            <p className="text-slate-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes via
              email or through a prominent notice on our platform.
            </p>
          </div>

          {/* Contact */}
          <div className="pt-6 border-t border-slate-800">
            <p className="text-slate-400">
              For privacy-related inquiries, please contact us at{' '}
              <Link href="/contact-us" className="text-orange-500 hover:text-orange-400 underline">
                contact page
              </Link>{' '}
              or email{' '}
              <a href="mailto:privacy@oneclick.com" className="text-orange-500 hover:text-orange-400 underline">
                privacy@oneclick.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
