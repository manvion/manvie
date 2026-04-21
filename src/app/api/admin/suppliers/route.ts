import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

function getAdminClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  );
}

function isAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("manvie-admin")?.value;
  return token && verifyToken(token, "admin");
}

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("supplier_profiles")
    .select("id, company_name, contact_name, email, location, country, specialty, status, products_count, total_revenue, rating, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ suppliers: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "ID and status required" }, { status: 400 });
  if (!["active", "denied"].includes(status)) {
    return NextResponse.json({ error: "Status must be 'active' or 'denied'." }, { status: 400 });
  }

  const supabase = getAdminClient();
  const updates: Record<string, unknown> = { status };
  if (status === "active") {
    updates.approved_at = new Date().toISOString();
    updates.approved_by = "admin";
  }

  const { data, error } = await supabase
    .from("supplier_profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ supplier: data });
}
