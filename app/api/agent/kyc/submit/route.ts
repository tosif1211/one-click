// app/api/kyc/submit/route.ts
import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema
const kycSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
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
  const supabase = await createClient();
  const formData = await request.formData();

  // 1. Authenticate
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
  }
  const userId = user.id;

  // 2. Validate Data
  const rawData = Object.fromEntries(formData.entries());
  const parsed = kycSchema.safeParse(rawData);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data', details: parsed.error.format() }, { status: 400 });
  }
  const { data } = parsed;

  // Track uploaded files for cleanup
  const uploadedPaths: string[] = [];
  const filePaths: Record<string, string> = {};

  try {
    // 3. Upload Files
    const filesToUpload = {
      aadhaarFront: data.aadhaarFront,
      aadhaarBack: data.aadhaarBack,
      panCardImage: data.panCardImage,
    };

    for (const [key, file] of Object.entries(filesToUpload)) {
      const filePath = `${userId}/${key}-${Date.now()}`;

      const { error: uploadError } = await supabase.storage.from('kyc_documents').upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed for ${key}: ${uploadError.message}`);
      }

      filePaths[key] = filePath;
      uploadedPaths.push(filePath);
    }

    // 4. Insert into Database
    const dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];

    const { error: dbError } = await supabase.from('kyc_submissions').insert({
      user_id: userId,
      status: 'PENDING',
      full_name: data.fullName,
      date_of_birth: dateOfBirth,
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

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    // 5. Update Profile
    const { error: profileError } = await supabase.from('profiles').update({ kyc_status: 'PENDING' }).eq('id', userId);

    if (profileError) {
      console.warn('Profile update warning:', profileError);
    }

    return NextResponse.json({ message: 'KYC submission successful' }, { status: 200 });
  } catch (error: any) {
    console.error('KYC Submission Error:', error);

    // --- CLEANUP: Delete uploaded files if anything failed ---
    if (uploadedPaths.length > 0) {
      try {
        await supabase.storage.from('kyc_documents').remove(uploadedPaths);
        console.log('Cleaned up orphaned files:', uploadedPaths);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }

    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
  }
}
