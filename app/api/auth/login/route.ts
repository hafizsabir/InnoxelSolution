import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signAppToken, APP_TOKEN_COOKIE, type AppTokenPayload } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const supabase = await createClient();

  // 1. Supabase sign-in
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? 'Login failed' }, { status: 401 });
  }

  // 2. Fetch role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  const role = (profile?.role ?? 'user') as 'admin' | 'user';

  // 3. Issue a custom JWT with role embedded
  const payload: AppTokenPayload = {
    sub: data.user.id,
    email: data.user.email!,
    role,
  };
  const appToken = await signAppToken(payload);

  // 4. Set as HttpOnly cookie
  const res = NextResponse.json({
    user: { id: data.user.id, email: data.user.email, role },
    message: 'Login successful',
  });

  res.cookies.set(APP_TOKEN_COOKIE, appToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return res;
}
