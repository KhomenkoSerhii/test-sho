"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth-server";
import { updateOrderStatus, deleteOrder } from "@/lib/data/orders";
import { sendOrderStatusEmail } from "@/lib/email";
import { OrderStatus } from "@/lib/types";

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorized");

  const status = String(formData.get("status")) as OrderStatus;
  const updated = await updateOrderStatus(id, status);
  // Notify the customer only when the status actually changed.
  if (updated) await sendOrderStatusEmail(updated);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/order/${id}`);
}

export async function deleteOrderAction(id: string, formData?: FormData) {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorized");

  await deleteOrder(id);
  revalidatePath("/admin/orders");

  // From the detail page, return to the list; from the list, this is a no-op re-render.
  if (formData?.get("redirect") === "list") {
    redirect("/admin/orders");
  }
}
