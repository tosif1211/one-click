// components/landing/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Download } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="headernav"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] md:w-[90%] transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 border border-slate-800 shadow-lg shadow-orange-500/5'
          : 'bg-black/70 border border-transparent'
      } rounded-2xl backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/images/logo.png"
            alt="OneClick Logo"
            width={42}
            height={42}
            className="rounded-xl"
          />
          <div className="flex flex-col items-start">
            <span className="text-xl sm:text-2xl font-bold text-white group-hover:bg-linear-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              OneClick
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 -mt-1 group-hover:text-slate-300 transition-colors duration-300">
              One Lifestyle
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300 group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-500 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Download Button - Desktop */}
        <div className="hidden md:block">
          <Link
            href="/download"
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-orange-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Download Now
          </Link>
        </div>

        {/* Mobile Buttons (Download Icon + Menu) */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Download Icon - Quick CTA for mobile */}
          <Link
            href="/download"
            className="p-2.5 rounded-lg bg-linear-to-r from-orange-500 to-pink-500 hover:opacity-90 transition-all duration-300"
            aria-label="Download app"
          >
            <Download className="w-5 h-5 text-white" />
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-black/90 backdrop-blur-xl rounded-b-2xl px-6 pb-6 pt-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-orange-500 transition-colors duration-300 py-1"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/download"
              className="mt-3 flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Download className="w-4 h-4" />
              Download Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
