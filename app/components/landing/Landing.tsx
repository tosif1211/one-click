'use client';

import { useState, useEffect } from 'react';
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
  Play,
  IndianRupee,
  Target,
  Award,
  Briefcase,
  Gift,
  Dumbbell,
  Rocket,
  Stethoscope,
  Film,
  ArrowRight,
} from 'lucide-react';

export default function Landing() {
  const [activeService, setActiveService] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % 10);
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
      icon: Dumbbell,
      name: 'GYM',
      description: 'Book gym memberships & fitness classes',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/50',
    },
    {
      icon: Utensils,
      name: 'Restaurant',
      description: 'Reserve tables at top restaurants',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/50',
    },
    {
      icon: Car,
      name: 'Rides',
      description: 'Book bike, auto & car rides instantly',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/50',
    },
    {
      icon: Utensils,
      name: 'Food',
      description: 'Order from 10,000+ restaurants',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/50',
    },
    {
      icon: ShoppingBag,
      name: 'Shopping',
      description: 'Shop from millions of products',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/50',
    },
    {
      icon: Hotel,
      name: 'Hotels',
      description: 'Book hotels & stays nationwide',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/50',
    },
    {
      icon: Plane,
      name: 'Travel',
      description: 'Flight, train & bus tickets',
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/50',
    },
    {
      icon: CreditCard,
      name: 'Bills',
      description: 'Pay all your bills & recharge',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/50',
    },
    {
      icon: Wallet,
      name: 'Payments',
      description: 'UPI, wallet & money transfer',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/50',
    },
    {
      icon: Home,
      name: 'Services',
      description: 'Home cleaning, repairs & more',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/50',
    },
    {
      icon: Stethoscope,
      name: 'Health',
      description: 'Medicines, lab tests & doctor appointments',
      color: 'from-teal-500 to-emerald-500',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/50',
    },
    {
      icon: Film,
      name: 'Entertainment',
      description: 'Movies, events & OTT subscriptions',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/50',
    },
  ];

  const stats = [
    { value: '10M+', label: 'Active Users', icon: Users },
    { value: '100+', label: 'Cities', icon: Target },
    { value: '50K+', label: 'Partners', icon: Briefcase },
    { value: '4.8★', label: 'App Rating', icon: Star },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Book anything in under 60 seconds',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Bank-grade security for all transactions',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always here when you need us',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Guaranteed lowest prices with cashback',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Business Owner',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'OneClick has completely changed how I manage my daily tasks. From ordering lunch to booking cabs, everything is just one click away!',
      gradient: 'from-orange-500/20 to-red-500/20',
    },
    {
      name: 'Priya Patel',
      role: 'Student',
      image: 'https://i.pravatar.cc/150?img=45',
      rating: 5,
      text: "Best super app in India! I use it for food delivery, shopping, and paying bills. Can't imagine life without it now.",
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      name: 'Amit Singh',
      role: 'Software Engineer',
      image: 'https://i.pravatar.cc/150?img=33',
      rating: 5,
      text: 'The convenience of having everything in one app is unmatched. Plus, the cashback offers are amazing!',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
  ];

  const agentEarnings = [
    {
      tier: 'Part-Time Agent',
      users: '30 users',
      earnings: '₹8,000 - ₹12,000',
      period: 'per month',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Beginner',
      badgeColor: 'bg-blue-500',
    },
    {
      tier: 'Full-Time Agent',
      users: '150 users',
      earnings: '₹25,000 - ₹40,000',
      period: 'per month',
      icon: Target,
      color: 'from-orange-500 to-pink-500',
      badge: 'Popular',
      badgeColor: 'bg-orange-500',
    },
    {
      tier: 'Top Agent',
      users: '500+ users',
      earnings: '₹80,000 - ₹1,20,000',
      period: 'per month',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      badge: 'Premium',
      badgeColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-10 md:pb-20 px-4 sm:px-6">
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
          <div
            className="absolute top-20 left-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className="absolute bottom-40 right-60 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/40 mb-8 backdrop-blur-xl shadow-lg shadow-orange-500/20">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-bold bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              India's #1 Super App
            </span>
            <Gift className="w-4 h-4 text-pink-500 animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-linear-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent drop-shadow-2xl">
              Everything You Need,
            </span>
            <br />
            <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Just One Click Away
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Book rides, order food, shop online, pay bills & more.{' '}
            <span className="font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Unified into one intelligent, beautiful experience
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="group relative px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden shadow-2xl shadow-orange-500/30">
              <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-1" />
              <div className="relative flex items-center gap-3 text-white">
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Download Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>

            <button className="group px-10 py-5 rounded-2xl font-bold text-lg border-2 border-slate-700 hover:border-orange-500/50 transition-all flex items-center gap-3 backdrop-blur-sm hover:bg-slate-900/50">
              <div className="p-1 rounded-full bg-linear-to-r from-orange-500 to-pink-500 group-hover:animate-pulse">
                <Play className="w-4 h-4 text-white" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl bg-linear-to-br from-slate-900/50 to-slate-800/30 border border-slate-800 backdrop-blur-xl transition-all duration-1000 hover:scale-105 hover:border-orange-500/50 ${
                    statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-orange-500 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">Services, </span>
              <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Endless Possibilities
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From daily commutes to dream vacations, we've got everything covered
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeService === index;
              return (
                <div
                  key={index}
                  className={`group relative p-8 rounded-3xl border-2 backdrop-blur-xl transition-all duration-500 hover:scale-110 ${
                    isActive
                      ? `${service.bgColor} ${service.borderColor} shadow-2xl`
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-3xl bg-linear-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-linear-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white transition-all duration-300">{service.name}</h3>

                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{service.description}</p>

                    <div
                      className={`inline-flex items-center text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-linear-to-r from-orange-500 to-pink-500 text-white'
                          : 'text-slate-500 group-hover:text-white group-hover:bg-slate-800'
                      }`}
                    >
                      Explore
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Become an Agent Section */}
      <section id="agent" className="py-12 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-green-500/5 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-10 md:mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 border border-green-500/40 mb-8 backdrop-blur-xl shadow-lg shadow-green-500/20">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Earning Opportunity
              </span>
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                Become an Agent,{' '}
              </span>
              <span className="bg-linear-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Earn Money
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Turn your network into income. Earn commission from every transaction made by users you refer.
              <span className="block mt-2 font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                No investment • No hidden fees • 100% transparent
              </span>
            </p>
          </div>

          {/* How It Works */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-20">
            {[
              {
                step: '01',
                title: 'Register',
                desc: 'Sign up with Aadhaar, PAN & bank details. Pass a simple 30-question exam. Pay ₹500 security deposit (refundable).',
                gradient: 'from-blue-500 to-cyan-500',
                icon: CheckCircle2,
                bgGlow: 'from-blue-500/20 to-cyan-500/20',
              },
              {
                step: '02',
                title: 'Share & Earn',
                desc: 'Get your unique referral code. Share with friends, family & community. Earn from every service they use.',
                gradient: 'from-orange-500 to-pink-500',
                icon: Rocket,
                bgGlow: 'from-orange-500/20 to-pink-500/20',
              },
              {
                step: '03',
                title: 'Build Team',
                desc: 'Recruit sub-agents. Earn from their referrals too. Unlimited levels. Grow your network, grow your income.',
                gradient: 'from-purple-500 to-pink-500',
                icon: Users,
                bgGlow: 'from-purple-500/20 to-pink-500/20',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="group relative overflow-hidden">
                  {/* Glow Effect Background */}
                  <div
                    className={`absolute -inset-2 bg-linear-to-br ${item.bgGlow} rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500`}
                  />

                  {/* Card */}
                  <div className="relative h-full p-8 rounded-3xl bg-slate-900/90 border-2 border-slate-800 group-hover:border-slate-700 backdrop-blur-xl transition-all duration-300">
                    {/* Step Number - Large Background */}
                    <div className="absolute top-4 right-4 text-8xl font-black text-slate-800/40 leading-none">
                      {item.step}
                    </div>

                    {/* Icon with Gradient Background */}
                    <div className="relative z-10 mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-linear-to-br ${item.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-8 h-1 rounded-full bg-linear-to-r ${item.gradient}`} />
                        <span
                          className={`text-xs font-bold uppercase tracking-wider bg-linear-to-r ${item.gradient} bg-clip-text text-transparent`}
                        >
                          Step {item.step}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Earnings Potential */}
          <div className="mb-10 md:mb-20">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Your Earning Potential
              </span>
            </h3>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Start earning from day one. No experience needed. Scale at your own pace.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {agentEarnings.map((tier, index) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 to-slate-800/50 border-2 border-slate-700 hover:border-orange-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  >
                    <div
                      className={`absolute -inset-1 rounded-3xl bg-linear-to-r ${tier.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`}
                    />

                    <div className="relative">
                      <div className="absolute -top-4 -right-4">
                        <div
                          className={`${tier.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}
                        >
                          {tier.badge}
                        </div>
                      </div>

                      <div
                        className={`w-20 h-20 rounded-2xl bg-linear-to-br ${tier.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold mb-2 text-white">{tier.tier}</h4>
                      <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {tier.users}
                      </p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span
                          className={`text-4xl font-bold bg-linear-to-r ${tier.color} bg-clip-text text-transparent`}
                        >
                          {tier.earnings}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium">{tier.period}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commission Breakdown */}
          <div className="relative p-8 md:p-12 lg:p-16 rounded-3xl bg-linear-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 border-2 border-orange-500/30 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Header Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-orange-500 to-pink-500 shadow-xl">
                  <IndianRupee className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm">Commission Structure</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4">
                <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  How Agents Earn Commission
                </span>
              </h3>

              <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                Multiple revenue streams designed to maximize your earning potential
              </p>

              {/* Commission Cards Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: IndianRupee,
                    title: 'Direct Referrals',
                    level: 'Level 1',
                    percentage: '60%',
                    desc: 'Earn commission from every transaction made by users you directly refer',
                    gradient: 'from-orange-500 to-pink-500',
                  },
                  {
                    icon: Users,
                    title: 'Downline Network',
                    level: 'Levels 2-3',
                    percentage: '20% + 10%',
                    desc: 'Earn from agents you recruit and their sub-agents network',
                    gradient: 'from-purple-500 to-pink-500',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Performance Bonus',
                    level: 'Top 10',
                    percentage: 'Extra',
                    desc: 'Quarterly bonuses from pool plus rank upgrades with higher rates',
                    gradient: 'from-green-500 to-emerald-500',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="group relative p-6 rounded-2xl bg-slate-900/80 border-2 border-slate-800 hover:border-slate-700 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                    >
                      {/* Glow Effect */}
                      <div
                        className={`absolute -inset-1 bg-linear-to-br ${item.gradient} opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity`}
                      />

                      <div className="relative">
                        {/* Icon */}
                        <div
                          className={`w-14 h-14 rounded-xl bg-linear-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Title & Level */}
                        <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 mb-3">{item.level}</p>

                        {/* Percentage */}
                        <div
                          className={`text-3xl font-black mb-3 bg-linear-to-r ${item.gradient} bg-clip-text text-transparent`}
                        >
                          {item.percentage}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300">
                  <Users className="w-5 md:w-6 h-5 md:h-6 group-hover:animate-bounce" />
                  Register as Agent Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>

                {/* Info Tags */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-6">
                  {['₹500 security deposit', 'Refundable after 6 months', 'No hidden charges'].map((text, i) => (
                    <span key={i} className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">Why Choose </span>
              <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
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
                  className="group relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 to-slate-800/50 border-2 border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                >
                  <div
                    className={`absolute -inset-1 rounded-3xl bg-linear-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`}
                  />

                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">Loved by </span>
              <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Millions
              </span>
            </h2>
            <p className="text-xl text-slate-400">See what our users have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 to-slate-800/50 border-2 border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:scale-105"
              >
                <div
                  className={`absolute inset-0 rounded-3xl bg-linear-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                    ))}
                  </div>

                  <p className="text-slate-300 mb-8 leading-relaxed text-lg">"{testimonial.text}"</p>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full ring-2 ring-orange-500/50"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-linear-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="about" className="py-12 md:py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-8 md:p-20 rounded-3xl bg-linear-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 border-2 border-orange-500/30 backdrop-blur-xl shadow-2xl overflow-hidden">
            
            {/* Background Orbs/Blobs (for visual flair) */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }}
            />

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 md:w-20 md:h-20 md:mb-8 rounded-2xl bg-linear-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-2xl animate-bounce">
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                Ready to Experience the{' '}
                <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Super App Revolution?
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-base md:text-xl text-slate-300 mb-8 md:mb-10">
                Join 10 million+ users who are already enjoying the convenience
              </p>

              {/* Download Buttons - Improved Responsiveness for mobile */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 md:mb-12">
                
                {/* Android Button - w-full on mobile, auto width on small screens and up */}
                <button className="group w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-base md:text-lg bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.03] sm:hover:scale-110 transition-all duration-300 flex items-center justify-center gap-3">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Download for Android
                </button>

                {/* iOS Button - w-full on mobile, auto width on small screens and up */}
                <button className="group w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-base md:text-lg border-2 border-slate-700 hover:border-orange-500/50 transition-all flex items-center justify-center gap-3 hover:bg-slate-900/50">
                  <Download className="w-5 h-5" />
                  Download for iOS
                </button>
              </div>

              {/* Feature Badges - flex-wrap ensures multi-line layout on small screens */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                {[
                  { icon: CheckCircle2, text: '100% Secure', gradient: 'from-green-500 to-emerald-500' },
                  { icon: CheckCircle2, text: 'No Hidden Charges', gradient: 'from-blue-500 to-cyan-500' },
                  { icon: CheckCircle2, text: '24/7 Support', gradient: 'from-purple-500 to-pink-500' },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 transition-all"
                  >
                    <div className={`p-1 rounded-full bg-linear-to-r ${badge.gradient}`}>
                      <badge.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
