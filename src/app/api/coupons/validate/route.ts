import { NextRequest, NextResponse } from "next/server";
import { findCoupon, applyCoupon } from "@/lib/data/coupons";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code = body?.code as string | undefined;
  const subtotal = Number(body?.subtotal ?? 0);

  if (!code) {
    return NextResponse.json({ error: "Вкажіть промокод" }, { status: 400 });
  }

  const coupon = await findCoupon(code);
  if (!coupon) {
    return NextResponse.json({ error: "Промокод не знайдено" }, { status: 404 });
  }

  const discount = applyCoupon(coupon, subtotal);
  if (discount === 0 && coupon.minSubtotal) {
    return NextResponse.json(
      { error: `Мінімальна сума замовлення — ${coupon.minSubtotal} грн` },
      { status: 422 }
    );
  }

  return NextResponse.json({ code: coupon.code, discount });
}
