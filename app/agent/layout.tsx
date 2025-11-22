'use client';

import AuthProvider from '@/context/AuthProvider';
import { ThemeProvider } from 'next-themes';
import AppLayout from '../components/agent/layout/AppLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
export default function AgentLayout({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="oneclick-agent-theme"
    >
      <AuthProvider>
        <SidebarProvider>
          <AppLayout>{children}</AppLayout>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
