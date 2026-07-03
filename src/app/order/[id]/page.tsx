import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, updateOrderStatus } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { OrderStatusStepper } from "@/components/order-status-stepper";
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";
import { SHIPPING_LABELS } from "@/lib/checkout-schema";
import { isCheckoutSessionPaid } from "@/lib/stripe";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id } = await params;
  const { session_id: sessionId } = await searchParams;
  let order = await getOrderById(id);

  if (!order) notFound();

  // Returned from Stripe Checkout: confirm payment directly from the session,
  // so the order updates even without the webhook running locally.
  if (sessionId && order.status === "pending_payment") {
    const paid = await isCheckoutSessionPaid(sessionId, id);
    if (paid) {
      await updateOrderStatus(id, "confirmed");
      order = { ...order, status: "confirmed" };
    }
  }

  const awaitingPayment = order.status === "pending_payment";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {sessionId && <ClearCartOnSuccess />}
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta">
        {awaitingPayment ? "Awaiting payment" : "Order confirmed"}
      </p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Thank you, {order.address.fullName.split(" ")[0]}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Order number <span className="font-mono text-ink">{order.id}</span> · a confirmation was
        sent to {order.address.email}
      </p>

      <div className="mt-12 rounded-2xl border border-ink/10 bg-paper-raised p-8">
        <OrderStatusStepper status={order.status} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Shipping</p>
          <p className="mt-2 text-sm">
            {order.address.city}, {order.address.address}
            <br />
            {SHIPPING_LABELS[order.shippingMethod]} · {order.address.postalCode}
            <br />
            {order.address.phone}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Payment</p>
          <p className="mt-2 text-sm">
            {order.paymentMethod === "card" ? "Paid online by card" : "Cash on delivery"}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Items</p>
        <ul className="mt-4 flex flex-col divide-y divide-ink/10">
          {order.lines.map((line) => (
            <li key={line.productId} className="flex items-center gap-4 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={line.image} alt={line.title} className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex flex-1 justify-between">
                <span className="text-sm">
                  {line.title} × {line.quantity}
                </span>
                <span className="font-mono text-sm">{formatPrice(line.price * line.quantity)}</span>
              </div>
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

      <Link href="/catalog" className="kinetic-link mt-12 inline-block font-mono text-xs uppercase tracking-widest">
        ← Continue shopping
      </Link>
    </div>
  );
}
