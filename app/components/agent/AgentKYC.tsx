'use client';

import React, { useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Calendar, ShieldCheck, UploadCloud, CheckCircle2, FileText, CreditCard, User, Clock, X } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const formatDate = (date: string | number | Date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const kycSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  dateOfBirth: z.date().refine((date) => date !== undefined, { message: "Date of birth is required." }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Card number format'),
  aadhaarNumber: z.string().regex(/^[2-9]{1}[0-9]{11}$/, 'Invalid Aadhaar number (12 digits)'),
  accountHolderName: z.string().min(3, 'Account holder name is required'),
  accountNumber: z.string().min(9, 'Account number must be valid'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code'),
  bankName: z.string().min(2, 'Bank name is required'),
  upiId: z.string().optional(),
  aadhaarFront: z.any().refine((file) => file, 'Aadhaar Front is required'),
  aadhaarBack: z.any().refine((file) => file, 'Aadhaar Back is required'),
  panCardImage: z.any().refine((file) => file, 'PAN Card image is required'),
});

type KycFormValues = z.infer<typeof kycSchema>;

const INITIAL_STATUS = 'NOT_SUBMITTED';

export default function AgentKYC() {
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [activeTab, setActiveTab] = useState('personal');
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState<string | null>(null);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState<string | null>(null);
  const [panCardImagePreview, setPanCardImagePreview] = useState<string | null>(null);

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      fullName: '',
      panNumber: '',
      aadhaarNumber: '',
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      upiId: '',
    },
  });

  const handleFileChange = (
    field: keyof KycFormValues,
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (PNG, JPG, etc.).');
        return;
      }
      form.setValue(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const removeFile = (
    field: keyof KycFormValues,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    form.setValue(field, undefined);
    setPreview(null);
  };

  const onError = (errors: FieldErrors<KycFormValues>) => {
    toast.error("Please fill in all required fields correctly.");
    const personalFields = ['fullName', 'dateOfBirth', 'panNumber', 'aadhaarNumber'];
    const documentFields = ['aadhaarFront', 'aadhaarBack', 'panCardImage'];
    const bankingFields = ['accountHolderName', 'accountNumber', 'ifscCode', 'bankName'];

    const hasPersonalError = personalFields.some(field => errors[field as keyof KycFormValues]);
    const hasDocumentError = documentFields.some(field => errors[field as keyof KycFormValues]);
    const hasBankingError = bankingFields.some(field => errors[field as keyof KycFormValues]);

    if (hasPersonalError) setActiveTab('personal');
    else if (hasDocumentError) setActiveTab('documents');
    else if (hasBankingError) setActiveTab('banking');
  };

  const onSubmit = async (data: KycFormValues) => {
    const loadingToast = toast.loading('Submitting KYC documents...');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.dismiss(loadingToast);
      toast.success('KYC submitted successfully! Waiting for admin approval.');
      setStatus('PENDING');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Submission failed. Please try again.');
    }
  };

  if (status === 'PENDING') {
    return (
      <div className="max-w-3xl mx-auto pt-10 px-4">
        <Card className="border-l-4 border-l-yellow-500 shadow-md">
          <CardHeader className="text-center pb-10 pt-10">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Verification in Progress</CardTitle>
            <CardDescription className="text-base mt-2">
              Our team is reviewing your documents. This usually takes 24-48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-10">
            <Button variant="outline" onClick={() => setStatus('NOT_SUBMITTED')}>
              (Dev Mode: Reset to Edit)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'APPROVED') {
    return (
      <div className="max-w-3xl mx-auto pt-10 px-4">
        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardHeader className="text-center pb-10 pt-10">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">KYC Verified</CardTitle>
            <CardDescription className="text-base mt-2">
              Congratulations! Your account is fully verified. You can now access all agent features.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your profile to activate payouts and referral links.
        </p>
      </div>

      <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-6">
        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300 font-semibold">Secure Submission</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
          Your documents are encrypted and stored securely.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
              <TabsTrigger value="personal" className="py-3 gap-2"><User className="w-4 h-4" /> Personal</TabsTrigger>
              <TabsTrigger value="documents" className="py-3 gap-2"><FileText className="w-4 h-4" /> Documents</TabsTrigger>
              <TabsTrigger value="banking" className="py-3 gap-2"><CreditCard className="w-4 h-4" /> Banking</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Enter your details exactly as on your ID.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-destructive ms-1">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Full Name"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.trimStart())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="mb-1.5">Date of Birth <span className="text-destructive ms-1">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                  {field.value ? formatDate(field.value) : <span>Enter Date of Birth</span>}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN Number <span className="text-destructive ms-1">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter PAN Number"
                              {...field}
                              maxLength={10}
                              onChange={(e) => field.onChange(e.target.value.replace(/\s/g, '').toUpperCase())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aadhaarNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhaar Number <span className="text-destructive ms-1">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Aadhaar Number"
                              maxLength={12}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab('documents')}>Next: Documents</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Document Upload</CardTitle>
                  <CardDescription>Upload clear images of your documents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="aadhaarFront" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Front <span className="text-destructive ms-1">*</span></FormLabel>
                        <FormControl>
                          {aadhaarFrontPreview ? (
                            <div className="relative w-full h-40 group">
                              <img src={aadhaarFrontPreview} alt="Aadhaar Front Preview" className="h-full w-full object-contain rounded-lg border-2 border-dashed p-1" />
                              <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFile('aadhaarFront', setAadhaarFrontPreview)}><X className="h-4 w-4" /></Button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                              <p className="text-xs text-muted-foreground">Click to upload</p>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange('aadhaarFront', e, setAadhaarFrontPreview)} />
                            </label>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="aadhaarBack" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Back <span className="text-destructive ms-1">*</span></FormLabel>
                        <FormControl>
                          {aadhaarBackPreview ? (
                            <div className="relative w-full h-40 group">
                              <img src={aadhaarBackPreview} alt="Aadhaar Back Preview" className="h-full w-full object-contain rounded-lg border-2 border-dashed p-1" />
                              <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFile('aadhaarBack', setAadhaarBackPreview)}><X className="h-4 w-4" /></Button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                              <p className="text-xs text-muted-foreground">Click to upload</p>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange('aadhaarBack', e, setAadhaarBackPreview)} />
                            </label>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="panCardImage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Card <span className="text-destructive ms-1">*</span></FormLabel>
                      <FormControl>
                        {panCardImagePreview ? (
                          <div className="relative w-full h-40 group">
                            <img src={panCardImagePreview} alt="PAN Card Preview" className="h-full w-full object-contain rounded-lg border-2 border-dashed p-1" />
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFile('panCardImage', setPanCardImagePreview)}><X className="h-4 w-4" /></Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-xs text-muted-foreground">Click to upload</p>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange('panCardImage', e, setPanCardImagePreview)} />
                          </label>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" type="button" onClick={() => setActiveTab('personal')}>Back</Button>
                  <Button type="button" onClick={() => setActiveTab('banking')}>Next: Bank Details</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="banking">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Enter the bank account for commission payouts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="accountHolderName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name <span className="text-destructive ms-1">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Account Holder Name"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.trimStart())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="accountNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number <span className="text-destructive ms-1">*</span></FormLabel>
                        <FormControl><Input type="password" placeholder="Enter Account Number" {...field} onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ''))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="ifscCode" render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code <span className="text-destructive ms-1">*</span></FormLabel>
                        <FormControl><Input placeholder="Enter IFSC Code" {...field} onChange={(e) => field.onChange(e.target.value.replace(/\s/g, '').toUpperCase())} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="bankName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name <span className="text-destructive ms-1">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Bank Name"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.trimStart())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="upiId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID (Optional)</FormLabel>
                        <FormControl><Input placeholder="Enter UPI ID" {...field} onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ''))} /></FormControl>
                        <FormDescription>For faster small payouts</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" type="button" onClick={() => setActiveTab('documents')}>Back</Button>
                  <Button type="submit">Submit Application</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </>
  );
}
