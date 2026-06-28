import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ownerEmail, visitorName, visitorEmail, message, portfolioName } = body;

    if (!ownerEmail || !visitorName || !visitorEmail || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      // Dev mode — log only, return success so the form still works
      console.log('[DevPort Contact] RESEND_API_KEY not set. Add it to .env.local to enable email delivery.');
      console.log('Would have sent to:', ownerEmail, '| From:', visitorName, '<' + visitorEmail + '>');
      return NextResponse.json({ ok: true, dev: true });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const subjectLine = `New message from ${visitorName} — via your DevPort portfolio`;

    const htmlBody = [
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head>',
      '<body style="margin:0;padding:0;font-family:sans-serif;background:#f9fafb;">',
      '<div style="max-width:600px;margin:40px auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">',
      '<div style="background:#111827;padding:28px 32px;">',
      '<span style="color:#fff;font-weight:700;font-size:15px;letter-spacing:.05em;text-transform:uppercase;">DEVPORT</span>',
      '</div>',
      '<div style="padding:36px 32px;">',
      `<h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;">New message from ${visitorName}</h1>`,
      `<p style="margin:0 0 28px;font-size:13px;color:#6b7280;">Via your <strong>${portfolioName || 'DevPort'}</strong> portfolio.</p>`,
      '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:24px;">',
      '<p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;color:#9ca3af;">From</p>',
      `<p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#111827;">${visitorName}</p>`,
      `<a href="mailto:${visitorEmail}" style="font-size:14px;color:#6366f1;text-decoration:none;">${visitorEmail}</a>`,
      '</div>',
      '<p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;color:#9ca3af;">Message</p>',
      '<div style="background:#f9fafb;border-left:3px solid #6366f1;border-radius:0 8px 8px 0;padding:16px 20px;">',
      `<p style="margin:0;font-size:14px;line-height:1.7;color:#374151;white-space:pre-wrap;">${message}</p>`,
      '</div>',
      '<div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;">',
      `<a href="mailto:${visitorEmail}?subject=Re: Your message via DevPort" style="display:inline-block;background:#111827;color:#fff;font-size:13px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">Reply to ${visitorName}</a>`,
      '</div>',
      '</div>',
      '<div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">',
      '<p style="margin:0;font-size:12px;color:#9ca3af;">Sent via DevPort. Someone submitted your portfolio contact form.</p>',
      '</div>',
      '</div></body></html>',
    ].join('');

    const { error } = await resend.emails.send({
      from: 'DevPort <onboarding@resend.dev>',
      to: [ownerEmail],
      replyTo: visitorEmail,
      subject: subjectLine,
      html: htmlBody,
    });

    if (error) {
      console.error('Resend delivery error:', error);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const e = err as Error;
    console.error('Contact route error:', e);
    return NextResponse.json({ error: e.message || 'Unexpected error.' }, { status: 500 });
  }
}
