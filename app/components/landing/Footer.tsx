// components/landing/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-slate-800 z-10">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Left Column - Brand */}
          <div className="flex flex-col">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-6 sm:mb-8 group w-fit">
              <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                <img src="/images/logo.png" alt="OneClick Logo" className="w-[50px] sm:w-[60px] h-auto rounded-xl" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl sm:text-3xl font-bold text-white group-hover:bg-linear-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  OneClick
                </span>
                <span className="text-xs sm:text-sm text-slate-400 -mt-1 group-hover:text-slate-300 transition-colors duration-300">
                  One Lifestyle
                </span>
              </div>
            </Link>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 mb-3 max-w-md leading-relaxed">
              <span className="text-white font-bold">Your all-in-one platform</span> for Rides, Food, Shopping, Hotels,
              Travel, Bills, Payments, and more.
              <span className="text-orange-500 font-semibold"> Everything you need — just one click away.</span>
            </p>
          </div>

          {/* Right Column - Tagline & Social */}
          <div className="flex flex-col justify-between">
            {/* Tagline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-6 md:mb-0 md:text-right">
              Experience everything in one place —
              <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {' '}
                right now.
              </span>
            </h2>

            {/* Social Media */}
            <div className="flex justify-start md:justify-end gap-3 mt-4 sm:mt-12">
              {[
                { name: 'Facebook', href: 'https://facebook.com/oneclick', Icon: Facebook },
                { name: 'Twitter', href: 'https://twitter.com/oneclick', Icon: Twitter },
                { name: 'Instagram', href: 'https://instagram.com/oneclick', Icon: Instagram },
                { name: 'LinkedIn', href: 'https://linkedin.com/company/oneclick', Icon: Linkedin },
                { name: 'YouTube', href: 'https://youtube.com/@oneclick', Icon: Youtube },
              ].map(({ name, href, Icon }) => (
                <Link
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="relative p-2.5 sm:p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition-all duration-300 group border border-slate-800 hover:border-orange-500/50"
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 group-hover:text-orange-500 transition-all duration-300 group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 md:my-8 border-slate-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          {/* Footer Links */}
          <div className="flex flex-wrap flex-col sm:flex-row gap-2 sm:gap-6 order-2 md:order-1">
            {[
              { name: 'Terms of Service', href: '/terms' },
              { name: 'Privacy Policy', href: '/privacy' },
              { name: 'Contact Us', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white text-base sm:text-lg hover:underline hover:text-orange-500 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-white text-sm sm:text-base order-1 md:order-2">
            Copyright © {currentYear} OneClick, All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}