'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  GitFork,
  Link2,
  DollarSign,
  Wallet,
  Receipt,
  CreditCard,
  Megaphone,
  BookOpen,
  User,
  Settings,
  Headphones,
  ShieldCheck,
  GraduationCap,
  FileText,
  Download,
  Award,
  History,
  Target,
  BarChart3,
  Gift,
  Shield,
  Activity,
  Database,
  Server,
  AlertCircle,
  Lock,
  Briefcase,
  PieChart
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthProvider';
import { isSuperAdmin } from '@/lib/roles';

interface NavSection {
  section: string;
  items: Array<{
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }>;
}

// --- AGENT NAVIGATION ---
const agentNavigation: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { href: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/agent/performance', label: 'Performance', icon: TrendingUp },
      { href: '/agent/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    section: 'Network',
    items: [
      { href: '/agent/my-referrals', label: 'My Referrals', icon: Users },
      { href: '/agent/my-team', label: 'My Team', icon: GitFork },
      { href: '/agent/referral-link', label: 'Referral Link', icon: Link2 },
      { href: '/agent/bonuses', label: 'Bonuses', icon: Gift },
    ],
  },
  {
    section: 'Earnings',
    items: [
      { href: '/agent/earnings', label: 'Earnings', icon: DollarSign },
      { href: '/agent/wallet', label: 'Wallet', icon: Wallet },
      { href: '/agent/transactions', label: 'Transactions', icon: Receipt },
      { href: '/agent/withdraw', label: 'Withdraw', icon: CreditCard },
      { href: '/agent/commission-history', label: 'Commission History', icon: History },
    ],
  },
  {
    section: 'Verification',
    items: [
      { href: '/agent/kyc', label: 'KYC Verification', icon: ShieldCheck, badge: 'Required' },
      { href: '/agent/documents', label: 'Documents', icon: FileText },
    ],
  },
  {
    section: 'Training',
    items: [
      { href: '/agent/training', label: 'Training & Certification', icon: GraduationCap },
      { href: '/agent/courses', label: 'Courses', icon: BookOpen },
      { href: '/agent/achievements', label: 'Achievements', icon: Award },
    ],
  },
  {
    section: 'Marketing',
    items: [
      { href: '/agent/marketing', label: 'Marketing Materials', icon: Megaphone },
      { href: '/agent/campaigns', label: 'Campaigns', icon: Target },
      { href: '/agent/downloads', label: 'Downloads', icon: Download },
    ],
  },
  {
    section: 'Account',
    items: [
      { href: '/agent/profile', label: 'Profile', icon: User },
      { href: '/agent/settings', label: 'Settings', icon: Settings },
      { href: '/agent/support', label: 'Support', icon: Headphones },
      { href: '/agent/reports', label: 'Reports', icon: FileText },
    ],
  },
];

// --- SUPER ADMIN NAVIGATION ---
const adminNavigation: NavSection[] = [
  {
    section: 'Control Panel',
    items: [
      { href: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Global Analytics', icon: PieChart },
      { href: '/admin/audit-logs', label: 'Audit Logs', icon: Activity },
    ],
  },
  {
    section: 'User Management',
    items: [
      { href: '/admin/users', label: 'All Users', icon: Users },
      { href: '/admin/agents', label: 'Agent Management', icon: Briefcase },
      { href: '/admin/kyc-approvals', label: 'KYC Approvals', icon: ShieldCheck, badge: 'Pending' },
      { href: '/admin/bans', label: 'Banned Accounts', icon: Shield },
    ],
  },
  {
    section: 'Finance & Payouts',
    items: [
      { href: '/admin/finance/overview', label: 'Finance Overview', icon: DollarSign },
      { href: '/admin/finance/payouts', label: 'Withdrawal Requests', icon: Wallet, badge: 'Action' },
      { href: '/admin/finance/transactions', label: 'Global Transactions', icon: Receipt },
      { href: '/admin/finance/commission-rates', label: 'Commission Rules', icon: Settings },
    ],
  },
  {
    section: 'System & Config',
    items: [
      { href: '/admin/system/settings', label: 'Platform Settings', icon: Settings },
      { href: '/admin/system/roles', label: 'Roles & Permissions', icon: Lock },
      { href: '/admin/system/database', label: 'Database', icon: Database },
      { href: '/admin/system/logs', label: 'Server Logs', icon: Server },
      { href: '/admin/system/alerts', label: 'System Alerts', icon: AlertCircle },
    ],
  },
  {
    section: 'Content Management',
    items: [
      { href: '/admin/cms/banners', label: 'Banners & Ads', icon: Megaphone },
      { href: '/admin/cms/notifications', label: 'Push Notifications', icon: Target },
      { href: '/admin/cms/training', label: 'Training Content', icon: BookOpen },
    ],
  },
];

function NavigationLinks({ isMobile = false, onLinkClick }: { isMobile?: boolean; onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { open: isOpen } = useSidebar();
  const { user } = useAuth();

  // Determine role based on authenticated user
  const isAdmin = user && isSuperAdmin(user.email || '');
  const navigation = isAdmin ? adminNavigation : agentNavigation;
  const badgeColor = isAdmin ? 'bg-destructive/10 text-destructive' : 'bg-orange-500/20 text-orange-500';

  const renderLink = ({
    href,
    label,
    icon: Icon,
    badge,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }) => {
    const isActive = pathname === href;

    const link = (
      <Link
        href={href}
        onClick={onLinkClick}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/50 ${
          isActive ? 'bg-accent text-primary' : 'text-muted-foreground hover:text-foreground'
        } ${!isOpen && !isMobile ? 'justify-center' : ''}`}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {(isOpen || isMobile) && (
          <>
            <span className="flex-1">{label}</span>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </>
        )}
      </Link>
    );

    // Tooltip for collapsed sidebar
    if (!isOpen && !isMobile) {
      return (
        <TooltipProvider key={href}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <React.Fragment key={href}>{link}</React.Fragment>;
  };

  const renderSectionHeader = (title: string) => {
    if (!isOpen && !isMobile) return null;

    return (
      <div className="px-3 py-2 mt-6 first:mt-0">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <nav className={`grid items-start gap-1 px-2 text-sm font-medium lg:px-4 mt-4 ${isMobile ? 'pt-4' : ''}`}>
        {navigation.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            {renderSectionHeader(section.section)}
            {section.items.map(renderLink)}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}

export default NavigationLinks;
