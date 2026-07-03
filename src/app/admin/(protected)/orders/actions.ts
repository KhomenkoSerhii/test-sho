"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/supabase/auth-server";
import { updateOrderStatus } from "@/lib/data/orders";
import { OrderStatus } from "@/lib/types";

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorized");

  const status = String(formData.get("status")) as OrderStatus;
  await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/order/${id}`);
}
