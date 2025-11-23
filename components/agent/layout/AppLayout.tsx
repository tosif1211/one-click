'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import Header from './Header';
import LayoutSidebar from './LayoutSidebar';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { session, loading } = useAuth();
  const isAuthenticated = !!session;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <div className="absolute inset-0 w-8 h-8 border-2 border-primary/20 rounded-full" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  // For non-authenticated users
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // For authenticated users
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <LayoutSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">{children}</div>
          </main>
          <Footer /> {/* ✅ Moved inside flex column */}
        </div>
      </div>
    </SidebarProvider>
  );
}
