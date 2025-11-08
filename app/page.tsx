// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  Utensils,
  ShoppingBag,
  Hotel,
  Plane,
  CreditCard,
  Wallet,
  Home,
  Zap,
  Star,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Download,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Play,
} from 'lucide-react';

export default function LandingPage() {
  const [activeService, setActiveService] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % 8);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setStatsVisible(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: Car,
      name: 'Rides',
      description: 'Book bike, auto & car rides instantly',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/50',
      href: '/rides',
    },
    {
      icon: Utensils,
      name: 'Food',
      description: 'Order from 10,000+ restaurants',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/50',
      href: '/food',
    },
    {
      icon: ShoppingBag,
      name: 'Shopping',
      description: 'Shop from millions of products',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/50',
      href: '/shop',
    },
    {
      icon: Hotel,
      name: 'Hotels',
      description: 'Book hotels & stays nationwide',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/50',
      href: '/hotels',
    },
    {
      icon: Plane,
      name: 'Travel',
      description: 'Flight, train & bus tickets',
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/50',
      href: '/travel',
    },
    {
      icon: CreditCard,
      name: 'Bills',
      description: 'Pay all your bills & recharge',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/50',
      href: '/bills',
    },
    {
      icon: Wallet,
      name: 'Payments',
      description: 'UPI, wallet & money transfer',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/50',
      href: '/pay',
    },
    {
      icon: Home,
      name: 'Services',
      description: 'Home cleaning, repairs & more',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/50',
      href: '/services',
    },
  ];

  const stats = [
    { value: '10M+', label: 'Active Users' },
    { value: '100+', label: 'Cities' },
    { value: '50K+', label: 'Partners' },
    { value: '4.8★', label: 'App Rating' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Book anything in under 60 seconds',
    },
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Bank-grade security for all transactions',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always here when you need us',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Guaranteed lowest prices with cashback',
    },
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Business Owner',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'OneClick has completely changed how I manage my daily tasks. From ordering lunch to booking cabs, everything is just one click away!',
    },
    {
      name: 'Priya Patel',
      role: 'Student',
      image: 'https://i.pravatar.cc/150?img=45',
      rating: 5,
      text: "Best super app in India! I use it for food delivery, shopping, and paying bills. Can't imagine life without it now.",
    },
    {
      name: 'Amit Singh',
      role: 'Software Engineer',
      image: 'https://i.pravatar.cc/150?img=33',
      rating: 5,
      text: 'The convenience of having everything in one app is unmatched. Plus, the cashback offers are amazing!',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              India's #1 Super App
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-linear-to-r from-white via-white to-slate-300 bg-clip-text text-transparent">
              Everything You Need,
            </span>
            <br />
            <span className="bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Just One Click Away
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Book rides, order food, shop online, pay bills & more.{' '}
            <span className="text-white font-semibold">unified into one intelligent, beautiful experience</span>{' '}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/download" className="group relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-pink-500 transition-transform group-hover:scale-105" />
              <div className="relative flex items-center gap-3">
                <Download className="w-5 h-5" />
                Download Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <button className="group px-8 py-4 rounded-xl font-bold text-lg border-2 border-slate-700 hover:border-slate-600 transition-all flex items-center gap-3">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                8 Services,{' '}
              </span>
              <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Endless Possibilities
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From daily commutes to dream vacations, we've got everything covered
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={index}
                  href={service.href}
                  className={`group relative p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    activeService === index
                      ? `${service.bgColor} ${service.borderColor} shadow-lg shadow-${service.color}/20`
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-linear-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />

                  {/* Content */}
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-xl bg-linear-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {service.name}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4">{service.description}</p>

                    <div className="flex items-center text-sm font-semibold text-slate-500 group-hover:text-white transition-colors">
                      Explore
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Why Choose{' '}
              </span>
              <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                OneClick?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">Loved by </span>
              <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Millions
              </span>
            </h2>
            <p className="text-xl text-slate-400">See what our users have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>

                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="about" className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 md:p-16 rounded-3xl bg-linear-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 border border-orange-500/30 backdrop-blur-sm">
            <Zap className="w-16 h-16 text-orange-500 mx-auto mb-6" />

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience the{' '}
              <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Super App Revolution?
              </span>
            </h2>

            <p className="text-xl text-slate-300 mb-8">
              Join 10 million+ users who are already enjoying the convenience
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/download"
                className="group px-8 py-4 rounded-xl font-bold text-lg bg-linear-to-r from-orange-500 to-pink-500 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download for Android
              </Link>

              <Link
                href="/download/ios"
                className="group px-8 py-4 rounded-xl font-bold text-lg border-2 border-slate-700 hover:border-slate-600 transition-all flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download for iOS
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                100% Secure
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                No Hidden Charges
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
