import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Order, OrderStatus } from "@/lib/types";

type OrderRow = {
  id: string;
  created_at: string;
  status: OrderStatus;
  lines: Order["lines"];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  coupon_code: string | null;
  shipping_method: Order["shippingMethod"];
  payment_method: Order["paymentMethod"];
  address: Order["address"];
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    lines: row.lines,
    subtotal: row.subtotal,
    discount: row.discount,
    shippingFee: row.shipping_fee,
    total: row.total,
    couponCode: row.coupon_code ?? undefined,
    shippingMethod: row.shipping_method,
    paymentMethod: row.payment_method,
    address: row.address,
  };
}

function orderToRow(order: Order): OrderRow {
  return {
    id: order.id,
    created_at: order.createdAt,
    status: order.status,
    lines: order.lines,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping_fee: order.shippingFee,
    total: order.total,
    coupon_code: order.couponCode ?? null,
    shipping_method: order.shippingMethod,
    payment_method: order.paymentMethod,
    address: order.address,
  };
}

// In-memory fallback store used only when Supabase env vars are not set.
// Lives for the lifetime of the dev server process — enough to demo the
// full create → confirm → status flow without external infrastructure.
declare global {
  var __ORDER_STORE__: Map<string, Order> | undefined;
}

function memoryStore(): Map<string, Order> {
  if (!global.__ORDER_STORE__) global.__ORDER_STORE__ = new Map();
  return global.__ORDER_STORE__;
}

export async function createOrder(order: Order): Promise<Order> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { error } = await supabase.from("orders").insert(orderToRow(order));
    if (!error) return order;
  }
  memoryStore().set(order.id, order);
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
    if (!error && data) return rowToOrder(data as OrderRow);
  }
  return memoryStore().get(id) ?? null;
}

export async function listOrders(): Promise<Order[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return (data as OrderRow[]).map(rowToOrder);
    return [];
  }
  return Array.from(memoryStore().values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/**
 * Updates an order's status only if it differs from the current value, and
 * returns the updated order — or null if nothing changed (already at that
 * status, or not found). Callers use the null result to avoid sending a
 * duplicate status email when two paths confirm the same order concurrently
 * (e.g. Stripe webhook + order-page session check).
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .neq("status", status)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToOrder(data as OrderRow) : null;
  }
  const order = memoryStore().get(id);
  if (!order || order.status === status) return null;
  const updated = { ...order, status };
  memoryStore().set(id, updated);
  return updated;
}

export async function deleteOrder(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  memoryStore().delete(id);
}
