import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatusAction, deleteOrderAction } from "../actions";
import { DeleteButton } from "@/components/admin/delete-button";

const STATUSES = ["pending_payment", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export const metadata = { title: "Admin · Order — Terra Studio" };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">{order.id}</h1>
        <DeleteButton
          action={deleteOrderAction.bind(null, order.id)}
          confirmText={`Delete order ${order.id}? This can't be undone.`}
          label="Delete order"
          redirectToList
        />
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Customer</p>
          <p className="mt-2 text-sm">
            {order.address.fullName}
            <br />
            {order.address.email} · {order.address.phone}
            <br />
            {order.address.city}, {order.address.address}, {order.address.postalCode}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Update status</p>
          <form action={updateOrderStatusAction.bind(null, order.id)} className="mt-2 flex gap-3">
            <select
              name="status"
              defaultValue={order.status}
              className="rounded-xl border border-ink/20 bg-paper px-4 py-2 text-sm outline-none focus:border-terracotta"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="magnetic-btn rounded-full bg-ink px-5 py-2 font-mono text-xs uppercase tracking-widest text-paper hover:bg-terracotta"
            >
              Save
            </button>
          </form>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Items</p>
        <ul className="mt-4 flex flex-col divide-y divide-ink/10">
          {order.lines.map((line) => (
            <li key={line.productId} className="flex justify-between py-3 text-sm">
              <span>
                {line.title} × {line.quantity}
              </span>
              <span className="font-mono">{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 border-t border-ink/10 pt-4 font-mono text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-olive">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink-soft">
            <span>Shipping</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base text-ink">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
