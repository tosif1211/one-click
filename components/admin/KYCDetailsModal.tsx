'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  User,
  FileText,
  CreditCard,
  ZoomIn,
  Calendar,
  Building2,
  Hash,
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Textarea } from '../ui/textarea';

export interface KYCSubmission {
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

interface KYCDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KYCSubmission | null;
  onAction?: (action: 'APPROVE' | 'REJECT', reason?: string) => Promise<void>; // ✅ Optional
  actionLoading?: boolean; // ✅ Optional
  mode?: 'admin' | 'agent'; // ✅ New prop
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

export default function KYCDetailsModal({
  isOpen,
  onClose,
  data,
  onAction,
  actionLoading = false,
  mode = 'admin', // ✅ Default to admin
}: KYCDetailsModalProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null);

  const handleActionClick = (action: 'APPROVE' | 'REJECT') => {
    if (onAction) {
      onAction(action, rejectReason);
      if (action === 'APPROVE') setRejectReason('');
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
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

          {data && (
            <div className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
              <section>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1 sm:p-1.5 rounded-md bg-blue-500/10">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">Personal Information</h3>
                </div>

                <Card className="bg-linear-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 border-blue-200/50 dark:border-blue-800/30">
                  <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                    <Detail icon={User} label="Full Name" value={data.full_name} />
                    <Detail icon={User} label="Account Holder" value={data.account_holder_name} />
                    <Detail
                      icon={Calendar}
                      label="Date of Birth"
                      value={new Date(data.date_of_birth).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    />
                    <Detail
                      icon={Calendar}
                      label="Submitted On"
                      value={new Date(data.submitted_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    />
                    <Detail icon={CreditCard} label="PAN Number" value={data.pan_number} mono />
                    <Detail icon={Hash} label="Aadhaar Number" value={data.aadhaar_number} mono />
                  </CardContent>
                </Card>
              </section>

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
                    src={data.aadhaar_front_signed}
                    onZoom={() =>
                      setZoomedImage({
                        src: data.aadhaar_front_signed,
                        title: 'Aadhaar Front',
                      })
                    }
                  />
                  <ImageCard
                    title="Aadhaar Back"
                    src={data.aadhaar_back_signed}
                    onZoom={() =>
                      setZoomedImage({
                        src: data.aadhaar_back_signed,
                        title: 'Aadhaar Back',
                      })
                    }
                  />
                  <ImageCard
                    title="PAN Card"
                    src={data.pan_card_signed}
                    onZoom={() =>
                      setZoomedImage({
                        src: data.pan_card_signed,
                        title: 'PAN Card',
                      })
                    }
                  />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1 sm:p-1.5 rounded-md bg-green-500/10">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">Banking Information</h3>
                </div>

                <Card className="bg-linear-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 border-green-200/50 dark:border-green-800/30">
                  <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <Detail icon={Building2} label="Bank Name" value={data.bank_name} />
                    <Detail icon={Hash} label="Account Number" value={data.account_number} mono />
                    <Detail icon={CreditCard} label="IFSC Code" value={data.ifsc_code} mono />
                    {data.upi_id && <Detail icon={CreditCard} label="UPI ID" value={data.upi_id} mono />}
                  </CardContent>
                </Card>
              </section>
              {mode === 'admin' && onAction && (
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
                      onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
                        setRejectReason(e.target.value)
                      }
                      rows={3}
                      className="resize-none text-xs sm:text-sm"
                    />
                  </div>

                  <div className="flex flex-row gap-2 sm:gap-3 pt-2">
                    <Button
                      variant="destructive"
                      className="flex-1 h-10 sm:h-11 text-xs sm:text-sm"
                      onClick={() => handleActionClick('REJECT')}
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
                      onClick={() => handleActionClick('APPROVE')}
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
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
