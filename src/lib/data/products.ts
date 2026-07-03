import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Product } from "@/lib/types";

export async function listProducts(params?: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  let products: Product[];

  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient()!;
    const { data, error } = await supabase.from("products").select("*");
    products = error || !data ? MOCK_PRODUCTS : (data as Product[]);
  } else {
    products = MOCK_PRODUCTS;
  }

  if (params?.category && params.category !== "Усі") {
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
    if (!error && data) return data as Product;
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
