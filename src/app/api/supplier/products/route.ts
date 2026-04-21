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
    .from("products")
    .select("id, name, category, price, base_cost, stock, status, badge, image_url, sku, sales_count, created_at")
    .eq("supplier_name", ctx.companyName)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

export async function POST(req: Request) {
  const ctx = getSupplierContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, category, price, baseCost, stock, imageUrl, description, sizes, gender } = body;

  if (!name || !category || !price) {
    return NextResponse.json({ error: "Name, category, and price are required." }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      category,
      gender: gender || "unisex",
      price: parseFloat(price),
      base_cost: baseCost ? parseFloat(baseCost) : null,
      stock: stock ? parseInt(stock) : 0,
      image_url: imageUrl || null,
      description: description || null,
      sizes: sizes || null,
      supplier_id: ctx.supplierId,
      supplier_name: ctx.companyName,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
