import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: 'OneClick - Everything You Need in One App | Super App India',
    template: '%s | OneClick',
  },
  description:
    'OneClick Super App - Your all-in-one platform for Rides, Food, Shopping, Hotels, Travel, Bills, Payments, and more. 8 services, 1 app. Download now!',
  keywords: [
    'super app India',
    'all in one app',
    'multi service app',
    'OneClick app',
    'ride booking',
    'food delivery',
    'hotel booking',
    'shopping online',
    'bill payment',
    'recharge app',
    'UPI payment',
    'travel booking',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'OneClick - Everything You Need in One App',
    description: 'services in 1 app: Rides, Food, Shopping, Hotels, Travel, Bills, Pay, Health.',
    siteName: 'OneClick',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const inter = Inter({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased font-sans bg-background scroll-smooth">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
