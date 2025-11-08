// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import Navbar from './components/landing/Navbar';
import Footer from './components/landing/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'OneClick - Everything You Need in One App | Super App India',
    template: '%s | OneClick',
  },
  description:
    'OneClick Super App - Your all-in-one platform for Rides, Food, Shopping, Hotels, Travel, Bills, Payments, and more. 8 services, 1 app. Download now!',
  keywords: [
    // Super App Keywords
    'super app India',
    'all in one app',
    'multi service app',
    'OneClick app',
    
    // Service-specific Keywords
    'ride booking',
    'food delivery',
    'hotel booking',
    'shopping online',
    'bill payment',
    'recharge app',
    'UPI payment',
    'travel booking',
    
    // Competitor Keywords
    'Paytm alternative',
    'PhonePe alternative',
    'Swiggy alternative',
    'Uber alternative',
    'MakeMyTrip alternative',
    'Amazon alternative',
    
    // Indian Market
    'best super app India',
    'cashback app',
    'digital wallet India',
    'one app for everything',
  ],
  authors: [{ name: 'OneClick Team' }],
  creator: 'OneClick',
  publisher: 'OneClick',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OneClick - Everything You Need in One App',
    description:
      '8 services in 1 app: Rides, Food, Shopping, Hotels, Travel, Bills, Pay, Health. Download OneClick now!',
    url: '/',
    siteName: 'OneClick',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OneClick Super App - All Services in One Place',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OneClick - Everything You Need in One App',
    description: '8 services, 1 app. Rides, Food, Shopping, Hotels, Travel, Bills & More!',
    images: ['/og-image.jpg'],
    creator: '@oneclick',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Lifestyle & Productivity',
  classification: 'Super App Platform',
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

const inter = Inter({
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'arial'],
  adjustFontFallback: true,
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="application-name" content="OneClick" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OneClick" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Schema.org - Super App */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MobileApplication',
              name: 'OneClick',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Android, iOS',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '50000',
              },
              description:
                'OneClick is a super app offering 8 services: Rides, Food Delivery, Shopping, Hotel Booking, Travel, Bill Payments, Digital Payments, and Health Services.',
              featureList: [
                'Ride Booking (Bike, Auto, Car)',
                'Food Delivery',
                'Online Shopping',
                'Hotel & Stay Booking',
                'Travel Tickets (Flight, Train, Bus)',
                'Bill Payments & Recharge',
                'UPI & Digital Payments',
                'Home Services',
              ],
            }),
          }}
        />

        {/* Schema.org - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'OneClick',
              alternateName: 'OneClick Super App',
              url: process.env.NEXT_PUBLIC_APP_URL,
              logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              description:
                'OneClick is India\'s leading super app offering ride-booking, food delivery, shopping, travel, payments, and more - all in one platform.',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-1234567890',
                contactType: 'Customer Support',
                availableLanguage: ['English', 'Hindi'],
                areaServed: 'IN',
              },
              sameAs: [
                'https://twitter.com/oneclick',
                'https://instagram.com/oneclick',
                'https://facebook.com/oneclick',
                'https://linkedin.com/company/oneclick',
                'https://youtube.com/@oneclick',
              ],
            }),
          }}
        />

        {/* Schema.org - WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: process.env.NEXT_PUBLIC_APP_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Schema.org - ItemList (Services) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'OneClick Services',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Rides',
                  description: 'Book bike, auto, and car rides instantly',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/rides`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Food Delivery',
                  description: 'Order food from your favorite restaurants',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/food`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Shopping',
                  description: 'Shop online from thousands of products',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/shop`,
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: 'Hotels',
                  description: 'Book hotels, resorts, and vacation rentals',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/hotels`,
                },
                {
                  '@type': 'ListItem',
                  position: 5,
                  name: 'Travel',
                  description: 'Book flights, trains, and bus tickets',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/travel`,
                },
                {
                  '@type': 'ListItem',
                  position: 6,
                  name: 'Bills & Recharge',
                  description: 'Pay bills and recharge mobile, DTH, and more',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/bills`,
                },
                {
                  '@type': 'ListItem',
                  position: 7,
                  name: 'Payments',
                  description: 'Send money, pay bills with UPI and wallet',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/pay`,
                },
                {
                  '@type': 'ListItem',
                  position: 8,
                  name: 'Home Services',
                  description: 'Book cleaning, repairs, and home services',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/services`,
                },
              ],
            }),
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is OneClick?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'OneClick is a super app that brings 8 essential services into one platform: Rides, Food Delivery, Shopping, Hotels, Travel, Bill Payments, Digital Payments, and Home Services.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is OneClick free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! OneClick is completely free to download and use. You only pay for the services you use (like ride fare, food orders, etc.).',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which cities is OneClick available in?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'OneClick is available in 100+ cities across India, covering all major metros and tier-2, tier-3 cities.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I pay on OneClick?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'OneClick supports multiple payment methods: UPI, Credit/Debit Cards, Net Banking, OneClick Wallet, and Cash.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased scroll-smooth font-sans bg-white dark:bg-slate-950 transition-colors duration-300">
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="oneclick-theme"
        > */}
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        {/* </ThemeProvider> */}
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
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
