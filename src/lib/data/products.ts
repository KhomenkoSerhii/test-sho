import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Product } from "@/lib/types";

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  currency: string;
  category: string;
  tags: string[];
  status: Product["status"];
  stock: number;
  images: string[];
  accent: string;
  size: Product["size"];
  variants: Product["variants"] | null;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    currency: row.currency as Product["currency"],
    category: row.category,
    tags: row.tags ?? [],
    status: row.status,
    stock: row.stock,
    images: row.images ?? [],
    accent: row.accent,
    size: row.size,
    variants: row.variants ?? undefined,
  };
}

function productToRow(product: Omit<Product, "id"> & { id?: string }): Omit<ProductRow, "id"> & {
  id?: string;
} {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    subtitle: product.subtitle,
    description: product.description,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    currency: product.currency,
    category: product.category,
    tags: product.tags,
    status: product.status,
    stock: product.stock,
    images: product.images,
    accent: product.accent,
    size: product.size,
    variants: product.variants ?? null,
  };
}

export async function listProducts(params?: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  let products: Product[];

  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    products = error || !data ? MOCK_PRODUCTS : (data as ProductRow[]).map(rowToProduct);
  } else {
    products = MOCK_PRODUCTS;
  }

  if (params?.category && params.category !== "All") {
    products = products.filter((p) => p.category === params.category);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data) return rowToProduct(data as ProductRow);
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (!error && data) return rowToProduct(data as ProductRow);
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function createProduct(product: Product): Promise<Product> {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("products").insert(productToRow(product));
  if (error) throw new Error(error.message);
  return product;
}

export async function updateProduct(id: string, product: Omit<Product, "id">): Promise<Product> {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("products").update(productToRow(product)).eq("id", id);
  if (error) throw new Error(error.message);
  return { ...product, id };
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
