import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { updateOrderStatus } from "@/lib/data/orders";
import { sendOrderStatusEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  }

  const stripe = getStripe()!;
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const updated = await updateOrderStatus(orderId, "confirmed");
      // Only emails if this call actually flipped the status (dedupes against
      // the order-page session check confirming the same order concurrently).
      if (updated) await sendOrderStatusEmail(updated);
    }
  }

  return NextResponse.json({ received: true });
}
