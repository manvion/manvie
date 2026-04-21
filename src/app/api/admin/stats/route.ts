import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function GET() {
  // Verify admin session
  const cookieStore = cookies();
  const token = cookieStore.get("manvie-admin")?.value;
  if (!token || !verifyToken(token, "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  );

  const [ordersRes, productsRes, suppliersRes] = await Promise.all([
    supabase.from("orders").select("total, status, created_at"),
    supabase.from("products").select("status, sales_count"),
    supabase.from("supplier_profiles").select("status"),
  ]);

  const orders = ordersRes.data ?? [];
  const products = productsRes.data ?? [];
  const suppliers = suppliersRes.data ?? [];

  const grossRevenue = orders
    .filter((o) => o.status === "delivered" || o.status === "shipped")
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  const fulfillmentQueue = orders.filter((o) => o.status === "processing").length;
  const pendingSuppliers = suppliers.filter((s) => s.status === "pending").length;
  const activePartners = suppliers.filter((s) => s.status === "active").length;
  const avgOrderValue =
    orders.length > 0
      ? orders.reduce((sum, o) => sum + (o.total ?? 0), 0) / orders.length
      : 0;

  return NextResponse.json({
    metrics: [
      {
        label: "Gross Revenue",
        value: `$${grossRevenue.toLocaleString("en-CA", { maximumFractionDigits: 0 })}`,
        change: "+--",
        trend: "up",
        sub: "delivered + shipped orders",
      },
      {
        label: "Fulfillment Queue",
        value: String(fulfillmentQueue),
        change: `${fulfillmentQueue} Processing`,
        trend: fulfillmentQueue > 10 ? "warn" : "neutral",
        sub: "units pending dispatch",
      },
      {
        label: "Supplier Approvals",
        value: String(pendingSuppliers),
        change: pendingSuppliers > 0 ? "Action Required" : "Up to Date",
        trend: pendingSuppliers > 0 ? "warn" : "up",
        sub: "pending review",
      },
      {
        label: "Active Partners",
        value: String(activePartners),
        change: "Stable",
        trend: "up",
        sub: "approved suppliers",
      },
      {
        label: "Avg. Order Value",
        value: `$${avgOrderValue.toLocaleString("en-CA", { maximumFractionDigits: 0 })}`,
        change: "+--",
        trend: "up",
        sub: "all-time average",
      },
      {
        label: "Return Rate",
        value: "N/A",
        change: "--",
        trend: "up",
        sub: "tracking enabled at launch",
      },
    ],
  });
}
