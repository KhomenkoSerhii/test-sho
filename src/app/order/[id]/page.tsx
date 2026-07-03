import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { OrderStatusStepper } from "@/components/order-status-stepper";
import { SHIPPING_LABELS } from "@/lib/checkout-schema";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta">
        Замовлення підтверджено
      </p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Дякуємо, {order.address.fullName.split(" ")[0]}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Номер замовлення <span className="font-mono text-ink">{order.id}</span> · підтвердження
        надіслано на {order.address.email}
      </p>

      <div className="mt-12 rounded-2xl border border-ink/10 bg-paper-raised p-8">
        <OrderStatusStepper status={order.status} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Доставка</p>
          <p className="mt-2 text-sm">
            {order.address.city}, {order.address.address}
            <br />
            {SHIPPING_LABELS[order.shippingMethod]} · {order.address.postalCode}
            <br />
            {order.address.phone}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Оплата</p>
          <p className="mt-2 text-sm">
            {order.paymentMethod === "card" ? "Карткою онлайн" : "При отриманні"}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Товари</p>
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
            <span>Проміжна сума</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-olive">
              <span>Знижка {order.couponCode ? `(${order.couponCode})` : ""}</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink-soft">
            <span>Доставка</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base text-ink">
            <span>Разом</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <Link href="/catalog" className="kinetic-link mt-12 inline-block font-mono text-xs uppercase tracking-widest">
        ← Продовжити покупки
      </Link>
    </div>
  );
}
