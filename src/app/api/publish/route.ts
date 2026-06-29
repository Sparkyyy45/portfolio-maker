import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-project-url') {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
    }

    // Initialize server-side Supabase client with the user's JWT
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
      },
    });

    // Verify user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 });
    }

    const { content, username, isPublished } = await request.json();

    // 1. Update Profile (username, is_published)
    if (username !== undefined || isPublished !== undefined) {
      const profileUpdates: any = {};
      if (username !== undefined) profileUpdates.username = username;
      if (isPublished !== undefined) profileUpdates.is_published = isPublished;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...profileUpdates
        });

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }
    }

    // 2. Update Portfolio Content
    if (content) {
      const { error: portfolioError } = await supabase
        .from('portfolios')
        .upsert({
          id: user.id,
          content: content,
          updated_at: new Date().toISOString(),
        });

      if (portfolioError) {
        return NextResponse.json({ error: portfolioError.message }, { status: 400 });
      }
    }

    // 3. Trigger on-demand cache revalidation
    if (username) {
      try {
        revalidatePath(`/${username}`);
      } catch (revalError) {
        console.error('Revalidation error:', revalError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Publish API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
