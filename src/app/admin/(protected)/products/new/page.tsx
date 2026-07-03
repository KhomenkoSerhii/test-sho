import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "../actions";

export const metadata = { title: "Admin · New product — Terra Studio" };

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">New product</h1>
      <ProductForm action={createProductAction} />
    </div>
  );
}
