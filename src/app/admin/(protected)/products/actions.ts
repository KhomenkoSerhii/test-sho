"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth-server";
import { createProduct, deleteProduct, updateProduct } from "@/lib/data/products";
import { Product, ProductStatus } from "@/lib/types";

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorized");
}

function parseProductForm(formData: FormData): Omit<Product, "id"> {
  const variantsRaw = String(formData.get("variants") ?? "").trim();
  let variants: Product["variants"];
  if (variantsRaw) {
    try {
      variants = JSON.parse(variantsRaw);
    } catch {
      throw new Error("Variants must be valid JSON, e.g. [{\"label\":\"Size\",\"options\":[\"S\",\"M\"]}]");
    }
  }

  const compareAtPriceRaw = String(formData.get("compareAtPrice") ?? "").trim();

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    compareAtPrice: compareAtPriceRaw ? Number(compareAtPriceRaw) : undefined,
    currency: "USD",
    category: String(formData.get("category") ?? "").trim(),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status: String(formData.get("status") ?? "in_stock") as ProductStatus,
    stock: Number(formData.get("stock") ?? 0),
    images: String(formData.get("images") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    accent: String(formData.get("accent") ?? "#C1531B").trim(),
    size: String(formData.get("size") ?? "md") as Product["size"],
    variants,
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const product = parseProductForm(formData);
  const id = product.slug || crypto.randomUUID();
  await createProduct({ ...product, id });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  redirect("/admin/products");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  const product = parseProductForm(formData);
  await updateProduct(id, product);
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath(`/product/${product.slug}`);
  redirect("/admin/products");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
}
