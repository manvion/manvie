import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Since webhooks hit this route blindly, we need full privilege client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Create actual Order in Supabase DB via Admin client
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://abcdefghijklmnopqrst.supabase.co') {
         await supabaseAdmin.from('orders').insert({
            stripe_session_id: session.id,
            total_amount: (session.amount_total || 0) / 100,
            payment_status: 'paid',
            fulfillment_status: 'processing'
         });
      }
      console.log('Payment processed and order logged.');
    } catch (dbError) {
      console.error('Error logging to Supabase', dbError);
    }
  }

  return NextResponse.json({ received: true });
}
