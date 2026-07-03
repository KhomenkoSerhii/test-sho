import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { deleteProductAction } from "./actions";

export const metadata = { title: "Admin · Products — Terra Studio" };

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="magnetic-btn rounded-full bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-paper hover:bg-terracotta"
        >
          New product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-raised font-mono text-xs uppercase tracking-widest text-ink-soft">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">{product.title}</td>
                <td className="px-4 py-3 text-ink-soft">{product.category}</td>
                <td className="px-4 py-3 font-mono">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-ink-soft">{product.status}</td>
                <td className="px-4 py-3 font-mono">{product.stock}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-4 font-mono text-xs uppercase tracking-widest">
                    <Link href={`/admin/products/${product.id}/edit`} className="kinetic-link">
                      Edit
                    </Link>
                    <form action={deleteProductAction.bind(null, product.id)}>
                      <button type="submit" className="kinetic-link text-terracotta">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
