import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const limit = parseInt(searchParams.get("limit") ?? "100");

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  );

  let query = supabase
    .from("products")
    .select("id, name, category, gender, price, stock, status, badge, supplier_name, image_url, sku, sales_count, sizes, subcategory")
    .eq("status", "active")
    .limit(limit)
    .order("sales_count", { ascending: false });

  if (category && category !== "Le Catalogue" && category !== "All") {
    query = query.eq("category", category);
  }
  if (gender) {
    query = query.or(`gender.eq.${gender},gender.eq.unisex`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}
