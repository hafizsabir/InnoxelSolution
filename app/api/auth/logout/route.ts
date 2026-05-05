import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { APP_TOKEN_COOKIE } from '@/lib/jwt';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const res = NextResponse.json({ ok: true });

  // Clear the custom JWT cookie
  res.cookies.set(APP_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return res;
}
