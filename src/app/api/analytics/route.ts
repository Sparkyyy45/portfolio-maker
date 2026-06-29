import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: NextRequest) {
  try {
    const { portfolioId, eventType } = await request.json();
    if (!portfolioId || !eventType) {
      return NextResponse.json({ error: 'Missing portfolioId or eventType' }, { status: 400 });
    }

    if (!['view', 'recruiter_click'].includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { error } = await supabase
      .from('analytics')
      .insert({
        portfolio_id: portfolioId,
        event_type: eventType,
      });

    if (error) {
      // If the table doesn't exist yet, return a distinct success status or log warning
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.warn(`Analytics table does not exist. Event "${eventType}" not recorded. Please run SQL migration.`);
        return NextResponse.json({ success: false, warning: 'analytics table does not exist' });
      }
      console.error('Error inserting analytics event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in analytics route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
