import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name ?? '' } },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Insert profile with 'user' role — promote to 'admin' manually in Supabase dashboard
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      role: 'user',
    });
  }

  return NextResponse.json({
    message: 'Account created! Check your email to confirm, then log in.',
  });
}
