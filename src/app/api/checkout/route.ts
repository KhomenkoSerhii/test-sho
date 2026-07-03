import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema, SHIPPING_FEES } from "@/lib/checkout-schema";
import { CartLine, Order } from "@/lib/types";
import { createOrder } from "@/lib/data/orders";
import { findCoupon, applyCoupon } from "@/lib/data/coupons";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

function generateOrderId() {
  return `TS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Card payments aren't configured yet. Choose cash on delivery instead." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body.address);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fields[String(issue.path[0])] = issue.message;
    }
    return NextResponse.json({ error: "Please check the form fields", fields }, { status: 422 });
  }

  const lines = body.lines as CartLine[] | undefined;
  if (!lines || lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 422 });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  let discount = 0;
  const couponCode: string | undefined = body.couponCode || undefined;
  if (couponCode) {
    const coupon = await findCoupon(couponCode);
    if (coupon) discount = applyCoupon(coupon, subtotal);
  }

  const { shippingMethod, paymentMethod, ...address } = parsed.data;
  const shippingFee = SHIPPING_FEES[shippingMethod];
  const total = Math.max(0, subtotal - discount) + shippingFee;

  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "pending_payment",
    lines,
    subtotal,
    discount,
    shippingFee,
    total,
    couponCode,
    shippingMethod,
    paymentMethod,
    address,
  };

  await createOrder(order);

  const stripe = getStripe()!;
  const origin = request.nextUrl.origin;

  const lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string; images?: string[] };
      unit_amount: number;
    };
    quantity: number;
  }> = lines.map((line) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: line.title,
        images: line.image.startsWith("http") ? [line.image] : undefined,
      },
      unit_amount: Math.round(line.price * 100),
    },
    quantity: line.quantity,
  }));

  if (shippingFee > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: Math.round(shippingFee * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: address.email,
    metadata: { orderId: order.id },
    discounts:
      discount > 0
        ? [
            {
              coupon: await stripe.coupons
                .create({
                  amount_off: Math.round(discount * 100),
                  currency: "usd",
                  duration: "once",
                  name: couponCode ?? "Discount",
                })
                .then((c) => c.id),
            },
          ]
        : undefined,
    success_url: `${origin}/order/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
  });

  return NextResponse.json({ checkoutUrl: session.url, order }, { status: 201 });
}
