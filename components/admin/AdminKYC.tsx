'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataTable from '../reusable/DataTable';
import DateRangePicker from '../reusable/DateRangePicker';
import { DateRange } from 'react-day-picker';
import moment from 'moment';
import AdminKYCModal, { KYCSubmission } from './KYCDetailsModal';

export default function AdminKYC() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<KYCSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    now.setHours(23, 59, 59, 999);
    return { from: yesterday, to: now };
  });

  const filteredData = useMemo(() => {
    if (statusFilter === 'ALL') {
      return submissions;
    }
    return submissions.filter((s) => s.status === statusFilter);
  }, [submissions, statusFilter]);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};

      if (dateRange?.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        params.from = fromDate.toISOString();
      }

      if (dateRange?.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        params.to = toDate.toISOString();
      }

      const res = await axios.get('/api/admin/kyc/list', { params });
      const responseData = res.data.data || [];

      setSubmissions(responseData);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch KYC requests');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const openReview = useCallback((item: KYCSubmission) => {
    setSelectedItem(item);
    setOpenDialog(true);
  }, []);

  const handleAction = async (action: 'APPROVE' | 'REJECT', reason?: string) => {
    if (!selectedItem) return;
    if (action === 'REJECT' && !reason?.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await axios.post('/api/admin/kyc/action', {
        id: selectedItem.id,
        userId: selectedItem.user_id,
        action,
        reason: reason,
      });

      toast.success(`KYC ${action === 'APPROVE' ? 'Approved' : 'Rejected'} successfully`);
      setOpenDialog(false);
      setSelectedItem(null);
      fetchSubmissions();
    } catch (error: any) {
      console.error('Action error:', error);
      toast.error(error.response?.data?.error || 'Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (value: string): string => {
    if (!value) return '-';
    return moment(value).format('DD MMM YYYY, hh:mm A');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Full Name',
        cell: ({ row }: any) => <div className="font-medium text-xs sm:text-sm">{row.getValue('full_name')}</div>,
      },
      {
        accessorKey: 'submitted_at',
        header: 'Submitted At',
        cell: ({ row }: any) => {
          const time = row.getValue('submitted_at') as string;
          return <div className="text-xs sm:text-sm">{formatDateTime(time)}</div>;
        },
      },
      {
        accessorKey: 'pan_number',
        header: 'PAN',
        cell: ({ row }: any) => <div className="font-mono text-xs sm:text-sm">{row.getValue('pan_number')}</div>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: any) => {
          const status = (row.getValue('status') as string) || '';
          const variant = status === 'PENDING' ? 'default' : status === 'APPROVED' ? 'secondary' : 'destructive';
          const className =
            status === 'PENDING'
              ? 'bg-yellow-100 !text-yellow-800 hover:bg-yellow-200'
              : status === 'APPROVED'
              ? 'bg-green-100 !text-green-800 hover:bg-green-200'
              : 'bg-red-100 !text-red-800 hover:bg-red-200';

          const display = status.charAt(0) + status.slice(1).toLowerCase();

          return (
            <Badge variant={variant as any} className={`${className} text-[10px] sm:text-xs`}>
              {display}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        disableSorting: true,
        cell: ({ row }: any) => {
          const item = row.original;
          return (
            <Button size="sm" variant="ghost" onClick={() => openReview(item)} className="h-8 w-8 p-0">
              <Eye className="w-4 h-4 text-primary" />
            </Button>
          );
        },
      },
    ],
    [openReview]
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">KYC Approvals</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Review and manage agent verification requests</p>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg md:text-xl text-primary flex flex-wrap justify-between items-start sm:items-center gap-3 sm:gap-4">
            <span>KYC List</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-lg font-medium text-muted-foreground">No KYC submissions found</p>
              <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredData} />
          )}
        </CardContent>
      </Card>

      <AdminKYCModal
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        data={selectedItem}
        onAction={handleAction}
        actionLoading={actionLoading}
        mode="admin"
      />
    </>
  );
}
