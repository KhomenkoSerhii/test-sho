import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "../../actions";

export const metadata = { title: "Admin · Edit product — Terra Studio" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">Edit product</h1>
      <ProductForm product={product} action={updateProductAction.bind(null, id)} />
    </div>
  );
}
