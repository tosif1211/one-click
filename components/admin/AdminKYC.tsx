'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  FileText,
  CreditCard,
  ZoomIn,
  Calendar,
  Building2,
  Hash,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataTable from '../reusable/DataTable';
import DateRangePicker from '../reusable/DateRangePicker';
import { DateRange } from 'react-day-picker';
import moment from 'moment';
import { Textarea } from '../textarea';

// --- Types ---
interface KYCSubmission {
  status: string;
  id: number;
  user_id: string;
  full_name: string;
  submitted_at: string;
  pan_number: string;
  aadhaar_number: string;
  aadhaar_front_signed: string;
  aadhaar_back_signed: string;
  pan_card_signed: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  date_of_birth: string;
  upi_id?: string;
}

const Detail = ({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon?: any;
  label: string;
  value: string | number;
  mono?: boolean;
}) => (
  <div className="group">
    <div className="flex items-center gap-1.5 mb-1">
      {Icon && <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />}
      <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
    <p
      className={`text-xs sm:text-sm font-semibold ${
        mono ? 'font-mono tracking-tight' : ''
      } text-foreground wrap-break-word`}
    >
      {value}
    </p>
  </div>
);

const ImageCard = ({ title, src, onZoom }: { title: string; src?: string; onZoom?: () => void }) => (
  <div className="group relative border rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-200 bg-linear-to-br from-background to-muted/20">
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <p className="text-xs sm:text-sm font-semibold text-foreground">{title}</p>
      {src && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoom}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 sm:h-8 sm:w-8"
        >
          <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      )}
    </div>
    <div className="bg-linear-to-br from-muted/30 to-muted/60 rounded-md sm:rounded-lg flex items-center justify-center min-h-[120px] sm:min-h-[180px] overflow-hidden border border-border/50">
      {src ? (
        <img
          src={src}
          alt={title}
          className="w-full h-auto object-contain max-h-40 sm:max-h-64 transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer"
          onClick={onZoom}
        />
      ) : (
        <div className="text-center p-4 sm:p-6">
          <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs sm:text-sm text-muted-foreground">No image available</p>
        </div>
      )}
    </div>
  </div>
);

const ImageZoomDialog = ({
  open,
  src,
  title,
  onClose,
}: {
  open: boolean;
  src: string;
  title: string;
  onClose: () => void;
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="w-[95vw] max-w-5xl max-h-[95vh] p-0 overflow-hidden">
      <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <DialogTitle className="text-base sm:text-xl font-semibold">{title}</DialogTitle>
      </DialogHeader>
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="bg-muted/30 rounded-lg p-2 flex items-center justify-center max-h-[70vh] sm:max-h-[75vh] overflow-auto">
          <img src={src} alt={title} className="w-full h-auto object-contain rounded" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default function AdminKYC() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<KYCSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    now.setHours(23, 59, 59, 999);
    return { from: yesterday, to: now };
  });

  // Memoized filtered data - no API call needed for client-side filtering
  const filteredData = useMemo(() => {
    if (statusFilter === 'ALL') {
      return submissions;
    }
    return submissions.filter((s) => s.status === statusFilter);
  }, [submissions, statusFilter]);

  // Fetch data - only on mount and dateRange change
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

  // Only fetch when dateRange changes
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const openReview = useCallback((item: KYCSubmission) => {
    setSelectedItem(item);
    setOpenDialog(true);
  }, []);

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!selectedItem) return;
    if (action === 'REJECT' && !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await axios.post('/api/admin/kyc/action', {
        id: selectedItem.id,
        userId: selectedItem.user_id,
        action,
        reason: rejectReason,
      });

      toast.success(`KYC ${action === 'APPROVE' ? 'Approved' : 'Rejected'} successfully`);
      setOpenDialog(false);
      setSelectedItem(null);
      setRejectReason('');
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

  // Memoized columns
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
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">KYC Approvals</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Review and manage agent verification requests</p>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      {/* Main Card */}
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

      {/* Review Dialog - Responsive */}
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) {
            setSelectedItem(null);
            setRejectReason('');
          }
        }}
      >
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg md:text-xl font-bold">Review Application</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Verify user documents against the details provided
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
              {/* PERSONAL DETAILS */}
              <section>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1 sm:p-1.5 rounded-md bg-blue-500/10">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">Personal Information</h3>
                </div>

                <Card className="bg-linear-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 border-blue-200/50 dark:border-blue-800/30">
                  <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                    <Detail icon={User} label="Full Name" value={selectedItem.full_name} />
                    <Detail icon={User} label="Account Holder" value={selectedItem.account_holder_name} />
                    <Detail
                      icon={Calendar}
                      label="Date of Birth"
                      value={new Date(selectedItem.date_of_birth).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    />
                    <Detail
                      icon={Calendar}
                      label="Submitted On"
                      value={new Date(selectedItem.submitted_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    />
                    <Detail icon={CreditCard} label="PAN Number" value={selectedItem.pan_number} mono />
                    <Detail
                      icon={Hash}
                      label="Aadhaar Number"
                      value={selectedItem.aadhaar_number}
                      mono
                    />
                  </CardContent>
                </Card>
              </section>

              {/* DOCUMENT IMAGES */}
              <section>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1 sm:p-1.5 rounded-md bg-purple-500/10">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">Identity Documents</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <ImageCard
                    title="Aadhaar Front"
                    src={selectedItem.aadhaar_front_signed}
                    onZoom={() =>
                      setZoomedImage({
                        src: selectedItem.aadhaar_front_signed,
                        title: 'Aadhaar Front',
                      })
                    }
                  />
                  <ImageCard
                    title="Aadhaar Back"
                    src={selectedItem.aadhaar_back_signed}
                    onZoom={() =>
                      setZoomedImage({
                        src: selectedItem.aadhaar_back_signed,
                        title: 'Aadhaar Back',
                      })
                    }
                  />
                  <ImageCard
                    title="PAN Card"
                    src={selectedItem.pan_card_signed}
                    onZoom={() =>
                      setZoomedImage({
                        src: selectedItem.pan_card_signed,
                        title: 'PAN Card',
                      })
                    }
                  />
                </div>
              </section>

              {/* BANK DETAILS */}
              <section>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1 sm:p-1.5 rounded-md bg-green-500/10">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">Banking Information</h3>
                </div>

                <Card className="bg-linear-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 border-green-200/50 dark:border-green-800/30">
                  <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <Detail icon={Building2} label="Bank Name" value={selectedItem.bank_name} />
                    <Detail icon={Hash} label="Account Number" value={selectedItem.account_number} mono />
                    <Detail icon={CreditCard} label="IFSC Code" value={selectedItem.ifsc_code} mono />
                    {selectedItem.upi_id && (
                      <Detail icon={CreditCard} label="UPI ID" value={selectedItem.upi_id} mono />
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* ACTION ZONE */}
              <section className="pt-4 sm:pt-6 border-t space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-foreground block">
                    Rejection Reason
                    <span className="text-muted-foreground font-normal ml-2 text-[10px] sm:text-xs">
                      (Required only for rejection)
                    </span>
                  </label>

                  <Textarea
                    placeholder="E.g., Name on PAN does not match the provided name..."
                    value={rejectReason}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setRejectReason(e.target.value)}
                    rows={3}
                    className="resize-none text-xs sm:text-sm"
                  />
                </div>

                <div className="flex flex-row gap-2 sm:gap-3 pt-2">
                  <Button
                    variant="destructive"
                    className="flex-1 h-10 sm:h-11 text-xs sm:text-sm"
                    onClick={() => handleAction('REJECT')}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        Reject Application
                      </>
                    )}
                  </Button>

                  <Button
                    className="flex-1 h-10 sm:h-11 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAction('APPROVE')}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        Approve Application
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[10px] sm:text-xs text-center text-muted-foreground pt-1">
                  Please verify all details carefully before approving or rejecting
                </p>
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Zoom Dialog */}
      {zoomedImage && (
        <ImageZoomDialog
          open={!!zoomedImage}
          src={zoomedImage.src}
          title={zoomedImage.title}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </>
  );
}
