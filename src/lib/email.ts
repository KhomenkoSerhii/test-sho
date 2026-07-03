import { Resend } from "resend";
import { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { SHIPPING_LABELS } from "@/lib/checkout-schema";

export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "Terra Studio <onboarding@resend.dev>";

let client: Resend | null = null;
function getResend(): Resend | null {
  if (!isEmailConfigured) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY as string);
  return client;
}

const STATUS_COPY: Record<OrderStatus, { subject: string; heading: string; body: string }> = {
  pending_payment: {
    subject: "Your order is awaiting payment",
    heading: "Awaiting payment",
    body: "We've reserved your items. Complete payment to confirm your order.",
  },
  confirmed: {
    subject: "Order confirmed",
    heading: "Thank you — your order is confirmed",
    body: "We've received your order and payment. We'll start preparing it shortly.",
  },
  processing: {
    subject: "Your order is being prepared",
    heading: "We're packing your order",
    body: "Your items are being carefully prepared for shipment.",
  },
  shipped: {
    subject: "Your order is on its way",
    heading: "Your order has shipped",
    body: "Your parcel is on its way. You'll receive it soon.",
  },
  delivered: {
    subject: "Your order has been delivered",
    heading: "Delivered — enjoy!",
    body: "Your order has been delivered. We hope you love it.",
  },
  cancelled: {
    subject: "Your order was cancelled",
    heading: "Order cancelled",
    body: "Your order has been cancelled. If this wasn't expected, reply to this email.",
  },
};

function renderEmail(order: Order, status: OrderStatus): string {
  const copy = STATUS_COPY[status];
  const lines = order.lines
    .map(
      (l) => `
      <tr>
        <td style="padding:8px 0;color:#57503f;font-size:14px;">${l.title} × ${l.quantity}</td>
        <td style="padding:8px 0;text-align:right;font-size:14px;">${formatPrice(l.price * l.quantity)}</td>
      </tr>`
    )
    .join("");

  const totalsRow = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:4px 0;color:${strong ? "#201c16" : "#57503f"};font-size:${strong ? "16px" : "14px"};">${label}</td>
      <td style="padding:4px 0;text-align:right;font-size:${strong ? "16px" : "14px"};">${value}</td>
    </tr>`;

  return `
  <div style="background:#f4eee4;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;background:#ebe1d0;border-radius:16px;overflow:hidden;border:1px solid #ddd0ba;">
      <div style="padding:28px 32px;border-bottom:1px solid #ddd0ba;">
        <div style="font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#c1531b;font-family:monospace;">${SITE.name}</div>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 8px;font-size:28px;color:#201c16;line-height:1.15;">${copy.heading}</h1>
        <p style="margin:0 0 24px;color:#57503f;font-size:15px;line-height:1.5;">${copy.body}</p>

        <div style="background:#f4eee4;border-radius:12px;padding:20px;">
          <div style="font-family:monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#57503f;margin-bottom:8px;">Order ${order.id}</div>
          <table style="width:100%;border-collapse:collapse;">${lines}</table>
          <div style="border-top:1px solid #ddd0ba;margin-top:12px;padding-top:12px;">
            <table style="width:100%;border-collapse:collapse;">
              ${totalsRow("Subtotal", formatPrice(order.subtotal))}
              ${order.discount > 0 ? totalsRow(`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, `-${formatPrice(order.discount)}`) : ""}
              ${totalsRow("Shipping", formatPrice(order.shippingFee))}
              ${totalsRow("Total", formatPrice(order.total), true)}
            </table>
          </div>
        </div>

        <div style="margin-top:24px;color:#57503f;font-size:14px;line-height:1.6;">
          <div style="font-family:monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Shipping</div>
          ${order.address.fullName}<br/>
          ${order.address.city}, ${order.address.address}, ${order.address.postalCode}<br/>
          ${SHIPPING_LABELS[order.shippingMethod]}
        </div>

        <a href="${SITE.url}/order/${order.id}" style="display:inline-block;margin-top:28px;background:#201c16;color:#f4eee4;text-decoration:none;padding:14px 28px;border-radius:999px;font-family:monospace;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Track your order</a>
      </div>
      <div style="padding:20px 32px;border-top:1px solid #ddd0ba;color:#57503f;font-size:12px;font-family:monospace;">
        ${SITE.name} · Home goods, made slowly
      </div>
    </div>
  </div>`;
}

/**
 * Sends a status email for an order. No-op (logged) when RESEND_API_KEY is
 * unset, so the app runs fully without email configured. Never throws into the
 * caller — email failures shouldn't break order flow.
 */
export async function sendOrderStatusEmail(order: Order, status?: OrderStatus): Promise<void> {
  const effective = status ?? order.status;
  const resend = getResend();
  if (!resend) {
    console.log(`[email] skipped (no RESEND_API_KEY): order ${order.id} → ${effective}`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: order.address.email,
      subject: `${STATUS_COPY[effective].subject} · ${order.id}`,
      html: renderEmail(order, effective),
    });
  } catch (err) {
    console.error(`[email] failed for order ${order.id}:`, err);
  }
}
