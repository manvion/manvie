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
    .from("products")
    .select("id, name, supplier_name, sku, base_cost, price, stock, status, sales_count, category, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, price, stock } = await req.json();
  if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

  const supabase = getAdminClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status !== undefined) updates.status = status;
  if (price !== undefined) updates.price = price;
  if (stock !== undefined) updates.stock = stock;

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
