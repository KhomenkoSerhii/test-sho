import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema, SHIPPING_FEES } from "@/lib/checkout-schema";
import { CartLine, Order } from "@/lib/types";
import { createOrder } from "@/lib/data/orders";
import { findCoupon, applyCoupon } from "@/lib/data/coupons";

function generateOrderId() {
  return `TS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
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
    status: paymentMethod === "cod" ? "confirmed" : "pending_payment",
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

  return NextResponse.json({ order }, { status: 201 });
}
