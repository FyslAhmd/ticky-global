import * as jose from "jose";
import { env } from "../lib/env";

export type SessionPayload = {
  userId: number;
  email: string;
};

const JWT_ALG = "HS256";

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT({ email: payload.email })
    .setSubject(String(payload.userId))
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30 days")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
    });
    const userId = Number(payload.sub);
    const email = payload.email as string;
    if (!userId || !email) return null;
    return { userId, email };
  } catch {
    return null;
  }
}
