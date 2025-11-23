// app/api/admin/kyc/list/route.ts
import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Fix: Get date strings and adjust for full day range
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    
    let from: string | null = null;
    let to: string | null = null;
    
    if (fromParam) {
      // Start of day
      const fromDate = new Date(fromParam);
      fromDate.setHours(0, 0, 0, 0);
      from = fromDate.toISOString();
    }
    
    if (toParam) {
      // End of day
      const toDate = new Date(toParam);
      toDate.setHours(23, 59, 59, 999);
      to = toDate.toISOString();
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('kyc_submissions')
      .select('*', { count: 'exact' })
      .order('submitted_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    
    if (from) {
      query = query.gte('submitted_at', from);
    }
    
    if (to) {
      query = query.lte('submitted_at', to);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    console.log('Query result:', { 
      dataCount: data?.length, 
      totalCount: count, 
      error,
      filters: { status, from, to, limit, offset }
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        data: [],
        count: count || 0,
        limit,
        offset,
      });
    }

    const dataWithUrls = await Promise.all(
      data.map(async (submission) => {
        try {
          const [frontUrl, backUrl, panUrl] = await Promise.all([
            submission.aadhaar_front_url
              ? supabase.storage.from('kyc_documents').createSignedUrl(submission.aadhaar_front_url, 3600)
              : Promise.resolve({ data: null }),
            submission.aadhaar_back_url
              ? supabase.storage.from('kyc_documents').createSignedUrl(submission.aadhaar_back_url, 3600)
              : Promise.resolve({ data: null }),
            submission.pan_card_url
              ? supabase.storage.from('kyc_documents').createSignedUrl(submission.pan_card_url, 3600)
              : Promise.resolve({ data: null }),
          ]);

          return {
            ...submission,
            aadhaar_front_signed: frontUrl.data?.signedUrl || null,
            aadhaar_back_signed: backUrl.data?.signedUrl || null,
            pan_card_signed: panUrl.data?.signedUrl || null,
          };
        } catch (urlError) {
          console.error('Error generating signed URLs:', urlError);
          return {
            ...submission,
            aadhaar_front_signed: null,
            aadhaar_back_signed: null,
            pan_card_signed: null,
          };
        }
      })
    );

    return NextResponse.json({
      data: dataWithUrls,
      count: count || 0,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
