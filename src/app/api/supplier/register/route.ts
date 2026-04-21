import { NextResponse } from "next/server";
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
    const body = await req.json();
    const {
      companyName,
      contactName,
      email,
      password,
      phone,
      location,
      country,
      specialty,
      description,
      annualCapacity,
    } = body;

    if (!companyName || !contactName || !email || !password || !specialty) {
      return NextResponse.json(
        { error: "Company name, contact name, email, password, and specialty are required." },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // Check for existing application by email
    const { data: existing } = await supabase
      .from("supplier_profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists." },
        { status: 409 }
      );
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        full_name: contactName,
        company_name: companyName,
        role: "supplier",
      },
    });

    if (authError) {
      if (authError.message.toLowerCase().includes("already")) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create supplier profile record
    const { error: profileError } = await supabase.from("supplier_profiles").insert({
      user_id: authData.user.id,
      company_name: companyName,
      contact_name: contactName,
      email,
      phone: phone || null,
      location: location || null,
      country: country || null,
      specialty,
      description: description || null,
      annual_capacity: annualCapacity || null,
      status: "pending",
    });

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: "Failed to create supplier profile." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Supplier registration error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
