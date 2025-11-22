// app/api/kyc/submit/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for form data validation on the server
const kycSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(), // Dates are received as strings
  panNumber: z.string(),
  aadhaarNumber: z.string(),
  accountHolderName: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
  bankName: z.string(),
  upiId: z.string().optional(),
  aadhaarFront: z.instanceof(File),
  aadhaarBack: z.instanceof(File),
  panCardImage: z.instanceof(File),
});

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();

  // Get the current user session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
  }
  const userId = session.user.id;

  // --- 1. Validate Form Data ---
  const rawData = Object.fromEntries(formData.entries());
  const parsed = kycSchema.safeParse(rawData);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data', details: parsed.error.format() }, { status: 400 });
  }
  const { data } = parsed;

  const fileUploadPromises = [];
  const filePaths: Record<string, string> = {};

  // --- 2. Upload Files to Supabase Storage ---
  const filesToUpload = {
    aadhaarFront: data.aadhaarFront,
    aadhaarBack: data.aadhaarBack,
    panCardImage: data.panCardImage,
  };

  for (const [key, file] of Object.entries(filesToUpload)) {
    const filePath = `${userId}/${key}-${Date.now()}`;
    filePaths[key] = filePath;
    fileUploadPromises.push(supabase.storage.from('kyc_documents').upload(filePath, file));
  }

  const uploadResults = await Promise.all(fileUploadPromises);

  // Check for any upload errors
  for (const result of uploadResults) {
    if (result.error) {
      console.error('Supabase Storage Error:', result.error);
      return NextResponse.json({ error: 'File upload failed', details: result.error.message }, { status: 500 });
    }
  }

  // --- 3. Insert Data into Database ---
  const { error: dbError } = await supabase.from('kyc_submissions').insert({
    user_id: userId,
    status: 'PENDING',
    full_name: data.fullName,
    date_of_birth: data.dateOfBirth,
    pan_number: data.panNumber,
    aadhaar_number: data.aadhaarNumber,
    account_holder_name: data.accountHolderName,
    account_number: data.accountNumber,
    ifsc_code: data.ifscCode,
    bank_name: data.bankName,
    upi_id: data.upiId,
    aadhaar_front_url: filePaths.aadhaarFront,
    aadhaar_back_url: filePaths.aadhaarBack,
    pan_card_url: filePaths.panCardImage,
  });

  if (dbError) {
    console.error('Supabase DB Error:', dbError);
    return NextResponse.json({ error: 'Database insertion failed', details: dbError.message }, { status: 500 });
  }

  // --- 4. Update Profile Status ---
  const { error: profileError } = await supabase.from('profiles').update({ kyc_status: 'PENDING' }).eq('id', userId);

  if (profileError) {
    // This is not critical enough to fail the whole request, but should be logged.
    console.warn('Could not update profile status:', profileError);
  }

  return NextResponse.json({ message: 'KYC submission successful' }, { status: 200 });
}
