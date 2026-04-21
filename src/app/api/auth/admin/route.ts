import { NextResponse } from "next/server";
import { createToken, hashPassword } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
    // Default password hash for "manvie-admin-2024" — CHANGE IN PRODUCTION via env
    const expectedHash =
      process.env.ADMIN_PASSWORD_HASH ?? hashPassword("manvie-admin-2024");

    const inputHash = hashPassword(String(password));

    if (
      String(username).trim() !== expectedUser ||
      inputHash !== expectedHash
    ) {
      // Constant-time delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createToken({ role: "admin", user: username });

    const res = NextResponse.json({ success: true, redirect: "/admin" });
    res.cookies.set("manvie-admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("manvie-admin");
  return res;
}
