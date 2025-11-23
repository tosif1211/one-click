// app/api/admin/kyc/action/route.ts
import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Authenticate
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse payload
  const { id, userId, action, reason } = await request.json();

  // ✅ DEBUG LOG 1: See what we received
  console.log('📥 Received payload:', { id, userId, action, reason });
  console.log('📊 Types:', { 
    idType: typeof id, 
    userIdType: typeof userId,
    idValue: id,
    userIdValue: userId
  });

  // 3. Validate
  if (!id || !userId || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!['APPROVE', 'REJECT'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  if (action === 'REJECT' && !reason) {
    return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 });
  }

  const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

  try {
    // ✅ DEBUG LOG 2: Check if the row exists BEFORE update
    const { data: existingRow, error: checkError } = await supabase
      .from('kyc_submissions')
      .select('id, user_id, status')
      .eq('id', Number(id))
      .single();

    console.log('🔍 Existing row check:', { existingRow, checkError });

    if (!existingRow) {
      return NextResponse.json({ 
        error: `No KYC submission found with id=${id}. Database returned: ${checkError?.message || 'null'}` 
      }, { status: 404 });
    }

    // ✅ DEBUG LOG 3: Compare userId
    console.log('🆔 User ID comparison:', {
      received: userId,
      inDatabase: existingRow.user_id,
      match: userId === existingRow.user_id
    });

    if (existingRow.user_id !== userId) {
      return NextResponse.json({ 
        error: `User ID mismatch. Expected: ${existingRow.user_id}, Got: ${userId}` 
      }, { status: 400 });
    }

    // 4. Perform Update
    const { data: updateData, error: submissionError } = await supabase
      .from('kyc_submissions')
      .update({
        status: newStatus,
        rejection_reason: action === 'REJECT' ? reason : null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', Number(id))
      .eq('user_id', userId)
      .select();

    console.log('✅ Update result:', { updateData, submissionError });

    if (submissionError) {
      return NextResponse.json({ error: submissionError.message }, { status: 500 });
    }

    if (!updateData || updateData.length === 0) {
      return NextResponse.json({ 
        error: 'Update succeeded but returned no rows. This should not happen.' 
      }, { status: 500 });
    }

    // 5. Update profile
    await supabase
      .from('profiles')
      .update({ kyc_status: newStatus })
      .eq('id', userId);

    return NextResponse.json({ 
      success: true, 
      message: `KYC ${newStatus.toLowerCase()} successfully`,
      data: updateData[0]
    });

  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
