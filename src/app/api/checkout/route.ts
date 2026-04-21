import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001");

export async function POST(req: Request) {
  try {
    const { items, shippingDetails } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Demo mode — no real Stripe key
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_dummy") {
      return NextResponse.json({
        url: `${BASE_URL}/checkout/success?demo=1&total=${items.reduce(
          (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity,
          0
        )}`,
      });
    }

    const lineItems = items.map(
      (item: { name: string; image: string; price: number; quantity: number }) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/checkout?canceled=1`,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["CA", "US", "FR", "GB", "AU", "DE", "JP"],
      },
      metadata: {
        items: JSON.stringify(items.map((i: { id: string }) => i.id)),
        ...(shippingDetails ? { customer_name: shippingDetails.firstName + " " + shippingDetails.lastName } : {}),
      },
      custom_text: {
        submit: { message: "Your order will be prepared by our Montréal atelier and shipped via white-glove courier." },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Checkout error";
    console.error("Stripe Checkout Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
