import { NextResponse } from "next/server";
import { createToken } from "@/lib/session";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getServiceClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Sign in via Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password: String(password),
    });

    if (authError || !authData.user) {
      await new Promise((r) => setTimeout(r, 300)); // Timing-safe delay
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Verify the user is an approved supplier
    const { data: supplier } = await supabase
      .from("supplier_profiles")
      .select("id, company_name, status")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (!supplier) {
      return NextResponse.json(
        { error: "No supplier account found for this email." },
        { status: 403 }
      );
    }

    if (supplier.status === "pending") {
      return NextResponse.json(
        { error: "Your application is still under review. We will notify you once approved." },
        { status: 403 }
      );
    }

    if (supplier.status === "denied") {
      return NextResponse.json(
        { error: "Your supplier application was not approved. Please contact support." },
        { status: 403 }
      );
    }

    // Issue session cookie
    const token = createToken({
      role: "supplier",
      user: email,
      supplierId: supplier.id,
      companyName: supplier.company_name,
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set("manvie-supplier", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("manvie-supplier");
  return res;
}
