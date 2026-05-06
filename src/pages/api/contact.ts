import type { APIRoute } from 'astro';

const RECIPIENTS = (import.meta.env.CONTACT_RECIPIENTS as string)
  ?.split(',')
  .map((e: string) => e.trim())
  .filter(Boolean) ?? [];

async function getAccessToken(): Promise<string> {
  console.debug('[contact] env check', {
    clientId: import.meta.env.GOOGLE_CLIENT_ID?.slice(0, 12) + '…',
    secret: import.meta.env.GOOGLE_CLIENT_SECRET ? 'set' : 'MISSING',
    refresh: import.meta.env.GOOGLE_REFRESH_TOKEN ? 'set' : 'MISSING',
    user: import.meta.env.GMAIL_USER,
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: import.meta.env.GOOGLE_CLIENT_ID as string,
      client_secret: import.meta.env.GOOGLE_CLIENT_SECRET as string,
      refresh_token: import.meta.env.GOOGLE_REFRESH_TOKEN as string,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[contact] token error', res.status, err);
    throw new Error('Failed to get access token');
  }
  const json = await res.json();
  return json.access_token as string;
}

function buildRawEmail(from: string, to: string[], replyTo: string, subject: string, body: string): string {
  const lines = [
    `From: ${from}`,
    `To: ${to.join(', ')}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ];
  return btoa(unescape(encodeURIComponent(lines.join('\r\n'))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Invalid content type' }), { status: 400 });
  }

  const body = await request.json();
  const { first_name, last_name, email, company, job_title, country, industry, interest, notes } = body;

  if (!first_name || !last_name || !email) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 422 });
  }

  if (RECIPIENTS.length === 0) {
    return new Response(JSON.stringify({ error: 'No recipients configured' }), { status: 500 });
  }

  const text = [
    '--- Contact Form Submission ---',
    `Name:       ${first_name} ${last_name}`,
    `Email:      ${email}`,
    `Company:    ${company || '—'}`,
    `Job Title:  ${job_title || '—'}`,
    `Country:    ${country || '—'}`,
    `Industry:   ${industry || '—'}`,
    `Interest:   ${interest || '—'}`,
    '',
    'Notes:',
    notes || '(none)',
  ].join('\n');

  try {
    const accessToken = await getAccessToken();
    const gmailUser = import.meta.env.GMAIL_USER as string;

    const raw = buildRawEmail(
      `"Anvil Prime Contact" <${gmailUser}>`,
      RECIPIENTS,
      email,
      `Contact Form — ${first_name} ${last_name}`,
      text,
    );

    const sendRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ raw }),
      },
    );

    if (!sendRes.ok) {
      const err = await sendRes.text();
      console.error('[contact] gmail api error', err);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('[contact] send failed', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
};
