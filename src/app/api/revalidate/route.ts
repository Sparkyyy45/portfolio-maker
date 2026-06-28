import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  const secret = request.nextUrl.searchParams.get('secret');

  // Verify revalidation secret
  const configuredSecret = process.env.REVALIDATION_SECRET;
  if (configuredSecret && secret !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required (e.g. /username)' }, { status: 400 });
  }

  try {
    // Revalidate the Vercel Edge Cache path
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Revalidation failed' }, { status: 500 });
  }
}
