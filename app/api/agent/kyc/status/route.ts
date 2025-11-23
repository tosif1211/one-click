// app/api/agent/kyc/status/route.ts
import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('kyc_submissions')
    .select('*') // ✅ Changed from 'status, rejection_reason' to '*'
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If no KYC found
  if (!data) {
    return NextResponse.json({
      status: 'NOT_SUBMITTED',
      rejection_reason: null,
      data: null,
    });
  }

  // ✅ Generate signed URLs for documents (if status is APPROVED or user wants to view)
  const { data: frontUrl } = await supabase.storage.from('kyc_documents').createSignedUrl(data.aadhaar_front_url, 3600);

  const { data: backUrl } = await supabase.storage.from('kyc_documents').createSignedUrl(data.aadhaar_back_url, 3600);

  const { data: panUrl } = await supabase.storage.from('kyc_documents').createSignedUrl(data.pan_card_url, 3600);

  return NextResponse.json({
    status: data.status,
    rejection_reason: data.rejection_reason || null,
    data: {
      ...data,
      aadhaar_front_signed: frontUrl?.signedUrl || null,
      aadhaar_back_signed: backUrl?.signedUrl || null,
      pan_card_signed: panUrl?.signedUrl || null,
    },
  });
}
