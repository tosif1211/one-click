'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { resetPassword, signInWithEmail, signUpWithEmail } from '@/lib/auth';
import Link from 'next/link';
import { createAdminClient } from '@/lib/admin';
import { useSearchParams } from 'next/navigation';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const searchParams = useSearchParams();

  // Login Form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
    setValue: setLoginValue,
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowSuccess(false);
      resetLogin();
      resetRegister();
    }
  }, [isOpen, defaultTab, resetLogin, resetRegister]);

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      const result = await signInWithEmail({
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Welcome back!');

      // Get the 'next' parameter from URL
      const nextUrl = searchParams.get('next') || '/agent/dashboard';

      // Full page reload to the destination
      window.location.href = nextUrl;
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await signUpWithEmail({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Show success screen
      setSuccessEmail(data.email);
      setShowSuccess(true);
      toast.success('Account created! Please check your email to verify.');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setValue('phone', value);
  };

  // Prevent spaces in email and password fields
  const handleLoginEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setLoginValue('email', value);
  };

  const handleLoginPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setLoginValue('password', value);
  };

  const handleRegisterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setValue('email', value);
  };

  const handleRegisterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setValue('password', value);
  };

  const handleRegisterConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setValue('confirmPassword', value);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSendingReset(true);
    try {
      const result = await resetPassword(forgotEmail);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  // Success Screen
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[480px] bg-slate-950 backdrop-blur-xl border-2 border-slate-800 text-white p-0 [&>button]:hidden">
          <div className="p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email!</h2>
              <p className="text-slate-400 text-sm">
                We've sent a verification link to <span className="text-white font-semibold">{successEmail}</span>
              </p>
            </div>

            <p className="text-slate-500 text-sm">
              Please check your inbox and click the link to activate your account.
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                setActiveTab('login');
              }}
              className="w-full px-6 py-3 rounded-lg font-semibold bg-linear-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
              Go to Login
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
            disabled={isLoading}
            className="absolute right-4 top-4 z-50 rounded-lg p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200 disabled:opacity-50"
          >
            <X className="h-4 w-4 text-slate-400 hover:text-white" />
          </button>

          {showForgotPassword && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 max-w-sm w-full">
                <h3 className="text-xl font-bold mb-2">Reset Password</h3>
                <p className="text-slate-400 text-sm mb-4">Enter your email and we'll send you a reset link</p>

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value.replace(/\s/g, ''))}
                      placeholder="Enter email"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowForgotPassword(false)}
                      disabled={isSendingReset}
                      className="flex-1 px-4 py-2.5 rounded-lg font-medium border-2 border-slate-700 text-white hover:border-slate-600 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleForgotPassword}
                      disabled={isSendingReset}
                      className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-linear-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                    >
                      {isSendingReset ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send Link'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  disabled={isLoading}
                  className="rounded-md data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200 font-medium text-sm text-slate-400 disabled:opacity-50"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  disabled={isLoading}
                  className="rounded-md data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200 font-medium text-sm text-slate-400 disabled:opacity-50"
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
                      disabled={isLoading}
                      {...loginRegister('email')}
                      onChange={handleLoginEmailChange}
                      placeholder="Enter email"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                        loginErrors.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-800 focus:border-orange-500/50'
                      }`}
                    />
                  </div>
                  {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">Password</label>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-orange-500 hover:text-orange-400 transition-colors disabled:opacity-50"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      disabled={isLoading}
                      {...loginRegister('password')}
                      onChange={handleLoginPasswordChange}
                      placeholder="Enter password"
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                        loginErrors.password
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-800 focus:border-orange-500/50'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>}
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full relative px-6 py-3 rounded-lg font-semibold overflow-hidden shadow-lg shadow-orange-500/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 transition-transform duration-200 group-hover:scale-105" />
                  <div className="relative flex items-center justify-center gap-2 text-white text-sm">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="px-6 sm:px-8 pb-8 mt-6 space-y-0">
              <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        disabled={isLoading}
                        {...registerRegister('name')}
                        placeholder="Enter full name"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                          registerErrors.name
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-800 focus:border-orange-500/50'
                        }`}
                      />
                    </div>
                    {registerErrors.name && <p className="text-red-500 text-xs mt-1">{registerErrors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Mobile</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        disabled={isLoading}
                        {...registerRegister('phone')}
                        onChange={handlePhoneChange}
                        placeholder="Enter mobile number"
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                          registerErrors.phone
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-800 focus:border-orange-500/50'
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
                      disabled={isLoading}
                      {...registerRegister('email')}
                      onChange={handleRegisterEmailChange}
                      placeholder="Enter email"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                        registerErrors.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-800 focus:border-orange-500/50'
                      }`}
                    />
                  </div>
                  {registerErrors.email && <p className="text-red-500 text-xs mt-1">{registerErrors.email.message}</p>}
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        disabled={isLoading}
                        {...registerRegister('password')}
                        onChange={handleRegisterPasswordChange}
                        placeholder="Enter password"
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                          registerErrors.password
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-800 focus:border-orange-500/50'
                        }`}
                      />
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors disabled:opacity-50"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{registerErrors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        disabled={isLoading}
                        {...registerRegister('confirmPassword')}
                        onChange={handleRegisterConfirmPasswordChange}
                        placeholder="Enter confirm password"
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                          registerErrors.confirmPassword
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-800 focus:border-orange-500/50'
                        }`}
                      />
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors disabled:opacity-50"
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
                      disabled={isLoading}
                      {...registerRegister('agreeTerms')}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-orange-500 disabled:opacity-50"
                    />
                    <span>
                      I agree to the{' '}
                      <Link
                        onClick={onClose}
                        href={'/terms-of-service'}
                        className="text-orange-500 hover:text-orange-400 underline"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        onClick={onClose}
                        href={'/privacy-policy'}
                        className="text-orange-500 hover:text-orange-400 underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {registerErrors.agreeTerms && (
                    <p className="text-red-500 text-xs mt-1">{registerErrors.agreeTerms.message}</p>
                  )}
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full relative px-6 py-3 rounded-lg font-semibold overflow-hidden shadow-lg shadow-orange-500/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 transition-transform duration-200 group-hover:scale-105" />
                  <div className="relative flex items-center justify-center gap-2 text-white text-sm">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
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
