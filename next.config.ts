/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_URL:'http://localhost:3000',
    NEXT_PUBLIC_SUPABASE_URL: 'https://gpyizypljtpqbnuavgov.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweWl6eXBsanRwcWJudWF2Z292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjA2ODcsImV4cCI6MjA3OTAzNjY4N30.dpxSiDsN6NO8JftdWiSYzsbLj8SeTAkyP5Civ9_sDmY',
  },
};

export default nextConfig;
