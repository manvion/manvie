import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

function getSupplierContext() {
  const cookieStore = cookies();
  const token = cookieStore.get("manvie-supplier")?.value;
  if (!token) return null;
  return verifyToken(token, "supplier") as { supplierId: string; companyName: string } | null;
}

function getServiceClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  );
}

export async function GET() {
  const ctx = getSupplierContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, customer_email, total, status, shipping_address, items, created_at")
    .eq("supplier_name", ctx.companyName)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(req: Request) {
  const ctx = getSupplierContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

  const supabase = getServiceClient();

  // Verify order belongs to this supplier
  const { data: order } = await supabase
    .from("orders")
    .select("status, supplier_name")
    .eq("id", id)
    .single();

  if (!order || order.supplier_name !== ctx.companyName) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.status !== "processing") {
    return NextResponse.json({ error: "Only processing orders can be dispatched." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "shipped", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}
