import { NextResponse } from "next/server";
import { createToken, hashPassword } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const expectedUser = process.env.MERCHANT_USERNAME ?? "merchant";
    const expectedHash =
      process.env.MERCHANT_PASSWORD_HASH ?? hashPassword("manvie-merchant-2024");

    const inputHash = hashPassword(String(password));

    if (
      String(username).trim() !== expectedUser ||
      inputHash !== expectedHash
    ) {
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createToken({ role: "merchant", user: username });

    const res = NextResponse.json({ success: true, redirect: "/supplier" });
    res.cookies.set("manvie-merchant", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("manvie-merchant");
  return res;
}
