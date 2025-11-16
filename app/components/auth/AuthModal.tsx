'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

// Zod Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^\S*$/, 'Password cannot contain spaces'),
});

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
      .length(10, 'Phone must be exactly 10 digits'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/^\S*$/, 'Password cannot contain spaces'),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthModal({ isOpen, onClose, defaultTab = 'register' }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Login Form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Register Form
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setShowPassword(false);
      setShowConfirmPassword(false);
      resetLogin();
      resetRegister();
    }
  }, [isOpen, defaultTab, resetLogin, resetRegister]);

  const onLoginSubmit = (data: LoginFormData) => {
    console.log('Login:', data);
    toast.success('Login successful!');
    // Add your login API call here
    onClose();
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    console.log('Register:', data);
    toast.success('Account created successfully!');
    // Add your register API call here
    onClose();
  };

  // Phone input handler - only allow digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setValue('phone', value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] bg-slate-950 backdrop-blur-xl border-2 border-slate-800 text-white p-0 overflow-y-auto [&>button]:hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-lg p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200"
          >
            <X className="h-4 w-4 text-slate-400 hover:text-white" />
          </button>

          {/* Header */}
          <DialogHeader className="px-6 sm:px-8 pt-8 pb-6 text-center border-b border-slate-800/50">
            <DialogTitle className="text-2xl sm:text-3xl font-bold mb-2">
              <span className="bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                {activeTab === 'login' ? 'Welcome Back' : 'Become an Agent'}
              </span>
            </DialogTitle>
            <p className="text-slate-400 text-sm">
              {activeTab === 'login' ? 'Sign in to your account' : 'Join us and start earning today'}
            </p>
          </DialogHeader>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
            className="w-full"
          >
            <div className="px-6 sm:px-8 pt-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900/80 p-1 rounded-lg border border-slate-800 h-11">
                <TabsTrigger
                  value="login"
                  className="rounded-md data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200 font-medium text-sm text-slate-400"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-md data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200 font-medium text-sm text-slate-400"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Login Tab */}
            <TabsContent value="login" className="px-6 sm:px-8 pb-8 mt-6 space-y-0">
              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      {...loginRegister('email')}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                        loginErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-orange-500/50'
                      }`}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">Password</label>
                    <button type="button" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...loginRegister('password')}
                      placeholder="Enter password"
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                        loginErrors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-orange-500/50'
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
                  {loginErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>
                  )}
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="group w-full relative px-6 py-3 rounded-lg font-semibold overflow-hidden shadow-lg shadow-orange-500/20 mt-6"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 transition-transform duration-200 group-hover:scale-105" />
                  <div className="relative flex items-center justify-center gap-2 text-white text-sm">
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="px-6 sm:px-8 pb-8 mt-6 space-y-0">
              <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
                {/* Name & Phone in one row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        {...registerRegister('name')}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                          registerErrors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-orange-500/50'
                        }`}
                      />
                    </div>
                    {registerErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{registerErrors.name.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        {...registerRegister('phone')}
                        onChange={handlePhoneChange}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                          registerErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-orange-500/50'
                        }`}
                      />
                    </div>
                    {registerErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{registerErrors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      {...registerRegister('email')}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                        registerErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-orange-500/50'
                      }`}
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{registerErrors.email.message}</p>
                  )}
                </div>

                {/* Password & Confirm Password in one row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...registerRegister('password')}
                        placeholder="Min 6 chars"
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                          registerErrors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-orange-500/50'
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
                    {registerErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{registerErrors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...registerRegister('confirmPassword')}
                        placeholder="Confirm"
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                          registerErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-orange-500/50'
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
                    {registerErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{registerErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      {...registerRegister('agreeTerms')}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-orange-500"
                    />
                    <span>
                      I agree to the{' '}
                      <button type="button" className="text-orange-500 hover:text-orange-400 underline">
                        Terms
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-orange-500 hover:text-orange-400 underline">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {registerErrors.agreeTerms && (
                    <p className="text-red-500 text-xs mt-1">{registerErrors.agreeTerms.message}</p>
                  )}
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  className="group w-full relative px-6 py-3 rounded-lg font-semibold overflow-hidden shadow-lg shadow-orange-500/20 mt-6"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 transition-transform duration-200 group-hover:scale-105" />
                  <div className="relative flex items-center justify-center gap-2 text-white text-sm">
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
