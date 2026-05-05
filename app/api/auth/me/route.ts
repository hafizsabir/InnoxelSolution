import { NextResponse, type NextRequest } from 'next/server';
import { verifyAppToken, APP_TOKEN_COOKIE } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(APP_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = await verifyAppToken(token);

  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    },
  });
}
