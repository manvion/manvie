import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET ?? "manvie-dev-secret-change-in-production";

function verifyToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [b64, sig] = parts;
  try {
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(b64)
      .digest("base64url");
    const sigBuf = Buffer.from(sig, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    // Token expires after 24h
    if (Date.now() - payload.iat > 86400000) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Protect /admin (except /admin/login) ────────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("manvie-admin")?.value;
    if (!token || !verifyToken(token)) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── Protect /supplier (except /supplier/login) ───────────────────────────
  if (pathname.startsWith("/supplier") && !pathname.startsWith("/supplier/login")) {
    const token = request.cookies.get("manvie-merchant")?.value;
    if (!token || !verifyToken(token)) {
      const url = new URL("/supplier/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|icon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
