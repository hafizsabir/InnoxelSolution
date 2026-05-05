import { SignJWT, jwtVerify } from 'jose';

export type AppTokenPayload = {
  sub: string;       // user id
  email: string;
  role: 'admin' | 'user';
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set in environment variables');
  return new TextEncoder().encode(secret);
}

/** Issue a signed JWT valid for 7 days */
export async function signAppToken(payload: AppTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

/** Verify and decode an app JWT — returns null on failure */
export async function verifyAppToken(token: string): Promise<AppTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as AppTokenPayload;
  } catch {
    return null;
  }
}

export const APP_TOKEN_COOKIE = 'app_token';
