import Link from "next/link";
import { listOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Admin · Orders — Terra Studio" };

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-ink-soft">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-raised font-mono text-xs uppercase tracking-widest text-ink-soft">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="kinetic-link font-mono">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.address.fullName}</td>
                  <td className="px-4 py-3 font-mono">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-ink-soft">{order.paymentMethod}</td>
                  <td className="px-4 py-3 text-ink-soft">{order.status}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                    {new Date(order.createdAt).toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
