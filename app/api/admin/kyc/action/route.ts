import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { id, userId, action, reason } = await request.json(); // action: 'APPROVE' | 'REJECT'

  if (!id || !userId || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 1. Update the Submission Record
  const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  
  const { error: submissionError } = await supabase
    .from('kyc_submissions')
    .update({ 
      status, 
      rejection_reason: reason || null,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id);

  if (submissionError) return NextResponse.json({ error: submissionError.message }, { status: 500 });

  // 2. Update the User Profile (Sync status)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ kyc_status: status })
    .eq('id', userId);

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
