import Stripe from "stripe";

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!isStripeConfigured) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  return stripeClient;
}

/**
 * Returns true if the given Checkout Session belongs to this order and has
 * been paid. Used by the order page to confirm payment on return from Stripe
 * without relying on the webhook (which needs a public URL / stripe listen).
 */
export async function isCheckoutSessionPaid(
  sessionId: string,
  orderId: string
): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid" && session.metadata?.orderId === orderId;
  } catch {
    return false;
  }
}
