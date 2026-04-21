import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET ?? "manvie-dev-secret-change-in-production";

export function createToken(payload: Record<string, unknown>): string {
  const data = JSON.stringify({ ...payload, iat: Date.now() });
  const b64 = Buffer.from(data).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(b64)
    .digest("base64url");
  return `${b64}.${sig}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  try {
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(b64)
      .digest("base64url");
    const sigBuf = Buffer.from(sig, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    // Token expires after 24h
    if (Date.now() - payload.iat > 86400000) return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(password.trim())
    .digest("hex");
}
