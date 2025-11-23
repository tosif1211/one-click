'use client';

import React, { useState, useEffect } from 'react';
import { Menu, LogOut, User, Wallet, DollarSign, Settings, Headphones, Award, Users, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { signOut } from '@/lib/auth';
import toast from 'react-hot-toast';
import NavigationLinks from './NavigationLinks';
import { useSidebar } from '@/components/ui/sidebar';
import ThemeToggle from './ThemeToggle';
import ThemeSelector from './ThemeSelector';

interface AgentEarnings {
  wallet_balance: number;
  total_earnings: number;
  pending_payout: number;
  this_month: number;
}

interface AgentStats {
  total_referrals: number;
  active_referrals: number;
  team_size: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export default function Header() {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [earnings, setEarnings] = useState<AgentEarnings>({
    wallet_balance: 0,
    total_earnings: 0,
    pending_payout: 0,
    this_month: 0,
  });
  const [stats, setStats] = useState<AgentStats>({
    total_referrals: 0,
    active_referrals: 0,
    team_size: 0,
    tier: 'bronze',
  });
  const [loading, setLoading] = useState(false);

  // Get user display info
  const getUserInitials = () => {
    const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Agent';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'Agent';
  };

  // Fetch agent earnings and stats
  const fetchAgentData = async () => {
    if (!user?.id || loading) return;

    try {
      setLoading(true);

      // TODO: Replace with actual API calls
      // const { data: earningsData } = await axios.get(`/api/agents/${user.id}/earnings`);
      // const { data: statsData } = await axios.get(`/api/agents/${user.id}/stats`);

      // Mock data for now
      setEarnings({
        wallet_balance: 12500,
        total_earnings: 45800,
        pending_payout: 3200,
        this_month: 8400,
      });

      setStats({
        total_referrals: 48,
        active_referrals: 32,
        team_size: 12,
        tier: 'silver',
      });
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAgentData();
    }
  }, [user?.id]);

  // Tier badge config
  const getTierConfig = (tier: string) => {
    const configs = {
      bronze: { color: 'bg-orange-500', label: 'Bronze', gradient: 'from-orange-500 to-orange-600' },
      silver: { color: 'bg-slate-400', label: 'Silver', gradient: 'from-slate-400 to-slate-500' },
      gold: { color: 'bg-yellow-500', label: 'Gold', gradient: 'from-yellow-500 to-yellow-600' },
      platinum: { color: 'bg-purple-500', label: 'Platinum', gradient: 'from-purple-500 to-purple-600' },
    };
    return configs[tier as keyof typeof configs] || configs.bronze;
  };

  const tierConfig = getTierConfig(stats.tier);

  // WhatsApp support
  const handleSupport = () => {
    const message = `Hello, I need help with my OneClick agent account.

Agent Details:
- Name: ${getDisplayName()}
- Email: ${user?.email}
- Agent Tier: ${tierConfig.label}
- Wallet Balance: ₹${earnings.wallet_balance.toLocaleString('en-IN')}
- Total Referrals: ${stats.total_referrals}

Please assist me.`;

    const whatsappUrl = `https://wa.me/917850006956?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp support...');
  };

  // Logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      const loadingToast = toast.loading('Signing out...');
      await signOut();
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Profile menu items
  const profileMenuItems = [
    { href: '/agent/profile', label: 'My Profile', icon: User, description: 'View and edit profile' },
    {
      href: '/agent/wallet',
      label: 'Wallet',
      icon: Wallet,
      description: `₹${earnings.wallet_balance.toLocaleString('en-IN')} available`,
    },
    {
      href: '/agent/earnings',
      label: 'Earnings',
      icon: DollarSign,
      description: `₹${earnings.total_earnings.toLocaleString('en-IN')} total`,
    },
    { href: '/agent/my-team', label: 'My Team', icon: Users, description: `${stats.team_size} members` },
    { href: '/agent/settings', label: 'Settings', icon: Settings, description: 'Account settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="hidden">
        <ThemeSelector />
      </div>
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Menu Buttons */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden hover:bg-accent/80 h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <NavigationLinks isMobile={true} onLinkClick={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar Toggle */}
          <Button
            variant="default"
            size="icon"
            className="hidden md:flex cursor-pointer hover:bg-primary/80 h-9 w-9"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Right: Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Tier Badge (Tablet+) */}
          <Badge className={`hidden sm:flex bg-linear-to-r ${tierConfig.gradient} text-white border-0`}>
            <Award className="w-3 h-3 mr-1" />
            {tierConfig.label}
          </Badge>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              {/* User Info */}
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className={`bg-linear-to-br ${tierConfig.gradient} text-white font-bold text-lg`}>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold text-base">{getDisplayName()}</h4>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <Badge className={`mt-1 bg-linear-to-r ${tierConfig.gradient} text-white border-0 text-xs`}>
                      <Award className="w-3 h-3 mr-1" />
                      {tierConfig.label} Agent
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Wallet</p>
                    <p className="text-sm font-bold text-green-600">₹{(earnings.wallet_balance / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Earnings</p>
                    <p className="text-sm font-bold text-orange-600">₹{(earnings.total_earnings / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Referrals</p>
                    <p className="text-sm font-bold text-purple-600">{stats.total_referrals}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Menu Items */}
              {profileMenuItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-start gap-3 py-2">
                    <item.icon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              {/* Theme Toggle */}
              <div className="px-2 py-2">
                <ThemeToggle />
              </div>

              <DropdownMenuSeparator />

              {/* Support */}
              <DropdownMenuItem onClick={handleSupport}>
                <Headphones className="mr-3 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
