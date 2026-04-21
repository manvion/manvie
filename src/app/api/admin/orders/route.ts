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

const ORDER_FLOW: Record<string, string> = {
  processing: "shipped",
  shipped: "delivered",
};

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_email, customer_name, total, status, supplier_name, items, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, advance } = await req.json();
  if (!id) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

  const supabase = getAdminClient();

  if (advance) {
    const { data: order } = await supabase
      .from("orders")
      .select("status")
      .eq("id", id)
      .single();

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const nextStatus = ORDER_FLOW[order.status];
    if (!nextStatus) return NextResponse.json({ error: "No further status transition." }, { status: 400 });

    const { data, error } = await supabase
      .from("orders")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ order: data });
  }

  return NextResponse.json({ error: "No action specified." }, { status: 400 });
}
