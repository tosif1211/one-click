'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  Wallet,
  DollarSign,
  Target,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Briefcase,
  Star,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '../reusable/DateRangePicker';
import { StatCard } from '../reusable/StatCard';

// --- Mock Data (Agent Specific) ---
const mockStats = {
  wallet_balance: 12500,
  todays_earnings: 850, // New metric
  total_earnings: 45800,
  this_month: 8400,
  last_month: 7200,
  pending_payout: 3200,
  total_referrals: 48,
  active_referrals: 32,
  inactive_referrals: 16,
  team_size: 12,
  tier: 'Silver',
  next_tier_progress: 65, // Percentage to next tier
};

const earningsHistory = [
  { date: '1 Nov', earnings: 200 },
  { date: '5 Nov', earnings: 450 },
  { date: '10 Nov', earnings: 300 },
  { date: '15 Nov', earnings: 600 },
  { date: '20 Nov', earnings: 850 },
  { date: '22 Nov', earnings: 400 },
];

const referralActivity = [
  { month: 'Jun', new_users: 4, active_users: 10 },
  { month: 'Jul', new_users: 6, active_users: 14 },
  { month: 'Aug', new_users: 3, active_users: 15 },
  { month: 'Sep', new_users: 8, active_users: 20 },
  { month: 'Oct', new_users: 5, active_users: 22 },
  { month: 'Nov', new_users: 12, active_users: 32 },
];

// Breakdown of where earnings come from
const earningsSourceData = [
  { name: 'Direct Referrals', value: 60, color: '#16a34a' }, // Green
  { name: 'Team Override', value: 25, color: '#2563eb' }, // Blue
  { name: 'Bonuses', value: 15, color: '#f59e0b' }, // Amber
];

const recentActivity = [
  {
    id: 1,
    type: 'New User',
    detail: 'Rahul S. joined via your link',
    time: '2 hours ago',
    icon: UserCheck,
    color: 'text-green-500',
  },
  {
    id: 2,
    type: 'Commission',
    detail: 'Ride booking commission (₹45)',
    time: '3 hours ago',
    icon: DollarSign,
    color: 'text-emerald-500',
  },
  {
    id: 3,
    type: 'Tier Progress',
    detail: 'You are 5 referrals away from Gold!',
    time: '1 day ago',
    icon: Star,
    color: 'text-yellow-500',
  },
  {
    id: 4,
    type: 'Withdrawal',
    detail: 'Withdrawal request approved (₹5000)',
    time: '2 days ago',
    icon: Wallet,
    color: 'text-blue-500',
  },
];

// --- Component ---
export default function AgentDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from: last30Days, to: now };
  });

  const monthlyGrowth = useMemo(() => {
    return ((mockStats.this_month - mockStats.last_month) / mockStats.last_month) * 100;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Hello, Agent! 👋</h1>
          <p className="text-sm text-muted-foreground">Here's how your business is performing today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-sm text-muted-foreground mr-2">
            Tier: <span className="font-semibold text-primary">{mockStats.tier}</span>
          </span>
          <DateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      {/* Key Stats Grid (Top Row) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Wallet / Liquidity */}
        <StatCard
          title="Wallet Balance"
          value={`₹${mockStats.wallet_balance.toLocaleString('en-IN')}`}
          icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
          borderColor="border-l-emerald-500"
          description="Available to Withdraw"
          subStats={[
            {
              label: 'Pending Payout',
              value: `₹${mockStats.pending_payout}`,
              icon: <Clock className="h-3 w-3 text-amber-500" />,
            },
          ]}
        />

        {/* 2. Immediate Performance */}
        <StatCard
          title="Earnings (This Month)"
          value={`₹${mockStats.this_month.toLocaleString('en-IN')}`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          borderColor="border-l-blue-500"
          description="vs. Last Month"
          subStats={[
            {
              label: 'Growth',
              value: `${monthlyGrowth.toFixed(1)}%`,
              icon:
                monthlyGrowth > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                ),
            },
            {
              label: 'Today',
              value: `₹${mockStats.todays_earnings}`,
              icon: <Zap className="h-3 w-3 text-yellow-500" />,
            },
          ]}
        />

        {/* 3. Network Health */}
        <StatCard
          title="Total Network"
          value={mockStats.total_referrals}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          borderColor="border-l-purple-500"
          description="Direct & Indirect"
          subStats={[
            {
              label: 'Active Users',
              value: mockStats.active_referrals,
              icon: <UserCheck className="h-3 w-3 text-emerald-500" />,
            },
            {
              label: 'Sub-Agents',
              value: mockStats.team_size,
              icon: <Briefcase className="h-3 w-3 text-blue-500" />,
            },
          ]}
        />

        {/* 4. Lifetime Achievement */}
        <StatCard
          title="Total Lifetime Earnings"
          value={`₹${mockStats.total_earnings.toLocaleString('en-IN')}`}
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
          borderColor="border-l-amber-500"
          description={`Current Tier: ${mockStats.tier}`}
          subStats={[
            {
              label: 'Next Tier',
              value: `${mockStats.next_tier_progress}%`,
              icon: <Target className="h-3 w-3 text-primary" />,
            },
          ]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart: Earnings Trend (span 4) */}
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className='text-primary'>Revenue Trend</CardTitle>
            <CardDescription>Daily earnings over the selected period</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`₹${value}`, 'Earnings']}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Secondary Chart: Earnings Source Breakdown (span 3) */}
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className='text-primary'>Earnings Source</CardTitle>
            <CardDescription>Where is your money coming from?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={earningsSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {earningsSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="mt-4 flex justify-center gap-4 text-sm">
              {earningsSourceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Growth Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Referral Growth Bar Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className='text-primary'>Network Growth</CardTitle>
            <CardDescription>New vs. Active Users per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={referralActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="active_users" name="Active Users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new_users" name="New Signups" fill="hsl(var(--primary)/0.3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className='text-primary'>Recent Activity</CardTitle>
            <CardDescription>Live updates from your network</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full bg-muted ${activity.color
                      .replace('text-', 'bg-')
                      .replace('500', '100')} dark:bg-muted`}
                  >
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
