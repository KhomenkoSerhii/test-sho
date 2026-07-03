import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { MOCK_COUPONS } from "@/lib/mock-data";
import { Coupon } from "@/lib/types";

export async function findCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();

  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", normalized)
      .maybeSingle();
    if (!error && data) return data as Coupon;
  }

  return MOCK_COUPONS.find((c) => c.code === normalized) ?? null;
}

export function applyCoupon(coupon: Coupon, subtotal: number): number {
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;
  if (coupon.kind === "percent") return Math.round((subtotal * coupon.value) / 100);
  return Math.min(coupon.value, subtotal);
}
