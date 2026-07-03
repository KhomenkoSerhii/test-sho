import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Order } from "@/lib/types";

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
    const { error } = await supabase.from("orders").insert(order);
    if (!error) return order;
  }
  memoryStore().set(order.id, order);
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
    if (!error && data) return data as Order;
  }
  return memoryStore().get(id) ?? null;
}
