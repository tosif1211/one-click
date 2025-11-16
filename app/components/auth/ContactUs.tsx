'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
    .length(10, 'Phone must be exactly 10 digits'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact Form:', data);
    toast.success('Message sent successfully! We will get back to you soon.');
    reset();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setValue('phone', value);
  };

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 mb-6 shadow-xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {[
              {
                icon: Mail,
                title: 'Email',
                value: 'support@oneclick.com',
                href: 'mailto:support@oneclick.com',
                gradient: 'from-orange-500 to-pink-500',
              },
              {
                icon: Phone,
                title: 'Phone',
                value: '+91 98765 43210',
                href: 'tel:+919876543210',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: MapPin,
                title: 'Office',
                value: 'Rajasthan, India',
                href: '#',
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl hover:border-orange-500/50 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <a href={item.href} className="text-slate-400 hover:text-orange-500 transition-colors">
                    {item.value}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl"
            >
              {/* Name & Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-800 focus:border-orange-500/50'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-800 focus:border-orange-500/50'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              {/* Phone & Subject */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    onChange={handlePhoneChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-800 focus:border-orange-500/50'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <input
                    type="text"
                    {...register('subject')}
                    placeholder="How can we help?"
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                      errors.subject
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-800 focus:border-orange-500/50'
                    }`}
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  {...register('message')}
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                  className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none transition-all resize-none ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-800 focus:border-orange-500/50'
                  }`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group w-full relative px-6 py-4 rounded-lg font-semibold overflow-hidden shadow-lg shadow-orange-500/20"
              >
                <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 transition-transform duration-200 group-hover:scale-105" />
                <div className="relative flex items-center justify-center gap-2 text-white">
                  <Send className="w-5 h-5" />
                  Send Message
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
